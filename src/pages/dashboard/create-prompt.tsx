import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/AuthGuard"
import { PromptPreviewModal } from "@/components/PromptPreviewModal"
import { 
  ArrowLeft,
  Upload,
  Eye,
  Save,
  X,
  Plus,
  Image as ImageIcon,
  DollarSign,
  Tag,
  FileText,
  AlertCircle
} from "lucide-react"
import { platformDb, platformStorage, isSupabaseConfigured } from "@/lib/platformClient"
import { collection, addDoc, serverTimestamp } from "@/lib/platformStubs/firestore"
import { ref, uploadBytes, getDownloadURL } from "@/lib/platformStubs/storage"

interface PromptFormData {
  title: string
  description: string
  category: string
  tags: string[]
  price: number
  content: string
  imageFile: File | null
  imageUrl: string
}

const categories = [
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

export function CreatePromptPage() {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<PromptFormData>({
    title: "",
    description: "",
    category: "",
    tags: [],
    price: 0,
    content: "",
    imageFile: null,
    imageUrl: ""
  })
  const [tagInput, setTagInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleBackToDashboard = () => {
    window.location.hash = "#dashboard"
  }

  const handleInputChange = (field: keyof PromptFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        error("Invalid file type", "Please upload an image file")
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        error("File too large", "Please upload an image smaller than 5MB")
        return
      }

      setFormData(prev => ({ ...prev, imageFile: file }))
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null, imageUrl: "" }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Prompt content is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true)
    }
  }

  const handlePublish = async () => {
    if (!validateForm()) {
      return
    }

    if (!currentUser) {
      error("Authentication required", "Please log in to publish prompts")
      return
    }

    if (!isSupabaseConfigured || !platformDb) {
      error("Service unavailable", "Firebase is not configured. Please try again later.")
      return
    }

    setIsLoading(true)

    try {
      let imageUrl = ""

      // Upload image if provided
      if (formData.imageFile && platformStorage) {
        const imageRef = ref(platformStorage, `prompts/${currentUser.uid}/${Date.now()}_${formData.imageFile.name}`)
        const snapshot = await uploadBytes(imageRef, formData.imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      // Save prompt to Firestore
      const promptData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags: formData.tags,
        price: formData.price,
        content: formData.content.trim(),
        imageUrl,
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email,
        createdAt: serverTimestamp(),
        likes: 0,
        downloads: 0,
        status: "active"
      }

      await addDoc(collection(platformDb, 'prompts'), promptData)

      success("Prompt Published!", "Your prompt has been successfully published to the marketplace")
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.hash = "#dashboard"
      }, 1500)

    } catch (err: any) {
      console.error('Error publishing prompt:', err)
      error("Publish failed", err.message || "Failed to publish prompt. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b bg-background"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Create New Prompt</h1>
                  <p className="text-sm text-muted-foreground">
                    Share your AI prompt with the community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prompt Details
                </CardTitle>
                <CardDescription>
                  Fill in the details for your new AI prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling title for your prompt"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your prompt does and how it helps users"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={errors.description ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.description && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </div>
                  )}
                </div>

                {/* Category and Price Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <div className="flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        {errors.category}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price || ""}
                        onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                        className={`pl-9 ${errors.price ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.price && (
                      <div className="flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        {errors.price}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Preview Image (Optional)</Label>
                  {!formData.imageFile ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Upload an image to showcase your prompt
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image
                          </label>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(formData.imageFile)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Prompt Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Prompt Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your AI prompt here. Be specific and detailed to help users get the best results."
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    className={errors.content ? "border-red-500" : ""}
                    rows={8}
                  />
                  {errors.content && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {errors.content}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This is the actual prompt that users will copy and use with their AI assistant.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePreview}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Prompt
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Publish Prompt
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <PromptPreviewModal
            promptData={formData}
            onClose={() => setShowPreview(false)}
            onPublish={handlePublish}
            isLoading={isLoading}
          />
        )}
      </div>
    </AuthGuard>
  )
}
