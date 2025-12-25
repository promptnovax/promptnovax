#!/usr/bin/env python3
"""
Start all MCP servers (for testing purposes)
Note: In production, servers should be started individually via Cursor MCP
"""

import asyncio
import subprocess
import sys
from pathlib import Path

def start_server(server_name, server_path):
    """Start a single MCP server"""
    print(f"Starting {server_name}...")
    try:
        process = subprocess.Popen(
            [sys.executable, str(server_path)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print(f"✓ {server_name} started (PID: {process.pid})")
        return process
    except Exception as e:
        print(f"✗ Failed to start {server_name}: {e}")
        return None

def main():
    """Start all MCP servers"""
    mcp_dir = Path(__file__).parent
    servers = {}
    
    # Find all server directories
    for server_dir in mcp_dir.iterdir():
        if server_dir.is_dir() and server_dir.name.endswith("-mcp"):
            server_file = server_dir / "server.py"
            if server_file.exists():
                servers[server_dir.name] = server_file
    
    print("=" * 60)
    print("Starting MCP Servers")
    print("=" * 60)
    print()
    
    processes = []
    for server_name, server_path in servers.items():
        process = start_server(server_name, server_path)
        if process:
            processes.append((server_name, process))
    
    print(f"\n✓ Started {len(processes)} servers")
    print("\nPress Ctrl+C to stop all servers...")
    
    try:
        # Keep running
        while True:
            asyncio.sleep(1)
    except KeyboardInterrupt:
        print("\n\nStopping all servers...")
        for server_name, process in processes:
            process.terminate()
            process.wait()
            print(f"✓ Stopped {server_name}")
        print("\nAll servers stopped.")

if __name__ == "__main__":
    main()

