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
  Star,
  Flag,
  CheckCircle,
  Trash2,
  RefreshCw
} from "lucide-react"

interface ReviewRow {
  id: string
  buyer: string
  product: string
  rating: number
  comment: string
  status: "visible" | "hidden" | "flagged"
  date: string
}

const MOCK_REVIEWS: ReviewRow[] = [
  { id: "REV-501", buyer: "Ali R.", product: "Advanced Code Review Assistant", rating: 5, comment: "Amazing quality!", status: "visible", date: "2024-01-22" },
  { id: "REV-500", buyer: "Sara K.", product: "Security Code Scanner", rating: 4, comment: "Very useful.", status: "visible", date: "2024-01-21" },
  { id: "REV-499", buyer: "John D.", product: "API Documentation Generator", rating: 2, comment: "Not as expected.", status: "flagged", date: "2024-01-20" },
]

export function SellerReviews() {
  const [search, setSearch] = useState("")
  const [rating, setRating] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_REVIEWS.filter(r =>
      (status === 'all' || r.status === status) &&
      (rating === 'all' || r.rating === Number(rating)) &&
      (r.id.toLowerCase().includes(q) || r.buyer.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q))
    )
  }, [search, rating, status])

  const stars = (n: number) => (
    <div className="inline-flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < n ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>Review moderation and visibility control</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search buyer, product, comment" className="pl-9" />
            </div>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {[5,4,3,2,1].map(r => (
                  <SelectItem key={r} value={String(r)}>{r} stars</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Header */}
          <div className="grid grid-cols-12 px-3 py-2 text-xs text-muted-foreground">
            <div className="col-span-2">Review</div>
            <div className="col-span-2">Buyer</div>
            <div className="col-span-3">Product</div>
            <div className="col-span-2">Rating</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
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
              {filtered.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-12 items-center px-3 py-3">
                  <div className="col-span-2 font-mono text-sm">{r.id}</div>
                  <div className="col-span-2">{r.buyer}</div>
                  <div className="col-span-3 truncate">{r.product}</div>
                  <div className="col-span-2">{stars(r.rating)}</div>
                  <div className="col-span-1">
                    <Badge variant={r.status === 'visible' ? 'default' : 'secondary'} className={r.status === 'flagged' ? 'bg-red-500' : ''}>{r.status}</Badge>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="outline" size="sm"><Flag className="h-4 w-4" /></Button>
                      <Button size="sm"><CheckCircle className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">No reviews found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}








