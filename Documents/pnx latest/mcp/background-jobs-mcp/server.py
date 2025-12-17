#!/usr/bin/env python3
"""
Background Jobs MCP Server
Provides tools for background job management and execution.
"""

import asyncio
import json
import uuid
from datetime import datetime
from typing import Any, Optional, Dict, List
from enum import Enum

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("background-jobs-mcp")

# Job storage
jobs: Dict[str, dict] = {}
job_queue: List[str] = []


class JobStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


async def execute_job(job_id: str):
    """Execute a background job"""
    if job_id not in jobs:
        return
    
    job = jobs[job_id]
    job["status"] = JobStatus.RUNNING.value
    job["started_at"] = datetime.utcnow().isoformat()
    
    try:
        # Execute job based on type
        job_type = job.get("type", "script")
        
        if job_type == "script":
            # Execute Python script
            code = job.get("code", "")
            # In production, use proper sandboxed execution
            exec(code)
            result = {"output": "Job executed successfully"}
        
        elif job_type == "http_request":
            # Make HTTP request
            import httpx
            url = job.get("url")
            method = job.get("method", "GET")
            data = job.get("data")
            
            async with httpx.AsyncClient() as client:
                response = await client.request(method, url, json=data)
                result = {
                    "status_code": response.status_code,
                    "response": response.text[:1000],
                }
        
        else:
            result = {"output": "Unknown job type"}
        
        job["status"] = JobStatus.COMPLETED.value
        job["completed_at"] = datetime.utcnow().isoformat()
        job["result"] = result
    
    except Exception as e:
        job["status"] = JobStatus.FAILED.value
        job["completed_at"] = datetime.utcnow().isoformat()
        job["error"] = str(e)


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available job management tools"""
    return [
        Tool(
            name="job_create",
            description="Create a new background job",
            inputSchema={
                "type": "object",
                "properties": {
                    "job_id": {"type": "string", "description": "Optional job ID (auto-generated if not provided)"},
                    "type": {"type": "string", "enum": ["script", "http_request"], "description": "Job type"},
                    "code": {"type": "string", "description": "Python code to execute (for script type)"},
                    "url": {"type": "string", "description": "URL for HTTP request (for http_request type)"},
                    "method": {"type": "string", "enum": ["GET", "POST", "PUT", "DELETE"], "description": "HTTP method"},
                    "data": {"type": "object", "description": "Request data"},
                    "schedule": {"type": "string", "description": "Cron expression for scheduling"},
                    "priority": {"type": "number", "description": "Job priority (higher = more important)", "default": 0},
                },
                "required": ["type"],
            },
        ),
        Tool(
            name="job_get",
            description="Get job status and details",
            inputSchema={
                "type": "object",
                "properties": {
                    "job_id": {"type": "string", "description": "Job ID"},
                },
                "required": ["job_id"],
            },
        ),
        Tool(
            name="job_list",
            description="List all jobs",
            inputSchema={
                "type": "object",
                "properties": {
                    "status": {"type": "string", "enum": ["pending", "running", "completed", "failed", "cancelled"]},
                    "limit": {"type": "number", "description": "Maximum number of jobs", "default": 50},
                },
            },
        ),
        Tool(
            name="job_cancel",
            description="Cancel a job",
            inputSchema={
                "type": "object",
                "properties": {
                    "job_id": {"type": "string", "description": "Job ID"},
                },
                "required": ["job_id"],
            },
        ),
        Tool(
            name="job_retry",
            description="Retry a failed job",
            inputSchema={
                "type": "object",
                "properties": {
                    "job_id": {"type": "string", "description": "Job ID"},
                },
                "required": ["job_id"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "job_create":
            job_id = arguments.get("job_id") or str(uuid.uuid4())
            
            job = {
                "job_id": job_id,
                "type": arguments["type"],
                "status": JobStatus.PENDING.value,
                "created_at": datetime.utcnow().isoformat(),
                "priority": arguments.get("priority", 0),
            }
            
            if arguments["type"] == "script":
                job["code"] = arguments.get("code", "")
            elif arguments["type"] == "http_request":
                job["url"] = arguments.get("url")
                job["method"] = arguments.get("method", "GET")
                job["data"] = arguments.get("data")
            
            if "schedule" in arguments:
                job["schedule"] = arguments["schedule"]
            
            jobs[job_id] = job
            job_queue.append(job_id)
            
            # Start job execution in background
            asyncio.create_task(execute_job(job_id))
            
            return [TextContent(type="text", text=json.dumps({"status": "created", "job_id": job_id}, indent=2))]
        
        elif name == "job_get":
            job_id = arguments["job_id"]
            if job_id not in jobs:
                raise ValueError(f"Job not found: {job_id}")
            
            return [TextContent(type="text", text=json.dumps(jobs[job_id], indent=2))]
        
        elif name == "job_list":
            job_list = list(jobs.values())
            
            if "status" in arguments:
                job_list = [j for j in job_list if j["status"] == arguments["status"]]
            
            # Sort by created_at (newest first)
            job_list.sort(key=lambda x: x["created_at"], reverse=True)
            
            limit = arguments.get("limit", 50)
            job_list = job_list[:limit]
            
            return [TextContent(type="text", text=json.dumps(job_list, indent=2))]
        
        elif name == "job_cancel":
            job_id = arguments["job_id"]
            if job_id not in jobs:
                raise ValueError(f"Job not found: {job_id}")
            
            job = jobs[job_id]
            if job["status"] in [JobStatus.PENDING.value, JobStatus.RUNNING.value]:
                job["status"] = JobStatus.CANCELLED.value
                job["cancelled_at"] = datetime.utcnow().isoformat()
                return [TextContent(type="text", text=json.dumps({"status": "cancelled", "job_id": job_id}, indent=2))]
            else:
                return [TextContent(type="text", text=json.dumps({"status": "cannot_cancel", "current_status": job["status"]}, indent=2))]
        
        elif name == "job_retry":
            job_id = arguments["job_id"]
            if job_id not in jobs:
                raise ValueError(f"Job not found: {job_id}")
            
            job = jobs[job_id]
            if job["status"] == JobStatus.FAILED.value:
                job["status"] = JobStatus.PENDING.value
                job["retry_count"] = job.get("retry_count", 0) + 1
                asyncio.create_task(execute_job(job_id))
                return [TextContent(type="text", text=json.dumps({"status": "retrying", "job_id": job_id}, indent=2))]
            else:
                return [TextContent(type="text", text=json.dumps({"status": "cannot_retry", "current_status": job["status"]}, indent=2))]
        
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

