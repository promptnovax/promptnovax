import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  MessageSquare,
  Search,
  ShoppingBag,
  Star,
  TimerReset
} from "lucide-react"

interface PurchaseRecord {
  id: string
  title: string
  seller: string
  price: number
  status: "active" | "support" | "refunded"
  purchaseDate: string
  lastSync: string
  rating: number
  downloads: number
  tags: string[]
}

const PURCHASES: PurchaseRecord[] = [
  {
    id: "ORD-9812",
    title: "Advanced Code Review Assistant",
    seller: "CodeMaster Pro",
    price: 29.99,
    status: "active",
    purchaseDate: "2024-01-20",
    lastSync: "2h ago",
    rating: 4.8,
    downloads: 3,
    tags: ["Engineering", "Automation"]
  },
  {
    id: "ORD-9804",
    title: "Creative Writing Prompts Generator",
    seller: "Creative Minds",
    price: 19.99,
    status: "active",
    purchaseDate: "2024-01-18",
    lastSync: "1d ago",
    rating: 4.6,
    downloads: 1,
    tags: ["Content", "Story"]
  },
  {
    id: "ORD-9777",
    title: "Prompt Testing Add-on",
    seller: "Testing Lab",
    price: 12.0,
    status: "support",
    purchaseDate: "2024-01-15",
    lastSync: "Awaiting seller",
    rating: 4.2,
    downloads: 0,
    tags: ["Quality", "Automation"]
  },
  {
    id: "ORD-9755",
    title: "Social Media Content Calendar",
    seller: "Social Media Pro",
    price: 34.99,
    status: "refunded",
    purchaseDate: "2024-01-10",
    lastSync: "Closed",
    rating: 4.5,
    downloads: 2,
    tags: ["Marketing", "Campaign"]
  }
]

const SEGMENTS = [
  { value: "all", label: "All purchases" },
  { value: "active", label: "Active workflows" },
  { value: "support", label: "Seller support" },
  { value: "refunded", label: "Refunded" }
]

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

const statusBadge = (status: PurchaseRecord["status"]) => {
  if (status === "active") return <Badge className="bg-green-500">Active</Badge>
  if (status === "support") return <Badge className="bg-amber-500 text-white">Seller support</Badge>
  return <Badge variant="outline" className="text-muted-foreground">Refunded</Badge>
}

export function BuyerPurchasesPage() {
  const { success } = useToast()
  const [search, setSearch] = useState("")
  const [segment, setSegment] = useState(SEGMENTS[0].value)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [statusFilters, setStatusFilters] = useState<string[]>(["active", "support", "refunded"])

  const filteredPurchases = useMemo(() => {
    const q = search.toLowerCase()
    return PURCHASES.filter((purchase) => {
      const matchesSegment = segment === "all" || purchase.status === segment
      const matchesStatus = statusFilters.includes(purchase.status)
      const matchesQuery =
        purchase.title.toLowerCase().includes(q) ||
        purchase.seller.toLowerCase().includes(q) ||
        purchase.id.toLowerCase().includes(q)
      return matchesSegment && matchesStatus && matchesQuery
    })
  }, [search, segment, statusFilters])

  const totalSpend = PURCHASES.reduce((sum, purchase) => sum + purchase.price, 0)
  const activeCount = PURCHASES.filter((purchase) => purchase.status === "active").length
  const supportCount = PURCHASES.filter((purchase) => purchase.status === "support").length

  const toggleStatus = (value: string) => {
    setStatusFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleExport = () => {
    const headers = ["Order ID", "Title", "Seller", "Price", "Status", "Purchase Date", "Last Sync"]
    const rows = filteredPurchases.map((purchase) => [
      purchase.id,
      purchase.title,
      purchase.seller,
      purchase.price.toString(),
      purchase.status,
      purchase.purchaseDate,
      purchase.lastSync
    ])
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `buyer-purchases-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success("Export started", "Your CSV download has begun.")
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Purchases & Licenses
            </h1>
            <p className="text-muted-foreground">
              Audit every prompt you own, manage delivery and trigger follow-ups with sellers.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setFilterSheetOpen(true)}>
              <Filter className="h-4 w-4 mr-2" />
              Advanced filters
            </Button>
            <Button onClick={handleExport}>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly spend</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalSpend)}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            +12% vs last month • All inclusive of taxes
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active bundles</CardDescription>
            <CardTitle className="text-3xl">{activeCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            All workflows syncing correctly
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Support tickets linked</CardDescription>
            <CardTitle className="text-3xl">{supportCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
            <TimerReset className="h-4 w-4 text-amber-500" />
            Avg resolution under 12h
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Purchase ledger</CardTitle>
              <CardDescription>Search by order ID, seller, prompt or status</CardDescription>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative md:w-64">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search purchases"
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          <Tabs value={segment} onValueChange={setSegment} className="w-full mt-4">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
              {SEGMENTS.map((option) => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-12 px-3 py-2 text-xs text-muted-foreground">
            <div className="col-span-3">Prompt</div>
            <div className="col-span-2">Seller</div>
            <div className="col-span-1 text-right">Price</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Last sync</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <Separator />
          <div className="divide-y">
            {filteredPurchases.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="grid grid-cols-12 gap-3 px-3 py-4 text-sm"
              >
                <div className="col-span-3">
                  <div className="font-medium">{purchase.title}</div>
                  <div className="text-xs text-muted-foreground">{purchase.id}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {purchase.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-wide">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">{purchase.seller}</p>
                  <p className="text-xs text-muted-foreground">Purchased {purchase.purchaseDate}</p>
                </div>
                <div className="col-span-1 text-right font-semibold">
                  {formatCurrency(purchase.price)}
                </div>
                <div className="col-span-2">{statusBadge(purchase.status)}</div>
                <div className="col-span-2 text-sm text-muted-foreground">{purchase.lastSync}</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Files
                  </Button>
                </div>
              </motion.div>
            ))}
            {filteredPurchases.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-10">
                No purchases match your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Seller follow-ups</CardTitle>
            <CardDescription>Keep delivery conversations organized</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {PURCHASES.filter((p) => p.status !== "active").map((purchase) => (
              <div key={purchase.id} className="rounded-xl border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{purchase.title}</div>
                  {statusBadge(purchase.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Seller: {purchase.seller} • Ordered {purchase.purchaseDate}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last sync: {purchase.lastSync}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule check-in
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality signals</CardTitle>
            <CardDescription>Monitor ratings and usage momentum</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {PURCHASES.map((purchase) => (
              <div key={purchase.id} className="rounded-xl bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{purchase.title}</p>
                    <p className="text-xs text-muted-foreground">{purchase.seller}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400" />
                    {purchase.rating}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{purchase.downloads} downloads</span>
                  <span>Updated {purchase.lastSync}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Advanced filters</SheetTitle>
            <SheetDescription>Choose the license states to include throughout the ledger.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            {["active", "support", "refunded"].map((status) => (
              <div key={status} className="flex items-center gap-3 rounded-xl border p-3">
                <Checkbox id={`status-${status}`} checked={statusFilters.includes(status)} onCheckedChange={() => toggleStatus(status)} />
                <Label htmlFor={`status-${status}`} className="capitalize">{status}</Label>
              </div>
            ))}
          </div>
          <SheetFooter className="mt-6 gap-2">
            <Button variant="ghost" onClick={() => setStatusFilters(["active", "support", "refunded"])}>Reset</Button>
            <Button onClick={() => setFilterSheetOpen(false)}>Apply filters</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

