# Supabase MCP Integration Guide

Yeh guide aapko Supabase MCP (Model Context Protocol) server ko properly integrate karne me help karega.

## 📋 Overview

Supabase MCP server aapke AI tools (jaise Cursor) ko directly Supabase se connect karta hai. Isse aap:
- Database tables design aur manage kar sakte hain
- SQL queries run kar sakte hain
- Project configuration fetch kar sakte hain
- New Supabase projects create kar sakte hain
- Database branches create kar sakte hain (development ke liye)
- TypeScript types generate kar sakte hain

## 🔑 Step 1: Supabase Personal Access Token (PAT) Create Karein

**IMPORTANT:** MCP server ko authenticate karne ke liye aapko ek Personal Access Token chahiye.

### Kahan se token banayein:

1. **Supabase Dashboard** me jayein:
   - https://supabase.com/dashboard pe login karein
   - Ya directly aapke project dashboard pe jayein

2. **Account Settings** me jayein:
   - Top right corner me aapke profile icon pe click karein
   - "Account Settings" ya "Access Tokens" section me jayein
   - Ya directly: https://supabase.com/dashboard/account/tokens

3. **New Token Create Karein:**
   - "Generate New Token" button pe click karein
   - Token ka naam dein (e.g., "Cursor MCP Token")
   - Expiration date set karein (optional, recommended: 1 year)
   - "Generate Token" pe click karein

4. **Token Copy Karein:**
   - ⚠️ **WARNING:** Token sirf ek baar dikhayi jayega!
   - Token ko immediately copy kar lein aur safe jagah save kar lein
   - Agar token kho jaye, to naya token banana padega

### Token Format:
Token kuch aise dikhega:
```
sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ⚙️ Step 2: MCP Configuration Update Karein

1. `.cursor/mcp.json` file open karein
2. `<YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN>` ko replace karein apne actual token se

**Example:**
```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ]
    }
  }
}
```

## 🔄 Step 3: Cursor Restart Karein

1. Cursor ko completely close karein
2. Cursor ko dobara open karein
3. MCP server automatically start ho jayega

## ✅ Step 4: Verify Setup

Cursor me aapko Supabase MCP tools available hone chahiye. Aap test kar sakte hain:

1. Cursor me koi prompt type karein jaise:
   - "List all tables in my Supabase database"
   - "Show me the schema for the prompts table"
   - "Create a new table for user preferences"

2. Agar MCP properly connected hai, to Cursor Supabase tools use karega

## 🛠️ Available MCP Tools

Supabase MCP server ke through aap yeh tasks kar sakte hain:

### Database Management:
- `list_tables` - All tables list karein
- `execute_sql` - SQL queries run karein
- `create_migration` - New migrations create karein
- `apply_migration` - Migrations apply karein

### Project Management:
- `get_project_config` - Project configuration fetch karein
- `create_project` - New Supabase project create karein
- `pause_project` - Project pause karein
- `restore_project` - Project restore karein

### Development:
- `create_branch` - Database branch create karein (experimental)
- `generate_typescript_types` - TypeScript types generate karein

### Monitoring:
- `get_logs` - Project logs fetch karein

## 📝 Usage Examples

### Example 1: Database Schema Check
```
"Show me all tables in my Supabase database and their columns"
```

### Example 2: Query Data
```
"Run a query to get all prompts with status 'live' from the prompts table"
```

### Example 3: Create Table
```
"Create a new table called 'user_preferences' with columns: user_id (uuid), theme (text), language (text)"
```

### Example 4: Generate TypeScript Types
```
"Generate TypeScript types for all tables in my database"
```

## 🔒 Security Best Practices

1. **Token Security:**
   - Token ko kabhi bhi code me commit mat karein
   - Token ko `.gitignore` me add karein (agar needed ho)
   - Token ko sirf trusted devices pe use karein

2. **Token Rotation:**
   - Regularly token rotate karein (har 3-6 months me)
   - Purane tokens ko revoke karein

3. **Permissions:**
   - Token ko minimum required permissions dein
   - Production databases pe direct changes se bachne ke liye branches use karein

## 🐛 Troubleshooting

### MCP Server Start Nahi Ho Raha

1. **Check Token:**
   - Token sahi hai ya nahi verify karein
   - Token expire to nahi ho gaya

2. **Check Node.js:**
   ```bash
   node --version
   npx --version
   ```
   Node.js 18+ hona chahiye

3. **Check Cursor Logs:**
   - Cursor me MCP errors check karein
   - Settings > MCP Servers me status check karein

### "Command Not Found" Error

Windows pe `cmd /c` prefix zaroori hai. `.cursor/mcp.json` me check karein ke format sahi hai.

### Connection Timeout

1. Internet connection check karein
2. Firewall settings check karein
3. Supabase dashboard me project accessible hai ya nahi check karein

## 📚 Additional Resources

- [Supabase MCP Server Documentation](https://github.com/supabase/mcp-server-supabase)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Supabase Dashboard](https://supabase.com/dashboard)

## 🎯 Next Steps

Ab aap Cursor me directly Supabase database ko manage kar sakte hain:

1. **Schema Changes:** Directly Cursor me prompts ke through schema update karein
2. **Data Queries:** Database queries run karein aur results dekhin
3. **Migrations:** Database changes ko migrations me track karein
4. **Type Generation:** TypeScript types automatically generate karein

---

**Note:** Agar aapko koi issue aaye ya help chahiye, to Supabase MCP GitHub repo me issue open kar sakte hain.














