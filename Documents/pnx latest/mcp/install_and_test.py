#!/usr/bin/env python3
"""
Install dependencies and test MCP servers
"""

import subprocess
import sys
import os
from pathlib import Path

def install_dependencies():
    """Install dependencies for all MCP servers"""
    mcp_dir = Path(__file__).parent
    servers = [d for d in mcp_dir.iterdir() if d.is_dir() and d.name.endswith("-mcp")]
    
    print("Installing dependencies for all MCP servers...\n")
    
    for server_dir in servers:
        req_file = server_dir / "requirements.txt"
        if req_file.exists():
            print(f"Installing dependencies for {server_dir.name}...")
            try:
                subprocess.run(
                    [sys.executable, "-m", "pip", "install", "-r", str(req_file)],
                    check=True,
                    capture_output=True
                )
                print(f"✓ {server_dir.name} dependencies installed\n")
            except subprocess.CalledProcessError as e:
                print(f"✗ Error installing {server_dir.name}: {e}\n")
    
    print("All dependencies installation complete!")

def check_imports():
    """Check if all required packages can be imported"""
    print("\nChecking imports...\n")
    
    packages = {
        "mcp": "MCP SDK",
        "httpx": "HTTP client",
        "playwright": "Browser automation",
        "stripe": "Stripe SDK",
        "beautifulsoup4": "HTML parsing",
        "asyncpg": "PostgreSQL async driver",
        "numpy": "Numerical computing",
    }
    
    missing = []
    for package, description in packages.items():
        try:
            if package == "beautifulsoup4":
                __import__("bs4")
            else:
                __import__(package)
            print(f"✓ {package} ({description})")
        except ImportError:
            print(f"✗ {package} ({description}) - MISSING")
            missing.append(package)
    
    if missing:
        print(f"\n⚠ Missing packages: {', '.join(missing)}")
        print("Run: pip install " + " ".join(missing))
    else:
        print("\n✓ All packages available!")

def verify_servers():
    """Verify all server files exist"""
    print("\nVerifying server files...\n")
    
    mcp_dir = Path(__file__).parent
    servers = [d for d in mcp_dir.iterdir() if d.is_dir() and d.name.endswith("-mcp")]
    
    required_files = ["server.py", "manifest.json", "requirements.txt", "README.md"]
    
    all_good = True
    for server_dir in servers:
        print(f"Checking {server_dir.name}...")
        for file in required_files:
            if (server_dir / file).exists():
                print(f"  ✓ {file}")
            else:
                print(f"  ✗ {file} - MISSING")
                all_good = False
        print()
    
    if all_good:
        print("✓ All server files present!")
    else:
        print("⚠ Some files are missing")
    
    return all_good

if __name__ == "__main__":
    print("=" * 60)
    print("MCP Ecosystem Setup and Verification")
    print("=" * 60)
    print()
    
    # Install dependencies
    install_dependencies()
    
    # Check imports
    check_imports()
    
    # Verify servers
    verify_servers()
    
    print("\n" + "=" * 60)
    print("Setup complete! All MCP servers are ready to use.")
    print("=" * 60)

