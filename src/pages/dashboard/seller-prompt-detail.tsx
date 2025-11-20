import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  TrendingUp, 
  DollarSign,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function SellerPromptDetailPage() {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState<any>(null)
  const [promptId, setPromptId] = useState<string>('')

  useEffect(() => {
    // Extract promptId and tab from URL hash
    const hash = window.location.hash
    const match = hash.match(/prompts\/([^?]+)/)
    const id = match ? match[1] : ''
    setPromptId(id)

    // Extract tab from URL params
    const urlParams = new URLSearchParams(hash.split('?')[1] || '')
    const tab = urlParams.get('tab') || 'overview'

    // In production, fetch prompt by ID
    // For now, use mock data based on promptId
    const mockPrompts: Record<string, any> = {
      'live_1': {
        id: 'live_1',
        title: 'Full-Stack SaaS Launch Architect',
        category: 'Development',
        status: 'live',
        price: 199,
        description: 'A comprehensive prompt pack for launching full-stack SaaS applications',
        qaScore: 94,
        views: 1804,
        sales: 146,
        conversionRate: 8.1,
        rating: 4.8,
        earnings: 7294.54,
        createdAt: '2025-11-12',
        lastUpdated: '2025-11-12'
      },
      'live_2': {
        id: 'live_2',
        title: 'Agency Proposal Autowriter',
        category: 'Business',
        status: 'live',
        price: 89,
        description: 'Generate professional agency proposals automatically',
        qaScore: 91,
        views: 1142,
        sales: 98,
        conversionRate: 8.6,
        rating: 4.0,
        earnings: 8722.00,
        createdAt: '2025-11-10',
        lastUpdated: '2025-11-10'
      },
      'review_1': {
        id: 'review_1',
        title: 'Midjourney Branding Mega Pack',
        category: 'Design',
        status: 'review',
        price: 59,
        description: 'Comprehensive branding prompts for Midjourney',
        qaScore: 88,
        views: 512,
        sales: 58,
        conversionRate: 11.3,
        rating: 0,
        earnings: 0,
        createdAt: '2025-11-12',
        lastUpdated: '2025-11-12'
      },
      'test_1': {
        id: 'test_1',
        title: 'No-Code App Builder Prompt Pack',
        category: 'Development',
        status: 'testing',
        price: 129,
        description: 'Build no-code applications with AI assistance',
        qaScore: 76,
        views: 318,
        sales: 34,
        conversionRate: 10.6,
        rating: 0,
        earnings: 0,
        createdAt: '2025-11-12',
        lastUpdated: '2025-11-12'
      },
      'draft_1': {
        id: 'draft_1',
        title: 'Enterprise SOC2 Audit Copilot',
        category: 'Compliance',
        status: 'draft',
        price: 149,
        description: 'AI-powered SOC2 compliance auditing assistant',
        qaScore: 0,
        views: 0,
        sales: 0,
        conversionRate: 0,
        rating: 0,
        earnings: 0,
        createdAt: '2025-11-11',
        lastUpdated: '2025-11-11'
      },
      'draft_2': {
        id: 'draft_2',
        title: 'AI Product Launch Blueprint',
        category: 'Marketing',
        status: 'draft',
        price: 79,
        description: 'Complete blueprint for launching AI products',
        qaScore: 48,
        views: 43,
        sales: 0,
        conversionRate: 0,
        rating: 0,
        earnings: 0,
        createdAt: '2025-11-10',
        lastUpdated: '2025-11-10'
      }
    }

    setPrompt(mockPrompts[id] || mockPrompts['live_1'])
  }, [promptId])

  const handleBack = () => {
    window.location.hash = '#dashboard/seller'
  }

  const handleEdit = () => {
    window.location.hash = `#dashboard/seller/prompt-studio?edit=${promptId}`
  }

  if (!prompt) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading prompt...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold">{prompt.title}</h2>
              <Badge variant={prompt.status === 'live' ? 'default' : 'secondary'}>
                {prompt.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{prompt.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View in Marketplace
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prompt.views.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prompt.sales}</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+8%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prompt.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Views to purchases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${prompt.earnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">After platform fees</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={(() => {
        const hash = window.location.hash
        const urlParams = new URLSearchParams(hash.split('?')[1] || '')
        return urlParams.get('tab') || 'overview'
      })()} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Price</Label>
                  <p className="text-lg font-semibold mt-1">${prompt.price}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rating</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{prompt.rating}</span>
                    <span className="text-sm text-muted-foreground">({prompt.sales} reviews)</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">QA Score</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{prompt.qaScore}%</Badge>
                    {prompt.qaScore >= 90 && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(prompt.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Analytics charts coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Buyer Feedback</CardTitle>
              <CardDescription>Reviews and ratings from buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Feedback will appear here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Settings</CardTitle>
              <CardDescription>Manage prompt visibility and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>Update Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

