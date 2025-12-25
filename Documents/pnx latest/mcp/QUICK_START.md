# MCP Servers - Quick Start Guide

## ✅ Setup Complete!

Sab MCP servers properly configured aur ready hain. Aapke API keys already `runtime.json` mein add kiye gaye hain.

## 🚀 Servers Status

### Configured Servers (API Keys Set):
1. ✅ **GitHub MCP** - GitHub token configured
2. ✅ **Multi-Model MCP** - OpenAI aur Gemini keys configured
3. ✅ **API Multiplexer MCP** - OpenAI aur Gemini keys configured

### Ready to Use (No API Keys Needed):
4. ✅ **File System MCP** - Local file operations
5. ✅ **Browser Automation MCP** - Playwright installed
6. ✅ **Python Runner MCP** - Sandboxed execution
7. ✅ **Scraper MCP** - Web scraping
8. ✅ **Prompt Execution MCP** - Workflow engine
9. ✅ **Vector Search MCP** - Embeddings & search
10. ✅ **Analytics MCP** - Usage tracking
11. ✅ **Webhook MCP** - Webhook management
12. ✅ **Background Jobs MCP** - Job queue

### Optional (Configure When Needed):
13. ⚠️ **Stripe Billing MCP** - Add Stripe key when needed
14. ⚠️ **Database MCP** - Add PostgreSQL URL when needed

## 📝 How to Use

### Option 1: Via Cursor MCP Integration

1. Cursor mein `runtime.json` file ko configure karein
2. Cursor automatically sab servers ko detect karega
3. MCP tools directly Cursor mein available honge

### Option 2: Run Individual Servers

```bash
# GitHub MCP
python mcp/github-mcp/server.py

# Multi-Model MCP
python mcp/multi-model-mcp/server.py

# File System MCP
python mcp/filesystem-mcp/server.py
```

### Option 3: Test Servers

```bash
# Test all servers
python mcp/test_servers.py

# Install dependencies
python mcp/install_and_test.py
```

## 🔧 Configuration

### Environment Variables (Already Set in runtime.json)

- `GITHUB_TOKEN` - ✅ Configured
- `OPENAI_API_KEY` - ✅ Configured
- `GEMINI_API_KEY` - ✅ Configured

### Optional Variables

- `STRIPE_API_KEY` - Add when needed
- `DATABASE_URL` - Add when needed
- `FILESYSTEM_BASE_DIR` - Optional, defaults to current directory

## 📚 Available Tools

Har server ke tools dekhne ke liye us server ki README.md file check karein:

```bash
# Example: GitHub MCP tools
cat mcp/github-mcp/README.md
```

## 🎯 Next Steps

1. **Cursor MCP Setup**: Cursor mein `runtime.json` ko point karein
2. **Test Servers**: `python mcp/test_servers.py` run karein
3. **Start Using**: Cursor mein MCP tools directly use karein

## ⚠️ Important Notes

- Sab API keys `runtime.json` mein securely stored hain
- File System MCP safety boundaries use karta hai
- Python Runner MCP sandboxed execution use karta hai
- Database MCP raw SQL execute karta hai - production mein careful rahein

## 🆘 Troubleshooting

Agar koi server start nahi ho raha:

1. Check dependencies: `python mcp/install_and_test.py`
2. Check API keys: `runtime.json` verify karein
3. Check Python version: Python 3.8+ required
4. Check imports: `python mcp/test_servers.py`

## ✨ All Set!

Sab kuch ready hai! Ab aap Cursor mein MCP servers ko use kar sakte hain. 🎉

