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
  Plus,
  Search,
  BadgePercent,
  RefreshCw
} from "lucide-react"

interface CouponRow {
  code: string
  type: "percent" | "flat"
  value: number
  usage: number
  limit: number
  status: "active" | "expired" | "scheduled"
  expires: string
}

const MOCK_COUPONS: CouponRow[] = [
  { code: "NEW10", type: "percent", value: 10, usage: 23, limit: 100, status: "active", expires: "2024-03-01" },
  { code: "SAVE5", type: "flat", value: 5, usage: 10, limit: 50, status: "scheduled", expires: "2024-04-01" },
  { code: "WINTER20", type: "percent", value: 20, usage: 50, limit: 50, status: "expired", expires: "2024-01-01" },
]

export function SellerCoupons() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_COUPONS.filter(c =>
      (status === 'all' || c.status === status) &&
      (c.code.toLowerCase().includes(q))
    )
  }, [search, status])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>Create and manage discount codes</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> New Coupon
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code" className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Header */}
          <div className="grid grid-cols-12 px-3 py-2 text-xs text-muted-foreground">
            <div className="col-span-3">Code</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-2">Usage</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Expires</div>
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
              {filtered.map((c, i) => (
                <motion.div key={c.code} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-12 items-center px-3 py-3">
                  <div className="col-span-3 font-mono text-sm">{c.code}</div>
                  <div className="col-span-2 flex items-center gap-1"><BadgePercent className="h-4 w-4" /> {c.type}</div>
                  <div className="col-span-2 font-medium">{c.type === 'percent' ? `${c.value}%` : `$${c.value.toFixed(2)}`}</div>
                  <div className="col-span-2">{c.usage}/{c.limit}</div>
                  <div className="col-span-1">
                    <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className={c.status === 'expired' ? 'bg-red-500' : ''}>{c.status}</Badge>
                  </div>
                  <div className="col-span-2 text-right">{c.expires}</div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">No coupons found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}








