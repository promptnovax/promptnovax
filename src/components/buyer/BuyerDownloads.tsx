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
  Copy,
  KeyRound
} from "lucide-react"

interface DownloadRow {
  id: string
  item: string
  key: string
  lastDownloaded: string
}

const MOCK_DOWNLOADS: DownloadRow[] = [
  { id: "DL-9001", item: "Advanced Code Review Assistant", key: "PX-KEY-92AB3", lastDownloaded: "2024-01-22" },
  { id: "DL-9000", item: "Creative Writing Prompts Generator", key: "PX-KEY-1C9ZX", lastDownloaded: "2024-01-18" },
]

export function BuyerDownloads() {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_DOWNLOADS.filter(d => d.id.toLowerCase().includes(q) || d.item.toLowerCase().includes(q) || d.key.toLowerCase().includes(q))
  }, [search])

  const copy = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Downloads</CardTitle>
              <CardDescription>Your keys and download history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search key or item" className="pl-9" />
            </div>
          </div>

          <div className="grid grid-cols-12 px-3 py-2 text-xs text-muted-foreground">
            <div className="col-span-3">Download</div>
            <div className="col-span-5">Item</div>
            <div className="col-span-2">Key</div>
            <div className="col-span-2 text-right">Last / Actions</div>
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
              {filtered.map((dl, i) => (
                <motion.div key={dl.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-12 items-center px-3 py-3">
                  <div className="col-span-3 font-mono text-sm">{dl.id}</div>
                  <div className="col-span-5 truncate">{dl.item}</div>
                  <div className="col-span-2 inline-flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <code className="text-xs">{dl.key}</code>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="inline-flex gap-2 items-center">
                      <span className="text-xs text-muted-foreground">{dl.lastDownloaded}</span>
                      <Button variant="outline" size="sm" onClick={() => copy(dl.key)}><Copy className="h-4 w-4" /></Button>
                      <Button size="sm"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">No downloads found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}








