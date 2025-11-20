import type { SellerDashboardSummary } from '@/types/seller'

export const sellerDashboardMock: SellerDashboardSummary = {
  sellerId: 'seller_123',
  profile: {
    name: 'Avery Quinn',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
    verificationStatus: 'pending',
    completionPercent: 72,
    checklist: [
      {
        id: 'kyc',
        label: 'Verify your identity',
        status: 'in_progress',
        description: 'Upload government-issued ID to unlock payouts',
        cta: { label: 'Continue verification', href: '#dashboard/seller/verification' }
      },
      {
        id: 'payout-method',
        label: 'Connect payout method',
        status: 'todo',
        description: 'Connect Stripe or USDC wallet to receive royalties',
        cta: { label: 'Add payout method', href: '#dashboard/seller/payouts' }
      },
      {
        id: 'first-prompt',
        label: 'Submit your first prompt',
        status: 'done',
        description: 'Publish at least one prompt to go live',
        cta: { label: 'View prompts', href: '#dashboard/seller' }
      },
      {
        id: 'pricing-rules',
        label: 'Review marketplace pricing rules',
        status: 'todo',
        description: 'Stay compliant with platform pricing limits',
        cta: { label: 'Read pricing guide', href: '#dashboard/seller/pricing-guide' }
      }
    ]
  },
  kpis: [
    {
      id: 'earnings',
      label: 'Net Earnings (30d)',
      value: '$1,284.40',
      change: { direction: 'up', value: '+18%' },
      hint: 'After platform fees'
    },
    {
      id: 'conversion',
      label: 'Conversion Rate',
      value: '14.3%',
      change: { direction: 'up', value: '+3.1pt' },
      hint: 'Views to purchases'
    },
    {
      id: 'qa-pass',
      label: 'QA Pass Rate',
      value: '92%',
      change: { direction: 'down', value: '-2pt' },
      hint: 'Last 10 submissions'
    },
    {
      id: 'followers',
      label: 'Followers',
      value: '2,418',
      change: { direction: 'up', value: '+124' }
    }
  ],
  lifecycle: [
    {
      stage: 'drafts',
      title: 'Drafts',
      description: 'Work in progress prompts',
      prompts: [
        {
          id: 'draft_1',
          title: 'Enterprise SOC2 Audit Copilot',
          category: 'Compliance',
          price: 149,
          status: 'draft',
          lastUpdated: '2025-11-11T08:15:00Z',
          metrics: { views: 0, sales: 0, conversionRate: 0 },
          qaScore: 0
        },
        {
          id: 'draft_2',
          title: 'AI Product Launch Blueprint',
          category: 'Marketing',
          price: 79,
          status: 'draft',
          lastUpdated: '2025-11-10T19:40:00Z',
          metrics: { views: 43, sales: 0, conversionRate: 0 },
          qaScore: 48
        }
      ]
    },
    {
      stage: 'testing',
      title: 'Testing',
      description: 'Running automated QA scenarios',
      prompts: [
        {
          id: 'test_1',
          title: 'No-Code App Builder Prompt Pack',
          category: 'Development',
          price: 129,
          status: 'testing',
          lastUpdated: '2025-11-12T15:55:00Z',
          metrics: { views: 318, sales: 34, conversionRate: 10.6 },
          qaScore: 76
        }
      ]
    },
    {
      stage: 'review',
      title: 'Under Review',
      description: 'Waiting for Marketplace approval',
      prompts: [
        {
          id: 'review_1',
          title: 'Midjourney Branding Mega Pack',
          category: 'Design',
          price: 59,
          status: 'review',
          lastUpdated: '2025-11-12T12:30:00Z',
          metrics: { views: 512, sales: 58, conversionRate: 11.3 },
          qaScore: 88
        }
      ]
    },
    {
      stage: 'live',
      title: 'Live in Marketplace',
      description: 'Generating revenue right now',
      prompts: [
        {
          id: 'live_1',
          title: 'Full-Stack SaaS Launch Architect',
          category: 'Development',
          price: 199,
          status: 'live',
          lastUpdated: '2025-11-12T05:20:00Z',
          metrics: { views: 1804, sales: 146, conversionRate: 8.1 },
          qaScore: 94
        },
        {
          id: 'live_2',
          title: 'Agency Proposal Autowriter',
          category: 'Business',
          price: 89,
          status: 'live',
          lastUpdated: '2025-11-10T22:17:00Z',
          metrics: { views: 1142, sales: 98, conversionRate: 8.6 },
          qaScore: 91
        }
      ]
    }
  ],
  testing: {
    totalActive: 3,
    avgTurnaroundMinutes: 42,
    runs: [
      {
        id: 'run_1',
        promptId: 'test_1',
        promptTitle: 'No-Code App Builder Prompt Pack',
        model: 'openrouter/gpt-4.1-mini',
        status: 'running',
        createdAt: '2025-11-12T15:40:00Z',
        updatedAt: '2025-11-12T15:55:00Z',
        score: 0.82,
        costEstimateUsd: 2.14
      },
      {
        id: 'run_2',
        promptId: 'live_2',
        promptTitle: 'Agency Proposal Autowriter',
        model: 'anthropic/claude-3.5-sonnet',
        status: 'passed',
        createdAt: '2025-11-12T14:20:00Z',
        updatedAt: '2025-11-12T14:50:00Z',
        score: 0.94,
        costEstimateUsd: 1.37
      },
      {
        id: 'run_3',
        promptId: 'draft_2',
        promptTitle: 'AI Product Launch Blueprint',
        model: 'openai/gpt-4o-mini',
        status: 'failed',
        createdAt: '2025-11-12T13:05:00Z',
        updatedAt: '2025-11-12T13:25:00Z',
        score: 0.52,
        costEstimateUsd: 0.68
      }
    ]
  },
  payouts: {
    pendingAmount: 245.67,
    lifetimeEarnings: 5045.34,
    payoutMethod: 'Stripe Connect •••• 4242',
    nextPayoutDate: '2025-11-15',
    historyPreview: [
      { id: 'payout_1', amount: 612.45, status: 'paid', scheduledFor: '2025-10-31' },
      { id: 'payout_2', amount: 487.32, status: 'paid', scheduledFor: '2025-10-15' },
      { id: 'payout_3', amount: 301.12, status: 'processing', scheduledFor: '2025-11-01' }
    ],
    feeSplit: {
      platformPercent: 18,
      sellerPercent: 82
    }
  },
  education: {
    activeCourse: {
      id: 'course_1',
      title: 'Prompt Engineering Mastery',
      progressPercent: 64
    },
    recommendations: [
      {
        id: 'resource_1',
        title: 'Pricing your AI prompts for enterprise buyers',
        category: 'pricing',
        durationMinutes: 12,
        level: 'intermediate',
        href: '#/academy/pricing'
      },
      {
        id: 'resource_2',
        title: 'Midjourney best practices for product branding',
        category: 'prompting',
        durationMinutes: 18,
        level: 'advanced',
        href: '#/academy/midjourney'
      },
      {
        id: 'resource_3',
        title: 'Marketing automation prompts that convert',
        category: 'marketing',
        durationMinutes: 9,
        level: 'beginner',
        href: '#/academy/marketing-automation'
      }
    ],
    certificationProgress: 38
  },
  alerts: [
    {
      id: 'alert_1',
      type: 'compliance',
      title: 'Pricing exceeds category limit',
      message: 'Development prompts in beta tier must stay under $159.',
      severity: 'warning',
      cta: { label: 'Adjust price', href: '#dashboard/seller/prompts/test_1?tab=settings' }
    },
    {
      id: 'alert_2',
      type: 'review',
      title: 'Revision requested',
      message: '“Midjourney Branding Mega Pack” needs usage disclaimers before approval.',
      severity: 'info',
      cta: { label: 'View feedback', href: '#dashboard/seller/prompts/test_2?tab=feedback' }
    },
    {
      id: 'alert_3',
      type: 'payout',
      title: 'Complete tax form',
      message: 'Submit W-8BEN before next payout to avoid withholding.',
      severity: 'critical',
      cta: { label: 'Upload form', href: '#dashboard/seller/payouts?tab=settings' }
    }
  ],
  feedback: [
    {
      id: 'feedback_1',
      promptId: 'live_1',
      promptTitle: 'Full-Stack SaaS Launch Architect',
      buyerHandle: '@productsmith',
      rating: 5,
      comment: 'Generated an MVP launch plan in under an hour. Worth every dollar!',
      createdAt: '2025-11-12T09:10:00Z'
    },
    {
      id: 'feedback_2',
      promptId: 'live_2',
      promptTitle: 'Agency Proposal Autowriter',
      buyerHandle: '@agencywave',
      rating: 4,
      comment: 'Great structure, would love a variant tailored for SEO retainers.',
      createdAt: '2025-11-11T17:45:00Z'
    }
  ]
}


