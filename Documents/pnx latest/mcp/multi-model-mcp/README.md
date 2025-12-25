# Multi-Model MCP Server

MCP server for OpenAI and Google Gemini AI operations.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export OPENAI_API_KEY=sk-your-openai-key
export GEMINI_API_KEY=your-gemini-key
```

## Running

```bash
python server.py
```

## Tools

- `openai_chat` - Chat with OpenAI models
- `openai_embed` - Generate OpenAI embeddings
- `gemini_chat` - Chat with Gemini models
- `gemini_embed` - Generate Gemini embeddings

## Port

This server runs on port **9005**.

