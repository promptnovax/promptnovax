import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft,
  Heart,
  MessageCircle,
  Eye,
  Clock,
  Star,
  Share2,
  MoreVertical,
  ThumbsUp,
  Reply,
  Flag,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export function PostDetailPage() {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const { success, error } = useToast()

  // Mock post data
  const post = {
    id: "1",
    title: "Advanced Prompt Engineering Techniques for Better AI Responses",
    content: `# Advanced Prompt Engineering Techniques for Better AI Responses

Prompt engineering is the art and science of crafting inputs that guide AI models to produce desired outputs. As AI models become more sophisticated, the ability to write effective prompts becomes increasingly valuable.

## Understanding the Basics

Before diving into advanced techniques, it's important to understand the fundamental principles:

### 1. Clarity and Specificity
- Be explicit about what you want
- Use clear, unambiguous language
- Avoid vague or open-ended requests

### 2. Context Setting
- Provide relevant background information
- Set the tone and style expectations
- Include domain-specific knowledge when needed

## Advanced Techniques

### Chain of Thought Prompting
This technique encourages the model to show its reasoning process:

\`\`\`
"Let's solve this step by step. First, I need to understand the problem. Then, I'll break it down into smaller parts..."
\`\`\`

### Few-Shot Learning
Provide examples of the desired input-output format:

\`\`\`
Example 1:
Input: "Write a professional email"
Output: [Professional email format]

Example 2:
Input: "Create a marketing slogan"
Output: [Marketing slogan format]

Now, for this input: "Draft a product description"
\`\`\`

### Role-Based Prompting
Assign a specific role to the AI:

\`\`\`
"You are an expert data scientist with 10 years of experience in machine learning. Your task is to..."
\`\`\`

## Best Practices

1. **Iterative Refinement**: Start with a basic prompt and refine based on outputs
2. **Temperature Control**: Use appropriate temperature settings for creativity vs consistency
3. **Token Management**: Be mindful of context window limitations
4. **Output Formatting**: Specify desired output format (JSON, markdown, etc.)

## Common Pitfalls to Avoid

- Overly complex prompts that confuse the model
- Inconsistent formatting across examples
- Missing context or background information
- Unrealistic expectations for single-shot responses

## Conclusion

Mastering prompt engineering requires practice and experimentation. Start with these techniques and adapt them to your specific use cases. Remember, the goal is to create a collaborative relationship with AI that produces reliable, high-quality results.`,
    author: {
      name: "Alex Chen",
      avatar: "https://github.com/shadcn.png",
      verified: true,
      followers: 1234,
      posts: 89
    },
    category: "ai",
    tags: ["prompt-engineering", "ai", "tutorial", "machine-learning"],
    stats: {
      likes: 42,
      comments: 18,
      views: 234,
      shares: 12
    },
    timeAgo: "2 hours ago",
    isLiked: false,
    isBookmarked: false
  }

  const comments = [
    {
      id: "1",
      content: "This is incredibly helpful! I've been struggling with getting consistent outputs from GPT-4. The chain of thought technique especially made a huge difference.",
      author: {
        name: "Sarah Johnson",
        avatar: "https://github.com/shadcn.png",
        verified: true
      },
      timeAgo: "1 hour ago",
      likes: 8,
      isLiked: false,
      replies: [
        {
          id: "1-1",
          content: "Same here! The few-shot examples really helped me understand the pattern.",
          author: {
            name: "Mike Chen",
            avatar: "https://github.com/shadcn.png",
            verified: false
          },
          timeAgo: "45 minutes ago",
          likes: 3,
          isLiked: true
        }
      ]
    },
    {
      id: "2",
      content: "Great post! Could you elaborate more on temperature settings? I'm not sure when to use high vs low values.",
      author: {
        name: "Emma Wilson",
        avatar: "https://github.com/shadcn.png",
        verified: true
      },
      timeAgo: "2 hours ago",
      likes: 5,
      isLiked: false,
      replies: []
    },
    {
      id: "3",
      content: "The role-based prompting technique is a game changer. I've been using it for code reviews and the quality has improved significantly.",
      author: {
        name: "David Kim",
        avatar: "https://github.com/shadcn.png",
        verified: true
      },
      timeAgo: "3 hours ago",
      likes: 12,
      isLiked: true,
      replies: []
    }
  ]

  const handleLike = () => {
    setIsLiked(!isLiked)
    success(isLiked ? "Post unliked" : "Post liked!", "Thanks for your engagement")
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    success(isBookmarked ? "Post unbookmarked" : "Post bookmarked!", "Saved to your bookmarks")
  }

  const handleShare = () => {
    success("Post shared!", "Link copied to clipboard")
  }

  const handleCommentLike = (commentId: string) => {
    success("Comment liked!", "Thanks for your feedback")
  }

  const handleReply = (commentId: string) => {
    success("Reply clicked!", "Opening reply form...")
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) {
      error("Please enter a comment")
      return
    }
    
    setIsSubmittingComment(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingComment(false)
      setNewComment("")
      success("Comment posted!", "Your comment has been added")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild>
                <Link href="#community">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Community
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">AI & ML</Badge>
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Post Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold mb-4">
                    {post.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {post.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{post.author.name}</p>
                          {post.author.verified && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {post.author.followers.toLocaleString()} followers • {post.author.posts} posts
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.timeAgo}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.stats.views} views
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    className={`p-2 rounded-lg transition-colors ${
                      isBookmarked 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                    }`}
                    onClick={handleBookmark}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Post Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Post Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <motion.button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                    onClick={handleLike}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.stats.likes + (isLiked ? 1 : 0)}</span>
                  </motion.button>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">{post.stats.comments}</span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground">
                    <Share2 className="h-5 w-5" />
                    <span className="font-medium">{post.stats.shares}</span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Upvote
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* New Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="gap-2"
                  >
                    {isSubmittingComment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {comment.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{comment.author.name}</p>
                          {comment.author.verified && (
                            <CheckCircle className="h-3 w-3 text-primary" />
                          )}
                          <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-3">{comment.content}</p>
                        
                        <div className="flex items-center gap-4">
                          <motion.button
                            className={`flex items-center gap-1 text-xs transition-colors ${
                              comment.isLiked 
                                ? 'text-red-500' 
                                : 'text-muted-foreground hover:text-red-500'
                            }`}
                            onClick={() => handleCommentLike(comment.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                            {comment.likes}
                          </motion.button>
                          <motion.button
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => handleReply(comment.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Reply className="h-3 w-3" />
                            Reply
                          </motion.button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 ml-6 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={reply.author.avatar} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                    {reply.author.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-xs">{reply.author.name}</p>
                                    {reply.author.verified && (
                                      <CheckCircle className="h-3 w-3 text-primary" />
                                    )}
                                    <span className="text-xs text-muted-foreground">{reply.timeAgo}</span>
                                  </div>
                                  <p className="text-xs leading-relaxed mb-2">{reply.content}</p>
                                  <div className="flex items-center gap-3">
                                    <motion.button
                                      className={`flex items-center gap-1 text-xs transition-colors ${
                                        reply.isLiked 
                                          ? 'text-red-500' 
                                          : 'text-muted-foreground hover:text-red-500'
                                      }`}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Heart className={`h-3 w-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                      {reply.likes}
                                    </motion.button>
                                    <motion.button
                                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Reply
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
