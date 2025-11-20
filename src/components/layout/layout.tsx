import { PremiumNavbar } from "./PremiumNavbar"
import { Footer } from "./footer"
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle"
import { FloatingQuickNav } from "@/components/ui/floating-quick-nav"

interface LayoutProps {
  children: React.ReactNode
  currentPage?: string
  showFooter?: boolean
}

export function Layout({ children, currentPage, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PremiumNavbar currentPage={currentPage} />
      <main className="flex-1">
        {children}
      </main>
      <FloatingThemeToggle />
      {currentPage === "home" && <FloatingQuickNav />}
      {showFooter && <Footer />}
    </div>
  )
}
