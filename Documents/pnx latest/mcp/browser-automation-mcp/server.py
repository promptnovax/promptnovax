#!/usr/bin/env python3
"""
Browser Automation MCP Server
Provides tools for browser automation using Playwright.
"""

import asyncio
import json
import sys
from typing import Any, Optional

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
from playwright.async_api import async_playwright, Browser, Page

# Initialize MCP server
server = Server("browser-automation-mcp")

# Global browser instance
browser: Optional[Browser] = None
playwright = None


async def get_browser() -> Browser:
    """Get or create browser instance"""
    global browser, playwright
    if browser is None:
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(headless=True)
    return browser


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available browser automation tools"""
    return [
        Tool(
            name="browser_navigate",
            description="Navigate to a URL",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "URL to navigate to"},
                    "wait_until": {"type": "string", "enum": ["load", "domcontentloaded", "networkidle"], "default": "load"},
                },
                "required": ["url"],
            },
        ),
        Tool(
            name="browser_screenshot",
            description="Take a screenshot of the current page",
            inputSchema={
                "type": "object",
                "properties": {
                    "full_page": {"type": "boolean", "description": "Capture full page", "default": False},
                },
            },
        ),
        Tool(
            name="browser_get_content",
            description="Get page HTML content",
            inputSchema={
                "type": "object",
                "properties": {
                    "selector": {"type": "string", "description": "CSS selector to get specific element"},
                },
            },
        ),
        Tool(
            name="browser_click",
            description="Click an element",
            inputSchema={
                "type": "object",
                "properties": {
                    "selector": {"type": "string", "description": "CSS selector"},
                },
                "required": ["selector"],
            },
        ),
        Tool(
            name="browser_type",
            description="Type text into an input field",
            inputSchema={
                "type": "object",
                "properties": {
                    "selector": {"type": "string", "description": "CSS selector"},
                    "text": {"type": "string", "description": "Text to type"},
                },
                "required": ["selector", "text"],
            },
        ),
        Tool(
            name="browser_fill",
            description="Fill a form field",
            inputSchema={
                "type": "object",
                "properties": {
                    "selector": {"type": "string", "description": "CSS selector"},
                    "value": {"type": "string", "description": "Value to fill"},
                },
                "required": ["selector", "value"],
            },
        ),
        Tool(
            name="browser_wait_for",
            description="Wait for element or condition",
            inputSchema={
                "type": "object",
                "properties": {
                    "selector": {"type": "string", "description": "CSS selector to wait for"},
                    "timeout": {"type": "number", "description": "Timeout in milliseconds", "default": 30000},
                },
                "required": ["selector"],
            },
        ),
        Tool(
            name="browser_evaluate",
            description="Execute JavaScript in the page context",
            inputSchema={
                "type": "object",
                "properties": {
                    "script": {"type": "string", "description": "JavaScript code to execute"},
                },
                "required": ["script"],
            },
        ),
        Tool(
            name="browser_get_title",
            description="Get page title",
            inputSchema={},
        ),
        Tool(
            name="browser_get_url",
            description="Get current page URL",
            inputSchema={},
        ),
    ]


# Page storage (simple in-memory store)
pages: dict[str, Page] = {}


async def get_page(page_id: str = "default") -> Page:
    """Get or create a page"""
    if page_id not in pages:
        browser = await get_browser()
        pages[page_id] = await browser.new_page()
    return pages[page_id]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        page = await get_page()
        
        if name == "browser_navigate":
            await page.goto(arguments["url"], wait_until=arguments.get("wait_until", "load"))
            return [TextContent(type="text", text=f"Navigated to {arguments['url']}")]
        
        elif name == "browser_screenshot":
            screenshot = await page.screenshot(full_page=arguments.get("full_page", False))
            import base64
            b64 = base64.b64encode(screenshot).decode("utf-8")
            return [TextContent(type="text", text=f"data:image/png;base64,{b64}")]
        
        elif name == "browser_get_content":
            if "selector" in arguments:
                element = await page.query_selector(arguments["selector"])
                if element:
                    content = await element.inner_html()
                else:
                    content = "Element not found"
            else:
                content = await page.content()
            return [TextContent(type="text", text=content)]
        
        elif name == "browser_click":
            await page.click(arguments["selector"])
            return [TextContent(type="text", text=f"Clicked {arguments['selector']}")]
        
        elif name == "browser_type":
            await page.type(arguments["selector"], arguments["text"])
            return [TextContent(type="text", text=f"Typed into {arguments['selector']}")]
        
        elif name == "browser_fill":
            await page.fill(arguments["selector"], arguments["value"])
            return [TextContent(type="text", text=f"Filled {arguments['selector']}")]
        
        elif name == "browser_wait_for":
            await page.wait_for_selector(arguments["selector"], timeout=arguments.get("timeout", 30000))
            return [TextContent(type="text", text=f"Waited for {arguments['selector']}")]
        
        elif name == "browser_evaluate":
            result = await page.evaluate(arguments["script"])
            return [TextContent(type="text", text=json.dumps(result))]
        
        elif name == "browser_get_title":
            title = await page.title()
            return [TextContent(type="text", text=title)]
        
        elif name == "browser_get_url":
            url = page.url
            return [TextContent(type="text", text=url)]
        
        else:
            raise ValueError(f"Unknown tool: {name}")
    
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]


async def cleanup():
    """Cleanup browser resources"""
    global browser, playwright
    if browser:
        await browser.close()
    if playwright:
        await playwright.stop()


async def main():
    """Main entry point"""
    try:
        async with stdio_server() as (read_stream, write_stream):
            await server.run(read_stream, write_stream, server.create_initialization_options())
    finally:
        await cleanup()


if __name__ == "__main__":
    asyncio.run(main())

