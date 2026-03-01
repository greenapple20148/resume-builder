import { create } from 'zustand'
import { supabase } from './supabase'
import { Profile, Resume, CoverLetter, SaveStatus } from '../types'

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
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      set({ user: session.user })
      await get().fetchProfile(session.user.id)
    }
    set({ authLoading: false })

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        set({ user: session.user })
        await get().fetchProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, profile: null, resumes: [], currentResume: null })
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        set({ user: session.user })
      }
    })
  },

  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      set({ profile: data as Profile })
      return data as Profile
    }

    // Profile doesn't exist — auto-create it (trigger may have failed)
    if (error?.code === 'PGRST116') {
      const { data: { user: authUser } } = await supabase.auth.getUser()
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
          set({ profile: newProfile as Profile })
          return newProfile as Profile
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

    // Update auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: updates.full_name },
    })
    if (authError) throw authError

    // If email is being changed
    if (updates.email && updates.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: updates.email,
      })
      if (emailError) throw emailError
    }

    // Refresh profile
    await get().fetchProfile(user.id)
  },

  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
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
    await supabase.auth.signOut()
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset-password`,
    })
    if (error) throw error
  },

  updatePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
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

  createResume: async (themeId = 'editorial_luxe', initialData = null) => {
    const { user } = get()
    if (!user) throw new Error('Not authenticated')

    // Ensure we have a valid session before making API calls
    console.log('[store] Step 1: Refreshing session...')
    const { error: sessionError } = await supabase.auth.refreshSession()
    if (sessionError) console.warn('[store] Session refresh warning:', sessionError.message)
    console.log('[store] Step 2: Checking resume count...')

    // Check resume limit with a simple count instead of RPC
    const { count, error: countError } = await supabase
      .from('resumes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (!countError && count !== null && count >= 10) {
      throw new Error('LIMIT_REACHED')
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
