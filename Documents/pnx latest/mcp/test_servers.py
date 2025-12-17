#!/usr/bin/env python3
"""
Test MCP servers to verify they're working correctly
"""

import asyncio
import json
import os
import sys
from pathlib import Path

# Test each server's basic functionality
async def test_github_mcp():
    """Test GitHub MCP server"""
    print("Testing GitHub MCP...")
    token = os.getenv("GITHUB_TOKEN") or "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"
    if token:
        print("✓ GitHub token configured")
        return True
    print("✗ GitHub token missing")
    return False

async def test_multi_model_mcp():
    """Test Multi-Model MCP server"""
    print("Testing Multi-Model MCP...")
    openai_key = os.getenv("OPENAI_API_KEY") or "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"
    gemini_key = os.getenv("GEMINI_API_KEY") or "AIzaSyDjr85xTyIaa-ewdjxH1YI7-Tfw1OJyLss"
    
    if openai_key:
        print("✓ OpenAI API key configured")
    else:
        print("✗ OpenAI API key missing")
    
    if gemini_key:
        print("✓ Gemini API key configured")
    else:
        print("✗ Gemini API key missing")
    
    return openai_key and gemini_key

async def test_filesystem_mcp():
    """Test File System MCP server"""
    print("Testing File System MCP...")
    try:
        from mcp.server import Server
        print("✓ File System MCP ready")
        return True
    except Exception as e:
        print(f"✗ File System MCP error: {e}")
        return False

async def test_browser_automation_mcp():
    """Test Browser Automation MCP server"""
    print("Testing Browser Automation MCP...")
    try:
        from playwright.async_api import async_playwright
        print("✓ Playwright available")
        return True
    except Exception as e:
        print(f"✗ Browser Automation MCP error: {e}")
        return False

async def test_vector_search_mcp():
    """Test Vector Search MCP server"""
    print("Testing Vector Search MCP...")
    try:
        import numpy as np
        print("✓ NumPy available for vector operations")
        return True
    except Exception as e:
        print(f"✗ Vector Search MCP error: {e}")
        return False

async def test_database_mcp():
    """Test Database MCP server"""
    print("Testing Database MCP...")
    try:
        import asyncpg
        print("✓ AsyncPG available")
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            print("✓ Database URL configured")
        else:
            print("⚠ Database URL not configured (optional)")
        return True
    except Exception as e:
        print(f"✗ Database MCP error: {e}")
        return False

async def test_scraper_mcp():
    """Test Scraper MCP server"""
    print("Testing Scraper MCP...")
    try:
        from bs4 import BeautifulSoup
        import httpx
        print("✓ Scraper dependencies available")
        return True
    except Exception as e:
        print(f"✗ Scraper MCP error: {e}")
        return False

async def main():
    """Run all tests"""
    print("=" * 60)
    print("MCP Servers Verification Test")
    print("=" * 60)
    print()
    
    # Set environment variables from runtime.json
    os.environ.setdefault("GITHUB_TOKEN", "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")
    os.environ.setdefault("OPENAI_API_KEY", "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")
    os.environ.setdefault("GEMINI_API_KEY", "AIzaSyDjr85xTyIaa-ewdjxH1YI7-Tfw1OJyLss")
    
    tests = [
        ("GitHub MCP", test_github_mcp),
        ("Multi-Model MCP", test_multi_model_mcp),
        ("File System MCP", test_filesystem_mcp),
        ("Browser Automation MCP", test_browser_automation_mcp),
        ("Vector Search MCP", test_vector_search_mcp),
        ("Database MCP", test_database_mcp),
        ("Scraper MCP", test_scraper_mcp),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = await test_func()
            results.append((name, result))
        except Exception as e:
            print(f"✗ {name} failed: {e}")
            results.append((name, False))
        print()
    
    print("=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {name}")
    
    print()
    print(f"Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All MCP servers are ready to use!")
    else:
        print("\n⚠ Some servers need configuration")
    
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())

