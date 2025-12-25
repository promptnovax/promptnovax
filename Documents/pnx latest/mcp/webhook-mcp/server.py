#!/usr/bin/env python3
"""
Webhook MCP Server
Provides tools for webhook management and delivery.
"""

import asyncio
import json
import os
from typing import Any, Optional, Dict, List
from datetime import datetime

import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("webhook-mcp")

# Webhook storage
webhooks: Dict[str, dict] = {}
webhook_deliveries: List[dict] = []


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available webhook tools"""
    return [
        Tool(
            name="webhook_create",
            description="Create a new webhook",
            inputSchema={
                "type": "object",
                "properties": {
                    "webhook_id": {"type": "string", "description": "Unique webhook ID"},
                    "url": {"type": "string", "description": "Webhook URL"},
                    "events": {"type": "array", "items": {"type": "string"}, "description": "Events to listen for"},
                    "secret": {"type": "string", "description": "Webhook secret for signing"},
                    "headers": {"type": "object", "description": "Custom headers"},
                },
                "required": ["webhook_id", "url"],
            },
        ),
        Tool(
            name="webhook_trigger",
            description="Trigger a webhook",
            inputSchema={
                "type": "object",
                "properties": {
                    "webhook_id": {"type": "string", "description": "Webhook ID"},
                    "event": {"type": "string", "description": "Event name"},
                    "payload": {"type": "object", "description": "Payload to send"},
                },
                "required": ["webhook_id", "event", "payload"],
            },
        ),
        Tool(
            name="webhook_list",
            description="List all webhooks",
            inputSchema={},
        ),
        Tool(
            name="webhook_get",
            description="Get webhook details",
            inputSchema={
                "type": "object",
                "properties": {
                    "webhook_id": {"type": "string", "description": "Webhook ID"},
                },
                "required": ["webhook_id"],
            },
        ),
        Tool(
            name="webhook_delete",
            description="Delete a webhook",
            inputSchema={
                "type": "object",
                "properties": {
                    "webhook_id": {"type": "string", "description": "Webhook ID"},
                },
                "required": ["webhook_id"],
            },
        ),
        Tool(
            name="webhook_get_deliveries",
            description="Get webhook delivery history",
            inputSchema={
                "type": "object",
                "properties": {
                    "webhook_id": {"type": "string", "description": "Webhook ID"},
                    "limit": {"type": "number", "description": "Maximum number of deliveries", "default": 50},
                },
                "required": ["webhook_id"],
            },
        ),
    ]


async def deliver_webhook(webhook: dict, event: str, payload: dict) -> dict:
    """Deliver webhook to URL"""
    url = webhook["url"]
    headers = webhook.get("headers", {}).copy()
    headers["Content-Type"] = "application/json"
    headers["X-Webhook-Event"] = event
    
    # Add signature if secret is provided
    if webhook.get("secret"):
        import hmac
        import hashlib
        payload_str = json.dumps(payload)
        signature = hmac.new(
            webhook["secret"].encode(),
            payload_str.encode(),
            hashlib.sha256
        ).hexdigest()
        headers["X-Webhook-Signature"] = f"sha256={signature}"
    
    delivery = {
        "webhook_id": webhook["webhook_id"],
        "event": event,
        "url": url,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "pending",
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            delivery["status"] = "success" if response.status_code < 400 else "failed"
            delivery["status_code"] = response.status_code
            delivery["response"] = response.text[:1000]  # Limit response size
    except Exception as e:
        delivery["status"] = "error"
        delivery["error"] = str(e)
    
    webhook_deliveries.append(delivery)
    return delivery


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "webhook_create":
            webhook_id = arguments["webhook_id"]
            webhooks[webhook_id] = {
                "webhook_id": webhook_id,
                "url": arguments["url"],
                "events": arguments.get("events", []),
                "secret": arguments.get("secret"),
                "headers": arguments.get("headers", {}),
                "created_at": datetime.utcnow().isoformat(),
            }
            return [TextContent(type="text", text=json.dumps({"status": "created", "webhook_id": webhook_id}, indent=2))]
        
        elif name == "webhook_trigger":
            webhook_id = arguments["webhook_id"]
            if webhook_id not in webhooks:
                raise ValueError(f"Webhook not found: {webhook_id}")
            
            webhook = webhooks[webhook_id]
            event = arguments["event"]
            payload = arguments["payload"]
            
            # Check if webhook listens to this event
            if webhook["events"] and event not in webhook["events"]:
                return [TextContent(type="text", text=json.dumps({"status": "skipped", "reason": "Event not in webhook events list"}, indent=2))]
            
            delivery = await deliver_webhook(webhook, event, payload)
            return [TextContent(type="text", text=json.dumps(delivery, indent=2))]
        
        elif name == "webhook_list":
            webhook_list = [
                {
                    "webhook_id": wh["webhook_id"],
                    "url": wh["url"],
                    "events": wh["events"],
                    "created_at": wh["created_at"],
                }
                for wh in webhooks.values()
            ]
            return [TextContent(type="text", text=json.dumps(webhook_list, indent=2))]
        
        elif name == "webhook_get":
            webhook_id = arguments["webhook_id"]
            if webhook_id not in webhooks:
                raise ValueError(f"Webhook not found: {webhook_id}")
            
            webhook = webhooks[webhook_id].copy()
            # Don't expose secret in response
            if "secret" in webhook:
                webhook["secret"] = "***"
            return [TextContent(type="text", text=json.dumps(webhook, indent=2))]
        
        elif name == "webhook_delete":
            webhook_id = arguments["webhook_id"]
            if webhook_id in webhooks:
                del webhooks[webhook_id]
                return [TextContent(type="text", text=json.dumps({"status": "deleted", "webhook_id": webhook_id}, indent=2))]
            else:
                return [TextContent(type="text", text=json.dumps({"status": "not_found", "webhook_id": webhook_id}, indent=2))]
        
        elif name == "webhook_get_deliveries":
            webhook_id = arguments["webhook_id"]
            limit = arguments.get("limit", 50)
            
            deliveries = [
                d for d in webhook_deliveries
                if d["webhook_id"] == webhook_id
            ][-limit:]
            
            return [TextContent(type="text", text=json.dumps(deliveries, indent=2))]
        
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

