import { cn } from "@/lib/utils"
import logoPNG from "@/media/logo-of-pnx.png"

interface BrandLogoProps {
  className?: string
  showWordmark?: boolean
  alt?: string
}

export function BrandLogo({ className, showWordmark = true, alt = "PNX logo" }: BrandLogoProps) {
  return (
    <img
      src={logoPNG}
      alt={alt}
      className={cn(
        "select-none",
        showWordmark ? "h-10 w-auto" : "h-10 w-10",
        className
      )}
      draggable={false}
    />
  )
}


