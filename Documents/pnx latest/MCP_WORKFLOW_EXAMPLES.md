# Supabase MCP Workflow Examples

Yeh document aapko dikhayega ke kaise aap Cursor me prompts ke through Supabase backend ko handle kar sakte hain.

## 🎯 Backend Management Through Prompts

### 1. Database Schema Management

#### View Current Schema
```
"Show me the complete database schema for my Supabase project. List all tables with their columns, types, and relationships."
```

#### Check Specific Table
```
"Show me the structure of the 'prompts' table including all columns, constraints, and indexes."
```

#### Add New Column
```
"Add a new column 'featured' (boolean, default false) to the 'prompts' table in my Supabase database."
```

#### Create New Table
```
"Create a new table 'user_subscriptions' with columns:
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- plan_type (text)
- status (text)
- expires_at (timestamptz)
- created_at (timestamptz)"
```

### 2. Data Queries & Reports

#### Get All Live Prompts
```
"Query my Supabase database to get all prompts where status is 'live', ordered by created_at descending. Show title, price, and seller_id."
```

#### Sales Report
```
"Generate a sales report from my Supabase database:
- Total orders count
- Total revenue in cents
- Orders by status
- Top 5 selling prompts"
```

#### User Analytics
```
"Get user statistics from my database:
- Total users count
- Users by role (buyer, seller, admin)
- New users in last 30 days"
```

### 3. Data Modifications

#### Update Records
```
"Update all prompts with status 'draft' that are older than 30 days to status 'archived' in my Supabase database."
```

#### Insert Test Data
```
"Insert a test prompt in my database:
- title: 'Test Prompt'
- seller_id: [use a valid UUID from profiles]
- status: 'draft'
- price_cents: 999
- visibility: 'private'"
```

### 4. Migration Management

#### Create Migration
```
"Create a migration to add an index on 'prompts.seller_id' and 'prompts.status' columns for better query performance."
```

#### Review Migrations
```
"Show me all pending migrations in my Supabase project."
```

### 5. TypeScript Type Generation

#### Generate Types
```
"Generate TypeScript types for all tables in my Supabase database. Save them in a format I can use in my frontend code."
```

#### Generate Specific Table Types
```
"Generate TypeScript types for the 'prompts' and 'orders' tables only."
```

### 6. Project Configuration

#### Get Project Details
```
"What is my Supabase project URL, region, and database connection details?"
```

#### Check Project Status
```
"Check the status of my Supabase project. Is it active, paused, or in maintenance?"
```

### 7. Database Branching (Development)

#### Create Development Branch
```
"Create a new database branch called 'feature-new-payment-system' for development work."
```

#### Switch to Branch
```
"Switch to the 'feature-new-payment-system' branch so I can test schema changes safely."
```

### 8. Logs & Debugging

#### View Recent Logs
```
"Show me the last 50 log entries from my Supabase project, filtered for errors only."
```

#### Check Database Performance
```
"Show me database query performance metrics and slow queries from my Supabase project."
```

## 🔄 Complete Workflow Example

### Scenario: Adding a New Feature

**Step 1: Check Current Schema**
```
"Show me the current structure of the 'prompts' table and related tables."
```

**Step 2: Plan Changes**
```
"Based on the schema, suggest how to add a 'tags' array column to the prompts table."
```

**Step 3: Create Migration**
```
"Create a migration to add a 'tags' text[] column to the prompts table with a default empty array."
```

**Step 4: Apply Changes**
```
"Apply the migration to add tags column to prompts table."
```

**Step 5: Verify Changes**
```
"Query the prompts table schema to confirm the tags column was added successfully."
```

**Step 6: Generate Types**
```
"Generate updated TypeScript types for the prompts table including the new tags column."
```

## 💡 Pro Tips

1. **Be Specific:** Always mention "in my Supabase database" or "from my Supabase project"

2. **Use Context:** Reference existing tables/columns by name when possible

3. **Safety First:** For destructive operations, MCP will ask for confirmation

4. **Branch for Testing:** Use database branches for experimental changes

5. **Type Generation:** Regularly regenerate TypeScript types after schema changes

## 🚨 Important Notes

- **Backup First:** Before major schema changes, ask MCP to show current state
- **Test Queries:** Always test SELECT queries before UPDATE/DELETE
- **Review Migrations:** Review generated SQL before applying migrations
- **Production Safety:** Use branches for production database changes

## 📝 Integration with Your Codebase

After MCP makes changes:

1. **Update Local Schema:** 
   - Copy the SQL from MCP to `PNX-main/supabase/schema.sql`
   - Keep it as source of truth

2. **Update TypeScript Types:**
   - Use generated types in `PNX-main/src/types/` or `PNX-main/backend/types/`

3. **Update Backend Code:**
   - Update `PNX-main/backend/lib/supabase.ts` if needed
   - Update API routes to use new schema

4. **Update Frontend:**
   - Use new types in React components
   - Update forms/queries for new fields

---

**Remember:** MCP se jo bhi changes honge, unhe manually `schema.sql` me bhi update karna hoga taaki codebase sync rahe!














