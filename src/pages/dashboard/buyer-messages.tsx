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

export function BuyerMessagesPage() {
  const { currentUser } = useAuth()
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>()
  const [selectedOtherParticipant, setSelectedOtherParticipant] = useState<{
    uid: string
    name: string
    avatar?: string
  } | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState<"all" | "starred" | "archived">("all")

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
      // Fallback if sidebar doesn't provide participant details
      setSelectedOtherParticipant(undefined)
    }
  }

  const handleBackToDashboard = () => {
    window.location.hash = "#dashboard/buyer"
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
                <p className="text-sm text-muted-foreground">Chat with sellers and creators</p>
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 max-w-lg px-8"
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-16 w-16 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Your Messages</h3>
                  <p className="text-muted-foreground text-lg">
                    Select a conversation from the sidebar to view messages, or start a new conversation with a seller.
                  </p>
                  <div className="pt-4 flex flex-col items-center gap-3">
                    <Button asChild className="mt-2">
                      <a href="#marketplace/index">Browse Marketplace</a>
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>All messages are secure and private</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

