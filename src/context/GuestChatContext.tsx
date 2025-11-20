import React, { createContext, useContext, useState, useEffect } from "react"

interface GuestUser {
  id: string
  name: string
  email?: string
  avatar?: string
}

interface GuestChatContextValue {
  guestUser: GuestUser | null
  setGuestUser: (user: GuestUser | null) => void
  isGuest: boolean
}

const GuestChatContext = createContext<GuestChatContextValue | undefined>(undefined)

export function GuestChatProvider({ children }: { children: React.ReactNode }) {
  const [guestUser, setGuestUserState] = useState<GuestUser | null>(null)

  useEffect(() => {
    // Load guest user from localStorage
    try {
      const stored = localStorage.getItem("pnx_guest_user")
      if (stored) {
        setGuestUserState(JSON.parse(stored))
      }
    } catch {}
  }, [])

  const setGuestUser = (user: GuestUser | null) => {
    setGuestUserState(user)
    if (user) {
      localStorage.setItem("pnx_guest_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("pnx_guest_user")
    }
  }

  return (
    <GuestChatContext.Provider value={{ guestUser, setGuestUser, isGuest: !!guestUser }}>
      {children}
    </GuestChatContext.Provider>
  )
}

export function useGuestChat() {
  const ctx = useContext(GuestChatContext)
  if (!ctx) throw new Error("useGuestChat must be used within GuestChatProvider")
  return ctx
}


