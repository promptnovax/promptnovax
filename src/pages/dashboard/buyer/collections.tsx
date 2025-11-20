import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  BookmarkCheck,
  CopyPlus,
  Heart,
  Layers3,
  ListPlus,
  Search,
  Share2,
  Sparkles,
  Users
} from "lucide-react"

interface Collection {
  id: string
  title: string
  prompts: number
  visibility: "Team" | "Private"
  tags: string[]
  updated: string
}

const collections: Collection[] = [
  { id: "COL-1001", title: "Fintech onboarding copilots", prompts: 12, visibility: "Team", tags: ["Fintech", "Product"], updated: "2h ago" },
  { id: "COL-1002", title: "Marketing launch kits", prompts: 9, visibility: "Team", tags: ["Marketing", "Campaign"], updated: "1d ago" },
  { id: "COL-1003", title: "Support macros", prompts: 6, visibility: "Private", tags: ["Support"], updated: "4d ago" }
]

const wishlist = [
  { title: "AI Chatbot Personality Designer", seller: "AI Innovators", price: "$39.00" },
  { title: "Social Media Content Calendar", seller: "Social Media Pro", price: "$34.99" },
  { title: "Voice of Customer Research Kit", seller: "Insights Lab", price: "$54.00" }
]

export function BuyerCollectionsPage() {
  const { success } = useToast()
  const [query, setQuery] = useState("")
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [newCollectionDialogOpen, setNewCollectionDialogOpen] = useState(false)
  const [importSource, setImportSource] = useState("")
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionNotes, setNewCollectionNotes] = useState("")
  const [newCollectionVisibility, setNewCollectionVisibility] = useState<"Team" | "Private">("Team")

  const filteredCollections = useMemo(() => {
    const q = query.toLowerCase()
    return collections.filter((collection) => collection.title.toLowerCase().includes(q))
  }, [query])

  const handleImport = () => {
    success("Import scheduled", "Your collection pack is being added to the workspace.")
    setImportDialogOpen(false)
    setImportSource("")
  }

  const handleCreateCollection = () => {
    if (!newCollectionName) return
    success("Collection created", `${newCollectionName} is ready for your team.`)
    setNewCollectionDialogOpen(false)
    setNewCollectionName("")
    setNewCollectionNotes("")
    setNewCollectionVisibility("Team")
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <Layers3 className="h-6 w-6 text-primary" />
              Collections & wishlist
            </h1>
            <p className="text-muted-foreground">
              Curate prompt packs, share with teams, and convert wishlist items into briefs.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <ListPlus className="h-4 w-4 mr-2" />
              Import set
            </Button>
            <Button onClick={() => setNewCollectionDialogOpen(true)}>
              <CopyPlus className="h-4 w-4 mr-2" />
              New collection
            </Button>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>Organize prompts by workflow, team or campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or tag"
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share with org
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCollections.map((collection, idx) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{collection.title}</p>
                    <p className="text-xs text-muted-foreground">{collection.updated} • {collection.prompts} prompts</p>
                  </div>
                  <Badge variant="secondary">{collection.visibility}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {collection.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Open
                  </Button>
                  <Button variant="outline" size="sm">
                    Duplicate
                  </Button>
                </div>
              </motion.div>
            ))}
            {filteredCollections.length === 0 && (
              <div className="col-span-full text-center text-sm text-muted-foreground py-6">
                No collections match your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wishlist desk</CardTitle>
          <CardDescription>Anything starred or saved from the marketplace lands here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wishlist" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="briefs">Briefs</TabsTrigger>
              <TabsTrigger value="shared">Shared with me</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="wishlist" className="mt-6 space-y-4">
              {wishlist.map((item) => (
                <div key={item.title} className="rounded-2xl border p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.seller}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{item.price}</span>
                    <Button variant="outline" size="sm">
                      Move to cart
                    </Button>
                    <Button size="sm">
                      <Heart className="h-3 w-3 mr-1" />
                      Keep
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="briefs" className="mt-6">
              <div className="rounded-2xl border border-dashed p-8 text-center space-y-3">
                <BookmarkCheck className="h-8 w-8 text-primary mx-auto" />
                <p className="font-semibold">No briefs generated yet</p>
                <p className="text-sm text-muted-foreground">
                  Promote wishlist prompts to a creative brief and send to prompt engineers instantly.
                </p>
                <Button>
                  Generate brief
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="shared" className="mt-6">
              <ScrollArea className="h-48 pr-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="rounded-xl border p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Collection #{idx + 1}</p>
                      <Badge variant="secondary">New</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Shared by Operations · {new Date(Date.now() - idx * 3600_000).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                      <Button size="sm">Add to library</Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="archived" className="mt-6 text-sm text-muted-foreground">
              No archived items. Anything removed from wishlist appears here for 30 days.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-dashed p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">Need help curating buyer-ready packs?</p>
          <p className="text-sm text-muted-foreground">
            Partner with marketplace strategists to design themed bundles for your team.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Invite collaborators
          </Button>
          <Button>
            <Sparkles className="h-4 w-4 mr-2" />
            Ask AI curator
          </Button>
        </div>
      </div>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import a collection pack</DialogTitle>
            <DialogDescription>Paste a share link or upload a CSV of prompts to create a curated set.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="import-link">Share link or CSV path</Label>
              <Input id="import-link" placeholder="https://..." value={importSource} onChange={(e) => setImportSource(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="import-notes">Notes</Label>
              <Textarea id="import-notes" placeholder="Who should use this? Any context for the team?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
            <Button disabled={!importSource} onClick={handleImport}>Add to workspace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newCollectionDialogOpen} onOpenChange={setNewCollectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new collection</DialogTitle>
            <DialogDescription>Bundle prompts for a workflow, launch, or stakeholder group.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection name</Label>
              <Input id="collection-name" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} placeholder="e.g. Q2 Product Launch" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-notes">Description</Label>
              <Textarea id="collection-notes" value={newCollectionNotes} onChange={(e) => setNewCollectionNotes(e.target.value)} placeholder="Add context or goals for this pack." />
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={newCollectionVisibility} onValueChange={(value: "Team" | "Private") => setNewCollectionVisibility(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team">Share with team</SelectItem>
                  <SelectItem value="Private">Private draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewCollectionDialogOpen(false)}>Cancel</Button>
            <Button disabled={!newCollectionName} onClick={handleCreateCollection}>Create collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

