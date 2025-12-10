import { PremiumNavbar } from "./PremiumNavbar"
import { Footer } from "./footer"
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle"
import { FloatingQuickNav } from "@/components/ui/floating-quick-nav"
import { useViewport } from "@/context/ViewportContext"
import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
  currentPage?: string
  showFooter?: boolean
}

export function Layout({ children, currentPage, showFooter = true }: LayoutProps) {
  const { isMobile, safeAreaTop, safeAreaBottom } = useViewport()

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{
        paddingTop: isMobile ? safeAreaTop : undefined
      }}
    >
      <PremiumNavbar currentPage={currentPage} />
      <main
        className={cn(
          "flex-1 w-full",
          isMobile ? "px-4 pt-4 pb-6" : ""
        )}
        style={{
          paddingBottom: isMobile ? safeAreaBottom + 24 : undefined
        }}
      >
        {children}
      </main>
      <FloatingThemeToggle />
      {currentPage === "home" && <FloatingQuickNav />}
      {showFooter && <Footer />}
    </div>
  )
}
