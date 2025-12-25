# Database MCP Server

MCP server for PostgreSQL database operations.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variable:
```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Running

```bash
python server.py
```

## Tools

- `db_query` - Execute a SELECT query
- `db_execute` - Execute INSERT, UPDATE, or DELETE
- `db_transaction` - Execute multiple queries in a transaction
- `db_list_tables` - List all tables
- `db_describe_table` - Get table schema

## Security

⚠️ **Warning**: This server executes raw SQL queries. Ensure proper access controls and validation in production.

## Port

This server runs on port **9014**.

