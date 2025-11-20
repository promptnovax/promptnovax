export type SellerChecklistItem = {
  id: string
  label: string
  status: 'todo' | 'in_progress' | 'done'
  description?: string
  cta?: { label: string; href: string }
}

export type SellerKpi = {
  id: string
  label: string
  value: string
  change?: {
    direction: 'up' | 'down'
    value: string
  }
  hint?: string
}

export type PromptSummary = {
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
  qaScore?: number
}

export type PromptLifecycleColumn = {
  stage: 'drafts' | 'testing' | 'review' | 'live'
  title: string
  description: string
  prompts: PromptSummary[]
}

export type TestingRun = {
  id: string
  promptId: string
  promptTitle: string
  model: string
  status: 'queued' | 'running' | 'passed' | 'failed'
  createdAt: string
  updatedAt: string
  score?: number
  costEstimateUsd?: number
}

export type TestingQueueSnapshot = {
  totalActive: number
  avgTurnaroundMinutes: number
  runs: TestingRun[]
}

export type PayoutSnapshot = {
  pendingAmount: number
  lifetimeEarnings: number
  payoutMethod?: string
  nextPayoutDate?: string
  historyPreview: Array<{
    id: string
    amount: number
    status: 'pending' | 'processing' | 'paid' | 'failed'
    scheduledFor: string
  }>
  feeSplit: {
    platformPercent: number
    sellerPercent: number
  }
}

export type EducationResource = {
  id: string
  title: string
  category: 'prompting' | 'pricing' | 'marketing' | 'compliance'
  durationMinutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  href: string
}

export type EducationSnapshot = {
  activeCourse?: {
    id: string
    title: string
    progressPercent: number
  }
  recommendations: EducationResource[]
  certificationProgress: number
}

export type SellerAlert = {
  id: string
  type: 'review' | 'compliance' | 'payout' | 'feature'
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  cta?: { label: string; href: string }
}

export type SellerFeedback = {
  id: string
  promptId: string
  promptTitle: string
  buyerHandle: string
  rating: number
  comment: string
  createdAt: string
}

export type SellerDashboardSummary = {
  sellerId: string
  profile: {
    name: string
    avatarUrl?: string
    verificationStatus: 'unverified' | 'pending' | 'verified'
    completionPercent: number
    checklist: SellerChecklistItem[]
  }
  kpis: SellerKpi[]
  lifecycle: PromptLifecycleColumn[]
  testing: TestingQueueSnapshot
  payouts: PayoutSnapshot
  education: EducationSnapshot
  alerts: SellerAlert[]
  feedback: SellerFeedback[]
}


