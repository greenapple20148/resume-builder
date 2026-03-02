export interface Profile {
    id: string
    full_name?: string
    email?: string
    plan: 'free' | 'pro' | 'premium' | 'career_plus'
    stripe_customer_id?: string
    stripe_subscription_id?: string
    subscription_status?: string
    subscription_period_end?: string
    mock_sessions_used?: number
    mock_sessions_purchased?: number
}

export interface PersonalInfo {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    website: string
    summary: string
    photo: string
}

export interface ExperienceEntry {
    id: number
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
}

export interface EducationEntry {
    id: number
    degree: string
    school: string
    location: string
    startDate: string
    endDate: string
    gpa: string
    notes: string
}

export interface LanguageEntry {
    id: number
    language: string
    level: string
}

export interface CertificationEntry {
    id: number
    name: string
    issuer: string
    date: string
    url: string
}

export interface ProjectEntry {
    id: number
    name: string
    description: string
    url: string
    tech: string
}

export interface CustomSectionEntry {
    id: number
    title: string
    subtitle: string
    date: string
    description: string
}

export interface CustomSection {
    id: number
    title: string
    entries: CustomSectionEntry[]
}

export interface ResumeData {
    personal: PersonalInfo
    summary: string
    experience: ExperienceEntry[]
    education: EducationEntry[]
    skills: string[]
    languages: LanguageEntry[]
    certifications: CertificationEntry[]
    projects: ProjectEntry[]
    customSections?: CustomSection[]
    hiddenSections?: string[]
    customFont?: string
    customColor?: string
    customFontSize?: number
}

export interface Resume {
    id: string
    user_id: string
    title: string
    theme_id: string
    data: ResumeData
    created_at: string
    updated_at: string
    last_edited_at?: string
}

export interface CoverLetter {
    id: string
    user_id: string
    title: string
    company_name: string
    job_title: string
    recipient_name: string
    body: string
    tone: 'professional' | 'conversational' | 'enthusiastic'
    resume_id?: string
    created_at: string
    updated_at: string
}

export type SaveStatus = 'saved' | 'saving' | 'error'
