import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  X,
  Grid3X3,
  List,
  SlidersHorizontal
} from "lucide-react"

interface FiltersBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedDifficulty: string
  onDifficultyChange: (difficulty: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  resultCount: number
  onClearFilters: () => void
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "development", label: "Development" },
  { value: "writing", label: "Writing" },
  { value: "business", label: "Business" },
  { value: "ai", label: "AI & ML" },
  { value: "marketing", label: "Marketing" },
  { value: "data", label: "Data Science" },
  { value: "design", label: "Design" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health & Fitness" },
  { value: "other", label: "Other" }
]

const difficulties = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
]

const sortOptions = [
  { value: "newest", label: "Newest First", icon: SortDesc },
  { value: "oldest", label: "Oldest First", icon: SortAsc },
  { value: "most_liked", label: "Most Liked", icon: SortDesc },
  { value: "most_saved", label: "Most Saved", icon: SortDesc },
  { value: "alphabetical", label: "A-Z", icon: SortAsc }
]

export function FiltersBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
  onClearFilters
}: FiltersBarProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  // Sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const hasActiveFilters = selectedCategory !== "all" || selectedDifficulty !== "all" || searchQuery.trim() !== ""

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isSticky ? 'sticky top-0 z-40' : ''}`}
    >
      <Card className={`${isSticky ? 'shadow-lg border-primary/20' : ''} transition-all duration-200`}>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-4">
                {/* Advanced Search */}
                <div className="flex-1 max-w-xl">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Search by title, description, tags, creator, or category..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-10 pr-10 border-2 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                  <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(diff => (
                        <SelectItem key={diff.value} value={diff.value}>
                          {diff.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onViewModeChange("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onViewModeChange("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onClearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            <div className="lg:hidden space-y-3">
              {/* Search and Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Search prompts, creators, tags..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-10 pr-10 border-2 focus:border-primary/50"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Options */}
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 border-t"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={selectedCategory} onValueChange={onCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(diff => (
                          <SelectItem key={diff.value} value={diff.value}>
                            {diff.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={onSortChange}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => {
                          const Icon = option.icon
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("grid")}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("list")}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onClearFilters}
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Results Count and Active Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {resultCount} prompt{resultCount !== 1 ? 's' : ''} found
                </span>
                
                {hasActiveFilters && (
                  <div className="flex items-center gap-2">
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.value === selectedCategory)?.label}
                      </Badge>
                    )}
                    {selectedDifficulty !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {difficulties.find(d => d.value === selectedDifficulty)?.label}
                      </Badge>
                    )}
                    {searchQuery.trim() && (
                      <Badge variant="secondary" className="text-xs">
                        "{searchQuery}"
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                Sorted by {sortOptions.find(s => s.value === sortBy)?.label}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
