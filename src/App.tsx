import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/hooks/use-toast"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CartProvider } from "@/context/CartContext"
import { GuestChatProvider } from "@/context/GuestChatContext"
import { Layout } from "@/components/layout/layout"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/ui/page-transition"
import { LoginPage } from "@/pages/auth/login"
import { SignupPage } from "@/pages/auth/signup"
import { CommunityPage } from "@/pages/community/community"
import { PostDetailPage } from "@/pages/community/post-detail"
import { CommunityHQPage } from "@/pages/community/hq"
import { CommunityGuidelinesPage } from "@/pages/community/guidelines"
import { CommunityApplyPage } from "@/pages/community/apply"
import { CommunityDeskPage } from "@/pages/community/desk"
import { HelpPage } from "@/pages/help/help"
import { CategoryDetailPage } from "@/pages/help/category-detail"
import { BlogPage } from "@/pages/blog/blog"
import { BlogDetailPage } from "@/pages/blog/blog-detail"
import { BuyerDashboard } from "@/pages/dashboard/buyer-dashboard"
import { BuyerPurchasesPage } from "@/pages/dashboard/buyer/purchases"
import { BuyerSubscriptionsPage } from "@/pages/dashboard/buyer/subscriptions"
import { BuyerAutomationHubPage } from "@/pages/dashboard/buyer/automation"
import { BuyerUsageAnalyticsPage } from "@/pages/dashboard/buyer/analytics"
import { BuyerCollectionsPage } from "@/pages/dashboard/buyer/collections"
import { BuyerBillingPage } from "@/pages/dashboard/buyer/billing"
import { BuyerSupportPage } from "@/pages/dashboard/buyer/support"
import { BuyerSignalsPage } from "@/pages/dashboard/buyer/signals"
import { SellerDashboard } from "@/pages/dashboard/seller-dashboard"
import { SellerUploadPage } from "@/pages/dashboard/seller-upload"
import { SellerIntegrationsPage } from "@/pages/dashboard/seller-integrations"
import { SellerPromptStudioPage } from "@/pages/dashboard/seller-prompt-studio"
import { SellerTestingLabPage } from "@/pages/dashboard/seller-testing-lab"
import { SellerPayoutsPage } from "@/pages/dashboard/seller-payouts"
import { SellerSupportPage } from "@/pages/dashboard/seller-support"
import { SellerPromptDetailPage } from "@/pages/dashboard/seller-prompt-detail"
import { SellerVerificationPage } from "@/pages/dashboard/seller-verification"
import { SellerPricingGuidePage } from "@/pages/dashboard/seller-pricing-guide"
import { SellerPromptLifecyclePage } from "@/pages/dashboard/seller-prompt-lifecycle"
import { SellerLaunchReadinessPage } from "@/pages/dashboard/seller-launch-readiness"
import { SellerAnalyticsPage } from "@/pages/dashboard/seller-analytics"
import { SellerCustomersPage } from "@/pages/dashboard/seller-customers"
import { SellerPromptsPage } from "@/pages/dashboard/seller-prompts"
import { SellerSettingsPage } from "@/pages/dashboard/seller-settings"
import { SellerTestHistoryPage } from "@/pages/dashboard/seller-test-history"
import { SellerTestScenariosPage } from "@/pages/dashboard/seller-test-scenarios"
import { CreatePromptPage as DashboardCreatePromptPage } from "@/pages/dashboard/create-prompt"
import { SlidesPage } from "@/pages/slides/slides"
import { ResetPasswordPage } from "@/pages/auth/reset-password"
import { MarketplacePage } from "@/pages/marketplace/marketplace"
import { PromptDetailPage as MarketplacePromptDetailPage } from "@/pages/marketplace/prompt-detail"
import { PromptDetailPage as DynamicPromptDetailPage } from "@/pages/marketplace/prompt-detail-dynamic"
import { SellerProfilePage } from "@/pages/marketplace/seller-profile"
import { UserSellerChatPage } from "@/pages/chat/user-seller-chat"
import { InboxPage } from "@/pages/chat/inbox"
import { SellerPage } from "@/pages/seller/seller"
import { SellerListingsPage } from "@/pages/seller/listings"
import { GeneratorPage } from "@/pages/generator/generator"
import { ChatPage } from "@/pages/chat/chat"
import { PricingPage } from "@/pages/pricing/pricing"
import { AboutPage } from "@/pages/about/about"
import { FAQPage } from "@/pages/faq/faq"
import { ContactPage } from "@/pages/contact/contact"
import { TermsPage } from "@/pages/terms/terms"
import { PrivacyPage } from "@/pages/privacy/privacy"
import { CareersPage } from "@/pages/careers/careers"
import { DocsPage } from "@/pages/docs/docs"
import { DashboardOverview } from "@/pages/dashboard/overview"
import { DashboardPage } from "@/pages/dashboard/dashboard"
import { DashboardIndex } from "@/pages/dashboard/index"
import { DashboardGenerator } from "@/pages/dashboard/generator"
import { DashboardChatbot } from "@/pages/dashboard/chatbot"
import { DashboardSettings } from "@/pages/dashboard/settings"
import { DashboardBilling } from "@/pages/dashboard/billing"
import { UserProfilePage } from "@/pages/user/[uid]"
import { CreatePromptPage } from "@/pages/prompts/create"
import { PromptEditPage } from "@/pages/prompts/edit/[id]"
import { PromptDetailPage as NewPromptDetailPage } from "@/pages/prompts/[id]"
import { MarketplaceIndex } from "@/pages/marketplace/index"
import { InboxIndex } from "@/pages/inbox/index"
import { ConversationDetailPage } from "@/pages/inbox/[conversationId]"
import { NotificationsPage } from "@/pages/notifications/index"
import { CreatorDashboard } from "@/pages/dashboard/creator-dashboard"
import { CreatorProfilePage } from "@/pages/creator/[username]"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EnhancedHomePage } from "@/pages/home/enhanced-home"
import { UnauthorizedPage } from "@/pages/unauthorized/unauthorized"
import { DemoModeBanner } from "@/components/DemoModeBanner"
import { isFirebaseConfigured } from "@/lib/firebaseClient"
import { TemplatesIndexPage } from "@/pages/templates/index"
import { ApiStudioPage } from "@/pages/studio/api"
import { IntegrationsIndexPage } from "@/pages/integrations/index"
import { FeaturesIndexPage } from "@/pages/features/index"
import { FeedbackPage } from "@/pages/feedback/feedback"
import { PromptGeneratorPage } from "@/pages/prompt-generator/prompt-generator"

