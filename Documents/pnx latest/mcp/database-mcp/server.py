#!/usr/bin/env python3
"""
Database MCP Server
Provides tools for PostgreSQL database operations.
"""

import asyncio
import json
import os
from typing import Any, Optional, Dict, List

import asyncpg
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("database-mcp")

# Database connection pool
db_pool: Optional[asyncpg.Pool] = None

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL", "")


async def get_pool() -> asyncpg.Pool:
    """Get or create database connection pool"""
    global db_pool
    if db_pool is None:
        if not DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable not set")
        db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
    return db_pool


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available database tools"""
    return [
        Tool(
            name="db_query",
            description="Execute a SELECT query",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "SQL SELECT query"},
                    "params": {"type": "array", "items": {"type": "string"}, "description": "Query parameters"},
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="db_execute",
            description="Execute an INSERT, UPDATE, or DELETE query",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "SQL query"},
                    "params": {"type": "array", "items": {"type": "string"}, "description": "Query parameters"},
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="db_transaction",
            description="Execute multiple queries in a transaction",
            inputSchema={
                "type": "object",
                "properties": {
                    "queries": {"type": "array", "items": {"type": "object"}, "description": "List of queries with params"},
                },
                "required": ["queries"],
            },
        ),
        Tool(
            name="db_list_tables",
            description="List all tables in the database",
            inputSchema={
                "type": "object",
                "properties": {
                    "schema": {"type": "string", "description": "Schema name (default: public)", "default": "public"},
                },
            },
        ),
        Tool(
            name="db_describe_table",
            description="Get table schema information",
            inputSchema={
                "type": "object",
                "properties": {
                    "table_name": {"type": "string", "description": "Table name"},
                    "schema": {"type": "string", "description": "Schema name (default: public)", "default": "public"},
                },
                "required": ["table_name"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        pool = await get_pool()
        
        if name == "db_query":
            query = arguments["query"]
            params = arguments.get("params", [])
            
            async with pool.acquire() as conn:
                rows = await conn.fetch(query, *params)
                result = [dict(row) for row in rows]
            
            return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
        elif name == "db_execute":
            query = arguments["query"]
            params = arguments.get("params", [])
            
            async with pool.acquire() as conn:
                result = await conn.execute(query, *params)
            
            return [TextContent(type="text", text=json.dumps({"status": "success", "result": result}, indent=2))]
        
        elif name == "db_transaction":
            queries = arguments["queries"]
            
            async with pool.acquire() as conn:
                async with conn.transaction():
                    results = []
                    for q in queries:
                        query = q["query"]
                        params = q.get("params", [])
                        if query.strip().upper().startswith("SELECT"):
                            rows = await conn.fetch(query, *params)
                            results.append([dict(row) for row in rows])
                        else:
                            result = await conn.execute(query, *params)
                            results.append(result)
            
            return [TextContent(type="text", text=json.dumps({"status": "success", "results": results}, indent=2, default=str))]
        
        elif name == "db_list_tables":
            schema = arguments.get("schema", "public")
            query = """
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = $1
                ORDER BY table_name
            """
            
            async with pool.acquire() as conn:
                rows = await conn.fetch(query, schema)
                tables = [row["table_name"] for row in rows]
            
            return [TextContent(type="text", text=json.dumps(tables, indent=2))]
        
        elif name == "db_describe_table":
            table_name = arguments["table_name"]
            schema = arguments.get("schema", "public")
            query = """
                SELECT 
                    column_name,
                    data_type,
                    is_nullable,
                    column_default
                FROM information_schema.columns
                WHERE table_schema = $1 AND table_name = $2
                ORDER BY ordinal_position
            """
            
            async with pool.acquire() as conn:
                rows = await conn.fetch(query, schema, table_name)
                columns = [dict(row) for row in rows]
            
            return [TextContent(type="text", text=json.dumps(columns, indent=2))]
        
        else:
            raise ValueError(f"Unknown tool: {name}")
    
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]


async def cleanup():
    """Cleanup database connections"""
    global db_pool
    if db_pool:
        await db_pool.close()


async def main():
    """Main entry point"""
    try:
        async with stdio_server() as (read_stream, write_stream):
            await server.run(read_stream, write_stream, server.create_initialization_options())
    finally:
        await cleanup()


if __name__ == "__main__":
    asyncio.run(main())

