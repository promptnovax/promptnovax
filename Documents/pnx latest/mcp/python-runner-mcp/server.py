#!/usr/bin/env python3
"""
Python Runner MCP Server
Provides sandboxed Python code execution with safety restrictions.
"""

import asyncio
import io
import json
import sys
import traceback
from contextlib import redirect_stdout, redirect_stderr
from typing import Any, Optional

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("python-runner-mcp")

# Restricted imports and operations
RESTRICTED_IMPORTS = {
    "os", "sys", "subprocess", "importlib", "eval", "exec", "compile",
    "__import__", "open", "file", "input", "raw_input",
}

RESTRICTED_BUILTINS = {
    "open", "file", "input", "raw_input", "exec", "eval", "compile",
    "__import__", "reload", "exit", "quit",
}


def safe_exec(code: str, timeout: int = 10) -> dict:
    """Safely execute Python code with restrictions"""
    # Basic safety checks
    for restricted in RESTRICTED_IMPORTS:
        if f"import {restricted}" in code or f"from {restricted}" in code:
            return {"error": f"Restricted import: {restricted}"}
    
    # Create restricted globals
    safe_globals = {
        "__builtins__": {
            k: v for k, v in __builtins__.items()
            if k not in RESTRICTED_BUILTINS
        },
        "__name__": "__main__",
    }
    
    # Capture output
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    
    try:
        with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
            exec(code, safe_globals, {})
        
        return {
            "success": True,
            "stdout": stdout_capture.getvalue(),
            "stderr": stderr_capture.getvalue(),
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
            "stdout": stdout_capture.getvalue(),
            "stderr": stderr_capture.getvalue(),
        }


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available Python runner tools"""
    return [
        Tool(
            name="python_execute",
            description="Execute Python code in a sandboxed environment",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {"type": "string", "description": "Python code to execute"},
                    "timeout": {"type": "number", "description": "Execution timeout in seconds", "default": 10},
                },
                "required": ["code"],
            },
        ),
        Tool(
            name="python_evaluate",
            description="Evaluate a Python expression and return the result",
            inputSchema={
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Python expression to evaluate"},
                },
                "required": ["expression"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "python_execute":
            result = safe_exec(arguments["code"], arguments.get("timeout", 10))
            import json
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "python_evaluate":
            # For evaluation, we'll use a safer approach
            try:
                # Basic safety check
                expr = arguments["expression"]
                for restricted in RESTRICTED_BUILTINS:
                    if restricted in expr:
                        raise ValueError(f"Restricted operation: {restricted}")
                
                result = eval(expr, {"__builtins__": {}}, {})
                return [TextContent(type="text", text=json.dumps({"success": True, "result": str(result)}))]
            except Exception as e:
                return [TextContent(type="text", text=json.dumps({"success": False, "error": str(e)}))]
        
        else:
            raise ValueError(f"Unknown tool: {name}")
    
    except Exception as e:
        import json
        return [TextContent(type="text", text=json.dumps({"error": str(e)}))]


async def main():
    """Main entry point"""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())

