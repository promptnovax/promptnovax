import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  MessageSquare, 
  Book, 
  HelpCircle, 
  Send,
  Search,
  FileText,
  Video,
  ExternalLink
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function SellerSupportPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')

  const handleBack = () => {
    window.location.hash = '#dashboard/seller'
  }

  const handleSubmitTicket = () => {
    toast({
      title: 'Ticket Submitted',
      description: 'Our support team will get back to you within 24 hours.'
    })
  }

  const helpArticles = [
    { id: '1', title: 'How to price your prompts', category: 'Pricing', readTime: '5 min' },
    { id: '2', title: 'Prompt approval guidelines', category: 'Compliance', readTime: '8 min' },
    { id: '3', title: 'Setting up payout methods', category: 'Payouts', readTime: '4 min' },
    { id: '4', title: 'Testing prompts effectively', category: 'Testing', readTime: '6 min' },
    { id: '5', title: 'Marketplace best practices', category: 'Marketing', readTime: '10 min' }
  ]

  const quickLinks = [
    { title: 'Seller Guide', icon: Book, href: '#help' },
    { title: 'API Documentation', icon: FileText, href: '#docs' },
    { title: 'Video Tutorials', icon: Video, href: '#tutorials' },
    { title: 'Community Forum', icon: MessageSquare, href: '#community' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Seller Support</h2>
          <p className="text-muted-foreground mt-1">Get help and resources for selling on our marketplace</p>
        </div>
      </div>

      <Tabs defaultValue="help" className="space-y-4">
        <TabsList>
          <TabsTrigger value="help">Help Center</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Help Articles</CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {helpArticles.map((article) => (
              <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {article.category} • {article.readTime}
                      </CardDescription>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Send us a message and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What can we help you with?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option>General Question</option>
                  <option>Technical Issue</option>
                  <option>Billing & Payouts</option>
                  <option>Account Issue</option>
                  <option>Feature Request</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  className="min-h-[200px]"
                />
              </div>
              <Button onClick={handleSubmitTicket} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((link, idx) => (
              <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <link.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      window.location.hash = link.href
                    }}
                  >
                    Open <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

