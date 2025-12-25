#!/usr/bin/env python3
"""
File System MCP Server
Provides tools for local file system operations with safety checks.
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Any, Optional

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("filesystem-mcp")

# Base directory for operations (safety boundary)
BASE_DIR = os.getenv("FILESYSTEM_BASE_DIR", os.getcwd())


def safe_path(path: str) -> Path:
    """Ensure path is within base directory"""
    full_path = (Path(BASE_DIR) / path).resolve()
    base = Path(BASE_DIR).resolve()
    if not str(full_path).startswith(str(base)):
        raise ValueError(f"Path outside allowed directory: {path}")
    return full_path


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available file system tools"""
    return [
        Tool(
            name="fs_read_file",
            description="Read file contents",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "File path relative to base directory"},
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="fs_write_file",
            description="Write content to a file",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "File path relative to base directory"},
                    "content": {"type": "string", "description": "File content"},
                    "append": {"type": "boolean", "description": "Append to file instead of overwrite", "default": False},
                },
                "required": ["path", "content"],
            },
        ),
        Tool(
            name="fs_list_directory",
            description="List directory contents",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Directory path relative to base directory", "default": "."},
                    "recursive": {"type": "boolean", "description": "List recursively", "default": False},
                },
            },
        ),
        Tool(
            name="fs_create_directory",
            description="Create a directory",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Directory path relative to base directory"},
                    "parents": {"type": "boolean", "description": "Create parent directories if needed", "default": True},
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="fs_delete_file",
            description="Delete a file",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "File path relative to base directory"},
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="fs_delete_directory",
            description="Delete a directory",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Directory path relative to base directory"},
                    "recursive": {"type": "boolean", "description": "Delete recursively", "default": False},
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="fs_file_exists",
            description="Check if file or directory exists",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Path relative to base directory"},
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="fs_get_file_info",
            description="Get file metadata (size, modified time, etc.)",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "File path relative to base directory"},
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="fs_copy_file",
            description="Copy a file",
            inputSchema={
                "type": "object",
                "properties": {
                    "source": {"type": "string", "description": "Source file path"},
                    "destination": {"type": "string", "description": "Destination file path"},
                },
                "required": ["source", "destination"],
            },
        ),
        Tool(
            name="fs_move_file",
            description="Move or rename a file",
            inputSchema={
                "type": "object",
                "properties": {
                    "source": {"type": "string", "description": "Source file path"},
                    "destination": {"type": "string", "description": "Destination file path"},
                },
                "required": ["source", "destination"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "fs_read_file":
            path = safe_path(arguments["path"])
            content = path.read_text(encoding="utf-8")
            return [TextContent(type="text", text=content)]
        
        elif name == "fs_write_file":
            path = safe_path(arguments["path"])
            path.parent.mkdir(parents=True, exist_ok=True)
            mode = "a" if arguments.get("append", False) else "w"
            with path.open(mode, encoding="utf-8") as f:
                f.write(arguments["content"])
            return [TextContent(type="text", text=f"File written: {path}")]
        
        elif name == "fs_list_directory":
            dir_path = safe_path(arguments.get("path", "."))
            if not dir_path.is_dir():
                raise ValueError(f"Not a directory: {dir_path}")
            
            if arguments.get("recursive", False):
                items = []
                for root, dirs, files in os.walk(dir_path):
                    for d in dirs:
                        items.append({"type": "directory", "path": str(Path(root) / d)})
                    for f in files:
                        items.append({"type": "file", "path": str(Path(root) / f)})
                return [TextContent(type="text", text=json.dumps(items, indent=2))]
            else:
                items = []
                for item in dir_path.iterdir():
                    items.append({
                        "name": item.name,
                        "type": "directory" if item.is_dir() else "file",
                        "path": str(item),
                    })
                return [TextContent(type="text", text=json.dumps(items, indent=2))]
        
        elif name == "fs_create_directory":
            path = safe_path(arguments["path"])
            path.mkdir(parents=arguments.get("parents", True), exist_ok=True)
            return [TextContent(type="text", text=f"Directory created: {path}")]
        
        elif name == "fs_delete_file":
            path = safe_path(arguments["path"])
            if not path.is_file():
                raise ValueError(f"Not a file: {path}")
            path.unlink()
            return [TextContent(type="text", text=f"File deleted: {path}")]
        
        elif name == "fs_delete_directory":
            path = safe_path(arguments["path"])
            if not path.is_dir():
                raise ValueError(f"Not a directory: {path}")
            if arguments.get("recursive", False):
                import shutil
                shutil.rmtree(path)
            else:
                path.rmdir()
            return [TextContent(type="text", text=f"Directory deleted: {path}")]
        
        elif name == "fs_file_exists":
            path = safe_path(arguments["path"])
            exists = path.exists()
            return [TextContent(type="text", text=json.dumps({"exists": exists, "is_file": path.is_file() if exists else False, "is_dir": path.is_dir() if exists else False}))]
        
        elif name == "fs_get_file_info":
            path = safe_path(arguments["path"])
            if not path.exists():
                raise ValueError(f"File not found: {path}")
            stat = path.stat()
            info = {
                "path": str(path),
                "size": stat.st_size,
                "modified": stat.st_mtime,
                "is_file": path.is_file(),
                "is_dir": path.is_dir(),
            }
            return [TextContent(type="text", text=json.dumps(info, indent=2))]
        
        elif name == "fs_copy_file":
            source = safe_path(arguments["source"])
            dest = safe_path(arguments["destination"])
            import shutil
            shutil.copy2(source, dest)
            return [TextContent(type="text", text=f"File copied: {source} -> {dest}")]
        
        elif name == "fs_move_file":
            source = safe_path(arguments["source"])
            dest = safe_path(arguments["destination"])
            source.rename(dest)
            return [TextContent(type="text", text=f"File moved: {source} -> {dest}")]
        
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

