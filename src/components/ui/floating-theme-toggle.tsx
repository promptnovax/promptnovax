import { ThemeSegmented } from "@/components/ui/theme-segmented"

export function FloatingThemeToggle() {
  return (
    <div className="fixed bottom-4 right-4 z-40 md:hidden">
      <div className="rounded-full border bg-background/80 backdrop-blur p-2 shadow-lg">
        <ThemeSegmented />
      </div>
    </div>
  )
}

export default FloatingThemeToggle


