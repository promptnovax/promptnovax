# Supabase MCP Quick Start Checklist

## ✅ Setup Steps (5 minutes)

### 1. Get Supabase Personal Access Token
- [ ] Go to: https://supabase.com/dashboard/account/tokens
- [ ] Click "Generate New Token"
- [ ] Name it: "Cursor MCP Token"
- [ ] Copy the token (it shows only once!)

### 2. Update MCP Configuration
- [ ] Open `.cursor/mcp.json`
- [ ] Replace `<YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN>` with your actual token
- [ ] Save the file

### 3. Restart Cursor
- [ ] Close Cursor completely
- [ ] Reopen Cursor
- [ ] MCP server will auto-start

### 4. Test Connection
Try this prompt in Cursor:
```
"List all tables in my Supabase database"
```

## 🎯 Common Use Cases

### View Database Schema
```
"Show me the schema for the prompts table"
```

### Query Data
```
"Get all live prompts from the database"
```

### Create New Table
```
"Create a table called 'user_settings' with columns: user_id (uuid), setting_key (text), setting_value (jsonb)"
```

### Generate TypeScript Types
```
"Generate TypeScript types for all my database tables"
```

### Check Project Info
```
"What is my Supabase project URL and configuration?"
```

## 🔧 Troubleshooting

**MCP not working?**
1. Check token in `.cursor/mcp.json` is correct
2. Restart Cursor
3. Check Cursor logs for errors

**Token expired?**
- Generate new token from Supabase dashboard
- Update `.cursor/mcp.json`

## 📍 Important Files

- `.cursor/mcp.json` - MCP server configuration
- `SUPABASE_MCP_SETUP.md` - Detailed setup guide
- `PNX-main/supabase/schema.sql` - Your database schema

---

**Ready to go!** Ab aap Cursor me directly Supabase manage kar sakte hain! 🚀














