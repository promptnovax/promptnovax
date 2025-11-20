import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft,
  Upload,
  Image,
  Tag,
  DollarSign,
  FileText,
  Eye,
  Save,
  Send,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Target,
  Users,
  TrendingUp
} from "lucide-react"

export function SellerUploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "",
    price: "",
    originalPrice: "",
    tags: [] as string[],
    promptType: "",
    difficulty: "",
    estimatedTime: "",
    requirements: [] as string[],
    features: [] as string[],
    exampleUsage: "",
    thumbnail: null as File | null,
    previewImage: null as string | null
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isDraft, setIsDraft] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const { success } = useToast()

  const categories = [
    { value: "development", label: "Development" },
    { value: "writing", label: "Writing" },
    { value: "business", label: "Business" },
    { value: "ai", label: "AI & ML" },
    { value: "marketing", label: "Marketing" },
    { value: "data", label: "Data Science" },
    { value: "design", label: "Design" },
    { value: "education", label: "Education" }
  ]

  const promptTypes = [
    { value: "template", label: "Template" },
    { value: "guide", label: "Guide" },
    { value: "example", label: "Example" },
    { value: "workflow", label: "Workflow" },
    { value: "checklist", label: "Checklist" }
  ]

  const difficultyLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
  ]

  const steps = [
    { id: 1, title: "Basic Info", description: "Title, description, and category" },
    { id: 2, title: "Pricing", description: "Set your price and tags" },
    { id: 3, title: "Content", description: "Detailed description and features" },
    { id: 4, title: "Media", description: "Upload thumbnail and preview" },
    { id: 5, title: "Review", description: "Review and publish" }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement("")
    }
  }

  const handleRemoveRequirement = (requirementToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== requirementToRemove)
    }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file,
        previewImage: URL.createObjectURL(file)
      }))
    }
  }

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    setIsDraft(true)
    success("Draft saved", "Your prompt has been saved as a draft")
  }

  const handlePublish = () => {
    success("Prompt published!", "Your prompt is now live on the marketplace")
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.category
      case 2:
        return formData.price && formData.tags.length > 0
      case 3:
        return formData.fullDescription && formData.features.length > 0
      case 4:
        return formData.thumbnail
      case 5:
        return true
      default:
        return false
    }
  }

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">Create New Prompt</h1>
                <p className="text-muted-foreground">Step {currentStep} of {steps.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              {isDraft && (
                <Badge variant="secondary">
                  <Save className="h-3 w-3 mr-1" />
                  Draft
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Prompt Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter a compelling title for your prompt"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Make it clear and descriptive to attract buyers
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of what your prompt does"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This will appear in search results and listings
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="mt-1">
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
                    </div>

                    <div>
                      <Label htmlFor="promptType">Prompt Type</Label>
                      <Select value={formData.promptType} onValueChange={(value) => handleInputChange("promptType", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select prompt type" />
                        </SelectTrigger>
                        <SelectContent>
                          {promptTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="estimatedTime">Estimated Time</Label>
                      <Input
                        id="estimatedTime"
                        placeholder="e.g., 5 minutes, 1 hour"
                        value={formData.estimatedTime}
                        onChange={(e) => handleInputChange("estimatedTime", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="originalPrice"
                          type="number"
                          placeholder="0.00"
                          value={formData.originalPrice}
                          onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Show a discount by setting a higher original price
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Tags *</Label>
                    <div className="mt-1 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button type="button" onClick={handleAddTag} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add relevant tags to help buyers find your prompt
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Content */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fullDescription">Detailed Description *</Label>
                    <Textarea
                      id="fullDescription"
                      placeholder="Provide a comprehensive description of your prompt, including how to use it, what it does, and any special features"
                      value={formData.fullDescription}
                      onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                      className="mt-1"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label>Features *</Label>
                    <div className="mt-1 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a feature"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                        />
                        <Button type="button" onClick={handleAddFeature} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 p-2 border rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="flex-1">{feature}</span>
                            <button
                              onClick={() => handleRemoveFeature(feature)}
                              className="hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Requirements</Label>
                    <div className="mt-1 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a requirement"
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
                        />
                        <Button type="button" onClick={handleAddRequirement} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.requirements.map((requirement) => (
                          <div key={requirement} className="flex items-center gap-2 p-2 border rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="flex-1">{requirement}</span>
                            <button
                              onClick={() => handleRemoveRequirement(requirement)}
                              className="hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exampleUsage">Example Usage</Label>
                    <Textarea
                      id="exampleUsage"
                      placeholder="Provide an example of how to use your prompt"
                      value={formData.exampleUsage}
                      onChange={(e) => handleInputChange("exampleUsage", e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Media */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label>Thumbnail Image *</Label>
                    <div className="mt-1">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload" className="cursor-pointer">
                          {formData.previewImage ? (
                            <div className="space-y-4">
                              <img
                                src={formData.previewImage}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg mx-auto"
                              />
                              <p className="text-sm text-muted-foreground">
                                Click to change image
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                              <div>
                                <p className="text-sm font-medium">Upload thumbnail</p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG up to 2MB
                                </p>
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Image Guidelines</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Use high-quality images that represent your prompt</li>
                          <li>• Recommended size: 800x400 pixels</li>
                          <li>• Avoid text-heavy images</li>
                          <li>• Use clear, professional visuals</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Ready to Publish?</h4>
                        <p className="text-sm text-muted-foreground">
                          Review your prompt details before publishing. Once published, your prompt will be available for purchase on the marketplace.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Prompt Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Title</Label>
                          <p className="text-sm">{formData.title || "Not set"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Category</Label>
                          <p className="text-sm capitalize">{formData.category || "Not set"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Price</Label>
                          <p className="text-sm">${formData.price || "0.00"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Tags</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Content Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Features</Label>
                          <p className="text-sm">{formData.features.length} features added</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Requirements</Label>
                          <p className="text-sm">{formData.requirements.length} requirements listed</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Description Length</Label>
                          <p className="text-sm">{formData.fullDescription.length} characters</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Thumbnail</Label>
                          <p className="text-sm">{formData.thumbnail ? "Uploaded" : "Not uploaded"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {currentStep < steps.length ? (
                    <Button
                      onClick={handleNextStep}
                      disabled={!isStepValid(currentStep)}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700">
                      <Send className="h-4 w-4 mr-2" />
                      Publish Prompt
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
