#!/usr/bin/env python3
"""
Final verification script - checks everything is ready
"""

import json
import os
from pathlib import Path

def check_runtime_json():
    """Check runtime.json configuration"""
    print("Checking runtime.json...")
    runtime_file = Path(__file__).parent / "runtime.json"
    
    if not runtime_file.exists():
        print("✗ runtime.json not found")
        return False
    
    with open(runtime_file) as f:
        config = json.load(f)
    
    servers = config.get("mcpServers", {})
    print(f"✓ Found {len(servers)} servers in runtime.json")
    
    # Check key servers have API keys
    github = servers.get("github-mcp", {})
    if github.get("env", {}).get("GITHUB_TOKEN"):
        print("✓ GitHub token configured")
    else:
        print("⚠ GitHub token missing")
    
    multi_model = servers.get("multi-model-mcp", {})
    env = multi_model.get("env", {})
    if env.get("OPENAI_API_KEY") and env.get("GEMINI_API_KEY"):
        print("✓ OpenAI and Gemini keys configured")
    else:
        print("⚠ AI model keys missing")
    
    return True

def check_all_servers():
    """Check all server directories exist"""
    print("\nChecking server directories...")
    mcp_dir = Path(__file__).parent
    servers = [d for d in mcp_dir.iterdir() if d.is_dir() and d.name.endswith("-mcp")]
    
    print(f"✓ Found {len(servers)} server directories")
    
    for server_dir in sorted(servers):
        server_file = server_dir / "server.py"
        if server_file.exists():
            print(f"  ✓ {server_dir.name}")
        else:
            print(f"  ✗ {server_dir.name} - server.py missing")
    
    return len(servers) == 14

def check_dependencies():
    """Check critical dependencies"""
    print("\nChecking dependencies...")
    
    deps = {
        "mcp": "MCP SDK",
        "httpx": "HTTP client",
        "playwright": "Browser automation",
        "stripe": "Stripe SDK",
        "bs4": "HTML parsing",
        "asyncpg": "PostgreSQL",
        "numpy": "Vector operations",
    }
    
    all_ok = True
    for package, desc in deps.items():
        try:
            if package == "bs4":
                __import__("bs4")
            else:
                __import__(package)
            print(f"  ✓ {package} ({desc})")
        except ImportError:
            print(f"  ✗ {package} ({desc}) - MISSING")
            all_ok = False
    
    return all_ok

def main():
    """Run all checks"""
    print("=" * 60)
    print("MCP Ecosystem Final Verification")
    print("=" * 60)
    print()
    
    checks = [
        ("Runtime Configuration", check_runtime_json),
        ("Server Directories", check_all_servers),
        ("Dependencies", check_dependencies),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"✗ {name} failed: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 60)
    print("Verification Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {name}")
    
    print()
    if passed == total:
        print("🎉 All checks passed! MCP ecosystem is ready!")
        print("\nNext steps:")
        print("1. Open Cursor and configure MCP integration")
        print("2. Point to: " + str(Path(__file__).parent / "runtime.json"))
        print("3. Start using MCP tools in Cursor!")
    else:
        print(f"⚠ {total - passed} check(s) failed. Please review above.")
    
    print("=" * 60)

if __name__ == "__main__":
    main()

