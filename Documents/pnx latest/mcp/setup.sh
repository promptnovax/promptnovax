#!/bin/bash
# Setup script for MCP ecosystem

echo "Setting up MCP Ecosystem..."

# Install dependencies for all servers
for dir in *-mcp; do
    if [ -d "$dir" ] && [ -f "$dir/requirements.txt" ]; then
        echo "Installing dependencies for $dir..."
        cd "$dir"
        pip install -r requirements.txt
        cd ..
    fi
done

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables (see README.md)"
echo "2. Configure runtime.json with your settings"
echo "3. Run individual servers or connect via Cursor MCP"

