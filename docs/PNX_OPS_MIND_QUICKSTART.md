# PNX Ops Mind - Quick Start Guide

## 🚀 Step-by-Step Setup

### Step 1: Create PNX Ops Mind Directory

```bash
# Root directory mein
cd "C:\Users\HS Computers\Documents\pnx latest"
mkdir pnx-ops-mind
cd pnx-ops-mind
```

### Step 2: Initialize Project

```bash
npm init -y
npm install express cors dotenv axios
npm install -D @types/node @types/express typescript tsx
npm install @modelcontextprotocol/sdk-client @modelcontextprotocol/sdk
```

### Step 3: Create Basic Structure

```
pnx-ops-mind/
├── src/
│   ├── core/
│   │   ├── ai-engine.ts
│   │   └── task-manager.ts
│   ├── integrations/
│   │   └── pnx-saas-api.ts
│   ├── modules/
│   │   ├── development/
│   │   ├── marketing/
│   │   ├── sales/
│   │   └── monitoring/
│   └── api/
│       └── server.ts
├── config/
│   └── prompts.ts
├── .env
├── package.json
└── tsconfig.json
```

### Step 4: Create Basic Server

Create `src/api/server.ts`:

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8788

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'PNX Ops Mind',
    timestamp: new Date().toISOString()
  })
})

