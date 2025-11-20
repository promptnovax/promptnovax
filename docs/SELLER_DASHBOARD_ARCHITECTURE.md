## Seller Dashboard Architecture

### Experience Pillars

1. **Activation & Compliance**
   - Onboarding checklist: verification (KYC), payment method, marketplace policies, prompt quality standards.
   - Compliance guardrails: prohibited content reminders, pricing guardrails, royalty split meters.
   - Profile completeness meter that maps to marketplace profile visibility.

2. **Prompt Lifecycle**
   - Drafting: Prompt Studio launcher, quick links to templates, ability to resume drafts.
   - Testing: sandbox queue with model selection, scenario coverage score, cost estimate, automated QA report.
   - Submission: publishing checklist, approval status timeline, reviewer feedback thread.

3. **Monetisation**
   - Sales & earnings cockpit: total revenue, platform fees, payout schedule, forecasted royalties.
   - Pricing assistant: recommended price bands per category, margin simulator.
   - Payment operations: connect payout method, tax forms, payout history export.

4. **Growth & Enablement**
   - Performance analytics: views → trials → conversions funnel, retention per prompt, featured placement insights.
   - Buyer feedback intelligence: sentiment, recurring feature requests, satisfaction score trends.
   - Education: micro courses, certification progress, community events, contextual tips while editing.

5. **Support & Community**
   - Knowledge base search, live chat escalation, ticket status.
   - Community leaderboard, collaboration invites, co-author management (future).

### Page Layout (v1 Implementation)

- **Sticky Header**
  - Greeting, verification badge, quick action buttons (new prompt, request payout, support).
  - Global search (commands, docs, prompts).

- **Responsive Grid**
  1. **Left Column (lg:w-2/3)**
     - Hero cards with KPIs (earnings, sales, active prompts, QA pass rate).
     - Prompt Lifecycle board (drafts, testing, review, live).
     - Prompt Studio panel (templates, create wizard, resume drafts).
     - Testing queue status widget.
  2. **Right Column (lg:w-1/3)**
     - Onboarding checklist / profile completeness meter.
     - Upcoming payouts and payment status.
     - Alerts & review feedback.
     - Education & support widgets.

- **Full-width Sections**
  - Advanced analytics preview (chart stack).
  - Buyer feedback & reviews quick view.

### Data Contracts (Placeholder for API Integration)

```ts
type SellerDashboardSummary = {
  sellerId: string
  profile: {
    name: string
    avatarUrl?: string
    verificationStatus: 'unverified' | 'pending' | 'verified'
    completionPercent: number
    checklist: Array<{
      id: string
      label: string
      status: 'todo' | 'in_progress' | 'done'
      description?: string
      cta?: { label: string; href: string }
    }>
  }
  kpis: Array<{
    id: 'earnings' | 'sales' | 'activePrompts' | 'qaPassRate' | string
    label: string
    value: string | number
    delta?: { direction: 'up' | 'down'; value: string }
    trend?: Array<number>
  }>
  lifecycleBoard: Array<{
    stage: 'drafts' | 'testing' | 'review' | 'live'
    prompts: Array<PromptSummary>
  }>
  testingQueue: {
    totalActive: number
    avgTurnaroundMinutes: number
    runs: Array<{
      id: string
      promptId: string
      model: string
      status: 'queued' | 'running' | 'passed' | 'failed'
      createdAt: string
      updatedAt: string
      score?: number
    }>
  }
  payouts: {
    nextPayoutDate?: string
    pendingAmount: number
    lifetimeEarnings: number
    payoutMethod?: string
    historyPreview: Array<{
      id: string
      amount: number
      status: 'pending' | 'processing' | 'paid' | 'failed'
      scheduledFor: string
    }>
  }
  education: {
    activeCourse?: {
      id: string
      title: string
      progressPercent: number
    }
    recommendations: Array<{
      id: string
      title: string
      category: 'prompting' | 'pricing' | 'marketing' | 'compliance'
      durationMinutes: number
      href: string
    }>
  }
  alerts: Array<{
    id: string
    type: 'review' | 'compliance' | 'payout' | 'feature'
    title: string
    message: string
    severity: 'info' | 'warning' | 'critical'
    cta?: { label: string; href: string }
  }>
  feedback: Array<{
    id: string
    promptId: string
    buyerHandle: string
    rating: number
    comment: string
    createdAt: string
  }>
}

type PromptSummary = {
  id: string
  title: string
  category: string
  price: number
  status: 'draft' | 'testing' | 'review' | 'live' | 'rejected'
  lastUpdated: string
  metrics?: {
    views: number
    sales: number
    conversionRate: number
  }
}
```

> The initial implementation will load from static mocks living under `src/data/seller-dashboard.ts`. Replace with real API requests once backend endpoints are available.

### Component Breakdown (v1)

| Component | Responsibility | Notes |
|-----------|----------------|-------|
| `SellerDashboardShell` | Layout scaffolding (header, grid, sections) | Lives in `pages/dashboard/seller-dashboard.tsx`. |
| `SellerKpiStrip` | Render key metric cards | Accepts `kpis`. |
| `PromptLifecycleBoard` | Kanban overview of prompts by stage | Drag & drop to be introduced later. |
| `PromptStudioPanel` | Entry point into creation tools | Includes template chips & CTA buttons. |
| `TestingQueueWidget` | Status of ongoing test runs | Highlights bottlenecks. |
| `OnboardingChecklist` | Checklist & profile completion meter | Syncs with profile data. |
| `PayoutSummaryCard` | Payment & revenue insights | Shows fee breakdown. |
| `EducationSpotlight` | Recommended lessons/resources | Links to docs or learning center. |
| `AlertsCenter` | List of actionable alerts | Badges by severity. |
| `FeedbackHighlights` | Recent buyer feedback | Glanceable sentiment. |

###Enhancements 

- Real-time updates via WebSocket (testing status, sales notifications).
- AI-generated recommendations (pricing, prompt improvements).
- Team collaboration (assign reviewers, shared drafts).
- Marketplace preview and staging environment.
- Consent-based analytics sharing with buyers.

