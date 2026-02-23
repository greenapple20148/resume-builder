import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useStore = create((set, get) => ({
  // Auth
  user: null,
  profile: null,
  authLoading: true,

  // Resumes
  resumes: [],
  currentResume: null,
  resumesLoading: false,

  // UI
  saveStatus: 'saved', // 'saved' | 'saving' | 'error'

  // ─── Auth Actions ───────────────────────────────────────────
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

    if (!error && data) set({ profile: data })
    return data
  },

  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
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

  // ─── Resume Actions ──────────────────────────────────────────
  fetchResumes: async () => {
    const { user } = get()
    if (!user) return

    set({ resumesLoading: true })
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (!error) set({ resumes: data || [] })
    set({ resumesLoading: false })
    return data
  },

  createResume: async (themeId = 'classic', initialData = null) => {
    const { user, profile } = get()
    if (!user) throw new Error('Not authenticated')

    // Check plan limits
    const { data: canCreate } = await supabase.rpc('can_create_resume', {
      user_uuid: user.id,
    })
    if (!canCreate) throw new Error('LIMIT_REACHED')

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

    if (error) throw error
    set((state) => ({ resumes: [data, ...state.resumes], currentResume: data }))
    return data
  },

  setCurrentResume: (resume) => set({ currentResume: resume }),

  updateResume: async (id, updates) => {
    set({ saveStatus: 'saving' })

    // Optimistic update
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
    const { error } = await supabase.from('resumes').delete().eq('id', id)
    if (error) throw error
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
    set((state) => ({ resumes: [data, ...state.resumes] }))
    return data
  },
}))
