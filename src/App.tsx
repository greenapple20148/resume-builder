import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './lib/store'
import { useTheme } from './lib/useTheme'
import './styles/global.css'
import './styles/terminal.css'
import './styles/healthcare.css'
import './styles/nature.css'
import './styles/scifi.css'
import './styles/sophisticated.css'
import './styles/vintage.css'
import './styles/graduate.css'
import './styles/futuristic.css'
import { Analytics } from "@vercel/analytics/react"

// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import ThemesPage from './pages/ThemesPage'
import EditorPage from './pages/EditorPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import PricingPage from './pages/PricingPage'
import NotFoundPage from './pages/NotFoundPage'

// Components
import { Toast } from './components/Toast'

interface RouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: RouteProps) {
  const { user, authLoading } = useStore()

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--parchment)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: '300',
            marginBottom: '20px',
            color: 'var(--ink)',
          }}>
            Resume<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>BuildIn</em>
          </div>
          <div className="spinner" style={{ margin: '0 auto', color: 'var(--gold)' }} />
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function PublicRoute({ children }: RouteProps) {
  const { user, authLoading } = useStore()
  if (authLoading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  const { initAuth } = useStore()
  useTheme() // Initialize theme on mount (sets data-theme attribute)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/themes" element={<ThemesPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/editor/new" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="/editor/:id" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}
