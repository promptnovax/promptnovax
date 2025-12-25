# API Multiplexer MCP Server

MCP server for API multiplexing and model switching.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables for APIs you want to use:
```bash
export OPENAI_API_KEY=sk-your-key
export GEMINI_API_KEY=your-key
export ANTHROPIC_API_KEY=your-key
```

## Running

```bash
python server.py
```

## Tools

- `multiplexer_register_api` - Register a new API
- `multiplexer_call` - Call an API endpoint
- `multiplexer_switch_model` - Switch between models/APIs
- `multiplexer_list_apis` - List all registered APIs
- `multiplexer_fallback_call` - Call with fallback to alternative APIs

## Port

This server runs on port **9010**.

