import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { firebaseDb, firebaseStorage, isFirebaseConfigured } from "@/lib/firebaseClient"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { 
  X, 
  Upload, 
  User, 
  Mail, 
  FileText,
  Image as ImageIcon,
  Loader2
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

interface EditProfileModalProps {
  user: UserData
  onClose: () => void
  onSave: (updatedUser: UserData) => void
}

export function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const { currentUser } = useAuth()
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    bio: user.bio || "",
    photoFile: null as File | null
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

      setFormData(prev => ({ ...prev, photoFile: file }))
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, photoFile: null }))
    setPreviewImage(null)
  }

  const handleSave = async () => {
    if (!currentUser) {
      error("Authentication required", "Please log in to update your profile")
      return
    }

    if (!formData.displayName.trim()) {
      error("Validation error", "Display name is required")
      return
    }

    if (!isFirebaseConfigured || !firebaseDb) {
      // Mock functionality for demo mode
      handleMockSave()
      return
    }

    setIsLoading(true)

    try {
      let photoURL = user.photoURL

      // Upload new image if provided
      if (formData.photoFile && firebaseStorage) {
        const imageRef = ref(firebaseStorage, `avatars/${currentUser.uid}/${Date.now()}_${formData.photoFile.name}`)
        const snapshot = await uploadBytes(imageRef, formData.photoFile)
        photoURL = await getDownloadURL(snapshot.ref)
      }

      // Update user document
      const userRef = doc(firebaseDb, 'users', currentUser.uid)
      await updateDoc(userRef, {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim() || null,
        photoURL: photoURL,
        updatedAt: serverTimestamp()
      })

      // Update current user's auth profile
      if (formData.displayName !== currentUser.displayName) {
        // Note: In a real app, you'd also update the Firebase Auth profile
        // await updateProfile(currentUser, { displayName: formData.displayName })
      }

      const updatedUser: UserData = {
        ...user,
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim() || undefined,
        photoURL: photoURL
      }

      onSave(updatedUser)

    } catch (err: any) {
      console.error('Error updating profile:', err)
      error("Update failed", err.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMockSave = () => {
    const updatedUser: UserData = {
      ...user,
      displayName: formData.displayName.trim(),
      bio: formData.bio.trim() || undefined,
      photoURL: previewImage || user.photoURL
    }
    onSave(updatedUser)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your profile information
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6 space-y-6">
              {/* Profile Picture */}
              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={previewImage || user.photoURL} />
                    <AvatarFallback className="text-lg">
                      {formData.displayName.charAt(0) || user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.photoFile ? "Change Image" : "Upload Image"}
                      </label>
                    </Button>
                    {formData.photoFile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    placeholder="Enter your display name"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="pl-10 min-h-[100px] resize-none"
                    maxLength={500}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !formData.displayName.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
