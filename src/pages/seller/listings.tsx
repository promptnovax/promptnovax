import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "@/components/ui/link"
import { 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  DollarSign,
  MessageSquare,
  Calendar,
  BarChart3
} from "lucide-react"

export function SellerListingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const listings = [
    {
      id: "1",
      title: "Advanced Content Marketing Strategy",
      description: "Comprehensive prompt for creating engaging content marketing campaigns with data-driven insights.",
      price: 29.99,
      category: "marketing",
      status: "active",
      views: 1234,
      sales: 45,
      revenue: 1349.55,
      rating: 4.9,
      createdAt: "2024-01-15",
      lastUpdated: "2024-01-20",
      image: "📊",
      tags: ["content", "marketing", "strategy"]
    },
    {
      id: "2",
      title: "Python Code Review Assistant",
      description: "AI-powered prompt for comprehensive code reviews, bug detection, and optimization suggestions.",
      price: 19.99,
      category: "coding",
      status: "active",
      views: 892,
      sales: 32,
      revenue: 639.68,
      rating: 4.8,
      createdAt: "2024-01-10",
      lastUpdated: "2024-01-18",
      image: "🐍",
      tags: ["python", "code-review", "debugging"]
    },
    {
      id: "3",
      title: "Creative Story Generator",
      description: "Generate compelling stories with character development, plot twists, and narrative structure.",
      price: 24.99,
      category: "art",
      status: "draft",
      views: 0,
      sales: 0,
      revenue: 0,
      rating: 0,
      createdAt: "2024-01-22",
      lastUpdated: "2024-01-22",
      image: "📚",
      tags: ["creative", "storytelling", "fiction"]
    },
    {
      id: "4",
      title: "Business Plan Generator",
      description: "Professional business plan creation with market analysis, financial projections, and strategy.",
      price: 39.99,
      category: "business",
      status: "paused",
      views: 445,
      sales: 8,
      revenue: 319.92,
      rating: 4.7,
      createdAt: "2024-01-05",
      lastUpdated: "2024-01-19",
      image: "💼",
      tags: ["business", "planning", "strategy"]
    },
    {
      id: "5",
      title: "AI Model Fine-tuning Guide",
      description: "Step-by-step instructions for fine-tuning language models for specific use cases.",
      price: 49.99,
      category: "ai",
      status: "active",
      views: 678,
      sales: 12,
      revenue: 599.88,
      rating: 4.8,
      createdAt: "2024-01-12",
      lastUpdated: "2024-01-21",
      image: "🤖",
      tags: ["ai", "machine-learning", "fine-tuning"]
    }
  ]

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "paused":
        return <Badge variant="outline">Paused</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPerformanceIcon = (views: number, sales: number) => {
    if (sales === 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    const conversionRate = (sales / views) * 100
    return conversionRate > 5 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-yellow-500" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Listings</h1>
          <p className="text-muted-foreground">View and manage all your published prompts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="#seller/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="#seller/upload">
              Upload New Prompt
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="revenue">Highest Revenue</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{listing.image}</div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(listing.status)}
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight">
                  <Link href={`#marketplace/${listing.id}`}>
                    {listing.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {listing.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between pt-0">
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{listing.views.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{listing.sales}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Sales</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getPerformanceIcon(listing.views, listing.sales)}
                        <span className="font-medium">${listing.revenue.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(listing.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Updated</div>
                    </div>
                  </div>

                  {/* Rating */}
                  {listing.rating > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{listing.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({listing.sales} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`#seller/edit/${listing.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    {listing.status === "active" ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold mb-2">No listings found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your search or filters"
              : "Get started by uploading your first prompt"
            }
          </p>
          <Button asChild>
            <Link href="#seller/upload">Upload Your First Prompt</Link>
          </Button>
        </motion.div>
      )}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Listing Summary</CardTitle>
            <CardDescription>
              Overview of your marketplace performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {listings.filter(l => l.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {listings.reduce((sum, l) => sum + l.views, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {listings.reduce((sum, l) => sum + l.sales, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Sales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ${listings.reduce((sum, l) => sum + l.revenue, 0).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
