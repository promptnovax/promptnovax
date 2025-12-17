#!/usr/bin/env python3
"""
Prompt Execution MCP Server
Provides tools for prompt execution and workflow orchestration.
"""

import asyncio
import json
from typing import Any, Optional, Dict, List

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("prompt-execution-mcp")

# Workflow storage (in-memory, can be replaced with database)
workflows: Dict[str, dict] = {}
execution_history: List[dict] = []


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available prompt execution tools"""
    return [
        Tool(
            name="prompt_execute",
            description="Execute a prompt with optional variables",
            inputSchema={
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "Prompt template"},
                    "variables": {"type": "object", "description": "Variables to substitute in prompt"},
                    "output_format": {"type": "string", "enum": ["text", "json", "structured"], "default": "text"},
                },
                "required": ["prompt"],
            },
        ),
        Tool(
            name="prompt_create_workflow",
            description="Create a new workflow",
            inputSchema={
                "type": "object",
                "properties": {
                    "workflow_id": {"type": "string", "description": "Unique workflow ID"},
                    "steps": {"type": "array", "items": {"type": "object"}, "description": "Workflow steps"},
                    "description": {"type": "string", "description": "Workflow description"},
                },
                "required": ["workflow_id", "steps"],
            },
        ),
        Tool(
            name="prompt_execute_workflow",
            description="Execute a workflow",
            inputSchema={
                "type": "object",
                "properties": {
                    "workflow_id": {"type": "string", "description": "Workflow ID to execute"},
                    "input_data": {"type": "object", "description": "Input data for workflow"},
                },
                "required": ["workflow_id"],
            },
        ),
        Tool(
            name="prompt_list_workflows",
            description="List all workflows",
            inputSchema={},
        ),
        Tool(
            name="prompt_get_workflow",
            description="Get workflow details",
            inputSchema={
                "type": "object",
                "properties": {
                    "workflow_id": {"type": "string", "description": "Workflow ID"},
                },
                "required": ["workflow_id"],
            },
        ),
    ]


def substitute_variables(prompt: str, variables: dict) -> str:
    """Substitute variables in prompt template"""
    result = prompt
    for key, value in variables.items():
        result = result.replace(f"{{{key}}}", str(value))
    return result


async def execute_workflow_step(step: dict, context: dict) -> dict:
    """Execute a single workflow step"""
    step_type = step.get("type", "prompt")
    
    if step_type == "prompt":
        prompt = step.get("prompt", "")
        # Substitute variables from context
        prompt = substitute_variables(prompt, context)
        return {"type": "prompt", "result": prompt, "status": "completed"}
    
    elif step_type == "condition":
        condition = step.get("condition", "")
        # Simple condition evaluation (can be enhanced)
        if condition in context and context[condition]:
            return {"type": "condition", "result": True, "status": "completed"}
        return {"type": "condition", "result": False, "status": "completed"}
    
    elif step_type == "transform":
        transform_func = step.get("transform", "")
        # Simple transform (can be enhanced with actual transformation logic)
        return {"type": "transform", "result": context, "status": "completed"}
    
    return {"type": step_type, "result": None, "status": "error", "error": "Unknown step type"}


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "prompt_execute":
            prompt = arguments["prompt"]
            variables = arguments.get("variables", {})
            
            # Substitute variables
            result_prompt = substitute_variables(prompt, variables)
            
            output_format = arguments.get("output_format", "text")
            result = {
                "prompt": result_prompt,
                "variables": variables,
                "output_format": output_format,
            }
            
            execution_history.append({
                "type": "prompt_execute",
                "result": result,
            })
            
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "prompt_create_workflow":
            workflow_id = arguments["workflow_id"]
            workflows[workflow_id] = {
                "id": workflow_id,
                "steps": arguments["steps"],
                "description": arguments.get("description", ""),
            }
            return [TextContent(type="text", text=json.dumps({"status": "created", "workflow_id": workflow_id}, indent=2))]
        
        elif name == "prompt_execute_workflow":
            workflow_id = arguments["workflow_id"]
            if workflow_id not in workflows:
                raise ValueError(f"Workflow not found: {workflow_id}")
            
            workflow = workflows[workflow_id]
            context = arguments.get("input_data", {})
            results = []
            
            for step in workflow["steps"]:
                step_result = await execute_workflow_step(step, context)
                results.append(step_result)
                # Update context with step result
                if "output_key" in step:
                    context[step["output_key"]] = step_result.get("result")
            
            execution_history.append({
                "type": "workflow_execute",
                "workflow_id": workflow_id,
                "results": results,
            })
            
            return [TextContent(type="text", text=json.dumps({"workflow_id": workflow_id, "results": results}, indent=2))]
        
        elif name == "prompt_list_workflows":
            workflow_list = [
                {
                    "id": wf["id"],
                    "description": wf.get("description", ""),
                    "steps_count": len(wf["steps"]),
                }
                for wf in workflows.values()
            ]
            return [TextContent(type="text", text=json.dumps(workflow_list, indent=2))]
        
        elif name == "prompt_get_workflow":
            workflow_id = arguments["workflow_id"]
            if workflow_id not in workflows:
                raise ValueError(f"Workflow not found: {workflow_id}")
            
            return [TextContent(type="text", text=json.dumps(workflows[workflow_id], indent=2))]
        
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

