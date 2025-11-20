import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Mic, Square, UploadCloud, Star, Send, ArrowLeft, MessageSquare } from "lucide-react"
import { Link } from "@/components/ui/link"
import { useToast } from "@/hooks/use-toast"

export function FeedbackPage() {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const { success, error } = useToast()

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      recordedChunksRef.current = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      }
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setRecording(true)
    } catch (e) {
      error("Recording Error", "Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop())
    setRecording(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.message.trim()) {
      error("Validation Error", "Please enter your feedback message")
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: send feedback data + audio blob to backend when available
    console.log('Feedback submitted:', { ...formData, rating, audioUrl })
    
    success("Thank you!", "Your feedback has been submitted successfully. We appreciate your input!")
    
    // Reset form
    setFormData({ name: '', email: '', message: '' })
    setRating(0)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Share Your <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Feedback</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Help us improve PromptX by sharing your thoughts, suggestions, or reporting any issues. Your voice matters!
            </p>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Tell us what you think</CardTitle>
                <CardDescription>
                  Your feedback helps us build a better product for everyone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name (Optional)</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-3">
                    <Label>Rating (Optional)</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`${i} star`}
                          onClick={() => setRating(i)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              i <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Feedback *</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your thoughts, suggestions, or report any issues..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Separator />

                  {/* Voice Note */}
                  <div className="space-y-3">
                    <Label>Add a voice note (Optional)</Label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {!recording ? (
                        <Button 
                          type="button" 
                          onClick={startRecording} 
                          variant="outline" 
                          className="gap-2"
                        >
                          <Mic className="h-4 w-4" /> Start recording
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={stopRecording} 
                          variant="destructive" 
                          className="gap-2"
                        >
                          <Square className="h-4 w-4" /> Stop recording
                        </Button>
                      )}
                      {audioUrl && (
                        <div className="flex items-center gap-2">
                          <audio src={audioUrl} controls className="max-w-xs" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              URL.revokeObjectURL(audioUrl)
                              setAudioUrl(null)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-xs text-muted-foreground">
                      By submitting, you agree to our terms & privacy policy.
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.message.trim()}
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      {isSubmitting ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Submit Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link href="#home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

















