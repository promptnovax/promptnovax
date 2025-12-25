#!/usr/bin/env python3
"""
GitHub MCP Server
Provides tools for interacting with GitHub repositories, issues, PRs, and more.
"""

import asyncio
import json
import os
import sys
from typing import Any, Optional
from urllib.parse import urlparse

import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("github-mcp")

# GitHub API configuration
GITHUB_API_BASE = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

if not GITHUB_TOKEN:
    print("Warning: GITHUB_TOKEN not set. Some operations may fail.", file=sys.stderr)


async def github_request(
    method: str, endpoint: str, data: Optional[dict] = None, params: Optional[dict] = None
) -> dict:
    """Make a request to GitHub API"""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {GITHUB_TOKEN}" if GITHUB_TOKEN else "",
    }
    url = f"{GITHUB_API_BASE}{endpoint}"
    
    async with httpx.AsyncClient() as client:
        response = await client.request(method, url, headers=headers, json=data, params=params)
        response.raise_for_status()
        return response.json() if response.content else {}


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available GitHub tools"""
    return [
        Tool(
            name="github_get_repo",
            description="Get repository information",
            inputSchema={
                "type": "object",
                "properties": {
                    "owner": {"type": "string", "description": "Repository owner"},
                    "repo": {"type": "string", "description": "Repository name"},
                },
                "required": ["owner", "repo"],
            },
        ),
        Tool(
            name="github_list_issues",
            description="List issues for a repository",
            inputSchema={
                "type": "object",
                "properties": {
                    "owner": {"type": "string", "description": "Repository owner"},
                    "repo": {"type": "string", "description": "Repository name"},
                    "state": {"type": "string", "enum": ["open", "closed", "all"], "default": "open"},
                    "labels": {"type": "string", "description": "Comma-separated label names"},
                },
                "required": ["owner", "repo"],
            },
        ),
        Tool(
            name="github_create_issue",
            description="Create a new issue",
            inputSchema={
                "type": "object",
                "properties": {
                    "owner": {"type": "string", "description": "Repository owner"},
                    "repo": {"type": "string", "description": "Repository name"},
                    "title": {"type": "string", "description": "Issue title"},
                    "body": {"type": "string", "description": "Issue body"},
                    "labels": {"type": "array", "items": {"type": "string"}, "description": "Issue labels"},
                },
                "required": ["owner", "repo", "title"],
            },
        ),
        Tool(
            name="github_list_pull_requests",
            description="List pull requests for a repository",
            inputSchema={
                "type": "object",
                "properties": {
                    "owner": {"type": "string", "description": "Repository owner"},
                    "repo": {"type": "string", "description": "Repository name"},
                    "state": {"type": "string", "enum": ["open", "closed", "all"], "default": "open"},
                },
                "required": ["owner", "repo"],
            },
        ),
        Tool(
            name="github_create_pull_request",
            description="Create a new pull request",
            inputSchema={
                "type": "object",
                "properties": {
                    "owner": {"type": "string", "description": "Repository owner"},
                    "repo": {"type": "string", "description": "Repository name"},
                    "title": {"type": "string", "description": "PR title"},
                    "body": {"type": "string", "description": "PR body"},
                    "head": {"type": "string", "description": "Branch to merge from"},
                    "base": {"type": "string", "description": "Branch to merge into", "default": "main"},
                },
                "required": ["owner", "repo", "title", "head"],
            },
        ),
        Tool(
            name="github_get_file_contents",
            description="Get file contents from a repository",
            inputSchema={
                "type": "object",
                "properties": {
                    "owner": {"type": "string", "description": "Repository owner"},
                    "repo": {"type": "string", "description": "Repository name"},
                    "path": {"type": "string", "description": "File path in repository"},
                    "ref": {"type": "string", "description": "Branch/tag/commit SHA", "default": "main"},
                },
                "required": ["owner", "repo", "path"],
            },
        ),
        Tool(
            name="github_search_repositories",
            description="Search for repositories",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"},
                    "sort": {"type": "string", "enum": ["stars", "forks", "updated"], "default": "stars"},
                    "order": {"type": "string", "enum": ["asc", "desc"], "default": "desc"},
                },
                "required": ["query"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "github_get_repo":
            result = await github_request("GET", f"/repos/{arguments['owner']}/{arguments['repo']}")
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "github_list_issues":
            params = {"state": arguments.get("state", "open")}
            if "labels" in arguments:
                params["labels"] = arguments["labels"]
            result = await github_request("GET", f"/repos/{arguments['owner']}/{arguments['repo']}/issues", params=params)
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "github_create_issue":
            data = {"title": arguments["title"]}
            if "body" in arguments:
                data["body"] = arguments["body"]
            if "labels" in arguments:
                data["labels"] = arguments["labels"]
            result = await github_request("POST", f"/repos/{arguments['owner']}/{arguments['repo']}/issues", data=data)
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "github_list_pull_requests":
            params = {"state": arguments.get("state", "open")}
            result = await github_request("GET", f"/repos/{arguments['owner']}/{arguments['repo']}/pulls", params=params)
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "github_create_pull_request":
            data = {
                "title": arguments["title"],
                "head": arguments["head"],
                "base": arguments.get("base", "main"),
            }
            if "body" in arguments:
                data["body"] = arguments["body"]
            result = await github_request("POST", f"/repos/{arguments['owner']}/{arguments['repo']}/pulls", data=data)
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "github_get_file_contents":
            ref = arguments.get("ref", "main")
            result = await github_request("GET", f"/repos/{arguments['owner']}/{arguments['repo']}/contents/{arguments['path']}", params={"ref": ref})
            import base64
            if result.get("encoding") == "base64":
                content = base64.b64decode(result["content"]).decode("utf-8")
                result["decoded_content"] = content
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "github_search_repositories":
            params = {
                "q": arguments["query"],
                "sort": arguments.get("sort", "stars"),
                "order": arguments.get("order", "desc"),
            }
            result = await github_request("GET", "/search/repositories", params=params)
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
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