// Main operations endpoint
app.post('/api/ops/execute', async (req, res) => {
  const { task, module, params } = req.body
  
  try {
    // TODO: Implement task execution
    res.json({
      success: true,
      task,
      result: 'Task executed successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 PNX Ops Mind running on http://localhost:${PORT}`)
})
```

### Step 5: Create PNX SaaS API Client

Create `src/integrations/pnx-saas-api.ts`:

```typescript
import axios from 'axios'

const PNX_SAAS_URL = process.env.PNX_SAAS_URL || 'http://localhost:8787'
const PNX_SAAS_API_KEY = process.env.PNX_SAAS_API_KEY || ''

class PNXSaaSClient {
  private client = axios.create({
    baseURL: PNX_SAAS_URL,
    headers: {
      'Authorization': `Bearer ${PNX_SAAS_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  async getSystemHealth() {
    const response = await this.client.get('/api/health')
    return response.data
  }

  async getMetrics() {
    // Add your metrics endpoint
    const response = await this.client.get('/api/metrics')
    return response.data
  }

  async executeAction(action: string, params: any) {
    const response = await this.client.post('/api/ops/execute', {
      action,
      params
    })
    return response.data
  }
}

export const pnxSaaSClient = new PNXSaaSClient()
```

### Step 6: Create AI Engine

Create `src/core/ai-engine.ts`:

```typescript
import { pnxSaaSClient } from '../integrations/pnx-saas-api'

interface Task {
  id: string
  type: string
  description: string
  module: 'development' | 'marketing' | 'sales' | 'monitoring'
  params?: any
}

interface TaskResult {
  success: boolean
  data?: any
  error?: string
  actions?: string[]
}

export class OpsMindAIEngine {
  private systemPrompt = `
You are PNX Ops Mind, an AI operations assistant for PNX SaaS platform.

Your role:
- Monitor and maintain PNX SaaS
- Automate development workflows
- Optimize marketing campaigns
- Analyze sales data
- Ensure system health

Always provide actionable recommendations with clear reasoning.
  `

  async processTask(task: Task): Promise<TaskResult> {
    try {
      // 1. Gather context
      const context = await this.buildContext(task)
      
      // 2. Generate AI response (placeholder - integrate with OpenAI/Claude)
      const aiResponse = await this.callAI(task, context)
      
      // 3. Execute actions
      const result = await this.executeActions(aiResponse.actions, task)
      
      return {
        success: true,
        data: result,
        actions: aiResponse.actions
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  private async buildContext(task: Task) {
    const [health, metrics] = await Promise.all([
      pnxSaaSClient.getSystemHealth(),
      pnxSaaSClient.getMetrics().catch(() => null)
    ])

    return {
      systemHealth: health,
      metrics: metrics,
      task: task
    }
  }

  private async callAI(task: Task, context: any) {
    // TODO: Integrate with OpenAI/Claude/Anthropic
    // For now, return mock response
    return {
      actions: [`Execute ${task.type} for ${task.module} module`],
      reasoning: 'Based on current system state and task requirements'
    }
  }

  private async executeActions(actions: string[], task: Task) {
    // Execute actions via PNX SaaS API or MCP servers
    const results = []
    
    for (const action of actions) {
      try {
        const result = await pnxSaaSClient.executeAction(action, task.params)
        results.push({ action, success: true, result })
      } catch (error) {
        results.push({ action, success: false, error: error.message })
      }
    }
    
    return results
  }
}

export const aiEngine = new OpsMindAIEngine()
```

### Step 7: Update Server with AI Engine

Update `src/api/server.ts`:

```typescript
import { aiEngine } from '../core/ai-engine'

// ... existing code ...

app.post('/api/ops/execute', async (req, res) => {
  const { task, module, params } = req.body
  
  try {
    const result = await aiEngine.processTask({
      id: `task-${Date.now()}`,
      type: task,
      description: params?.description || '',
      module: module || 'monitoring',
      params
    })
    
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})
```

### Step 8: Create Environment File

Create `.env`:

```env
PORT=8788
PNX_SAAS_URL=http://localhost:8787
PNX_SAAS_API_KEY=your-api-key-here

# AI Provider Keys
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# MCP Server URLs (if running separately)
MCP_GITHUB_URL=http://localhost:9001
MCP_DATABASE_URL=http://localhost:9014
MCP_ANALYTICS_URL=http://localhost:9011
```

### Step 9: Create TypeScript Config

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Step 10: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/api/server.ts",
    "build": "tsc",
    "start": "node dist/api/server.js"
  }
}
```

## 🔗 Connect PNX SaaS to PNX Ops Mind

### Add Webhook Endpoint in PNX SaaS

Update `PNX-main/backend/index.ts`:

```typescript
// Add after existing routes
app.post('/api/webhooks/ops-mind', async (req, res) => {
  const { event, data } = req.body
  
  try {
    // Forward to PNX Ops Mind
    await axios.post('http://localhost:8788/api/events', {
      source: 'pnx-saas',
      event,
      data,
      timestamp: new Date().toISOString()
    })
    
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to forward to Ops Mind:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Example: Trigger on user signup
app.post('/api/auth/signup', async (req, res) => {
  // ... existing signup logic ...
  
  // Notify Ops Mind
  await axios.post('http://localhost:8788/api/events', {
    source: 'pnx-saas',
    event: 'user_signup',
    data: { userId: user.id, email: user.email },
    timestamp: new Date().toISOString()
  })
  
  res.json({ success: true, user })
})
```

### Add Event Handler in PNX Ops Mind

Create `src/api/events.ts`:

```typescript
import { Request, Response } from 'express'
import { aiEngine } from '../core/ai-engine'

export async function handleEvent(req: Request, res: Response) {
  const { source, event, data, timestamp } = req.body
  
  try {
    // Process event based on type
    switch (event) {
      case 'user_signup':
        await handleUserSignup(data)
        break
      case 'prompt_purchased':
        await handlePromptPurchase(data)
        break
      case 'system_error':
        await handleSystemError(data)
        break
      default:
        console.log(`Unknown event: ${event}`)
    }
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

async function handleUserSignup(data: any) {
  // AI can analyze new user signups
  // Suggest marketing campaigns
  // Update user acquisition metrics
  console.log('New user signup:', data)
}

async function handlePromptPurchase(data: any) {
  // Track sales
  // Analyze popular prompts
  // Suggest similar prompts
  console.log('Prompt purchased:', data)
}

async function handleSystemError(data: any) {
  // Alert on errors
  // Suggest fixes
  // Create bug reports
  console.log('System error:', data)
}
```

## 🧪 Testing

### Test 1: Health Check

```bash
curl http://localhost:8788/health
```

### Test 2: Execute Task

```bash
curl -X POST http://localhost:8788/api/ops/execute \
  -H "Content-Type: application/json" \
  -d '{
    "task": "analyze_performance",
    "module": "monitoring",
    "params": {
      "description": "Analyze system performance"
    }
  }'
```

### Test 3: Send Event from PNX SaaS

```bash
curl -X POST http://localhost:8787/api/webhooks/ops-mind \
  -H "Content-Type: application/json" \
  -d '{
    "event": "user_signup",
    "data": {
      "userId": "123",
      "email": "test@example.com"
    }
  }'
```

## 🎯 Next Steps

1. **Integrate Real AI Provider**
   - Add OpenAI/Claude SDK
   - Implement proper AI calls
   - Add context management

2. **Connect MCP Servers**
   - Setup MCP client connections
   - Test each server
   - Implement error handling

3. **Build First Module**
   - Start with Development module
   - Implement basic operations
   - Test with real tasks

4. **Add Monitoring**
   - Log all operations
   - Track performance
   - Create dashboards

## 📝 Example Usage

### From PNX SaaS Dashboard

```typescript
// In PNX SaaS frontend
async function askOpsMind(question: string) {
  const response = await fetch('http://localhost:8788/api/ops/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task: 'answer_question',
      module: 'monitoring',
      params: { question }
    })
  })
  
  return response.json()
}
```

### Direct API Call

```typescript
// Analyze marketing performance
const result = await fetch('http://localhost:8788/api/ops/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task: 'analyze_campaigns',
    module: 'marketing',
    params: {
      period: 'last_30_days',
      metrics: ['conversion', 'roi', 'engagement']
    }
  })
})
```

## 🎉 You're Ready!

Ab aap dono systems ko integrate kar sakte hain:
- **PNX SaaS** = User-facing application
- **PNX Ops Mind** = AI operations layer

Dono independent hain lekin tightly integrated!

