import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Camera,
  Shield,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function SellerVerificationPage() {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [idUploaded, setIdUploaded] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)

  const handleBack = () => {
    window.location.hash = '#dashboard/seller'
  }

  const handleIdUpload = () => {
    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      setIdUploaded(true)
      setUploading(false)
      toast({
        title: 'ID Uploaded',
        description: 'Your ID has been uploaded successfully. Verification in progress...'
      })
    }, 2000)
  }

  const handleSelfieUpload = () => {
    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      setSelfieUploaded(true)
      setUploading(false)
      toast({
        title: 'Selfie Uploaded',
        description: 'Your selfie has been uploaded successfully.'
      })
    }, 2000)
  }

  const verificationSteps = [
    {
      id: 'id',
      title: 'Upload Government ID',
      description: 'Upload a clear photo of your government-issued ID (passport, driver\'s license, or national ID)',
      completed: idUploaded,
      icon: FileText
    },
    {
      id: 'selfie',
      title: 'Take a Selfie',
      description: 'Take a selfie holding your ID next to your face for verification',
      completed: selfieUploaded,
      icon: Camera
    },
    {
      id: 'review',
      title: 'Review & Approval',
      description: 'Our team will review your documents within 24-48 hours',
      completed: false,
      icon: Shield
    }
  ]

  const completionPercent = (verificationSteps.filter(s => s.completed).length / verificationSteps.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Identity Verification</h2>
          <p className="text-muted-foreground mt-1">Verify your identity to unlock payouts and marketplace features</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verification Progress</CardTitle>
              <CardDescription>Complete all steps to verify your identity</CardDescription>
            </div>
            <Badge variant={completionPercent === 100 ? 'default' : 'secondary'}>
              {Math.round(completionPercent)}% Complete
            </Badge>
          </div>
          <Progress value={completionPercent} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className={`rounded-lg border p-6 ${
                  step.completed
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    step.completed
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      {step.completed && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/50">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                    {step.id === 'id' && !idUploaded && (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-sm font-medium mb-2">Upload your ID document</p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Supported formats: JPG, PNG, PDF (Max 10MB)
                          </p>
                          <Button onClick={handleIdUpload} disabled={uploading}>
                            {uploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    {step.id === 'selfie' && !selfieUploaded && (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-sm font-medium mb-2">Take a selfie with your ID</p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Make sure your face and ID are clearly visible
                          </p>
                          <Button onClick={handleSelfieUpload} disabled={uploading}>
                            {uploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Camera className="h-4 w-4 mr-2" />
                                Take Photo
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    {step.id === 'review' && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Pending Review</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your documents are being reviewed. You'll receive an email notification once verification is complete.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Verify?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Unlock payout functionality to receive your earnings</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Get featured placement in marketplace promotions</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Build trust with buyers through verified seller badge</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Access advanced seller features and analytics</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

