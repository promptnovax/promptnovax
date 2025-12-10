import { useState } from "react"
import { motion } from "framer-motion"
import { InboxSidebar } from "@/components/chat/InboxSidebar"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { 
  MessageCircle,
  ArrowLeft,
  Search,
  MoreVertical,
  Archive,
  Filter
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SellerMessagesPage() {
  const { currentUser } = useAuth()
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>()
  const [selectedOtherParticipant, setSelectedOtherParticipant] = useState<{
    uid: string
    name: string
    avatar?: string
  } | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState<"all" | "starred" | "archived">("all")
  const quickReplies = [
    "Hi! I'm interested",
    "Tell me more",
    "What's included?"
  ]

  const handleConversationSelect = (
    conversationId: string,
    otherParticipant?: {
      uid: string
      name: string
      avatar?: string
    }
  ) => {
    setSelectedConversationId(conversationId)
    if (otherParticipant) {
      setSelectedOtherParticipant(otherParticipant)
    } else {
      // Fallback for any conversations without participant metadata
      setSelectedOtherParticipant(undefined)
    }
  }

  const handleBackToDashboard = () => {
    window.location.hash = "#dashboard/seller"
  }

  const handleQuickReplyCopy = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  }

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b bg-background z-10 flex-shrink-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  Messages
                </h1>
                <p className="text-sm text-muted-foreground">Manage conversations with buyers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Instagram-like Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Conversations List */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col bg-background border-r border-border min-w-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Conversations</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setFilterMode("all")}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant={filterMode === "archived" ? "default" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setFilterMode(filterMode === "archived" ? "all" : "archived")}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <InboxSidebar
              onConversationSelect={handleConversationSelect}
              selectedConversationId={selectedConversationId}
              searchQuery={searchQuery}
              isDashboard={true}
              filterMode={filterMode}
            />
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className="flex-1 flex flex-col bg-muted/20">
          {selectedConversationId ? (
            <ChatWindow
              conversationId={selectedConversationId}
              otherParticipant={selectedOtherParticipant}
              isDashboard={true}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-3xl px-6"
              >
                <Card className="border-primary/10 bg-card/80 backdrop-blur">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 grid place-items-center shadow">
                        <MessageCircle className="h-7 w-7 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">CodeMaster Pro</h3>
                          <Badge variant="secondary">Verified</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Tap a conversation to view profile or reply. Buyers see your responses instantly.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span>No messages yet — start the conversation.</span>
                        </div>
                        <div className="rounded-2xl border bg-muted/40 p-4 text-left space-y-2">
                          <div className="text-sm text-muted-foreground">Suggested openers</div>
                          <div className="flex flex-wrap gap-2">
                            {quickReplies.map((reply) => (
                              <Button
                                key={reply}
                                variant="secondary"
                                size="sm"
                                className="rounded-full"
                                onClick={() => handleQuickReplyCopy(reply)}
                              >
                                {reply}
                              </Button>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Click to copy and paste into a conversation once you select a buyer.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-muted/30 p-4 space-y-3">
                        <div className="text-sm font-semibold">Inbox tips</div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Keep replies under 5 minutes during active hours.</li>
                          <li>• Share inclusions and delivery timelines early.</li>
                          <li>• Use templates for pricing and scope confirmation.</li>
                        </ul>
                        <Button variant="outline" size="sm" className="w-full" onClick={handleBackToDashboard}>
                          View Dashboard
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

