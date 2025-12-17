# MCP Ecosystem

Complete MCP (Model Context Protocol) server ecosystem for your SaaS application.

## Overview

This directory contains 14 specialized MCP servers, each providing specific functionality:

1. **GitHub MCP** (port 9001) - GitHub repository, issue, and PR operations
2. **File System MCP** (port 9002) - Local file system operations
3. **Browser Automation MCP** (port 9003) - Browser automation with Playwright
4. **Stripe Billing MCP** (port 9004) - Stripe billing and payment operations
5. **Multi-Model MCP** (port 9005) - OpenAI and Gemini AI operations
6. **Python Runner MCP** (port 9006) - Sandboxed Python code execution
7. **Scraper MCP** (port 9007) - Multi-source web scraping
8. **Prompt Execution MCP** (port 9008) - Prompt execution and workflow engine
9. **Vector Search MCP** (port 9009) - Vector search, embeddings, and memory
10. **API Multiplexer MCP** (port 9010) - API multiplexing and model switching
11. **Analytics MCP** (port 9011) - Analytics, usage tracking, and metrics
12. **Webhook MCP** (port 9012) - Webhook management and delivery
13. **Background Jobs MCP** (port 9013) - Background job management
14. **Database MCP** (port 9014) - PostgreSQL database operations

## Quick Start

### 1. Install Dependencies

Each server has its own `requirements.txt`. Install dependencies for all servers:

```bash
# Install dependencies for each server
for dir in mcp/*-mcp; do
    cd "$dir"
    pip install -r requirements.txt
    cd ../..
done
```

Or install for a specific server:

```bash
cd mcp/github-mcp
pip install -r requirements.txt
```

### 2. Set Environment Variables

Configure environment variables for servers that need them:

```bash
# GitHub
export GITHUB_TOKEN=your_github_token

# Stripe
export STRIPE_API_KEY=sk_test_your_key

# AI Models
export OPENAI_API_KEY=sk-your-openai-key
export GEMINI_API_KEY=your-gemini-key
export ANTHROPIC_API_KEY=your-anthropic-key

# Database
export DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# File System (optional)
export FILESYSTEM_BASE_DIR=/path/to/allowed/directory
```

### 3. Run Servers

Each server can be run independently:

```bash
# Example: Run GitHub MCP server
python mcp/github-mcp/server.py
```

### 4. Configure Cursor

The `runtime.json` file contains configuration for all servers. Update it with your environment variables and ensure paths are correct.

## Server Details

Each server includes:
- `manifest.json` - Server metadata and configuration
- `server.py` - Main server implementation
- `requirements.txt` - Python dependencies
- `README.md` - Server-specific documentation

## Architecture

- **Protocol**: All servers follow the MCP (Model Context Protocol) specification
- **Communication**: STDIO-based communication
- **Language**: Python 3.8+
- **Ports**: 9001-9014 (for reference, actual communication via STDIO)

## Testing

Test each server individually using MCP client tools or connect via Cursor's MCP integration.

## Security Notes

- File System MCP restricts operations to a base directory
- Python Runner MCP uses sandboxed execution with restricted imports
- Database MCP executes raw SQL - ensure proper access controls
- All servers should be run with appropriate permissions

## Production Considerations

- Replace in-memory storage with persistent databases where applicable
- Add authentication and authorization layers
- Implement proper error handling and logging
- Use connection pooling for database operations
- Consider using proper vector databases for Vector Search MCP
- Add rate limiting and request validation

## License

Part of your SaaS application.

