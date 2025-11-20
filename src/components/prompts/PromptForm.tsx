import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { firebaseDb, firebaseStorage, isFirebaseConfigured } from "@/lib/firebaseClient"
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { 
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  FileText,
  Loader2,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface PromptFormData {
  title: string
  description: string
  category: string
  tags: string[]
  difficulty: string
  visibility: boolean
  previewImageFile: File | null
  previewImageUrl: string
  fileUpload: File | null
  fileUrl: string
}

interface PromptFormProps {
  initialData?: Partial<PromptFormData> & { id?: string }
  onSave?: (promptId: string) => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
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

const difficulties = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
]

export function PromptForm({ initialData, onSave, onCancel, mode = 'create' }: PromptFormProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<PromptFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    tags: initialData?.tags || [],
    difficulty: initialData?.difficulty || "beginner",
    visibility: initialData?.visibility ?? true,
    previewImageFile: null,
    previewImageUrl: initialData?.previewImageUrl || "",
    fileUpload: null,
    fileUrl: initialData?.fileUrl || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newTag, setNewTag] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        error("Invalid file type", "Please upload an image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        error("File too large", "Please upload an image smaller than 5MB")
        return
      }
      setFormData(prev => ({ 
        ...prev, 
        previewImageFile: file, 
        previewImageUrl: URL.createObjectURL(file) 
      }))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        error("File too large", "Please upload a file smaller than 10MB")
        return
      }
      setFormData(prev => ({ ...prev, fileUpload: file }))
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      previewImageFile: null, 
      previewImageUrl: "" 
    }))
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, fileUpload: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }))
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
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!currentUser) {
      error("Authentication required", "Please log in to save prompts")
      return
    }

    if (!validateForm()) {
      error("Validation error", "Please fill in all required fields")
      return
    }

    setIsSaving(true)
    setUploadProgress(0)

    try {
      let previewImageUrl = formData.previewImageUrl
      let fileUrl = formData.fileUrl

      // Upload preview image if new file is selected
      if (formData.previewImageFile && firebaseStorage) {
        setIsUploading(true)
        const imageRef = ref(firebaseStorage, `prompts/${currentUser.uid}/${Date.now()}_preview.jpg`)
        const imageSnapshot = await uploadBytes(imageRef, formData.previewImageFile)
        previewImageUrl = await getDownloadURL(imageSnapshot.ref)
        setUploadProgress(50)
      }

      // Upload additional file if selected
      if (formData.fileUpload && firebaseStorage) {
        const fileRef = ref(firebaseStorage, `prompts/${currentUser.uid}/${Date.now()}_${formData.fileUpload.name}`)
        const fileSnapshot = await uploadBytes(fileRef, formData.fileUpload)
        fileUrl = await getDownloadURL(fileSnapshot.ref)
        setUploadProgress(100)
      }

      if (!isFirebaseConfigured || !firebaseDb) {
        // Mock save for demo mode
        const mockPromptId = `prompt_${Date.now()}`
        success("Prompt saved", "Your prompt has been saved successfully (demo mode)")
        onSave?.(mockPromptId)
        return
      }

      // Save to Firestore
      const promptData = {
        uid: currentUser.uid,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags: formData.tags,
        difficulty: formData.difficulty,
        visibility: formData.visibility,
        previewImageURL: previewImageUrl,
        fileURL: fileUrl,
        likes: [],
        saves: [],
        createdAt: mode === 'create' ? serverTimestamp() : undefined,
        lastEditedAt: serverTimestamp()
      }

      if (mode === 'edit' && initialData?.id) {
        // Update existing prompt
        const promptRef = doc(firebaseDb, 'prompts', initialData.id)
        await updateDoc(promptRef, promptData)
        success("Prompt updated", "Your prompt has been updated successfully")
      } else {
        // Create new prompt
        const promptRef = doc(firebaseDb, 'prompts')
        await setDoc(promptRef, promptData)
        success("Prompt created", "Your prompt has been created successfully")
      }

      onSave?.(initialData?.id || 'new')

    } catch (err: any) {
      console.error('Error saving prompt:', err)
      error("Save failed", err.message || "Failed to save prompt. Please try again.")
    } finally {
      setIsUploading(false)
      setIsSaving(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add('border-primary', 'bg-primary/5')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'image' | 'file') => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (type === 'image') {
        if (file.type.startsWith('image/')) {
          setFormData(prev => ({ 
            ...prev, 
            previewImageFile: file, 
            previewImageUrl: URL.createObjectURL(file) 
          }))
        } else {
          error("Invalid file type", "Please drop an image file")
        }
      } else {
        setFormData(prev => ({ ...prev, fileUpload: file }))
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Create New Prompt' : 'Edit Prompt'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'create' 
              ? 'Share your AI prompt with the community' 
              : 'Update your prompt information'
            }
          </p>
        </div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Uploading files...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about your prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter a descriptive title for your prompt"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what your prompt does and how to use it..."
                  rows={6}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleInputChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
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
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags *</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder="Add a tag (e.g., chatbot, marketing)"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.tags}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Media & Files</CardTitle>
              <CardDescription>
                Upload a preview image and optional additional files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preview Image */}
              <div>
                <Label>Preview Image</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-6 transition-colors ${
                    formData.previewImageUrl ? 'border-green-500 bg-green-50' : 'border-muted-foreground/25'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'image')}
                >
                  {formData.previewImageUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <img 
                          src={formData.previewImageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Image uploaded successfully</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Drag and drop an image here, or click to browse
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          ref={imageInputRef}
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
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional File */}
              <div>
                <Label>Additional File (Optional)</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-6 transition-colors ${
                    formData.fileUpload ? 'border-green-500 bg-green-50' : 'border-muted-foreground/25'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'file')}
                >
                  {formData.fileUpload ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{formData.fileUpload.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(formData.fileUpload.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">File ready for upload</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Drag and drop a file here, or click to browse
                        </p>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </label>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Any file type up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Visibility Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
              <CardDescription>
                Control who can see your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="visibility">Public</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.visibility ? 'Visible to everyone' : 'Only visible to you'}
                  </p>
                </div>
                <Switch
                  id="visibility"
                  checked={formData.visibility}
                  onCheckedChange={(checked) => handleInputChange("visibility", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardContent className="p-6">
              <Button
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="w-full"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === 'create' ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'create' ? 'Create Prompt' : 'Save Changes'}
                  </>
                )}
              </Button>
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSaving || isUploading}
                  className="w-full mt-2"
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
