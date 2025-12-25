#!/usr/bin/env python3
"""
Scraper MCP Server
Provides tools for multi-source web scraping.
"""

import asyncio
import json
from typing import Any, Optional
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("scraper-mcp")


async def fetch_url(url: str, headers: Optional[dict] = None) -> dict:
    """Fetch URL content"""
    default_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }
    if headers:
        default_headers.update(headers)
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.get(url, headers=default_headers)
        response.raise_for_status()
        return {
            "url": str(response.url),
            "status_code": response.status_code,
            "headers": dict(response.headers),
            "content": response.text,
            "content_type": response.headers.get("content-type", ""),
        }


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available scraping tools"""
    return [
        Tool(
            name="scraper_fetch",
            description="Fetch raw content from a URL",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to fetch"},
                    "headers": {"type": "object", "description": "Custom HTTP headers"},
                },
                "required": ["url"],
            },
        ),
        Tool(
            name="scraper_extract_text",
            description="Extract text content from HTML",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to scrape"},
                    "selector": {"type": "string", "description": "CSS selector to extract specific elements"},
                },
                "required": ["url"],
            },
        ),
        Tool(
            name="scraper_extract_links",
            description="Extract all links from a page",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to scrape"},
                    "filter": {"type": "string", "description": "Filter links by pattern"},
                },
                "required": ["url"],
            },
        ),
        Tool(
            name="scraper_extract_images",
            description="Extract all images from a page",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to scrape"},
                },
                "required": ["url"],
            },
        ),
        Tool(
            name="scraper_extract_metadata",
            description="Extract metadata (title, description, etc.) from a page",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to scrape"},
                },
                "required": ["url"],
            },
        ),
        Tool(
            name="scraper_extract_table",
            description="Extract table data from HTML",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to scrape"},
                    "table_index": {"type": "number", "description": "Index of table to extract (0-based)", "default": 0},
                },
                "required": ["url"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "scraper_fetch":
            result = await fetch_url(arguments["url"], arguments.get("headers"))
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "scraper_extract_text":
            data = await fetch_url(arguments["url"])
            soup = BeautifulSoup(data["content"], "html.parser")
            
            if "selector" in arguments:
                elements = soup.select(arguments["selector"])
                text = "\n".join([elem.get_text(strip=True) for elem in elements])
            else:
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.decompose()
                text = soup.get_text(separator="\n", strip=True)
            
            return [TextContent(type="text", text=text)]
        
        elif name == "scraper_extract_links":
            data = await fetch_url(arguments["url"])
            soup = BeautifulSoup(data["content"], "html.parser")
            base_url = data["url"]
            
            links = []
            for a in soup.find_all("a", href=True):
                href = a["href"]
                # Resolve relative URLs
                if href.startswith("/"):
                    from urllib.parse import urljoin
                    href = urljoin(base_url, href)
                elif not href.startswith("http"):
                    continue
                
                if "filter" in arguments and arguments["filter"] not in href:
                    continue
                
                links.append({
                    "url": href,
                    "text": a.get_text(strip=True),
                })
            
            return [TextContent(type="text", text=json.dumps(links, indent=2))]
        
        elif name == "scraper_extract_images":
            data = await fetch_url(arguments["url"])
            soup = BeautifulSoup(data["content"], "html.parser")
            base_url = data["url"]
            
            images = []
            for img in soup.find_all("img"):
                src = img.get("src") or img.get("data-src", "")
                if not src:
                    continue
                
                # Resolve relative URLs
                if src.startswith("/"):
                    from urllib.parse import urljoin
                    src = urljoin(base_url, src)
                elif not src.startswith("http"):
                    continue
                
                images.append({
                    "url": src,
                    "alt": img.get("alt", ""),
                    "title": img.get("title", ""),
                })
            
            return [TextContent(type="text", text=json.dumps(images, indent=2))]
        
        elif name == "scraper_extract_metadata":
            data = await fetch_url(arguments["url"])
            soup = BeautifulSoup(data["content"], "html.parser")
            
            metadata = {
                "title": soup.find("title").get_text(strip=True) if soup.find("title") else "",
                "description": "",
                "keywords": "",
                "og_title": "",
                "og_description": "",
                "og_image": "",
            }
            
            # Meta description
            meta_desc = soup.find("meta", attrs={"name": "description"})
            if meta_desc:
                metadata["description"] = meta_desc.get("content", "")
            
            # Meta keywords
            meta_keywords = soup.find("meta", attrs={"name": "keywords"})
            if meta_keywords:
                metadata["keywords"] = meta_keywords.get("content", "")
            
            # Open Graph
            og_title = soup.find("meta", property="og:title")
            if og_title:
                metadata["og_title"] = og_title.get("content", "")
            
            og_desc = soup.find("meta", property="og:description")
            if og_desc:
                metadata["og_description"] = og_desc.get("content", "")
            
            og_image = soup.find("meta", property="og:image")
            if og_image:
                metadata["og_image"] = og_image.get("content", "")
            
            return [TextContent(type="text", text=json.dumps(metadata, indent=2))]
        
        elif name == "scraper_extract_table":
            data = await fetch_url(arguments["url"])
            soup = BeautifulSoup(data["content"], "html.parser")
            tables = soup.find_all("table")
            
            if not tables:
                return [TextContent(type="text", text=json.dumps({"error": "No tables found"}))]
            
            table_index = arguments.get("table_index", 0)
            if table_index >= len(tables):
                return [TextContent(type="text", text=json.dumps({"error": f"Table index {table_index} out of range"}))]
            
            table = tables[table_index]
            rows = []
            for tr in table.find_all("tr"):
                cells = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                if cells:
                    rows.append(cells)
            
            return [TextContent(type="text", text=json.dumps(rows, indent=2))]
        
        else:
            raise ValueError(f"Unknown tool: {name}")
    
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]


async def main():
    """Main entry point"""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())

