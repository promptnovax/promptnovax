import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/components/ui/link"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { postJson } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  ArrowRight,
  ShoppingCart,
  Sparkles,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { BrandLogo } from "@/components/visuals/BrandLogo"

export function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [userType, setUserType] = useState<"buyer" | "seller" | "both">("buyer")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const { success, error } = useToast()
  const { signup, loginWithGoogle, currentUser, userRole } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userRole) {
      // Redirect to dashboard based on user role
      const redirectPath = userRole.role === "seller" ? "#dashboard/seller" : (userRole.role === "buyer" ? "#dashboard/buyer" : "#dashboard/seller")
      window.location.hash = redirectPath
    }
  }, [currentUser, userRole])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      error("Name is required")
      return false
    }
    if (!formData.email.trim()) {
      error("Email is required")
      return false
    }
    if (formData.password.length < 8) {
      error("Password must be at least 8 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      error("Passwords do not match")
      return false
    }
    if (!agreedToTerms) {
      error("Please agree to the Terms of Service and Privacy Policy")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await postJson<{ ok: boolean }>("/otp/send", { email: formData.email })
      setOtpSent(true)
      success("Verification code sent", "Check your email for the 6-digit code")
    } catch (err: any) {
      error("Signup failed", err.message || "Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyAndCreate = async () => {
    if (!otpCode || otpCode.length < 6) {
      error("Invalid code", "Please enter the 6-digit code")
      return
    }
    setIsLoading(true)
    try {
      await postJson<{ ok: boolean }>("/otp/verify", { email: formData.email, code: otpCode })
      await signup(formData.email, formData.password, userType, formData.name)
      success("Account created successfully!", `Welcome to PromptX as a ${userType}!`)
      
      // Manual redirect after successful signup
      setTimeout(() => {
        const redirectPath = userType === "seller" ? "#dashboard/seller" : (userType === "buyer" ? "#dashboard/buyer" : "#dashboard/seller")
        window.location.hash = redirectPath
        window.location.reload() // Force reload to ensure clean state
      }, 1500)
    } catch (err: any) {
      error("Verification failed", err.message || "Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true)
    try {
      if (provider === "Google") {
        await loginWithGoogle()
        success("Google signup successful!", `Welcome as a ${userType}!`)
        
        // Manual redirect after successful Google signup
        setTimeout(() => {
          const redirectPath = userType === "seller" ? "#dashboard/seller" : (userType === "buyer" ? "#dashboard/buyer" : "#dashboard/seller")
          window.location.hash = redirectPath
          window.location.reload() // Force reload to ensure clean state
        }, 1500)
      } else {
        success(`${provider} signup clicked!`, "Redirecting to authentication...")
      }
    } catch (err: any) {
      error("Social signup failed", err.message || "Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    if (password.length < 6) return { strength: 1, label: "Weak", color: "bg-red-500" }
    if (password.length < 8) return { strength: 2, label: "Fair", color: "bg-yellow-500" }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, label: "Strong", color: "bg-green-500" }
    }
    return { strength: 3, label: "Good", color: "bg-blue-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="text-center space-y-6 pb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
              className="flex items-center justify-center mb-2"
            >
              <BrandLogo />
            </motion.div>
            
            <div>
              <CardTitle className="text-2xl font-bold mb-2">Create your account</CardTitle>
              <CardDescription className="text-base">
                Get started with PromptX today
              </CardDescription>
            </div>

            {/* User Type Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <div className="flex items-center bg-muted/50 rounded-lg p-1">
                <motion.button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    userType === "buyer"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setUserType("buyer")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Buyer
                </motion.button>
                <motion.button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    userType === "seller"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setUserType("seller")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-4 w-4" />
                  Seller
                </motion.button>
                <motion.button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    userType === "both"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setUserType("both")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-4 w-4" />
                  Both
                </motion.button>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 focus:border-primary/50 transition-colors"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 focus:border-primary/50 transition-colors"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    Passwords do not match
                  </div>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                  <div className="flex items-center gap-2 text-sm text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    Passwords match
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center space-x-3"
              >
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded border-gray-300 focus:ring-primary"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link href="#terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </motion.div>

              {!otpSent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
              )}

              {otpSent && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Enter 6-digit code</Label>
                <Input
                  inputMode="numeric"
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="h-12 text-center tracking-widest text-lg"
                />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setOtpSent(false)}>
                    Edit email
                  </Button>
                  <Button type="button" className="flex-1" onClick={handleVerifyAndCreate} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                </div>
              </div>
              )}
            </form>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-1 gap-3"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-center gap-2"
                  onClick={() => handleSocialSignup("Google")}
                >
                  {/* Google "G" mark SVG */}
                  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 28.1 4 22 4 10.9 4 2 12.9 2 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 28.1 4 22 4 14.3 4 7.6 8.6 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29 35.5 26.6 36 24 36c-5.2 0-9.5-3.5-11.1-8.3l-6.5 5C8.6 39.4 15.8 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3.2-3.7 5.7-7 6.7l6.2 5.1C36.9 37.8 40 31.6 40 24c0-1.3-.1-2.7-.4-3.5z"/>
                  </svg>
                  <span>Continue with Google</span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-center text-sm"
            >
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="#login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
