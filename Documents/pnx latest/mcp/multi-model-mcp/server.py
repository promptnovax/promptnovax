#!/usr/bin/env python3
"""
Multi-Model MCP Server
Provides tools for OpenAI and Google Gemini AI operations.
"""

import asyncio
import json
import os
import sys
from typing import Any, Optional

import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("multi-model-mcp")

# API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY not set.", file=sys.stderr)
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not set.", file=sys.stderr)


async def openai_chat_completion(model: str, messages: list, temperature: float = 0.7) -> dict:
    """Call OpenAI API"""
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=60.0,
        )
        response.raise_for_status()
        return response.json()


async def gemini_chat_completion(model: str, prompt: str, temperature: float = 0.7) -> dict:
    """Call Gemini API"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": temperature},
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data, timeout=60.0)
        response.raise_for_status()
        return response.json()


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available AI model tools"""
    return [
        Tool(
            name="openai_chat",
            description="Chat with OpenAI models (GPT-4, GPT-3.5, etc.)",
            inputSchema={
                "type": "object",
                "properties": {
                    "model": {"type": "string", "description": "Model name (e.g., gpt-4, gpt-3.5-turbo)", "default": "gpt-3.5-turbo"},
                    "messages": {"type": "array", "items": {"type": "object"}, "description": "Chat messages"},
                    "temperature": {"type": "number", "description": "Temperature (0-2)", "default": 0.7},
                },
                "required": ["messages"],
            },
        ),
        Tool(
            name="openai_embed",
            description="Generate embeddings using OpenAI",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to embed"},
                    "model": {"type": "string", "description": "Embedding model", "default": "text-embedding-3-small"},
                },
                "required": ["text"],
            },
        ),
        Tool(
            name="gemini_chat",
            description="Chat with Google Gemini models",
            inputSchema={
                "type": "object",
                "properties": {
                    "model": {"type": "string", "description": "Model name (e.g., gemini-pro)", "default": "gemini-pro"},
                    "prompt": {"type": "string", "description": "Prompt text"},
                    "temperature": {"type": "number", "description": "Temperature (0-2)", "default": 0.7},
                },
                "required": ["prompt"],
            },
        ),
        Tool(
            name="gemini_embed",
            description="Generate embeddings using Gemini",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to embed"},
                },
                "required": ["text"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "openai_chat":
            result = await openai_chat_completion(
                arguments.get("model", "gpt-3.5-turbo"),
                arguments["messages"],
                arguments.get("temperature", 0.7),
            )
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "openai_embed":
            headers = {
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            }
            data = {
                "model": arguments.get("model", "text-embedding-3-small"),
                "input": arguments["text"],
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/embeddings",
                    headers=headers,
                    json=data,
                    timeout=60.0,
                )
                response.raise_for_status()
                result = response.json()
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "gemini_chat":
            result = await gemini_chat_completion(
                arguments.get("model", "gemini-pro"),
                arguments["prompt"],
                arguments.get("temperature", 0.7),
            )
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "gemini_embed":
            url = f"https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key={GEMINI_API_KEY}"
            data = {
                "model": "models/embedding-001",
                "content": {"parts": [{"text": arguments["text"]}]},
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data, timeout=60.0)
                response.raise_for_status()
                result = response.json()
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

