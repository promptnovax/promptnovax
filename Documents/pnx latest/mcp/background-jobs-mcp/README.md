# Background Jobs MCP Server

MCP server for background job management and execution.

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

- `job_create` - Create a new background job
- `job_get` - Get job status and details
- `job_list` - List all jobs
- `job_cancel` - Cancel a job
- `job_retry` - Retry a failed job

## Job Types

- `script` - Execute Python code
- `http_request` - Make HTTP request

## Port

This server runs on port **9013**.

