import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, X, Clock } from "lucide-react"

interface Conversation {
  id: string
  title: string
  updatedAt: number
}

interface ChatSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversations: Conversation[]
  onSelectConversation: (id: string) => void
}

export function ChatSearchModal({
  open,
  onOpenChange,
  conversations,
  onSelectConversation
}: ChatSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return conversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(query) ||
        conv.id.toLowerCase().includes(query)
    )
  }, [searchQuery, conversations])

  const handleSelect = (id: string) => {
    onSelectConversation(id)
    onOpenChange(false)
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0a0d14] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Conversations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by conversation title..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-white/40 hover:text-white"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim() ? (
              filteredConversations.length > 0 ? (
                <div className="space-y-2">
                  {filteredConversations.map((conv) => (
                    <motion.button
                      key={conv.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelect(conv.id)}
                      className="w-full p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{conv.title}</p>
                          <p className="text-xs text-white/50 flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(conv.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <p className="text-sm text-white/60">No conversations found</p>
                  <p className="text-xs text-white/40 mt-1">
                    Try a different search term
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-sm text-white/60">Start typing to search conversations</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

