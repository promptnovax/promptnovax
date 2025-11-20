import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FollowButton } from "@/components/FollowButton"
import { useAuth } from "@/context/AuthContext"
import { ContactButtons } from "@/components/contact/ContactButtons"
import { 
  Edit,
  Plus,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Star,
  Heart,
  Download,
  Eye,
  MessageCircle
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

interface ProfileHeaderProps {
  user: UserData
  isOwner: boolean
  onEditProfile: () => void
  onAddNewPrompt: () => void
}

export function ProfileHeader({ user, isOwner, onEditProfile, onAddNewPrompt }: ProfileHeaderProps) {
  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="relative">
      {/* Gradient Banner */}
      <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center md:items-start space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback className="text-2xl font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isOwner && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="absolute -bottom-2 -right-2"
                    >
                      <Button
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={onEditProfile}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">{user.totalPrompts || 0}</div>
                    <div className="text-xs text-muted-foreground">Prompts</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">{user.followers.length}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">{user.following.length}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{user.displayName}</h1>
                    {isOwner && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(user.createdAt)}
                    </div>
                    {user.email && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-4 w-4" />
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {user.bio}
                  </motion.p>
                )}

                {/* Performance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-semibold">{user.totalLikes || 0}</div>
                      <div className="text-xs text-muted-foreground">Total Likes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Download className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-semibold">{user.totalDownloads || 0}</div>
                      <div className="text-xs text-muted-foreground">Downloads</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-semibold">4.8</div>
                      <div className="text-xs text-muted-foreground">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {isOwner ? (
                  <>
                    <Button onClick={onEditProfile} className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={onAddNewPrompt} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Prompt
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2 w-full">
                    <FollowButton 
                      sellerId={user.uid} 
                      sellerName={user.displayName}
                    />
                    <ContactButtons
                      userId={user.uid}
                      userName={user.displayName}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
