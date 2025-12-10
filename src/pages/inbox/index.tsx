import { useState } from "react"
import { motion } from "framer-motion"
import { InboxSidebar } from "@/components/chat/InboxSidebar"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useGuestChat } from "@/context/GuestChatContext"
import { 
  MessageCircle,
  ArrowLeft,
  Users,
  Search,
  MoreVertical,
  Archive
} from "lucide-react"

export function InboxIndex() {
  const { currentUser } = useAuth()
  const { guestUser } = useGuestChat()
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>()
  const [selectedOtherParticipant, setSelectedOtherParticipant] = useState<{
    uid: string
    name: string
    avatar?: string
  } | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState<"all" | "starred" | "archived">("all")

  const canAccess = !!currentUser || !!guestUser

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
      setSelectedOtherParticipant(undefined)
    }
  }

  const handleBackToMarketplace = () => {
    window.location.hash = "#marketplace/index"
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-16 text-center space-y-4">
            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Start Messaging</h3>
              <p className="text-muted-foreground mb-6">
                Message creators directly from product pages or log in to access your conversations.
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <a href="#marketplace/index">Browse Marketplace</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#login">Log In</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* WhatsApp Style: Left Sidebar - Conversations List */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col bg-background border-r border-border">
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Messages
            </h2>
            <div className="flex items-center gap-1">
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
              placeholder="Search or start new chat"
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
            filterMode={filterMode}
          />
        </div>
      </div>

      {/* WhatsApp Style: Right Side - Chat Window */}
      <div className="flex-1 flex flex-col bg-muted/20">
        {selectedConversationId ? (
          <ChatWindow
            conversationId={selectedConversationId}
            otherParticipant={selectedOtherParticipant}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 max-w-md px-8"
            >
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the left to start chatting, or message a creator from their profile page.
                </p>
              </div>
              <Button asChild className="mt-6">
                <a href="#marketplace/index">Browse Marketplace</a>
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
