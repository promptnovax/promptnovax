import { motion } from "framer-motion"
import { AuthGuard } from "@/components/AuthGuard"
import { PromptForm } from "@/components/prompts/PromptForm"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CreatePromptPage() {
  const { success } = useToast()

  const handleSave = (promptId: string) => {
    success("Prompt created", "Your prompt has been created successfully!")
    // Redirect to user's dashboard or prompts list
    window.location.hash = "#dashboard/index"
  }

  const handleCancel = () => {
    window.location.hash = "#dashboard/index"
  }

  const handleBackToDashboard = () => {
    window.location.hash = "#dashboard/index"
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
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="container mx-auto px-4 py-8"
        >
          <PromptForm
            mode="create"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </motion.div>
      </div>
    </AuthGuard>
  )
}
