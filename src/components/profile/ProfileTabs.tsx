import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateProductImage, generateProductThumbnail, getCategoryPlaceholder } from "@/lib/marketplaceImages"
import { 
  FileText,
  User,
  Users,
  UserPlus,
  Star,
  Download,
  Eye,
  Calendar,
  Tag,
  DollarSign,
  Heart,
  ImageIcon,
  ZoomIn,
  ShoppingCart
} from "lucide-react"

interface UserData {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  followers: string[]
  following: string[]
  createdAt: any
  totalPrompts?: number
  totalLikes?: number
  totalDownloads?: number
}

interface PromptData {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  price: number
  content: string
  imageUrl?: string
  sellerId: string
  sellerEmail: string
  createdAt: any
  likes: number
  downloads: number
  status: string
}

interface ProfileTabsProps {
  user: UserData
  prompts: PromptData[]
  followers: UserData[]
  following: UserData[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProfileTabs({ 
  user, 
  prompts, 
  followers, 
  following, 
  activeTab, 
  onTabChange 
}: ProfileTabsProps) {
  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      development: "Development",
      writing: "Writing",
      business: "Business",
      ai: "AI & ML",
      marketing: "Marketing",
      data: "Data Science",
      design: "Design",
      education: "Education",
      health: "Health & Fitness",
      other: "Other"
    }
    return categories[category] || category
  }

  const handlePromptClick = (promptId: string) => {
    window.location.hash = `#marketplace/${promptId}`
  }

  const handleUserClick = (userId: string) => {
    window.location.hash = `#user/${userId}`
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="prompts" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Prompts ({prompts.length})
        </TabsTrigger>
        <TabsTrigger value="about" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          About
        </TabsTrigger>
        <TabsTrigger value="followers" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Followers ({followers.length})
        </TabsTrigger>
        <TabsTrigger value="following" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Following ({following.length})
        </TabsTrigger>
      </TabsList>

      {/* Prompts Tab */}
      <TabsContent value="prompts" className="mt-6">
        {prompts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No prompts yet</h3>
              <p className="text-muted-foreground">
                {user.displayName} hasn't created any prompts yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prompts.map((prompt, index) => {
              // Generate image if not exists
              const productImage = prompt.imageUrl || generateProductImage(prompt.category, prompt.id, prompt.title)
              
              return (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-primary/20 group"
                        onClick={() => handlePromptClick(prompt.id)}>
                    <div className="relative overflow-hidden bg-muted">
                      {productImage ? (
                        <>
                          <img
                            src={productImage}
                            alt={prompt.title}
                            loading="lazy"
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            style={{
                              imageRendering: 'high-quality',
                              objectFit: 'cover'
                            }}
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePromptClick(prompt.id)
                              }}
                            >
                              <ZoomIn className="h-4 w-4 mr-2" />
                              View Product
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:via-primary/15 group-hover:to-primary/10 transition-all duration-300">
                          <div className="text-center">
                            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                              {getCategoryPlaceholder(prompt.category)}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">{getCategoryLabel(prompt.category)}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge variant="secondary" className="capitalize backdrop-blur-sm bg-background/80">
                          {getCategoryLabel(prompt.category)}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="default" className="bg-primary backdrop-blur-sm">
                          {formatPrice(prompt.price)}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {prompt.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" />
                          {prompt.likes}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Download className="h-3 w-3" />
                          {prompt.downloads}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Created {formatDate(prompt.createdAt)}</span>
                        <span>{prompt.downloads} downloads</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </TabsContent>

      {/* About Tab */}
      <TabsContent value="about" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>About {user.displayName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user.bio ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No bio available yet.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div className="space-y-4">
                <h4 className="font-semibold">Profile Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Prompts</span>
                    <span className="font-medium">{user.totalPrompts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Likes</span>
                    <span className="font-medium">{user.totalLikes || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Downloads</span>
                    <span className="font-medium">{user.totalDownloads || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Followers</span>
                    <span className="font-medium">{user.followers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Following</span>
                    <span className="font-medium">{user.following.length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Account Info</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-medium">{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Followers Tab */}
      <TabsContent value="followers" className="mt-6">
        {followers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No followers yet</h3>
              <p className="text-muted-foreground">
                {user.displayName} doesn't have any followers yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followers.map((follower, index) => (
              <motion.div
                key={follower.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleUserClick(follower.uid)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={follower.photoURL} />
                        <AvatarFallback>
                          {follower.displayName?.charAt(0) || follower.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{follower.displayName}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {follower.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {follower.followers?.length || 0} followers
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Following Tab */}
      <TabsContent value="following" className="mt-6">
        {following.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <UserPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Not following anyone</h3>
              <p className="text-muted-foreground">
                {user.displayName} isn't following anyone yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {following.map((followedUser, index) => (
              <motion.div
                key={followedUser.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleUserClick(followedUser.uid)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={followedUser.photoURL} />
                        <AvatarFallback>
                          {followedUser.displayName?.charAt(0) || followedUser.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{followedUser.displayName}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {followedUser.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {followedUser.followers?.length || 0} followers
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