type Page =
  | "home"
  | "login"
  | "signup"
  | "reset-password"
  | "dashboard"
  | "marketplace"
  | "marketplace/detail"
  | "generator"
  | "prompt-generator"
  | "chat"
  | "slides"
  | "community"
  | "community/post-detail"
  | "community/hq"
  | "community/guidelines"
  | "community/apply"
  | "community/desk/changelog"
  | "community/desk/team"
  | "community/desk/escalations"
  | "help"
  | "help/account"
  | "help/billing"
  | "help/prompts"
  | "help/ai-tools"
  | "help/troubleshooting"
  | "help/integrations"
  | "blog"
  | "blog/detail"
  | "dashboard/buyer"
  | "dashboard/buyer/purchases"
  | "dashboard/buyer/subscriptions"
  | "dashboard/buyer/automation"
  | "dashboard/buyer/analytics"
  | "dashboard/buyer/collections"
  | "dashboard/buyer/billing"
  | "dashboard/buyer/support"
  | "dashboard/buyer/signals"
  | "dashboard/seller"
  | "dashboard/seller/integrations"
  | "dashboard/seller/prompt-studio"
  | "dashboard/seller/testing"
  | "dashboard/seller/create"
  | "dashboard/create-prompt"
  | "pricing"
  | "about"
  | "faq"
  | "contact"
  | "terms"
  | "privacy"
  | "careers"
  | "docs"
  | "dashboard/overview"
  | "dashboard/generator"
  | "dashboard/chatbot"
  | "dashboard/settings"
  | "dashboard/billing"
  | "seller"
  | "seller/upload"
  | "seller/listings"
  | "unauthorized"
  | "user"
  | "dashboard/index"
  | "prompts"
  | "prompts/create"
  | "prompts/edit"
  | "prompts/detail"
  | "marketplace/index"
  | "inbox"
  | "inbox/conversation"
  | "notifications"
  | "dashboard/creator"
  | "creator"
  | "templates/index"
  | "studio/api"
  | "studio/api/blueprint"
  | "studio/api/composer"
  | "studio/api/ops"
  | "integrations/index"
  | "features/index"
  | "feedback"

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Ignite Your{" "}
            <span className="text-primary">AI Imagination</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate perfect AI prompts for ChatGPT, Claude, Midjourney, and 20+ AI platforms. 
            Transform your ideas into powerful prompts that deliver exceptional results.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            Start Creating Prompts
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            View Examples
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center space-y-4 p-6 rounded-lg border">
          <div className="text-4xl">🚀</div>
          <h3 className="text-xl font-semibold">Lightning Fast</h3>
          <p className="text-muted-foreground">
            Generate professional prompts in seconds with our AI-powered engine.
          </p>
        </div>

        <div className="text-center space-y-4 p-6 rounded-lg border">
          <div className="text-4xl">🎯</div>
          <h3 className="text-xl font-semibold">Precision Crafted</h3>
          <p className="text-muted-foreground">
            Optimized prompts for maximum effectiveness across all major AI platforms.
          </p>
        </div>

        <div className="text-center space-y-4 p-6 rounded-lg border">
          <div className="text-4xl">🔧</div>
          <h3 className="text-xl font-semibold">Customizable</h3>
          <p className="text-muted-foreground">
            Fine-tune prompts to match your specific needs and use cases.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center space-y-6 p-12 rounded-lg bg-muted/50">
        <h2 className="text-3xl font-bold">Ready to Transform Your AI Experience?</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Join thousands of creators who are already using PromptNovaX to unlock the full potential of AI.
        </p>
        <Button size="lg" className="text-lg px-8">
          Get Started Free
        </Button>
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home")

  // Handle routing with proper URL updates
  const handleRoute = (page: Page) => {
    setCurrentPage(page)
    window.history.pushState({}, '', `#${page}`)
  }

  // Check URL hash on load and handle browser navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1) as Page
    if (hash && hash !== currentPage) {
      setCurrentPage(hash)
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const hash = window.location.hash.slice(1) as Page
      if (hash) {
        setCurrentPage(hash)
      } else {
        setCurrentPage("home")
      }
    }

    // Handle custom navigate events from Link components
    const handleNavigate = (e: CustomEvent) => {
      const page = e.detail.href as Page
      handleRoute(page)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('navigate', handleNavigate as EventListener)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('navigate', handleNavigate as EventListener)
    }
  }, [currentPage])

  const renderPage = () => {
          // Handle inbox pages
          if (currentPage.startsWith("inbox/")) {
            const inboxPath = currentPage.split("/")
            if (inboxPath[1] === "conversation") {
              const conversationId = inboxPath[2]
              return <ConversationDetailPage conversationId={conversationId} />
            }
          }

          // Handle chat pages
          if (currentPage.startsWith("chat/")) {
            const chatParts = currentPage.split("/")
            const chatId = chatParts[1]
            
            if (chatId === "inbox") {
              return <InboxPage />
            } else if (chatId === "guest") {
              // Guest messaging - sellerId is in chatParts[2]
              const sellerId = chatParts[2] || chatParts[1]
              return <UserSellerChatPage sellerId={sellerId} isGuest={true} />
            } else {
              return <UserSellerChatPage sellerId={chatId} />
            }
          }

      // Handle user profile pages
      if (currentPage.startsWith("user/")) {
        const userId = currentPage.split("/")[1]
        return <UserProfilePage uid={userId} />
      }

      // Handle creator profile pages
      if (currentPage.startsWith("creator/")) {
        const username = currentPage.split("/")[1]
        return <CreatorProfilePage username={username} />
      }

    // Handle prompt pages
    if (currentPage.startsWith("prompts/")) {
      const promptPath = currentPage.split("/")
      if (promptPath[1] === "create") {
        return <CreatePromptPage />
      } else if (promptPath[1] === "edit") {
        const promptId = promptPath[2]
        return <PromptEditPage id={promptId} />
      } else {
        const promptId = promptPath[1]
        return <NewPromptDetailPage id={promptId} />
      }
    }

    // Handle seller profile pages
    if (currentPage.startsWith("seller-profile/")) {
      const sellerId = currentPage.split("/")[1]
      return <SellerProfilePage sellerId={sellerId} />
    }

          // Handle marketplace pages
          if (currentPage.startsWith("marketplace/")) {
            if (currentPage === "marketplace/index") {
              return <MarketplaceIndex />
            } else if (currentPage !== "marketplace") {
              const promptId = currentPage.split("/")[1]
              return <DynamicPromptDetailPage promptId={promptId} />
            }
          }

    // Handle dedicated community sub-pages
    if (currentPage === "community/hq") {
      return <CommunityHQPage />
    }
    if (currentPage === "community/guidelines") {
      return <CommunityGuidelinesPage />
    }
    if (currentPage === "community/apply") {
      return <CommunityApplyPage />
    }
    if (currentPage.startsWith("community/desk/")) {
      const view = currentPage.split("/")[2] as "changelog" | "team" | "escalations"
      return <CommunityDeskPage view={view} />
    }
    if (currentPage.startsWith("community/") && currentPage !== "community") {
      return <PostDetailPage />
    }

    // Handle help category pages
    if (currentPage.startsWith("help/") && currentPage !== "help") {
      const categoryId = currentPage.split("/")[1]
      return <CategoryDetailPage categoryId={categoryId} />
    }

    // Handle blog detail pages
    if (currentPage.startsWith("blog/") && currentPage !== "blog") {
      const postId = currentPage.split("/")[1]
      return <BlogDetailPage postId={postId} />
    }

    // Handle dashboard pages
    if (currentPage.startsWith("dashboard/")) {
      const dashboardType = currentPage.split("/")[1]
      if (dashboardType === "index") {
        return <DashboardIndex />
      } else if (dashboardType === "buyer") {
        const parts = currentPage.split("/")
        const subPage = parts[2]
        if (!subPage) {
          return <BuyerDashboard />
        }
        if (subPage === "purchases") {
          return <BuyerPurchasesPage />
        }
        if (subPage === "subscriptions") {
          return <BuyerSubscriptionsPage />
        }
        if (subPage === "automation") {
          return <BuyerAutomationHubPage />
        }
        if (subPage === "analytics") {
          return <BuyerUsageAnalyticsPage />
        }
        if (subPage === "collections") {
          return <BuyerCollectionsPage />
        }
        if (subPage === "billing") {
          return <BuyerBillingPage />
        }
        if (subPage === "support") {
          return <BuyerSupportPage />
        }
        if (subPage === "signals") {
          return <BuyerSignalsPage />
        }
        return <BuyerDashboard />
      } else if (dashboardType === "seller") {
        const parts = currentPage.split("/")
        const subPage = parts[2]
        
        // Handle seller prompt detail pages: dashboard/seller/prompts/{promptId}
        if (subPage === "prompts" && parts[3]) {
          return <SellerPromptDetailPage />
        }
        
        // Handle other seller sub-pages
        if (subPage === "create") {
          return <SellerUploadPage />
        } else if (subPage === "verification") {
          return <SellerVerificationPage />
        } else if (subPage === "pricing-guide") {
          return <SellerPricingGuidePage />
        } else if (subPage === "prompt-lifecycle" || subPage === "lifecycle") {
          return <SellerPromptLifecyclePage />
        } else if (subPage === "launch-readiness") {
          return <SellerLaunchReadinessPage />
        } else if (subPage === "analytics") {
          return <SellerAnalyticsPage />
        } else if (subPage === "customers") {
          return <SellerCustomersPage />
        } else if (subPage === "prompts") {
          return <SellerPromptsPage />
        } else if (subPage === "settings") {
          return <SellerSettingsPage />
        } else if (subPage === "test-history") {
          return <SellerTestHistoryPage />
        } else if (subPage === "test-scenarios") {
          return <SellerTestScenariosPage />
        } else if (subPage === "payouts") {
          return <SellerPayoutsPage />
        } else if (subPage === "prompt-studio" || subPage === "studio") {
          return <SellerPromptStudioPage />
        } else if (subPage === "testing" || subPage === "testing-lab") {
          return <SellerTestingLabPage />
        } else if (subPage === "integrations") {
          return <SellerIntegrationsPage />
        } else if (subPage === "support") {
          return <SellerSupportPage />
        }
        
        return <SellerDashboard />
      } else if (dashboardType === "create-prompt") {
        return <DashboardCreatePromptPage />
      }
    }

    switch (currentPage) {
      case "login":
        return <LoginPage />
      case "signup":
        return <SignupPage />
      case "reset-password":
        return <ResetPasswordPage />
      case "marketplace":
        return <MarketplaceIndex />
      case "generator":
        return <GeneratorPage />
      case "prompt-generator":
        return <PromptGeneratorPage />
      case "chat":
        return <ChatPage />
      case "slides":
        return <SlidesPage />
      case "pricing":
        return <PricingPage />
      case "feedback":
        return <FeedbackPage />
      case "about":
        return <AboutPage />
      case "faq":
        return <FAQPage />
      case "contact":
        return <ContactPage />
      case "terms":
        return <TermsPage />
      case "privacy":
        return <PrivacyPage />
      case "careers":
        return <CareersPage />
      case "docs":
        return <DocsPage />
      case "templates/index":
        return <TemplatesIndexPage />
      case "studio/api":
        return <ApiStudioPage />
      case "studio/api/blueprint":
        return <ApiStudioPage initialSection="blueprint" restrictToSection />
      case "studio/api/composer":
        return <ApiStudioPage initialSection="composer" restrictToSection />
      case "studio/api/ops":
        return <ApiStudioPage initialSection="ops" restrictToSection />
      case "integrations/index":
        return <IntegrationsIndexPage />
      case "features/index":
        return <FeaturesIndexPage />
      case "help":
        return <HelpPage />
      case "blog":
        return <BlogPage />
      case "seller":
        return <SellerPage />
      case "seller/upload":
        return <SellerUploadPage />
      case "seller/listings":
        return <SellerListingsPage />
      case "community":
        return <CommunityPage />
      case "dashboard":
        return <DashboardPage />
        case "dashboard/index":
          return <DashboardIndex />
        case "dashboard/creator":
          return <CreatorDashboard />
        case "dashboard/overview":
          return <DashboardOverview />
        case "dashboard/generator":
          return <DashboardGenerator />
        case "dashboard/chatbot":
          return <DashboardChatbot />
        case "dashboard/settings":
          return <DashboardSettings />
        case "dashboard/billing":
          return <DashboardBilling />
      case "dashboard/seller":
        return <SellerDashboard />
      case "dashboard/seller/integrations":
        return <SellerIntegrationsPage />
      case "dashboard/seller/prompt-studio":
        return <SellerPromptStudioPage />
      case "dashboard/seller/testing":
        return <SellerTestingLabPage />
      case "dashboard/seller/payouts":
        return <SellerPayoutsPage />
      case "dashboard/seller/support":
        return <SellerSupportPage />
      case "dashboard/seller/verification":
        return <SellerVerificationPage />
      case "dashboard/seller/pricing-guide":
        return <SellerPricingGuidePage />
      case "dashboard/buyer":
        return <BuyerDashboard />
            case "prompts/create":
              return <CreatePromptPage />
            case "inbox":
              return <InboxIndex />
            case "notifications":
              return <NotificationsPage />
            case "unauthorized":
              return <UnauthorizedPage />
            default:
              return <EnhancedHomePage />
    }
  }

  // Check if current page is a dashboard sub-page
    const isDashboardPage = currentPage?.startsWith("dashboard") && currentPage !== "dashboard/creator"
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="promptnovax-theme">
      <AuthProvider>
        <TooltipProvider>
          <ToastProvider>
          {!isFirebaseConfigured && <DemoModeBanner />}
          <AnimatePresence mode="wait">
        {currentPage === "dashboard/creator" ? (
          <PageTransition key={currentPage}>
            {renderPage()}
          </PageTransition>
        ) : isDashboardPage ? (
          <PageTransition key={currentPage}>
            <DashboardLayout currentPage={currentPage}>
              {renderPage()}
            </DashboardLayout>
          </PageTransition>
        ) : currentPage === "chat" ? (
          <PageTransition key="chat">
            <ChatPage />
          </PageTransition>
        ) : (
          <PageTransition key={currentPage}>
            <CartProvider>
              <GuestChatProvider>
                <Layout currentPage={currentPage}>
                  {renderPage()}
                </Layout>
              </GuestChatProvider>
            </CartProvider>
          </PageTransition>
        )}
          </AnimatePresence>
          </ToastProvider>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App