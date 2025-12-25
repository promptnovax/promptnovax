#!/usr/bin/env python3
"""
Stripe Billing MCP Server
Provides tools for Stripe billing operations.
"""

import asyncio
import json
import os
import sys
from typing import Any, Optional

import stripe
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("stripe-billing-mcp")

# Stripe configuration
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY", "")
if STRIPE_API_KEY:
    stripe.api_key = STRIPE_API_KEY
else:
    print("Warning: STRIPE_API_KEY not set. Stripe operations will fail.", file=sys.stderr)


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available Stripe tools"""
    return [
        Tool(
            name="stripe_create_customer",
            description="Create a new Stripe customer",
            inputSchema={
                "type": "object",
                "properties": {
                    "email": {"type": "string", "description": "Customer email"},
                    "name": {"type": "string", "description": "Customer name"},
                    "metadata": {"type": "object", "description": "Additional metadata"},
                },
                "required": ["email"],
            },
        ),
        Tool(
            name="stripe_get_customer",
            description="Get customer by ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "customer_id": {"type": "string", "description": "Stripe customer ID"},
                },
                "required": ["customer_id"],
            },
        ),
        Tool(
            name="stripe_create_subscription",
            description="Create a subscription for a customer",
            inputSchema={
                "type": "object",
                "properties": {
                    "customer_id": {"type": "string", "description": "Stripe customer ID"},
                    "price_id": {"type": "string", "description": "Stripe price ID"},
                    "metadata": {"type": "object", "description": "Additional metadata"},
                },
                "required": ["customer_id", "price_id"],
            },
        ),
        Tool(
            name="stripe_cancel_subscription",
            description="Cancel a subscription",
            inputSchema={
                "type": "object",
                "properties": {
                    "subscription_id": {"type": "string", "description": "Stripe subscription ID"},
                },
                "required": ["subscription_id"],
            },
        ),
        Tool(
            name="stripe_create_checkout_session",
            description="Create a checkout session",
            inputSchema={
                "type": "object",
                "properties": {
                    "price_id": {"type": "string", "description": "Stripe price ID"},
                    "success_url": {"type": "string", "description": "Success redirect URL"},
                    "cancel_url": {"type": "string", "description": "Cancel redirect URL"},
                    "customer_id": {"type": "string", "description": "Existing customer ID (optional)"},
                },
                "required": ["price_id", "success_url", "cancel_url"],
            },
        ),
        Tool(
            name="stripe_list_invoices",
            description="List invoices for a customer",
            inputSchema={
                "type": "object",
                "properties": {
                    "customer_id": {"type": "string", "description": "Stripe customer ID"},
                    "limit": {"type": "number", "description": "Number of invoices to return", "default": 10},
                },
                "required": ["customer_id"],
            },
        ),
        Tool(
            name="stripe_create_payment_intent",
            description="Create a payment intent",
            inputSchema={
                "type": "object",
                "properties": {
                    "amount": {"type": "number", "description": "Amount in cents"},
                    "currency": {"type": "string", "description": "Currency code", "default": "usd"},
                    "customer_id": {"type": "string", "description": "Stripe customer ID"},
                    "metadata": {"type": "object", "description": "Additional metadata"},
                },
                "required": ["amount"],
            },
        ),
        Tool(
            name="stripe_list_products",
            description="List all products",
            inputSchema={
                "type": "object",
                "properties": {
                    "limit": {"type": "number", "description": "Number of products to return", "default": 10},
                },
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "stripe_create_customer":
            customer = stripe.Customer.create(
                email=arguments["email"],
                name=arguments.get("name"),
                metadata=arguments.get("metadata", {}),
            )
            return [TextContent(type="text", text=json.dumps(customer.to_dict(), indent=2))]
        
        elif name == "stripe_get_customer":
            customer = stripe.Customer.retrieve(arguments["customer_id"])
            return [TextContent(type="text", text=json.dumps(customer.to_dict(), indent=2))]
        
        elif name == "stripe_create_subscription":
            subscription = stripe.Subscription.create(
                customer=arguments["customer_id"],
                items=[{"price": arguments["price_id"]}],
                metadata=arguments.get("metadata", {}),
            )
            return [TextContent(type="text", text=json.dumps(subscription.to_dict(), indent=2))]
        
        elif name == "stripe_cancel_subscription":
            subscription = stripe.Subscription.modify(
                arguments["subscription_id"],
                cancel_at_period_end=True,
            )
            return [TextContent(type="text", text=json.dumps(subscription.to_dict(), indent=2))]
        
        elif name == "stripe_create_checkout_session":
            session_params = {
                "payment_method_types": ["card"],
                "line_items": [{"price": arguments["price_id"], "quantity": 1}],
                "mode": "subscription",
                "success_url": arguments["success_url"],
                "cancel_url": arguments["cancel_url"],
            }
            if "customer_id" in arguments:
                session_params["customer"] = arguments["customer_id"]
            
            session = stripe.checkout.Session.create(**session_params)
            return [TextContent(type="text", text=json.dumps(session.to_dict(), indent=2))]
        
        elif name == "stripe_list_invoices":
            invoices = stripe.Invoice.list(
                customer=arguments["customer_id"],
                limit=arguments.get("limit", 10),
            )
            return [TextContent(type="text", text=json.dumps([inv.to_dict() for inv in invoices.data], indent=2))]
        
        elif name == "stripe_create_payment_intent":
            intent_params = {
                "amount": arguments["amount"],
                "currency": arguments.get("currency", "usd"),
            }
            if "customer_id" in arguments:
                intent_params["customer"] = arguments["customer_id"]
            if "metadata" in arguments:
                intent_params["metadata"] = arguments["metadata"]
            
            intent = stripe.PaymentIntent.create(**intent_params)
            return [TextContent(type="text", text=json.dumps(intent.to_dict(), indent=2))]
        
        elif name == "stripe_list_products":
            products = stripe.Product.list(limit=arguments.get("limit", 10))
            return [TextContent(type="text", text=json.dumps([p.to_dict() for p in products.data], indent=2))]
        
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

