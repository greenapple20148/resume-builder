'use client'
import { create } from 'zustand'
import { supabase } from './supabase'
import { Profile, Resume, CoverLetter, SaveStatus } from '../types'
import { getEffectivePlan } from './expressUnlock'
import { cacheUserPlan } from './aiProvider'
import { saveVersionSnapshot } from './resumeVersions'

interface StoreState {
  user: any | null
  profile: Profile | null
  authLoading: boolean
  resumes: Resume[]
  currentResume: Resume | null
  resumesLoading: boolean
  saveStatus: SaveStatus
  coverLetters: CoverLetter[]
  coverLettersLoading: boolean
  setUser: (user: any) => void
  setProfile: (profile: Profile | null) => void
  setAuthLoading: (loading: boolean) => void
  initAuth: () => Promise<void>
  fetchProfile: (userId: string) => Promise<Profile | null>
  updateProfile: (updates: { full_name?: string; email?: string }) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signInWithLinkedIn: () => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  fetchResumes: () => Promise<Resume[] | undefined>
  createResume: (themeId?: string, initialData?: any) => Promise<Resume>
  setCurrentResume: (resume: Resume | null) => void
  updateResume: (id: string, updates: Partial<Resume>) => Promise<void>
  deleteResume: (id: string) => Promise<void>
  deleteAllResumes: () => Promise<void>
  duplicateResume: (resume: Resume) => Promise<Resume>
  fetchCoverLetters: () => Promise<CoverLetter[] | undefined>
  createCoverLetter: (data: Partial<CoverLetter>) => Promise<CoverLetter>
  updateCoverLetter: (id: string, updates: Partial<CoverLetter>) => Promise<void>
  deleteCoverLetter: (id: string) => Promise<void>
}

