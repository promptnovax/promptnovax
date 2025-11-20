import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search,
  Download,
  Eye,
  Receipt
} from "lucide-react"

interface InvoiceRow {
  id: string
  date: string
  amount: number
  item: string
}

const MOCK_INVOICES: InvoiceRow[] = [
  { id: "INV-8001", date: "2024-01-22", amount: 29.99, item: "Advanced Code Review Assistant" },
  { id: "INV-8000", date: "2024-01-18", amount: 19.99, item: "Creative Writing Prompts Generator" },
]

export function BuyerInvoices() {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_INVOICES.filter(i => i.id.toLowerCase().includes(q) || i.item.toLowerCase().includes(q))
  }, [search])

  const format = (v: number) => `$${v.toFixed(2)}`

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Payment history and downloadable invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoice or item" className="pl-9" />
            </div>
          </div>

          <div className="grid grid-cols-12 px-3 py-2 text-xs text-muted-foreground">
            <div className="col-span-3">Invoice</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-4">Item</div>
            <div className="col-span-2 text-right">Amount / Actions</div>
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
              {filtered.map((inv, i) => (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-12 items-center px-3 py-3">
                  <div className="col-span-3 font-mono text-sm">{inv.id}</div>
                  <div className="col-span-3">{inv.date}</div>
                  <div className="col-span-4 truncate">{inv.item}</div>
                  <div className="col-span-2 text-right">
                    <div className="inline-flex gap-2 items-center">
                      <span className="font-medium">{format(inv.amount)}</span>
                      <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button size="sm"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">No invoices found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}








