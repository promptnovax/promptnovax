# GitHub MCP Server

MCP server for GitHub operations including repositories, issues, pull requests, and file operations.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variable:
```bash
export GITHUB_TOKEN=your_github_token_here
```

## Running

```bash
python server.py
```

## Tools

- `github_get_repo` - Get repository information
- `github_list_issues` - List issues for a repository
- `github_create_issue` - Create a new issue
- `github_list_pull_requests` - List pull requests
- `github_create_pull_request` - Create a new pull request
- `github_get_file_contents` - Get file contents from repository
- `github_search_repositories` - Search for repositories

## Testing

Test the server using MCP client tools or connect via Cursor's MCP integration.

## Port

This server runs on port **9001**.