export const useStore = create<StoreState>((set, get) => ({
  // Auth
  user: null,
  profile: null,
  authLoading: true,

  // Resumes
  resumes: [],
  currentResume: null,
  resumesLoading: false,

  // Cover Letters
  coverLetters: [],
  coverLettersLoading: false,

  // UI
  saveStatus: 'saved',

  // Actions
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setAuthLoading: (authLoading) => set({ authLoading }),

  initAuth: async () => {
    // Global safety net: authLoading MUST resolve within 8 seconds no matter what
    const safetyTimeout = setTimeout(() => {
      const state = get()
      if (state.authLoading) {
        console.warn('[auth] Safety timeout — forcing authLoading: false after 8s')
        set({ authLoading: false })
      }
    }, 8000)

    try {
      const isAuthCallback = typeof window !== 'undefined' &&
        (window.location.search.includes('code=') ||
          window.location.hash.includes('access_token=') ||
          window.location.hash.includes('error_description='))

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          set({ user: session.user })
          // Fire-and-forget profile fetch in listener — don't block auth
          get().fetchProfile(session.user.id).catch(() => { })
          if (isAuthCallback) set({ authLoading: false })
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, profile: null, resumes: [], currentResume: null })
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          set({ user: session.user })
        } else if (event === 'INITIAL_SESSION') {
          if (isAuthCallback && !session?.user) {
            set({ authLoading: false })
          }
        }
      })

      let session: any = null
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('getSession_timeout')), 5000))
        ])
        session = result.data.session
      } catch {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const ref = supabaseUrl?.split('//')[1]?.split('.')[0]
        const raw = localStorage.getItem(`sb-${ref}-auth-token`)
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (parsed?.user) session = parsed
          } catch { /* ignore */ }
        }
      }

      if (session?.user) {
        set({ user: session.user })
        // Fetch profile with timeout — don't let it block authLoading
        try {
          await Promise.race([
            get().fetchProfile(session.user.id),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('fetchProfile_timeout')), 5000))
          ])
        } catch {
          console.warn('[auth] fetchProfile timed out — continuing without profile')
        }
      }

      if (!isAuthCallback) {
        set({ authLoading: false })
      } else {
        setTimeout(() => set({ authLoading: false }), 4000)
      }
    } catch (err) {
      console.error('[auth] initAuth crashed:', err)
      set({ authLoading: false })
    } finally {
      clearTimeout(safetyTimeout)
    }
  },

  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      const profile = data as Profile
      set({ profile })
      cacheUserPlan(getEffectivePlan(profile))
      return profile
    }

    // Profile doesn't exist — auto-create it (trigger may have failed)
    if (error?.code === 'PGRST116') {
      // getUser() can also deadlock — race with timeout
      let authUser: any = null
      try {
        const result = await Promise.race([
          supabase.auth.getUser(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('getUser_timeout')), 5000))
        ])
        authUser = result.data.user
      } catch { /* timeout or error */ }
      if (authUser) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || '',
            plan: 'free',
          }, { onConflict: 'id' })
          .select()
          .single()

        if (newProfile) {
          const profile = newProfile as Profile
          set({ profile })
          cacheUserPlan(getEffectivePlan(profile))
          return profile
        }
      }
    }
    return null
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) throw new Error('Not authenticated')

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: updates.full_name })
      .eq('id', user.id)

    if (profileError) throw profileError

    // Update auth metadata (can deadlock — wrap with timeout)
    try {
      const authResult = await Promise.race([
        supabase.auth.updateUser({ data: { full_name: updates.full_name } }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('updateUser_timeout')), 5000))
      ])
      if (authResult.error) throw authResult.error
    } catch (e: any) {
      if (e.message !== 'updateUser_timeout') throw e
    }

    // If email is being changed
    if (updates.email && updates.email !== user.email) {
      try {
        const emailResult = await Promise.race([
          supabase.auth.updateUser({ email: updates.email }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('updateUser_timeout')), 5000))
        ])
        if (emailResult.error) throw emailResult.error
      } catch (e: any) {
        if (e.message !== 'updateUser_timeout') throw e
      }
    }

    // Refresh profile
    await get().fetchProfile(user.id)
  },

  signUp: async (email, password, fullName) => {
    // 1. Securely check if email already exists using our RPC
    // (Bypasses Supabase's default email enumeration shielding)
    const { data: emailExists, error: checkError } = await supabase.rpc('check_email_exists', { lookup_email: email })
    if (checkError) throw checkError
    if (emailExists) {
      throw new Error('User already registered')
    }

    // 2. Perform the actual signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/welcome`,
      },
    })

    if (error) throw error
    return data
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw error
    return data
  },

  signInWithLinkedIn: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    // signOut() can also deadlock via getSession() — don't let it block the UI
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((resolve) => setTimeout(resolve, 3000))
      ])
    } catch { /* ignore */ }
    // Always clear local state regardless of whether signOut succeeded
    const ref = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]
    if (ref) {
      localStorage.removeItem(`sb-${ref}-auth-token`)
    }
    set({ user: null, profile: null, resumes: [], currentResume: null, coverLetters: [] })
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset-password`,
    })
    if (error) throw error
  },

  updatePassword: async (newPassword) => {
    try {
      const result = await Promise.race([
        supabase.auth.updateUser({ password: newPassword }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('updateUser_timeout')), 5000))
      ])
      if (result.error) throw result.error
    } catch (e: any) {
      if (e.message === 'updateUser_timeout') throw new Error('Password update timed out. Please try again.')
      throw e
    }
  },

  fetchResumes: async () => {
    const { user } = get()
    if (!user) return

    set({ resumesLoading: true })

    // Race against a timeout so loading never hangs forever
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000))
    const query = supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    const result = await Promise.race([query, timeout])

    if (result && 'data' in result && !result.error) {
      set({ resumes: (result.data as Resume[]) || [] })
    }
    set({ resumesLoading: false })
    return (result && 'data' in result ? result.data : get().resumes) as Resume[]
  },

  createResume: async (themeId = 'classic', initialData = null) => {
    const { user, profile } = get()
    if (!user) throw new Error('Not authenticated')

    // Ensure we have a valid session before making API calls (can deadlock — skip if timeout)
    try {
      await Promise.race([
        supabase.auth.refreshSession(),
        new Promise((resolve) => setTimeout(resolve, 3000))
      ])
    } catch { /* ignore refresh failures */ }

    // Check resume limit based on user's effective plan (accounts for Express Unlock)
    const planLimits: Record<string, number> = { free: 1, pro: 5, premium: 10, career_plus: Infinity }
    const currentPlan = getEffectivePlan(profile)
    const resumeLimit = planLimits[currentPlan] || 1

    if (resumeLimit !== Infinity) {
      const { count, error: countError } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (!countError && count !== null && count >= resumeLimit) {
        throw new Error('LIMIT_REACHED')
      }
    }

    const defaultData = initialData || {
      personal: {
        fullName: '',
        jobTitle: '',
        email: user.email || '',
        phone: '',
        location: '',
        website: '',
        summary: '',
        photo: '',
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
    }

    console.log('[store] Step 3: Inserting resume...')
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        theme_id: themeId,
        title: initialData && initialData.personal?.fullName ? `${initialData.personal.fullName}'s Resume` : 'My Resume',
        data: defaultData,
      })
      .select()
      .single()

    console.log('[store] Step 4: Insert result:', { data, error })
    if (error) throw error
    const newResume = data as Resume
    set((state) => ({ resumes: [newResume, ...state.resumes], currentResume: newResume }))
    return newResume
  },

  setCurrentResume: (resume) => set({ currentResume: resume }),

  updateResume: async (id, updates) => {
    set({ saveStatus: 'saving' })

    set((state) => ({
      currentResume: state.currentResume?.id === id
        ? { ...state.currentResume, ...updates }
        : state.currentResume,
      resumes: state.resumes.map((r) => r.id === id ? { ...r, ...updates } : r),
    }))

    const { error } = await supabase
      .from('resumes')
      .update({ ...updates, last_edited_at: new Date().toISOString() })
      .eq('id', id)

    set({ saveStatus: error ? 'error' : 'saved' })
    if (error) throw error

    // Auto-snapshot for version history (Pro+ only, non-blocking)
    if (updates.data) {
      const { user, profile, currentResume } = get()
      const plan = getEffectivePlan(profile)
      if (user && plan !== 'free') {
        saveVersionSnapshot(
          id,
          user.id,
          updates.data,
          currentResume?.title,
          currentResume?.theme_id,
        ).catch(() => { }) // silent
      }
    }
  },

  deleteResume: async (id) => {
    const { user } = get()
    if (!user) throw new Error('Not authenticated')
    console.log('[store] Deleting resume:', id)
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) {
      console.error('[store] Delete error:', error)
      throw error
    }
    console.log('[store] Delete successful')
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
      currentResume: state.currentResume?.id === id ? null : state.currentResume,
    }))
  },

  deleteAllResumes: async () => {
    const { user } = get()
    if (!user) throw new Error('Not authenticated')
    console.log('[store] Deleting all resumes for user:', user.id)
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('user_id', user.id)
    if (error) {
      console.error('[store] Delete all error:', error)
      throw error
    }
    console.log('[store] Delete all successful')
    set({ resumes: [], currentResume: null })
  },

  duplicateResume: async (resume) => {
    const { user } = get()
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        title: `${resume.title} (Copy)`,
        theme_id: resume.theme_id,
        data: resume.data,
      })
      .select()
      .single()

    if (error) throw error
    const duplicated = data as Resume
    set((state) => ({ resumes: [duplicated, ...state.resumes] }))
    return duplicated
  },
  // ── Cover Letters ────────────────────────────
  fetchCoverLetters: async () => {
    const { user } = get()
    if (!user) return
    set({ coverLettersLoading: true })
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    if (!error) set({ coverLetters: (data as CoverLetter[]) || [] })
    set({ coverLettersLoading: false })
    return data as CoverLetter[]
  },

  createCoverLetter: async (data) => {
    const { user } = get()
    if (!user) throw new Error('Not authenticated')
    const { data: newCL, error } = await supabase
      .from('cover_letters')
      .insert({
        user_id: user.id,
        title: data.title || `Cover Letter — ${data.company_name || 'Untitled'}`,
        company_name: data.company_name || '',
        job_title: data.job_title || '',
        recipient_name: data.recipient_name || '',
        body: data.body || '',
        tone: data.tone || 'professional',
        resume_id: data.resume_id || null,
      })
      .select()
      .single()
    if (error) throw error
    const cl = newCL as CoverLetter
    set((state) => ({ coverLetters: [cl, ...state.coverLetters] }))
    return cl
  },

  updateCoverLetter: async (id, updates) => {
    set({ saveStatus: 'saving' })
    set((state) => ({
      coverLetters: state.coverLetters.map((cl) =>
        cl.id === id ? { ...cl, ...updates } : cl
      ),
    }))
    const { error } = await supabase
      .from('cover_letters')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    set({ saveStatus: error ? 'error' : 'saved' })
    if (error) throw error
  },

  deleteCoverLetter: async (id) => {
    const { error } = await supabase.from('cover_letters').delete().eq('id', id)
    if (error) throw error
    set((state) => ({
      coverLetters: state.coverLetters.filter((cl) => cl.id !== id),
    }))
  },
}))
