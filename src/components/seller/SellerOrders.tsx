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
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from "lucide-react"

interface OrderRow {
  id: string
  customer: string
  product: string
  amount: number
  status: "paid" | "pending" | "refunded"
  date: string
}

const MOCK_ORDERS: OrderRow[] = [
  { id: "ORD-10234", customer: "Ali R.", product: "Advanced Code Review Assistant", amount: 29.99, status: "paid", date: "2024-01-22" },
  { id: "ORD-10233", customer: "Sara K.", product: "Security Code Scanner", amount: 34.99, status: "pending", date: "2024-01-22" },
  { id: "ORD-10232", customer: "John D.", product: "API Documentation Generator", amount: 24.99, status: "refunded", date: "2024-01-21" },
  { id: "ORD-10231", customer: "Arham M.", product: "Creative Story Generator", amount: 19.99, status: "paid", date: "2024-01-21" },
]

export function SellerOrders() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_ORDERS.filter(o => 
      (status === "all" || o.status === status) &&
      (o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q))
    )
  }, [search, status])

  const format = (v: number) => `$${v.toFixed(2)}`

  const statusBadge = (s: OrderRow["status"]) => {
    if (s === "paid") return <Badge className="bg-green-500">Paid</Badge>
    if (s === "pending") return <Badge className="bg-amber-500">Pending</Badge>
    return <Badge className="bg-red-500">Refunded</Badge>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage customer orders, statuses, and fulfillment</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" /> Export CSV
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
                placeholder="Search orders, customers, products"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 px-3 py-2 text-xs text-muted-foreground">
            <div className="col-span-3">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Product</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <Separator />

          {/* Rows */}
          {loading ? (
            <div className="space-y-2 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((o, i) => (
                <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-12 items-center px-3 py-3">
                  <div className="col-span-3 font-mono text-sm">{o.id}</div>
                  <div className="col-span-3">{o.customer}</div>
                  <div className="col-span-3 truncate">{o.product}</div>
                  <div className="col-span-1 font-medium">{format(o.amount)}</div>
                  <div className="col-span-1">{statusBadge(o.status)}</div>
                  <div className="col-span-1 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      {o.status === 'pending' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-4 w-4" /></Button>
                      )}
                      {o.status === 'paid' && (
                        <Button variant="outline" size="sm"><Clock className="h-4 w-4" /></Button>
                      )}
                      {o.status === 'refunded' && (
                        <Button variant="outline" size="sm"><XCircle className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">No orders found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}








