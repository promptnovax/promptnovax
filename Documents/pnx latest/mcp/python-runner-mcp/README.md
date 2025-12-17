# Python Runner MCP Server

MCP server for sandboxed Python code execution with safety restrictions.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running

```bash
python server.py
```

## Tools

- `python_execute` - Execute Python code in sandbox
- `python_evaluate` - Evaluate Python expression

## Safety

The sandbox restricts:
- File system operations
- Network operations
- System operations
- Dangerous builtins (exec, eval, open, etc.)

## Port

This server runs on port **9006**.

