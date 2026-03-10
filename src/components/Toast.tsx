'use client'
import { useState, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'default'

interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration: number
}

type ToastListener = (toast: ToastItem) => void

// Global toast state
let toastListeners: ToastListener[] = []
let toastId = 0

export const toast = {
  show(message: string, type: ToastType = 'default', duration = 4000) {
    const id = ++toastId
    toastListeners.forEach((fn) => fn({ id, message, type, duration }))
    return id
  },
  success: (msg: string, dur?: number) => toast.show(msg, 'success', dur),
  error: (msg: string, dur?: number) => toast.show(msg, 'error', dur || 6000),
  info: (msg: string, dur?: number) => toast.show(msg, 'info', dur),
}

export function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const listener: ToastListener = (t) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
      }, t.duration)
    }
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== listener)
    }
  }, [])

  if (toasts.length === 0) return null

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    default: '◈',
  }

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type !== 'default' ? t.type : ''}`}>
          <span>{icons[t.type] || icons.default}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
