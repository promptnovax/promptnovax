import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PromptCard } from "@/components/prompts/PromptCard"
import { 
  Loader2,
  FileText,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Grid3X3,
  List
} from "lucide-react"

interface PromptData {
  id: string
  uid: string
  title: string
  description: string
  category: string
  tags: string[]
  difficulty: string
  visibility: boolean
  previewImageURL?: string
  fileURL?: string
  likes: string[]
  saves: string[]
  createdAt: any
  lastEditedAt?: any
  creatorName?: string
  creatorAvatar?: string
}

interface PromptGridProps {
  prompts: PromptData[]
  loading: boolean
  error: string | null
  viewMode: "grid" | "list"
  onLoadMore?: () => void
  hasMore?: boolean
  onRefresh?: () => void
  onLike?: (promptId: string) => void
  onSave?: (promptId: string) => void
  onShare?: (promptId: string) => void
  onFollow?: (userId: string) => void
}

export function PromptGrid({
  prompts,
  loading,
  error,
  viewMode,
  onLoadMore,
  hasMore = false,
  onRefresh,
  onLike,
  onSave,
  onShare,
  onFollow
}: PromptGridProps) {
  const handlePromptClick = (prompt: PromptData) => {
    // Navigate directly to marketplace detail page
    window.location.hash = `#marketplace/${prompt.id}`
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Prompts</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading && prompts.length === 0) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-muted rounded-full"></div>
                      <div className="h-3 bg-muted rounded w-20"></div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (prompts.length === 0 && !loading) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="py-20 text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-16 w-16 text-primary/50" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No prompts found</h3>
              <p className="text-muted-foreground text-lg">
                We couldn't find any prompts matching your search criteria.
              </p>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your search terms, filters, or categories to discover more prompts.
              </p>
            </div>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="lg" className="mt-6">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Mode Indicator */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          {viewMode === "grid" ? (
            <Grid3X3 className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
          <span className="capitalize">{viewMode} View</span>
        </div>
        <span className="font-medium text-foreground">
          {prompts.length} {prompts.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Prompt Grid */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      }`}>
        <AnimatePresence>
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <div onClick={() => handlePromptClick(prompt)}>
                <PromptCard
                  prompt={prompt}
                  showActions={true}
                  onEdit={() => {}} // Not used in marketplace
                  onDelete={() => {}} // Not used in marketplace
                  onLike={onLike}
                  onSave={onSave}
                  onShare={onShare}
                  className="cursor-pointer"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Prompts"
            )}
          </Button>
        </div>
      )}

      {/* Loading indicator for additional content */}
      {loading && prompts.length > 0 && (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      )}

    </div>
  )
}
