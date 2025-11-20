import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Sparkles, TrendingUp, Users, Zap, Filter, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MarketplaceHeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function MarketplaceHeader({ searchQuery = "", onSearchChange }: MarketplaceHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Sync local search with prop changes
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)
    onSearchChange?.(value)
  }

  const clearSearch = () => {
    setLocalSearch("")
    onSearchChange?.("")
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-8">
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">Professional AI Prompt Marketplace</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Explore Premium AI Prompts
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover high-quality prompts with professional 4K images from top creators worldwide
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">1,200+</span>
                </div>
                <p className="text-sm text-muted-foreground">Active Prompts</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <p className="text-sm text-muted-foreground">Creators</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">10K+</span>
                </div>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </div>
            </motion.div>

            {/* Advanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  value={localSearch}
                  onChange={handleSearchChange}
                  placeholder="Search prompts by title, description, tags, creator name, or category..."
                  className="w-full pl-12 pr-12 py-6 text-base rounded-2xl border-2 border-border bg-background/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 shadow-lg hover:shadow-xl"
                />
                {localSearch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Search Suggestions/Hints */}
              {!localSearch && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                  <span>Quick searches:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLocalSearch("code")
                      onSearchChange?.("code")
                    }}
                    className="h-7 text-xs hover:text-primary"
                  >
                    Code
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLocalSearch("design")
                      onSearchChange?.("design")
                    }}
                    className="h-7 text-xs hover:text-primary"
                  >
                    Design
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLocalSearch("marketing")
                      onSearchChange?.("marketing")
                    }}
                    className="h-7 text-xs hover:text-primary"
                  >
                    Marketing
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLocalSearch("ai")
                      onSearchChange?.("ai")
                    }}
                    className="h-7 text-xs hover:text-primary"
                  >
                    AI & ML
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
