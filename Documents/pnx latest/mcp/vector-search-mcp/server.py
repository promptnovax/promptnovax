#!/usr/bin/env python3
"""
Vector Search MCP Server
Provides tools for vector search, embeddings, and memory operations.
"""

import asyncio
import json
import os
from typing import Any, Optional, List, Dict
import numpy as np

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("vector-search-mcp")

# Simple in-memory vector store (can be replaced with proper vector DB)
vector_store: Dict[str, dict] = {}
embeddings_cache: Dict[str, List[float]] = {}


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(dot_product / (norm1 * norm2))


async def generate_embedding(text: str) -> List[float]:
    """Generate embedding for text (simplified - should use actual embedding model)"""
    # In production, this would call OpenAI, Gemini, or local embedding model
    # For now, using a simple hash-based approach as placeholder
    import hashlib
    hash_obj = hashlib.md5(text.encode())
    hash_hex = hash_obj.hexdigest()
    # Convert to 384-dim vector (common embedding size)
    embedding = [float(int(hash_hex[i:i+2], 16) / 255.0) for i in range(0, min(384, len(hash_hex)), 2)]
    # Pad if needed
    while len(embedding) < 384:
        embedding.append(0.0)
    return embedding[:384]


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available vector search tools"""
    return [
        Tool(
            name="vector_store",
            description="Store a document with its embedding",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "Unique document ID"},
                    "text": {"type": "string", "description": "Document text"},
                    "metadata": {"type": "object", "description": "Additional metadata"},
                    "embedding": {"type": "array", "items": {"type": "number"}, "description": "Optional pre-computed embedding"},
                },
                "required": ["id", "text"],
            },
        ),
        Tool(
            name="vector_search",
            description="Search for similar documents",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"},
                    "top_k": {"type": "number", "description": "Number of results to return", "default": 5},
                    "threshold": {"type": "number", "description": "Minimum similarity threshold", "default": 0.0},
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="vector_get_embedding",
            description="Get embedding for text",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text to embed"},
                },
                "required": ["text"],
            },
        ),
        Tool(
            name="vector_delete",
            description="Delete a document from the vector store",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "Document ID to delete"},
                },
                "required": ["id"],
            },
        ),
        Tool(
            name="vector_list",
            description="List all documents in the vector store",
            inputSchema={
                "type": "object",
                "properties": {
                    "limit": {"type": "number", "description": "Maximum number of documents to return", "default": 100},
                },
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls"""
    try:
        if name == "vector_store":
            doc_id = arguments["id"]
            text = arguments["text"]
            metadata = arguments.get("metadata", {})
            
            # Generate or use provided embedding
            if "embedding" in arguments:
                embedding = arguments["embedding"]
            else:
                embedding = await generate_embedding(text)
            
            vector_store[doc_id] = {
                "id": doc_id,
                "text": text,
                "embedding": embedding,
                "metadata": metadata,
            }
            
            return [TextContent(type="text", text=json.dumps({"status": "stored", "id": doc_id}, indent=2))]
        
        elif name == "vector_search":
            query = arguments["query"]
            top_k = arguments.get("top_k", 5)
            threshold = arguments.get("threshold", 0.0)
            
            # Generate query embedding
            query_embedding = await generate_embedding(query)
            
            # Calculate similarities
            results = []
            for doc_id, doc in vector_store.items():
                similarity = cosine_similarity(query_embedding, doc["embedding"])
                if similarity >= threshold:
                    results.append({
                        "id": doc_id,
                        "text": doc["text"],
                        "similarity": similarity,
                        "metadata": doc.get("metadata", {}),
                    })
            
            # Sort by similarity and return top_k
            results.sort(key=lambda x: x["similarity"], reverse=True)
            results = results[:top_k]
            
            return [TextContent(type="text", text=json.dumps(results, indent=2))]
        
        elif name == "vector_get_embedding":
            text = arguments["text"]
            embedding = await generate_embedding(text)
            return [TextContent(type="text", text=json.dumps({"embedding": embedding, "dimension": len(embedding)}, indent=2))]
        
        elif name == "vector_delete":
            doc_id = arguments["id"]
            if doc_id in vector_store:
                del vector_store[doc_id]
                return [TextContent(type="text", text=json.dumps({"status": "deleted", "id": doc_id}, indent=2))]
            else:
                return [TextContent(type="text", text=json.dumps({"status": "not_found", "id": doc_id}, indent=2))]
        
        elif name == "vector_list":
            limit = arguments.get("limit", 100)
            docs = [
                {
                    "id": doc["id"],
                    "text": doc["text"][:100] + "..." if len(doc["text"]) > 100 else doc["text"],
                    "metadata": doc.get("metadata", {}),
                }
                for doc in list(vector_store.values())[:limit]
            ]
            return [TextContent(type="text", text=json.dumps(docs, indent=2))]
        
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

