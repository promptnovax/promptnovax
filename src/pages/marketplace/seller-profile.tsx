import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { platformDb, isSupabaseConfigured } from "@/lib/platformClient"
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "@/lib/platformStubs/firestore"
import { 
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Award,
  ShoppingBag,
  Users,
  TrendingUp,
  MessageCircle,
  UserPlus,
  UserCheck,
  Briefcase,
  ExternalLink,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Heart,
  Download
} from "lucide-react"

interface SellerProfileProps {
  sellerId: string
}

export function SellerProfilePage({ sellerId }: SellerProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const { currentUser } = useAuth()
  const { success, error } = useToast()

  // Mock seller data
  const getSellerData = (id: string) => {
    const sellers = {
      "1": {
        id: "1",
        name: "CodeMaster Pro",
        username: "@codemasterpro",
        avatar: "https://github.com/shadcn.png",
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop",
        verified: true,
        title: "Senior Software Engineer & AI Specialist",
        location: "San Francisco, CA",
        memberSince: "March 2023",
        bio: "Professional software engineer with 10+ years of experience in code quality and best practices. Specialized in helping developers write better, more secure code. Passionate about AI and automation.",
        stats: {
          totalSales: 15420,
          followers: 8934,
          following: 234,
          prompts: 47,
          rating: 4.9,
          reviews: 1247,
          responseTime: "2 hours",
          completionRate: 98
        },
        skills: ["JavaScript", "Python", "TypeScript", "React", "Node.js", "AI/ML", "Code Review", "Security"],
        socials: {
          website: "https://codemasterpro.dev",
          twitter: "https://twitter.com/codemasterpro",
          linkedin: "https://linkedin.com/in/codemasterpro",
          email: "contact@codemasterpro.dev"
        },
        prompts: [
          {
            id: "1",
            title: "Advanced Code Review Assistant",
            description: "Get comprehensive code reviews with suggestions",
            thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
            price: 29.99,
            rating: 4.8,
            downloads: 2341,
            featured: true
          },
          {
            id: "4",
            title: "Security Code Scanner",
            description: "Identify security vulnerabilities in your code",
            thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
            price: 34.99,
            rating: 4.7,
            downloads: 1234,
            featured: false
          },
          {
            id: "5",
            title: "API Documentation Generator",
            description: "Generate comprehensive API documentation",
            thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
            price: 24.99,
            rating: 4.6,
            downloads: 987,
            featured: false
          }
        ],
        reviews: [
          {
            id: "1",
            author: "John Doe",
            avatar: "https://github.com/shadcn.png",
            rating: 5,
            date: "2024-01-20",
            comment: "Excellent prompts! Very detailed and helpful. Highly recommend!",
            promptTitle: "Advanced Code Review Assistant"
          },
          {
            id: "2",
            author: "Jane Smith",
            avatar: "https://github.com/shadcn.png",
            rating: 5,
            date: "2024-01-18",
            comment: "Great quality work. Fast response and very professional.",
            promptTitle: "Security Code Scanner"
          },
          {
            id: "3",
            author: "Mike Johnson",
            avatar: "https://github.com/shadcn.png",
            rating: 4,
            date: "2024-01-15",
            comment: "Very useful prompts. Would love to see more advanced features.",
            promptTitle: "API Documentation Generator"
          }
        ],
        achievements: [
          { icon: Award, title: "Top Seller", description: "Ranked in top 1% of sellers" },
          { icon: Star, title: "5-Star Rating", description: "Maintained 4.9+ rating" },
          { icon: Users, title: "Popular Creator", description: "8K+ followers" },
          { icon: ShoppingBag, title: "15K+ Sales", description: "Best selling prompts" }
        ]
      },
      "2": {
        id: "2",
        name: "Creative Minds",
        username: "@creativeminds",
        avatar: "https://github.com/shadcn.png",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop",
        verified: true,
        title: "Creative Writer & Content Specialist",
        location: "New York, NY",
        memberSince: "May 2023",
        bio: "Professional creative writer with expertise in storytelling, content creation, and AI-assisted writing. Passionate about helping others unlock their creative potential.",
        stats: {
          totalSales: 8920,
          followers: 4567,
          following: 189,
          prompts: 32,
          rating: 4.8,
          reviews: 567,
          responseTime: "1 hour",
          completionRate: 96
        },
        skills: ["Creative Writing", "Content Creation", "Storytelling", "AI Writing", "Blogging", "Social Media"],
        socials: {
          website: "https://creativeminds.blog",
          twitter: "https://twitter.com/creativeminds",
          linkedin: "https://linkedin.com/in/creativeminds",
          email: "hello@creativeminds.blog"
        },
        prompts: [
          {
            id: "2",
            title: "Creative Writing Prompts Generator",
            description: "Generate unique and inspiring writing prompts",
            thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
            price: 19.99,
            rating: 4.6,
            downloads: 1876,
            featured: true
          }
        ],
        reviews: [
          {
            id: "1",
            author: "Alice Johnson",
            avatar: "https://github.com/shadcn.png",
            rating: 5,
            date: "2024-01-19",
            comment: "Amazing creative prompts! Really helped me break through writer's block.",
            promptTitle: "Creative Writing Prompts Generator"
          }
        ],
        achievements: [
          { icon: Award, title: "Creative Excellence", description: "Top creative content creator" },
          { icon: Star, title: "4.8+ Rating", description: "Consistently high ratings" },
          { icon: Users, title: "4K+ Followers", description: "Growing community" },
          { icon: ShoppingBag, title: "8K+ Sales", description: "Popular prompts" }
        ]
      },
      "3": {
        id: "3",
        name: "Business Solutions",
        username: "@bizsolutions",
        avatar: "https://github.com/shadcn.png",
        coverImage: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&h=400&fit=crop",
        verified: true,
        title: "Business Consultant & Template Expert",
        location: "London, UK",
        memberSince: "February 2023",
        bio: "Business consultant specializing in professional templates, email communications, and business process optimization. Helping businesses communicate more effectively.",
        stats: {
          totalSales: 12300,
          followers: 6789,
          following: 156,
          prompts: 28,
          rating: 4.9,
          reviews: 892,
          responseTime: "3 hours",
          completionRate: 99
        },
        skills: ["Business Writing", "Email Templates", "Process Optimization", "Professional Communication", "Project Management"],
        socials: {
          website: "https://bizsolutions.pro",
          twitter: "https://twitter.com/bizsolutions",
          linkedin: "https://linkedin.com/in/bizsolutions",
          email: "contact@bizsolutions.pro"
        },
        prompts: [
          {
            id: "3",
            title: "Business Email Templates",
            description: "Professional email templates for business scenarios",
            thumbnail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop",
            price: 24.99,
            rating: 4.9,
            downloads: 3456,
            featured: true
          }
        ],
        reviews: [
          {
            id: "1",
            author: "Robert Wilson",
            avatar: "https://github.com/shadcn.png",
            rating: 5,
            date: "2024-01-18",
            comment: "Excellent business templates! Saved me hours of work.",
            promptTitle: "Business Email Templates"
          }
        ],
        achievements: [
          { icon: Award, title: "Business Expert", description: "Top business consultant" },
          { icon: Star, title: "4.9+ Rating", description: "Exceptional quality" },
          { icon: Users, title: "6K+ Followers", description: "Business community" },
          { icon: ShoppingBag, title: "12K+ Sales", description: "Best selling templates" }
        ]
      }
    }
    
    return sellers[id] || sellers["1"]
  }

  const seller = getSellerData(sellerId)

  // Initialize followers count and follow status
  useEffect(() => {
    setFollowersCount(seller.stats.followers)
    
    // Check if user is following this seller
    if (currentUser && isSupabaseConfigured && platformDb) {
      checkFollowStatus()
    }
  }, [currentUser, sellerId])

  const checkFollowStatus = async () => {
    if (!currentUser || !isSupabaseConfigured || !platformDb) return

    try {
      const userDoc = await getDoc(doc(platformDb, 'followers', currentUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const followedSellerIds = userData.followedSellerIds || []
        setIsFollowing(followedSellerIds.includes(sellerId))
      }
    } catch (err) {
      console.error('Error checking follow status:', err)
    }
  }

  const handleBackToMarketplace = () => {
    window.location.hash = '#marketplace'
  }

  const handleFollow = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.hash = '#login'
      return
    }

    setIsLoading(true)

    try {
      if (isSupabaseConfigured && platformDb) {
        // Use Firebase for real follow functionality
        const userRef = doc(platformDb, 'followers', currentUser.uid)
        const userDoc = await getDoc(userRef)

        if (isFollowing) {
          // Unfollow
          if (userDoc.exists()) {
            await updateDoc(userRef, {
              followedSellerIds: arrayRemove(sellerId),
              updatedAt: serverTimestamp()
            })
          }
          setFollowersCount(prev => Math.max(0, prev - 1))
          success("Unfollowed", `You unfollowed ${seller.name}`)
        } else {
          // Follow
          if (userDoc.exists()) {
            await updateDoc(userRef, {
              followedSellerIds: arrayUnion(sellerId),
              updatedAt: serverTimestamp()
            })
          } else {
            await setDoc(userRef, {
              userId: currentUser.uid,
              followedSellerIds: [sellerId],
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            })
          }
          setFollowersCount(prev => prev + 1)
          success("Following!", `You are now following ${seller.name}`)
        }
      } else {
        // Mock follow functionality for demo mode
        if (isFollowing) {
          setFollowersCount(prev => Math.max(0, prev - 1))
          success("Unfollowed", `You unfollowed ${seller.name}`)
        } else {
          setFollowersCount(prev => prev + 1)
          success("Following!", `You are now following ${seller.name}`)
        }
      }

      setIsFollowing(!isFollowing)
    } catch (err: any) {
      error("Follow failed", err.message || "Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const handleHire = () => {
    success("Hire Request Sent!", "The seller will contact you soon")
  }

  const handleMessage = () => {
    if (!currentUser) {
      window.location.hash = '#login'
      return
    }
    // Navigate to inbox with this seller
    window.location.hash = `#inbox?userId=${sellerId}`
  }

  const handlePromptClick = (promptId: string) => {
    window.location.hash = `#marketplace/${promptId}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background"
      >
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={handleBackToMarketplace}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </motion.div>

      {/* Cover Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-64 bg-gradient-to-r from-primary/20 to-primary/10"
      >
        <img
          src={seller.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback>{seller.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h1 className="text-3xl font-bold">{seller.name}</h1>
                          {seller.verified && (
                            <CheckCircle className="h-6 w-6 text-primary fill-primary" />
                          )}
                        </div>
                        <p className="text-muted-foreground">{seller.username}</p>
                        <p className="text-lg font-medium mt-2">{seller.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {seller.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Member since {seller.memberSince}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={handleFollow} 
                        variant={isFollowing ? "outline" : "default"}
                        disabled={isLoading}
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                            />
                            {isFollowing ? "Unfollowing..." : "Following..."}
                          </>
                        ) : !currentUser ? (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Login to Follow
                          </>
                        ) : isFollowing ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleHire}>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Hire Me
                      </Button>
                      <Button variant="outline" onClick={handleMessage}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="prompts" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="prompts">Prompts ({seller.prompts.length})</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({seller.reviews.length})</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              {/* Prompts Tab */}
              <TabsContent value="prompts" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seller.prompts.map((prompt, index) => (
                    <motion.div
                      key={prompt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePromptClick(prompt.id)}>
                        <img
                          src={prompt.thumbnail}
                          alt={prompt.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{prompt.title}</CardTitle>
                              <CardDescription className="mt-2">{prompt.description}</CardDescription>
                            </div>
                            {prompt.featured && (
                              <Badge variant="secondary">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {prompt.rating}
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                {prompt.downloads}
                              </div>
                            </div>
                            <span className="text-lg font-bold text-primary">${prompt.price}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Bio</h3>
                      <p className="text-muted-foreground">{seller.bio}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {seller.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-3">Connect With Me</h3>
                      <div className="flex flex-wrap gap-3">
                        {seller.socials.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={seller.socials.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4 mr-2" />
                              Website
                            </a>
                          </Button>
                        )}
                        {seller.socials.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={seller.socials.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="h-4 w-4 mr-2" />
                              Twitter
                            </a>
                          </Button>
                        )}
                        {seller.socials.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={seller.socials.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                        {seller.socials.email && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${seller.socials.email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {seller.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} alt={review.author} />
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold">{review.author}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-2">{review.comment}</p>
                            <Badge variant="outline" className="text-xs">
                              For: {review.promptTitle}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seller.achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                              <achievement.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{achievement.title}</h3>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Sales</span>
                  <span className="font-bold">{seller.stats.totalSales.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Followers</span>
                  <span className="font-bold">{followersCount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Following</span>
                  <span className="font-bold">{seller.stats.following}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Prompts</span>
                  <span className="font-bold">{seller.stats.prompts}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-muted-foreground">Rating</span>
                  </div>
                  <span className="font-bold">{seller.stats.rating}/5</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-bold">{seller.stats.reviews.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Response Time</span>
                  </div>
                  <span className="font-medium">{seller.stats.responseTime}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                  </div>
                  <span className="font-medium">{seller.stats.completionRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={handleHire}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Hire for Project
                </Button>
                <Button variant="outline" className="w-full" onClick={handleMessage}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

