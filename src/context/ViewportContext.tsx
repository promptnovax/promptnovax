import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type Breakpoint = "mobile" | "tablet" | "desktop" | "large"

type ViewportState = {
  width: number
  height: number
  breakpoint: Breakpoint
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  safeAreaTop: number
  safeAreaBottom: number
}

const DEFAULT_STATE: ViewportState = {
  width: 1440,
  height: 900,
  breakpoint: "desktop",
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  safeAreaTop: 0,
  safeAreaBottom: 0
}

const ViewportContext = createContext<ViewportState>(DEFAULT_STATE)

const getBreakpoint = (width: number): Breakpoint => {
  if (width < 640) return "mobile"
  if (width < 1024) return "tablet"
  if (width < 1440) return "desktop"
  return "large"
}

const computeSafeArea = () => {
  if (typeof window === "undefined" || !window.visualViewport) {
    return { top: 0, bottom: 0 }
  }

  const { offsetTop, height, pageTop } = window.visualViewport
  const top = Math.max(offsetTop ?? pageTop ?? 0, 0)
  const bottom = Math.max(
    (window.innerHeight - (offsetTop ?? 0) - height),
    0
  )

  return { top, bottom }
}

export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ViewportState>(DEFAULT_STATE)

  const updateViewport = useCallback(() => {
    if (typeof window === "undefined") return

    const width = window.innerWidth
    const height = window.innerHeight
    const breakpoint = getBreakpoint(width)
    const { top, bottom } = computeSafeArea()

    setState({
      width,
      height,
      breakpoint,
      isMobile: breakpoint === "mobile",
      isTablet: breakpoint === "tablet",
      isDesktop: breakpoint === "desktop" || breakpoint === "large",
      safeAreaTop: top,
      safeAreaBottom: bottom
    })
  }, [])

  useEffect(() => {
    updateViewport()
    if (typeof window === "undefined") return

    window.addEventListener("resize", updateViewport)
    window.visualViewport?.addEventListener("resize", updateViewport)
    window.visualViewport?.addEventListener("scroll", updateViewport)

    return () => {
      window.removeEventListener("resize", updateViewport)
      window.visualViewport?.removeEventListener("resize", updateViewport)
      window.visualViewport?.removeEventListener("scroll", updateViewport)
    }
  }, [updateViewport])

  useEffect(() => {
    if (typeof document === "undefined") return
    document.body.dataset.breakpoint = state.breakpoint
    document.documentElement.style.setProperty("--safe-area-top", `${state.safeAreaTop}px`)
    document.documentElement.style.setProperty("--safe-area-bottom", `${state.safeAreaBottom}px`)
  }, [state.breakpoint, state.safeAreaTop, state.safeAreaBottom])

  const memoized = useMemo(() => state, [state])

  return (
    <ViewportContext.Provider value={memoized}>
      {children}
    </ViewportContext.Provider>
  )
}

export const useViewport = () => useContext(ViewportContext)

