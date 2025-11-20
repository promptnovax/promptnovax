import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search,
  RefreshCw,
  CreditCard,
  PauseCircle,
  PlayCircle,
  XCircle
} from "lucide-react"

interface SubRow {
  id: string
  plan: string
  seller: string
  price: number
  status: "active" | "paused" | "canceled"
  renewsOn: string
}

const MOCK_SUBS: SubRow[] = [
  { id: "SUB-3001", plan: "Pro Updates", seller: "CodeMaster Pro", price: 4.99, status: "active", renewsOn: "2024-02-10" },
  { id: "SUB-3000", plan: "Prompt of the Week", seller: "Creative Minds", price: 2.99, status: "paused", renewsOn: "2024-02-01" },
]

export function BuyerSubscriptions() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_SUBS.filter(s => 
      (status === "all" || s.status === status) &&
      (s.id.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q) || s.seller.toLowerCase().includes(q))
    )
  }, [search, status])

  const format = (v: number) => `$${v.toFixed(2)}`

  const badge = (s: SubRow["status"]) => {
    if (s === "active") return <Badge className="bg-green-500">Active</Badge>
    if (s === "paused") return <Badge className="bg-amber-500">Paused</Badge>
    return <Badge className="bg-red-500">Canceled</Badge>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Manage your active subscriptions and renewals</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Button size="sm">
                <CreditCard className="h-4 w-4 mr-2" /> Payment Methods
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscriptions, plans, sellers"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Header */}
          <div className="grid grid-cols-12 px-3 py-2 text-xs text-muted-foreground">
            <div className="col-span-3">Subscription</div>
            <div className="col-span-3">Plan</div>
            <div className="col-span-2">Seller</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Renews / Actions</div>
          </div>
          <Separator />

          {loading ? (
            <div className="space-y-2 mt-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-12 items-center px-3 py-3">
                  <div className="col-span-3 font-mono text-sm">{s.id}</div>
                  <div className="col-span-3 truncate">{s.plan}</div>
                  <div className="col-span-2">{s.seller}</div>
                  <div className="col-span-1 font-medium">{format(s.price)}</div>
                  <div className="col-span-1">{badge(s.status)}</div>
                  <div className="col-span-2 text-right">
                    <div className="inline-flex gap-2">
                      {s.status === 'active' && (
                        <Button variant="outline" size="sm"><PauseCircle className="h-4 w-4" /></Button>
                      )}
                      {s.status === 'paused' && (
                        <Button size="sm"><PlayCircle className="h-4 w-4" /></Button>
                      )}
                      {s.status !== 'canceled' && (
                        <Button variant="outline" size="sm" className="text-red-600"><XCircle className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">No subscriptions found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}








