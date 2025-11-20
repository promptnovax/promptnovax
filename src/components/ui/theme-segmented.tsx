import { useTheme } from "@/components/theme-provider"
import { Monitor, Sun, Moon } from "lucide-react"

export function ThemeSegmented() {
  const { theme, setTheme } = useTheme()

  const Item = ({ value, children }: { value: "system" | "light" | "dark"; children: React.ReactNode }) => (
    <button
      onClick={() => setTheme(value)}
      className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
        theme === value ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
      aria-label={`Set ${value} theme`}
    >
      {children}
    </button>
  )

  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-muted/50 border px-3 py-2 backdrop-blur">
      <Item value="system"><Monitor className="h-4 w-4" /></Item>
      <Item value="light"><Sun className="h-4 w-4" /></Item>
      <Item value="dark"><Moon className="h-4 w-4" /></Item>
    </div>
  )
}

export default ThemeSegmented


