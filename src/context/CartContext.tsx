import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface CartItem {
  id: string
  title: string
  price: number
  imageUrl?: string
  quantity?: number
  category?: string
  description?: string
  sellerId?: string
  sellerName?: string
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  isInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pnx_cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("pnx_cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const found = prev.find(p => p.id === item.id)
      if (found) {
        return prev.map(p => 
          p.id === item.id 
            ? { ...p, quantity: (p.quantity ?? 1) + 1 } 
            : p
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity } : p
      )
    )
  }

  const clear = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.price * (item.quantity ?? 1))
    }, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => {
      return total + (item.quantity ?? 1)
    }, 0)
  }

  const isInCart = (id: string) => {
    return items.some(item => item.id === id)
  }

  const getItemQuantity = (id: string) => {
    const item = items.find(item => item.id === id)
    return item?.quantity ?? 0
  }

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getItemQuantity
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}


