import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function SellerPayoutsPage() {
  const { toast } = useToast()
  const [payoutMethod, setPayoutMethod] = useState<'stripe' | 'usdc'>('stripe')

  const handleBack = () => {
    window.location.hash = '#dashboard/seller'
  }

  const handleConnectStripe = () => {
    toast({
      title: 'Connecting Stripe',
      description: 'Redirecting to Stripe Connect...'
    })
    // In production, this would redirect to Stripe OAuth
  }

  const handleConnectWallet = () => {
    toast({
      title: 'Connect Wallet',
      description: 'Wallet connection coming soon...'
    })
  }

  const payoutHistory = [
    { id: '1', amount: 612.45, status: 'paid', date: '2025-10-31', method: 'Stripe' },
    { id: '2', amount: 487.32, status: 'paid', date: '2025-10-15', method: 'Stripe' },
    { id: '3', amount: 301.12, status: 'processing', date: '2025-11-01', method: 'Stripe' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-primary" />
              Payouts & Earnings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your earnings, payout methods, and payment history
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Pending Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$245.67</div>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Next payout: Nov 15, 2025
            </p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Lifetime Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$5,045.34</div>
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+18% this month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Fee Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82% / 18%</div>
            <p className="text-sm text-muted-foreground mt-2">Seller / Platform</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="method" className="space-y-4">
        <TabsList>
          <TabsTrigger value="method">Payout Method</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="method" className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Connect Payout Method</CardTitle>
              <CardDescription>Choose how you want to receive your earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card 
                  className={`cursor-pointer transition-all ${payoutMethod === 'stripe' ? 'border-primary ring-2 ring-primary' : ''}`}
                  onClick={() => setPayoutMethod('stripe')}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">Stripe Connect</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Receive payouts directly to your bank account via Stripe
                    </p>
                    {payoutMethod === 'stripe' ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Connected Account</p>
                          <p className="text-xs text-muted-foreground mt-1">•••• 4242</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Update Account
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={handleConnectStripe} className="w-full">
                        Connect Stripe
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${payoutMethod === 'usdc' ? 'border-primary ring-2 ring-primary' : ''}`}
                  onClick={() => setPayoutMethod('usdc')}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Wallet className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">USDC Wallet</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Receive payouts in USDC cryptocurrency
                    </p>
                    {payoutMethod === 'usdc' ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Wallet Address</p>
                          <p className="text-xs text-muted-foreground mt-1 font-mono">0x742d...a1b2</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Update Wallet
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={handleConnectWallet} className="w-full">
                        Connect Wallet
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Payout History</CardTitle>
                  <CardDescription>View all your past payouts and transactions</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payoutHistory.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        payout.status === 'paid' ? 'bg-green-100 dark:bg-green-900' :
                        payout.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900' :
                        'bg-gray-100 dark:bg-gray-900'
                      }`}>
                        {payout.status === 'paid' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : payout.status === 'processing' ? (
                          <Clock className="h-5 w-5 text-blue-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">${payout.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(payout.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={payout.status === 'paid' ? 'default' : 'secondary'}>
                        {payout.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{payout.method}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Payout Settings</CardTitle>
              <CardDescription>Configure your payout preferences and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payout Frequency</Label>
                <Select defaultValue="biweekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Minimum Payout Amount</Label>
                <Input type="number" placeholder="50" defaultValue="50" />
                <p className="text-xs text-muted-foreground">
                  Payouts will be processed when this amount is reached
                </p>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

