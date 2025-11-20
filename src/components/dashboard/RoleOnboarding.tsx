import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Store,
  ShoppingBag,
  ArrowRight,
  Shield,
  Sparkles,
  TrendingUp,
  Gift,
  Star,
  Users,
  CheckCircle
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebaseClient"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

const STORAGE_KEY = "pnx_user_role"
const ONBOARD_DONE_KEY = 'pnx_onboarding_done'

type Role = "seller" | "buyer" | "both"

export function RoleOnboarding({ onComplete }: { onComplete: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role | null>(null)
  const [step, setStep] = useState<number>(1)
  const [interests, setInterests] = useState<string[]>([])
  const [displayName, setDisplayName] = useState<string>("")
  const [notificationsOptIn, setNotificationsOptIn] = useState<boolean>(true)
  const { currentUser } = useAuth()

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === "seller" || raw === "buyer" || raw === "both") {
      onComplete(raw as Role)
    }
  }, [onComplete])

  const choose = (role: Role) => {
    setSelected(role)
  }

  const continueNext = async () => {
    if (step === 1) {
      if (!selected) return
      setStep(2)
      return
    }

    if (step === 2) {
      setStep(3)
      return
    }

    // step 3 => finalize
    if (!selected) return

    // Persist locally for routing robustness
    localStorage.setItem(STORAGE_KEY, selected)
    localStorage.setItem(ONBOARD_DONE_KEY, '1')

    // Persist in Firestore if available
    try {
      if (isFirebaseConfigured && firebaseDb && currentUser) {
        const userRef = doc(firebaseDb, 'users', currentUser.uid)
        const snap = await getDoc(userRef)
        const existing: any = snap.exists() ? snap.data() : {}
        const finalDisplayName = displayName || currentUser.displayName || existing.displayName || currentUser.email?.split('@')[0] || ''
        await setDoc(userRef, {
          ...existing,
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: finalDisplayName,
          role: selected,
          interests: interests,
          preferences: { notificationsOptIn },
          onboardingCompleted: true,
          updatedAt: serverTimestamp(),
          createdAt: existing?.createdAt || serverTimestamp()
        }, { merge: true })

        // Ensure role-specific profiles are created
        if (selected === 'seller' || selected === 'both') {
          await setDoc(doc(firebaseDb, 'sellers', currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: finalDisplayName,
            createdAt: serverTimestamp()
          }, { merge: true })
        }
        if (selected === 'buyer' || selected === 'both') {
          await setDoc(doc(firebaseDb, 'buyers', currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: finalDisplayName,
            createdAt: serverTimestamp()
          }, { merge: true })
        }
      }
    } catch (err) {
      // Non-blocking; proceed even if persistence fails
      console.warn('Failed to persist onboarding', err)
    }

    onComplete(selected)
  }

  const interestOptions = [
    'Copywriting', 'Marketing', 'Design', 'Development', 'Automation', 'Research', 'Chatbots', 'Midjourney', 'SEO'
  ]

  const toggleInterest = (name: string) => {
    setInterests(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name])
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="text-center mb-10">
        <Badge variant="secondary" className="mb-2">
          <Sparkles className="h-3 w-3 mr-1" /> Welcome to PromptX
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {step === 1 && 'How do you want to use the platform?'}
          {step === 2 && 'What are you interested in?'}
          {step === 3 && 'Set up your profile'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {step === 1 && 'Select a role to tailor your dashboard experience. You can switch later.'}
          {step === 2 && 'Pick a few topics to personalize your recommendations.'}
          {step === 3 && 'Add basic details so others can recognize you.'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seller Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={`cursor-pointer transition-all ${selected === 'seller' ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`} onClick={() => choose('seller')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Store className="h-5 w-5 text-primary" />
                  I'm a Seller
                </CardTitle>
                <Badge variant="outline" className="gap-1">
                  <Shield className="h-3 w-3" /> Verified support
                </Badge>
              </div>
              <CardDescription>Upload, manage and sell your prompts. Track earnings and growth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" /> Sales analytics and payouts
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" /> Followers and customer management
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" /> Reviews and ratings
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Buyer Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className={`cursor-pointer transition-all ${selected === 'buyer' ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`} onClick={() => choose('buyer')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  I'm a Buyer
                </CardTitle>
                <Badge variant="outline" className="gap-1">
                  <Gift className="h-3 w-3" /> Deals & bundles
                </Badge>
              </div>
              <CardDescription>Discover top prompts, manage purchases, and access downloads.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-purple-600" /> Curated recommendations
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" /> Secure checkout
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-slate-600" /> Buyer protection
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Both Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className={`cursor-pointer transition-all ${selected === 'both' ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`} onClick={() => choose('both')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Store className="h-5 w-5 text-primary" />
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  I want Both
                </CardTitle>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" /> Full access
                </Badge>
              </div>
              <CardDescription>Sell your prompts and also buy from others. Switch anytime.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" /> Earnings + purchases in one place
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" /> Grow audience and discover creators
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-slate-600" /> All protections apply
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleInterest(opt)}
                  className={`border rounded-lg px-3 py-2 text-sm text-left transition-colors ${interests.includes(opt) ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-sm font-medium">Display name</label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Ali Raza" className="mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <input id="notify" type="checkbox" checked={notificationsOptIn} onChange={(e) => setNotificationsOptIn(e.target.checked)} />
              <label htmlFor="notify" className="text-sm text-muted-foreground">Send me important updates and tips</label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-end mt-6 gap-2">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button onClick={continueNext} disabled={step === 1 && !selected}>
          {step < 3 ? 'Continue' : 'Finish'} <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}








