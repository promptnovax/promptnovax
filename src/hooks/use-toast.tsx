import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { Toast, ToastContainer } from "@/components/ui/toast"

type ToastPayloadVariant = "default" | "destructive" | "success" | "warning" | "info"

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  toast: (payload: { title: string; description?: string; variant?: ToastPayloadVariant; duration?: number }) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "success" })
  }, [addToast])

  const error = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "error" })
  }, [addToast])

  const warning = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "warning" })
  }, [addToast])

  const info = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "info" })
  }, [addToast])

  const toast = useCallback((payload: { title: string; description?: string; variant?: ToastPayloadVariant; duration?: number }) => {
    let mappedType: Toast["type"] = "info"
    if (payload.variant === "destructive") {
      mappedType = "error"
    } else if (payload.variant === "success" || payload.variant === "default") {
      mappedType = "success"
    } else if (payload.variant === "warning") {
      mappedType = "warning"
    }

    addToast({
      title: payload.title,
      description: payload.description,
      type: mappedType,
      duration: payload.duration,
    })
  }, [addToast])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        toast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
