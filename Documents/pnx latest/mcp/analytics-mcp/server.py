#!/usr/bin/env python3
"""
Analytics MCP Server
Provides tools for analytics, usage tracking, and metrics.
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Any, Optional, Dict, List
from collections import defaultdict

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("analytics-mcp")

# In-memory analytics store (can be replaced with database)
events: List[dict] = []
metrics: Dict[str, dict] = {}


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available analytics tools"""
    return [
        Tool(
            name="analytics_track_event",
            description="Track an event",
            inputSchema={
                "type": "object",
                "properties": {
                    "event_name": {"type": "string", "description": "Event name"},
                    "user_id": {"type": "string", "description": "User ID"},
                    "properties": {"type": "object", "description": "Event properties"},
                    "timestamp": {"type": "string", "description": "ISO timestamp (optional)"},
                },
                "required": ["event_name"],
            },
        ),
        Tool(
            name="analytics_get_events",
            description="Get events with filters",
            inputSchema={
                "type": "object",
                "properties": {
                    "event_name": {"type": "string", "description": "Filter by event name"},
                    "user_id": {"type": "string", "description": "Filter by user ID"},
                    "start_date": {"type": "string", "description": "Start date (ISO format)"},
                    "end_date": {"type": "string", "description": "End date (ISO format)"},
                    "limit": {"type": "number", "description": "Maximum number of events", "default": 100},
                },
            },
        ),
        Tool(
            name="analytics_get_metrics",
            description="Get aggregated metrics",
            inputSchema={
                "type": "object",
                "properties": {
                    "metric_name": {"type": "string", "description": "Metric name"},
                    "start_date": {"type": "string", "description": "Start date (ISO format)"},
                    "end_date": {"type": "string", "description": "End date (ISO format)"},
                    "group_by": {"type": "string", "enum": ["day", "hour", "week", "month"], "description": "Group by time period"},
                },
            },
        ),
        Tool(
            name="analytics_increment_metric",
            description="Increment a counter metric",
            inputSchema={
                "type": "object",
                "properties": {
                    "metric_name": {"type": "string", "description": "Metric name"},
                    "value": {"type": "number", "description": "Value to increment by", "default": 1},
                },
                "required": ["metric_name"],
            },
        ),
        Tool(
            name="analytics_set_metric",
            description="Set a metric value",
            inputSchema={
                "type": "object",
                "properties": {
                    "metric_name": {"type": "string", "description": "Metric name"},
                    "value": {"type": "number", "description": "Metric value"},
                },
                "required": ["metric_name", "value"],
            },
        ),
        Tool(
            name="analytics_get_user_activity",
            description="Get user activity summary",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User ID"},
                    "days": {"type": "number", "description": "Number of days to look back", "default": 30},
                },
                "required": ["user_id"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "analytics_track_event":
            event = {
                "event_name": arguments["event_name"],
                "user_id": arguments.get("user_id"),
                "properties": arguments.get("properties", {}),
                "timestamp": arguments.get("timestamp") or datetime.utcnow().isoformat(),
            }
            events.append(event)
            return [TextContent(type="text", text=json.dumps({"status": "tracked", "event": event}, indent=2))]
        
        elif name == "analytics_get_events":
            filtered_events = events.copy()
            
            if "event_name" in arguments:
                filtered_events = [e for e in filtered_events if e["event_name"] == arguments["event_name"]]
            
            if "user_id" in arguments:
                filtered_events = [e for e in filtered_events if e.get("user_id") == arguments["user_id"]]
            
            if "start_date" in arguments:
                start = datetime.fromisoformat(arguments["start_date"])
                filtered_events = [e for e in filtered_events if datetime.fromisoformat(e["timestamp"]) >= start]
            
            if "end_date" in arguments:
                end = datetime.fromisoformat(arguments["end_date"])
                filtered_events = [e for e in filtered_events if datetime.fromisoformat(e["timestamp"]) <= end]
            
            limit = arguments.get("limit", 100)
            filtered_events = filtered_events[-limit:]
            
            return [TextContent(type="text", text=json.dumps(filtered_events, indent=2))]
        
        elif name == "analytics_get_metrics":
            metric_name = arguments.get("metric_name")
            start_date = arguments.get("start_date")
            end_date = arguments.get("end_date")
            group_by = arguments.get("group_by")
            
            if metric_name and metric_name in metrics:
                result = metrics[metric_name]
            else:
                # Aggregate from events
                filtered_events = events.copy()
                if start_date:
                    start = datetime.fromisoformat(start_date)
                    filtered_events = [e for e in filtered_events if datetime.fromisoformat(e["timestamp"]) >= start]
                if end_date:
                    end = datetime.fromisoformat(end_date)
                    filtered_events = [e for e in filtered_events if datetime.fromisoformat(e["timestamp"]) <= end]
                
                if metric_name:
                    filtered_events = [e for e in filtered_events if e["event_name"] == metric_name]
                
                result = {
                    "count": len(filtered_events),
                    "unique_users": len(set(e.get("user_id") for e in filtered_events if e.get("user_id"))),
                }
            
            return [TextContent(type="text", text=json.dumps(result, indent=2))]
        
        elif name == "analytics_increment_metric":
            metric_name = arguments["metric_name"]
            value = arguments.get("value", 1)
            
            if metric_name not in metrics:
                metrics[metric_name] = {"value": 0, "type": "counter"}
            
            metrics[metric_name]["value"] += value
            metrics[metric_name]["last_updated"] = datetime.utcnow().isoformat()
            
            return [TextContent(type="text", text=json.dumps({"metric_name": metric_name, "value": metrics[metric_name]["value"]}, indent=2))]
        
        elif name == "analytics_set_metric":
            metric_name = arguments["metric_name"]
            value = arguments["value"]
            
            metrics[metric_name] = {
                "value": value,
                "type": "gauge",
                "last_updated": datetime.utcnow().isoformat(),
            }
            
            return [TextContent(type="text", text=json.dumps({"metric_name": metric_name, "value": value}, indent=2))]
        
        elif name == "analytics_get_user_activity":
            user_id = arguments["user_id"]
            days = arguments.get("days", 30)
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            user_events = [
                e for e in events
                if e.get("user_id") == user_id
                and datetime.fromisoformat(e["timestamp"]) >= cutoff_date
            ]
            
            # Aggregate by event name
            event_counts = defaultdict(int)
            for event in user_events:
                event_counts[event["event_name"]] += 1
            
            result = {
                "user_id": user_id,
                "total_events": len(user_events),
                "event_breakdown": dict(event_counts),
                "period_days": days,
            }
            
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

