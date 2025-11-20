import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, History, Search, Filter, Download, Eye, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock test history data
const mockTestHistory = [
  {
    id: '1',
    promptTitle: 'Code Review Assistant',
    promptText: 'Review this code for security issues...',
    models: ['GPT-4', 'Claude 3.5'],
    status: 'completed',
    completedAt: '2025-01-15T10:30:00Z',
    totalTests: 2,
    passedTests: 2,
    avgLatency: 1200,
    totalCost: 0.0234
  },
  {
    id: '2',
    promptTitle: 'Image Generation Prompt',
    promptText: 'Generate a professional logo...',
    models: ['DALL-E 3', 'Midjourney'],
    status: 'completed',
    completedAt: '2025-01-14T15:20:00Z',
    totalTests: 2,
    passedTests: 1,
    avgLatency: 3500,
    totalCost: 0.0456
  },
  {
    id: '3',
    promptTitle: 'Content Writer',
    promptText: 'Write a blog post about...',
    models: ['GPT-4', 'Claude 3.5', 'GPT-3.5'],
    status: 'failed',
    completedAt: '2025-01-13T09:15:00Z',
    totalTests: 3,
    passedTests: 1,
    avgLatency: 0,
    totalCost: 0.0123
  }
]

export function SellerTestHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredHistory = mockTestHistory.filter(item => {
    const matchesSearch = item.promptTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.promptText.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.hash = '#dashboard/seller/testing'}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Testing Lab
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
              <History className="h-7 w-7 text-primary" />
              Test History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your past test runs
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export History
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search test history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Test History List */}
      <div className="grid gap-4">
        {filteredHistory.map((test) => (
          <Card key={test.id} className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {test.promptTitle}
                    {test.status === 'completed' ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {test.promptText}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Models Tested</p>
                  <p className="font-semibold">{test.models.length}</p>
                  <p className="text-xs text-muted-foreground">{test.models.join(', ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Test Results</p>
                  <p className="font-semibold">
                    {test.passedTests}/{test.totalTests} passed
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {test.avgLatency}ms
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                  <p className="font-semibold">${test.totalCost.toFixed(4)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(test.completedAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.location.hash = `#dashboard/seller/testing?load=${test.id}`}>
                    Re-run Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <Card className="border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <History className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No test history found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.hash = '#dashboard/seller/testing'}
            >
              Run Your First Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

