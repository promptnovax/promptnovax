# File System MCP Server

MCP server for local file system operations with safety boundaries.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Optionally set base directory (defaults to current working directory):
```bash
export FILESYSTEM_BASE_DIR=/path/to/allowed/directory
```

## Running

```bash
python server.py
```

## Tools

- `fs_read_file` - Read file contents
- `fs_write_file` - Write content to a file
- `fs_list_directory` - List directory contents
- `fs_create_directory` - Create a directory
- `fs_delete_file` - Delete a file
- `fs_delete_directory` - Delete a directory
- `fs_file_exists` - Check if file exists
- `fs_get_file_info` - Get file metadata
- `fs_copy_file` - Copy a file
- `fs_move_file` - Move or rename a file

## Safety

All operations are restricted to the base directory to prevent unauthorized access.

## Port

This server runs on port **9002**.

