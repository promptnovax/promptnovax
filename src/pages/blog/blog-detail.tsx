import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Twitter,
  Linkedin,
  Facebook,
  ChevronUp,
  Star,
  TrendingUp
} from "lucide-react"

interface BlogDetailProps {
  postId: string
}

export function BlogDetailPage({ postId }: BlogDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { success } = useToast()

  // Mock blog post data
  const blogPost = {
    id: "1",
    title: "Building Better Prompts: A Complete Guide to AI Communication",
    description: "Learn the fundamental principles of prompt engineering and discover techniques that will help you get better results from any AI model.",
    author: {
      name: "Alex Rodriguez",
      avatar: "https://github.com/shadcn.png",
      role: "Prompt Engineer",
      bio: "Alex is a seasoned prompt engineer with over 5 years of experience in AI and machine learning. He specializes in optimizing AI model interactions and has helped thousands of users improve their prompt writing skills.",
      followers: 1234,
      posts: 89
    },
    category: "tips",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    publishedAt: "2024-01-12",
    readTime: "6 min read",
    views: 1923,
    likes: 89,
    comments: 12,
    content: `# Building Better Prompts: A Complete Guide to AI Communication

In the rapidly evolving world of artificial intelligence, the ability to communicate effectively with AI models has become a crucial skill. Whether you're using GPT-4, Claude, or any other language model, the quality of your prompts directly determines the quality of the responses you receive.

## Understanding the Fundamentals

### What Makes a Good Prompt?

A good prompt is more than just a question or request. It's a carefully crafted instruction that provides the AI with:

- **Clear context**: What is the situation or background?
- **Specific instructions**: What exactly do you want the AI to do?
- **Desired format**: How should the response be structured?
- **Examples**: What does good output look like?

### The Anatomy of an Effective Prompt

Let's break down the components of a well-structured prompt:

1. **Context Setting**: Provide relevant background information
2. **Role Definition**: Assign a specific role or expertise to the AI
3. **Task Description**: Clearly state what you want accomplished
4. **Output Format**: Specify how you want the response structured
5. **Constraints**: Set any limitations or requirements

## Advanced Techniques

### Chain of Thought Prompting

This technique encourages the AI to show its reasoning process:

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

## Common Pitfalls to Avoid

### 1. Vague Instructions
❌ "Write something about AI"
✅ "Write a 500-word article explaining how AI is transforming healthcare, including specific examples and future implications"

### 2. Missing Context
❌ "Analyze this data"
✅ "Analyze this sales data from Q3 2023 and provide insights on customer behavior trends, including recommendations for Q4 strategy"

### 3. Unclear Output Format
❌ "Give me a summary"
✅ "Provide a bullet-point summary with 5 key takeaways, each in 2-3 sentences"

## Best Practices for Different Use Cases

### Creative Writing
- Use descriptive language to set the tone
- Provide character backgrounds and setting details
- Specify the desired length and style

### Technical Documentation
- Include relevant technical context
- Specify the target audience
- Request code examples where appropriate

### Business Analysis
- Provide relevant data and metrics
- Specify the business context
- Request actionable recommendations

## Measuring Prompt Effectiveness

### Key Metrics to Track
- **Relevance**: Does the response address your request?
- **Accuracy**: Is the information correct and factual?
- **Completeness**: Does it cover all aspects of your request?
- **Clarity**: Is the response easy to understand?

### Iterative Improvement
1. Start with a basic prompt
2. Analyze the response quality
3. Refine based on what worked and what didn't
4. Test with variations
5. Document successful patterns

## Tools and Resources

### Prompt Libraries
- Explore community-shared prompts
- Study successful examples
- Adapt templates for your use cases

### Testing Platforms
- Use playground environments
- Compare different model responses
- A/B test prompt variations

## Conclusion

Mastering prompt engineering is an ongoing process that requires practice, experimentation, and continuous learning. By understanding the fundamental principles and applying advanced techniques, you can significantly improve your interactions with AI models.

Remember, the goal is not just to get a response, but to get the right response that serves your specific needs. With time and practice, you'll develop an intuition for crafting effective prompts that consistently deliver high-quality results.

## Next Steps

1. Start with simple prompts and gradually add complexity
2. Experiment with different techniques
3. Join communities to learn from others
4. Keep a library of your most effective prompts
5. Stay updated with new AI model capabilities

Happy prompting! 🚀`,
    tags: ["prompt-engineering", "ai", "tips", "guide"],
    relatedPosts: [
      {
        id: "2",
        title: "Advanced Prompt Engineering Techniques",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
        readTime: "8 min read",
        publishedAt: "2024-01-10"
      },
      {
        id: "3",
        title: "AI Model Comparison Guide",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop",
        readTime: "12 min read",
        publishedAt: "2024-01-08"
      },
      {
        id: "4",
        title: "Prompt Templates for Business",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
        readTime: "5 min read",
        publishedAt: "2024-01-05"
      }
    ]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    success(isLiked ? "Post unliked" : "Post liked!", "Thanks for your feedback")
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    success(isBookmarked ? "Post unbookmarked" : "Post bookmarked!", "Saved to your bookmarks")
  }

  const handleShare = (platform: string) => {
    success("Post shared!", `Shared on ${platform}`)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show scroll to top button when scrolled down
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild>
                <Link href="#blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Tips</Badge>
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {blogPost.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {blogPost.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={blogPost.author.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {blogPost.author.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{blogPost.author.name}</h3>
                <p className="text-sm text-muted-foreground">{blogPost.author.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{formatDate(blogPost.publishedAt)}</p>
              <p className="text-sm text-muted-foreground">{blogPost.readTime}</p>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <img
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {blogPost.content}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                  {blogPost.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Article Actions */}
            <Card className="mt-6">
              <CardContent className="p-6">
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
                      <span className="font-medium">{blogPost.likes + (isLiked ? 1 : 0)}</span>
                    </motion.button>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">{blogPost.comments}</span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground">
                      <Eye className="h-5 w-5" />
                      <span className="font-medium">{blogPost.views.toLocaleString()}</span>
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
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => handleShare("copy")}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={blogPost.author.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {blogPost.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{blogPost.author.name}</h4>
                    <p className="text-sm text-muted-foreground">{blogPost.author.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {blogPost.author.bio}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {blogPost.author.followers.toLocaleString()} followers
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark className="h-4 w-4" />
                    {blogPost.author.posts} posts
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  Follow
                </Button>
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share this post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.button
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  onClick={() => handleShare("Twitter")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Twitter className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Share on Twitter</span>
                </motion.button>
                <motion.button
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  onClick={() => handleShare("LinkedIn")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Share on LinkedIn</span>
                </motion.button>
                <motion.button
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  onClick={() => handleShare("Facebook")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Facebook className="h-4 w-4 text-blue-700" />
                  <span className="text-sm">Share on Facebook</span>
                </motion.button>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blogPost.relatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="flex gap-3 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
