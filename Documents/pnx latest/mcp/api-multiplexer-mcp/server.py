#!/usr/bin/env python3
"""
API Multiplexer MCP Server
Provides tools for API multiplexing and model switching.
"""

import asyncio
import json
import os
from typing import Any, Optional, Dict

import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("api-multiplexer-mcp")

# API configurations
API_CONFIGS: Dict[str, dict] = {
    "openai": {
        "base_url": "https://api.openai.com/v1",
        "api_key": os.getenv("OPENAI_API_KEY", ""),
        "headers": {"Content-Type": "application/json"},
    },
    "gemini": {
        "base_url": "https://generativelanguage.googleapis.com/v1beta",
        "api_key": os.getenv("GEMINI_API_KEY", ""),
    },
    "anthropic": {
        "base_url": "https://api.anthropic.com/v1",
        "api_key": os.getenv("ANTHROPIC_API_KEY", ""),
        "headers": {"Content-Type": "application/json", "anthropic-version": "2023-06-01"},
    },
}


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available API multiplexer tools"""
    return [
        Tool(
            name="multiplexer_register_api",
            description="Register a new API configuration",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "API name"},
                    "base_url": {"type": "string", "description": "Base URL"},
                    "api_key": {"type": "string", "description": "API key"},
                    "headers": {"type": "object", "description": "Default headers"},
                },
                "required": ["name", "base_url"],
            },
        ),
        Tool(
            name="multiplexer_call",
            description="Call an API endpoint",
            inputSchema={
                "type": "object",
                "properties": {
                    "api_name": {"type": "string", "description": "API name"},
                    "endpoint": {"type": "string", "description": "API endpoint"},
                    "method": {"type": "string", "enum": ["GET", "POST", "PUT", "DELETE", "PATCH"], "default": "POST"},
                    "data": {"type": "object", "description": "Request body"},
                    "params": {"type": "object", "description": "Query parameters"},
                },
                "required": ["api_name", "endpoint"],
            },
        ),
        Tool(
            name="multiplexer_switch_model",
            description="Switch between different models/APIs for the same operation",
            inputSchema={
                "type": "object",
                "properties": {
                    "operation": {"type": "string", "description": "Operation type (chat, embed, etc.)"},
                    "model": {"type": "string", "description": "Model identifier"},
                    "api_name": {"type": "string", "description": "API to use"},
                },
                "required": ["operation", "model", "api_name"],
            },
        ),
        Tool(
            name="multiplexer_list_apis",
            description="List all registered APIs",
            inputSchema={},
        ),
        Tool(
            name="multiplexer_fallback_call",
            description="Call API with fallback to alternative APIs on failure",
            inputSchema={
                "type": "object",
                "properties": {
                    "api_names": {"type": "array", "items": {"type": "string"}, "description": "List of APIs to try in order"},
                    "endpoint": {"type": "string", "description": "API endpoint"},
                    "method": {"type": "string", "enum": ["GET", "POST", "PUT", "DELETE", "PATCH"], "default": "POST"},
                    "data": {"type": "object", "description": "Request body"},
                },
                "required": ["api_names", "endpoint"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "multiplexer_register_api":
            api_name = arguments["name"]
            API_CONFIGS[api_name] = {
                "base_url": arguments["base_url"],
                "api_key": arguments.get("api_key", ""),
                "headers": arguments.get("headers", {}),
            }
            return [TextContent(type="text", text=json.dumps({"status": "registered", "api_name": api_name}, indent=2))]
        
        elif name == "multiplexer_call":
            api_name = arguments["api_name"]
            if api_name not in API_CONFIGS:
                raise ValueError(f"API not found: {api_name}")
            
            config = API_CONFIGS[api_name]
            endpoint = arguments["endpoint"]
            method = arguments.get("method", "POST")
            data = arguments.get("data")
            params = arguments.get("params")
            
            url = f"{config['base_url']}{endpoint}"
            headers = config.get("headers", {}).copy()
            
            # Add API key to headers or params
            if config.get("api_key"):
                if "gemini" in api_name.lower():
                    # Gemini uses query param
                    if params is None:
                        params = {}
                    params["key"] = config["api_key"]
                else:
                    headers["Authorization"] = f"Bearer {config['api_key']}"
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.request(method, url, headers=headers, json=data, params=params)
                response.raise_for_status()
                result = response.json() if response.content else {}
            
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "multiplexer_switch_model":
            # Store model mapping (in production, use persistent storage)
            operation = arguments["operation"]
            model = arguments["model"]
            api_name = arguments["api_name"]
            
            # This is a simplified implementation
            # In production, you'd maintain a mapping of operation -> model -> api
            result = {
                "operation": operation,
                "model": model,
                "api": api_name,
                "status": "configured",
            }
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "multiplexer_list_apis":
            api_list = [
                {
                    "name": name,
                    "base_url": config["base_url"],
                    "has_api_key": bool(config.get("api_key")),
                }
                for name, config in API_CONFIGS.items()
            ]
            return [TextContent(type="text", text=json.dumps(api_list, indent=2))]
        
        elif name == "multiplexer_fallback_call":
            api_names = arguments["api_names"]
            endpoint = arguments["endpoint"]
            method = arguments.get("method", "POST")
            data = arguments.get("data")
            
            last_error = None
            for api_name in api_names:
                if api_name not in API_CONFIGS:
                    continue
                
                try:
                    config = API_CONFIGS[api_name]
                    url = f"{config['base_url']}{endpoint}"
                    headers = config.get("headers", {}).copy()
                    
                    if config.get("api_key"):
                        if "gemini" in api_name.lower():
                            params = {"key": config["api_key"]}
                        else:
                            headers["Authorization"] = f"Bearer {config['api_key']}"
                            params = None
                    else:
                        params = None
                    
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        response = await client.request(method, url, headers=headers, json=data, params=params)
                        response.raise_for_status()
                        result = response.json() if response.content else {}
                    
                    return [TextContent(type="text", text=json.dumps({"api_used": api_name, "result": result}, indent=2))]
                
                except Exception as e:
                    last_error = str(e)
                    continue
            
            return [TextContent(type="text", text=json.dumps({"error": "All APIs failed", "last_error": last_error}, indent=2))]
        
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

