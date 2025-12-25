@echo off
REM Setup script for MCP ecosystem (Windows)

echo Setting up MCP Ecosystem...

REM Install dependencies for all servers
for /d %%d in (*-mcp) do (
    if exist "%%d\requirements.txt" (
        echo Installing dependencies for %%d...
        cd %%d
        pip install -r requirements.txt
        cd ..
    )
)

echo Setup complete!
echo.
echo Next steps:
echo 1. Set environment variables (see README.md)
echo 2. Configure runtime.json with your settings
echo 3. Run individual servers or connect via Cursor MCP

