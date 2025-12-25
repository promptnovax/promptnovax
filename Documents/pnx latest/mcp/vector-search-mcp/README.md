# Vector Search MCP Server

MCP server for vector search, embeddings, and memory operations.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running

```bash
python server.py
```

## Tools

- `vector_store` - Store a document with embedding
- `vector_search` - Search for similar documents
- `vector_get_embedding` - Get embedding for text
- `vector_delete` - Delete a document
- `vector_list` - List all documents

## Note

This implementation uses a simple in-memory vector store. For production, consider using a proper vector database like Pinecone, Weaviate, or Qdrant.

## Port

This server runs on port **9009**.

