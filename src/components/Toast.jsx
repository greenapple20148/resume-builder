import { useState, useCallback, useEffect } from 'react'

// Global toast state
let toastListeners = []
let toastId = 0

export const toast = {
  show(message, type = 'default', duration = 4000) {
    const id = ++toastId
    toastListeners.forEach((fn) => fn({ id, message, type, duration }))
    return id
  },
  success: (msg, dur) => toast.show(msg, 'success', dur),
  error: (msg, dur) => toast.show(msg, 'error', dur || 6000),
  info: (msg, dur) => toast.show(msg, 'info', dur),
}

export function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const listener = (t) => {
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

  const icons = {
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
