import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Image,
  Type,
  Palette,
  Eye,
  EyeOff,
  Save,
  Download,
  Share2,
  MoreVertical,
  Presentation,
  FileText,
  ImageIcon,
  Layout
} from "lucide-react"

interface Slide {
  id: string
  title: string
  content: string
  image?: string
  order: number
  isVisible: boolean
  backgroundColor?: string
  textColor?: string
}

export function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "1",
      title: "Welcome to Our Presentation",
      content: "This is the introduction slide. Here you can introduce your topic and set the stage for your presentation.",
      order: 1,
      isVisible: true,
      backgroundColor: "bg-gradient-to-br from-blue-500 to-purple-600",
      textColor: "text-white"
    },
    {
      id: "2", 
      title: "Key Statistics",
      content: "• 95% customer satisfaction rate\n• 50% increase in productivity\n• 10,000+ happy customers\n• 24/7 support available",
      order: 2,
      isVisible: true,
      backgroundColor: "bg-gradient-to-br from-green-500 to-teal-600",
      textColor: "text-white"
    },
    {
      id: "3",
      title: "Our Solution",
      content: "We provide innovative solutions that help businesses grow and succeed in today's competitive market.",
      order: 3,
      isVisible: true,
      backgroundColor: "bg-gradient-to-br from-orange-500 to-red-600",
      textColor: "text-white"
    }
  ])

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isPresenting, setIsPresenting] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { success } = useToast()

  const [newSlide, setNewSlide] = useState({
    title: "",
    content: "",
    image: "",
    backgroundColor: "bg-gradient-to-br from-blue-500 to-purple-600",
    textColor: "text-white"
  })

  const backgroundOptions = [
    { value: "bg-gradient-to-br from-blue-500 to-purple-600", label: "Blue Purple", preview: "bg-gradient-to-br from-blue-500 to-purple-600" },
    { value: "bg-gradient-to-br from-green-500 to-teal-600", label: "Green Teal", preview: "bg-gradient-to-br from-green-500 to-teal-600" },
    { value: "bg-gradient-to-br from-orange-500 to-red-600", label: "Orange Red", preview: "bg-gradient-to-br from-orange-500 to-red-600" },
    { value: "bg-gradient-to-br from-purple-500 to-pink-600", label: "Purple Pink", preview: "bg-gradient-to-br from-purple-500 to-pink-600" },
    { value: "bg-gradient-to-br from-indigo-500 to-blue-600", label: "Indigo Blue", preview: "bg-gradient-to-br from-indigo-500 to-blue-600" },
    { value: "bg-gradient-to-br from-gray-800 to-gray-900", label: "Dark Gray", preview: "bg-gradient-to-br from-gray-800 to-gray-900" }
  ]

  const textColorOptions = [
    { value: "text-white", label: "White" },
    { value: "text-black", label: "Black" },
    { value: "text-gray-800", label: "Dark Gray" },
    { value: "text-blue-600", label: "Blue" },
    { value: "text-green-600", label: "Green" }
  ]

  const handleAddSlide = () => {
    const newSlideData: Slide = {
      id: Date.now().toString(),
      title: newSlide.title,
      content: newSlide.content,
      image: newSlide.image || undefined,
      order: slides.length + 1,
      isVisible: true,
      backgroundColor: newSlide.backgroundColor,
      textColor: newSlide.textColor
    }
    
    setSlides(prev => [...prev, newSlideData])
    setNewSlide({
      title: "",
      content: "",
      image: "",
      backgroundColor: "bg-gradient-to-br from-blue-500 to-purple-600",
      textColor: "text-white"
    })
    setIsDialogOpen(false)
    success("Slide added!", "New slide has been created")
  }

  const handleEditSlide = (slide: Slide) => {
    setEditingSlide(slide)
    setNewSlide({
      title: slide.title,
      content: slide.content,
      image: slide.image || "",
      backgroundColor: slide.backgroundColor || "bg-gradient-to-br from-blue-500 to-purple-600",
      textColor: slide.textColor || "text-white"
    })
    setIsDialogOpen(true)
  }

  const handleUpdateSlide = () => {
    if (!editingSlide) return

    setSlides(prev => prev.map(slide => 
      slide.id === editingSlide.id 
        ? {
            ...slide,
            title: newSlide.title,
            content: newSlide.content,
            image: newSlide.image || undefined,
            backgroundColor: newSlide.backgroundColor,
            textColor: newSlide.textColor
          }
        : slide
    ))
    
    setEditingSlide(null)
    setNewSlide({
      title: "",
      content: "",
      image: "",
      backgroundColor: "bg-gradient-to-br from-blue-500 to-purple-600",
      textColor: "text-white"
    })
    setIsDialogOpen(false)
    success("Slide updated!", "Changes have been saved")
  }

  const handleDeleteSlide = (slideId: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== slideId))
    if (currentSlideIndex >= slides.length - 1) {
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
    }
    success("Slide deleted!", "Slide has been removed")
  }

  const handleToggleVisibility = (slideId: string) => {
    setSlides(prev => prev.map(slide => 
      slide.id === slideId 
        ? { ...slide, isVisible: !slide.isVisible }
        : slide
    ))
  }

  const nextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index)
  }

  const startPresentation = () => {
    setIsPresenting(true)
    success("Presentation started!", "Press ESC to exit presentation mode")
  }

  const stopPresentation = () => {
    setIsPresenting(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isPresenting) {
      if (e.key === "Escape") {
        stopPresentation()
      } else if (e.key === "ArrowRight") {
        nextSlide()
      } else if (e.key === "ArrowLeft") {
        prevSlide()
      }
    }
  }

  // Add keyboard event listener
  useState(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  })

  const currentSlide = slides[currentSlideIndex]

  if (isPresenting) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full flex items-center justify-center p-8"
        >
          {currentSlide && (
            <Card className={`w-full max-w-4xl h-full max-h-[80vh] ${currentSlide.backgroundColor} ${currentSlide.textColor} border-0 shadow-2xl`}>
              <CardContent className="p-12 h-full flex flex-col justify-center">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-8"
                >
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    {currentSlide.title}
                  </h1>
                  <div className="text-xl md:text-2xl leading-relaxed whitespace-pre-line">
                    {currentSlide.content}
                  </div>
                  {currentSlide.image && (
                    <div className="mt-8">
                      <img 
                        src={currentSlide.image} 
                        alt={currentSlide.title}
                        className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          )}
          
          {/* Presentation Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur rounded-full px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm font-medium">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-white/30 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={stopPresentation}
              className="text-white hover:bg-white/20"
            >
              <Pause className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Presentation className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Slides System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and manage beautiful presentations with our intuitive slide editor
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSlide ? "Edit Slide" : "Create New Slide"}
                </DialogTitle>
                <DialogDescription>
                  {editingSlide ? "Update your slide content and styling" : "Add a new slide to your presentation"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Slide Title</Label>
                  <Input
                    id="title"
                    value={newSlide.title}
                    onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter slide title"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newSlide.content}
                    onChange={(e) => setNewSlide(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter slide content"
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    value={newSlide.image}
                    onChange={(e) => setNewSlide(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Background</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {backgroundOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setNewSlide(prev => ({ ...prev, backgroundColor: option.value }))}
                          className={`h-12 rounded-lg border-2 ${
                            newSlide.backgroundColor === option.value ? 'border-primary' : 'border-border'
                          }`}
                        >
                          <div className={`w-full h-full rounded-md ${option.preview}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Text Color</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {textColorOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setNewSlide(prev => ({ ...prev, textColor: option.value }))}
                          className={`h-10 rounded-lg border-2 ${
                            newSlide.textColor === option.value ? 'border-primary' : 'border-border'
                          } ${option.value} font-medium`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingSlide ? handleUpdateSlide : handleAddSlide}>
                    {editingSlide ? "Update Slide" : "Add Slide"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">
            <Button variant="outline" onClick={startPresentation}>
              <Play className="h-4 w-4 mr-2" />
              Present
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Slides List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Slides ({slides.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        currentSlideIndex === index 
                          ? "ring-2 ring-primary bg-primary/5" 
                          : "hover:shadow-md"
                      }`}
                      onClick={() => goToSlide(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {slide.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleVisibility(slide.id)
                              }}
                            >
                              {slide.isVisible ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditSlide(slide)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteSlide(slide.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {slide.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            Slide {index + 1}
                          </Badge>
                          {slide.image && (
                            <ImageIcon className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Slide Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                {currentSlide ? (
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`h-full ${currentSlide.backgroundColor} ${currentSlide.textColor} rounded-lg flex items-center justify-center p-12`}
                  >
                    <div className="text-center space-y-8 max-w-4xl">
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        {currentSlide.title}
                      </h1>
                      <div className="text-lg md:text-xl leading-relaxed whitespace-pre-line">
                        {currentSlide.content}
                      </div>
                      {currentSlide.image && (
                        <div className="mt-8">
                          <img 
                            src={currentSlide.image} 
                            alt={currentSlide.title}
                            className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Presentation className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No slides available. Create your first slide to get started.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            {slides.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentSlideIndex === index ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={nextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
