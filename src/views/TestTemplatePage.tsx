'use client'
// src/pages/TestTemplatePage.tsx — Dev-only page for rendering templates with fake data
// Usage: /test-template?id=exec_ledger  (renders that template)
//        /test-template?id=all          (renders ALL templates in sequence)
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { PREVIEW_MAP } from './ThemesPreviews'
import type { ResumeData } from '../types'

// ── Realistic Fake Resume Data ─────────────────────────
const FAKE_DATA: Partial<ResumeData> = {
    personal: {
        fullName: 'Alexandra Chen',
        jobTitle: 'Senior Product Manager',
        email: 'alexandra.chen@example.com',
        phone: '(415) 555-0192',
        location: 'San Francisco, CA',
        website: 'alexchen.io',
        photo: '',
        summary: '',
    },
    summary: 'Results-driven product leader with 8+ years of experience driving cross-functional teams to deliver innovative SaaS products. Proven track record of launching features that increased user engagement by 40% and revenue by $2.5M annually. Passionate about data-informed decision making and customer-centric design.',
    experience: [
        {
            id: 1, title: 'Senior Product Manager', company: 'Stripe', location: 'San Francisco, CA',
            startDate: 'Jan 2021', endDate: '', current: true,
            description: 'Led the development of Stripe Terminal SDK, growing merchant adoption by 65% in 18 months\nManaged a team of 12 engineers and 3 designers across 2 time zones\nDefined product roadmap resulting in 3 major feature launches generating $4.2M ARR\nEstablished OKR framework adopted by 5 other product teams across the organization',
        },
        {
            id: 2, title: 'Product Manager', company: 'Figma', location: 'San Francisco, CA',
            startDate: 'Mar 2018', endDate: 'Dec 2020', current: false,
            description: 'Spearheaded the Auto Layout feature launch, reaching 2M+ active users within 6 months\nConducted 200+ user interviews to identify pain points and prioritize feature backlog\nCollaborated with engineering to reduce load times by 35% through performance optimization\nDrove 28% increase in enterprise plan conversions through targeted feature development',
        },
        {
            id: 3, title: 'Associate Product Manager', company: 'Google', location: 'Mountain View, CA',
            startDate: 'Jul 2016', endDate: 'Feb 2018', current: false,
            description: 'Contributed to Google Maps local search improvements serving 1B+ monthly users\nAnalyzed user behavior data to inform A/B testing strategy, improving click-through rates by 18%\nCoordinated with 4 engineering teams to deliver quarterly feature releases on schedule',
        },
    ],
    education: [
        { id: 1, school: 'Stanford University', degree: 'MBA, Technology Management', startDate: '2014', endDate: '2016', gpa: '3.9' },
        { id: 2, school: 'UC Berkeley', degree: 'B.S. Computer Science', startDate: '2010', endDate: '2014', gpa: '3.7' },
    ],
    skills: ['Product Strategy', 'Agile / Scrum', 'SQL & Data Analysis', 'Figma & Sketch', 'A/B Testing', 'User Research', 'Roadmap Planning', 'Stakeholder Management', 'Python', 'JIRA & Confluence'],
    languages: [
        { id: 1, language: 'English', level: 'Native' },
        { id: 2, language: 'Mandarin', level: 'Fluent' },
        { id: 3, language: 'Spanish', level: 'Intermediate' },
    ],
    certifications: [
        { id: 1, name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: '2022' },
        { id: 2, name: 'Google Analytics Professional', issuer: 'Google', date: '2021' },
    ],
    projects: [
        { id: 1, name: 'AI Resume Builder', description: 'Built a full-stack resume creation platform with AI-powered content suggestions and ATS optimization', tech: 'React, TypeScript, Node.js, OpenAI API', url: 'github.com/alexchen/resumeai' },
        { id: 2, name: 'Market Pulse Dashboard', description: 'Real-time competitive analysis dashboard for product teams with automated alerts', tech: 'Python, D3.js, PostgreSQL', url: '' },
    ],
} as any

// ── Extended 2-Page Resume Data ────────────────────────
// Heavy content to force templates onto 2+ pages
const EXTENDED_DATA: Partial<ResumeData> = {
    personal: {
        fullName: 'Alexandra Chen',
        jobTitle: 'VP of Product & Engineering',
        email: 'alexandra.chen@example.com',
        phone: '(415) 555-0192',
        location: 'San Francisco, CA',
        website: 'alexchen.io',
        photo: '',
        summary: '',
    },
    summary: 'Visionary product and engineering leader with 14+ years of experience spanning enterprise SaaS, consumer fintech, and developer tools. Proven track record of scaling product organizations from 10 to 80+ people, driving $50M+ ARR growth, and shipping category-defining products used by millions. Deep expertise in AI/ML product strategy, platform architecture, and go-to-market execution. Board advisor to 3 early-stage startups.',
    experience: [
        {
            id: 1, title: 'VP of Product & Engineering', company: 'Stripe', location: 'San Francisco, CA',
            startDate: 'Jan 2022', endDate: '', current: true,
            description: 'Lead a 80-person product and engineering organization across Stripe Terminal, Stripe Connect, and Stripe Identity\nDrove the launch of Stripe Terminal SDK v3, growing merchant adoption by 65% and generating $18M incremental ARR\nEstablished company-wide OKR framework adopted by all 12 product teams, improving cross-team alignment by 40%\nArchitected the migration from monolith to microservices, reducing deployment time from 4 hours to 12 minutes\nMentored and promoted 8 senior ICs to Staff/Principal level through structured career development programs\nNegotiated and closed 3 strategic partnerships worth $12M combined annual contract value',
        },
        {
            id: 2, title: 'Senior Director of Product', company: 'Figma', location: 'San Francisco, CA',
            startDate: 'Mar 2019', endDate: 'Dec 2021', current: false,
            description: 'Built and led the 25-person product team responsible for Figma\'s core editor and Dev Mode\nSpearheaded the Auto Layout v4 feature launch, reaching 2M+ active users within 6 months and becoming the #1 requested feature\nConducted 200+ user interviews and synthesized insights into a 3-year product vision presented to the board\nCollaborated with engineering to reduce editor load times by 35% through strategic performance optimization\nDrove 28% increase in enterprise plan conversions ($8M ARR) through targeted feature development\nLaunched Figma Community marketplace, onboarding 50K+ creators in the first quarter',
        },
        {
            id: 3, title: 'Product Manager', company: 'Google', location: 'Mountain View, CA',
            startDate: 'Jul 2016', endDate: 'Feb 2019', current: false,
            description: 'Owned the Google Maps local search experience serving 1B+ monthly active users across 220 countries\nAnalyzed user behavior data to inform A/B testing strategy, improving click-through rates by 18% and driving $200M+ ad revenue\nCoordinated with 4 engineering teams across 3 offices to deliver quarterly feature releases on schedule\nBuilt and shipped the "Popular Times" feature, now used by 500M+ users monthly to plan visits',
        },
        {
            id: 4, title: 'Associate Product Manager', company: 'Dropbox', location: 'San Francisco, CA',
            startDate: 'Jun 2014', endDate: 'Jun 2016', current: false,
            description: 'Managed the Dropbox Paper product from beta to general availability, growing to 1M+ active documents\nDesigned the real-time collaboration engine supporting 50+ concurrent editors per document\nPartnered with the growth team to optimize the onboarding funnel, increasing Day-7 retention by 22%\nLed the integration with Slack and Zoom, driving 15% increase in weekly active usage',
        },
        {
            id: 5, title: 'Software Engineer', company: 'LinkedIn', location: 'Sunnyvale, CA',
            startDate: 'Aug 2012', endDate: 'May 2014', current: false,
            description: 'Developed the LinkedIn Skills endorsement backend system processing 10M+ endorsements daily\nOptimized the news feed ranking algorithm, improving engagement metrics by 12%\nBuilt internal A/B testing framework used by 200+ engineers across the organization',
        },
        {
            id: 6, title: 'Software Engineering Intern', company: 'Microsoft', location: 'Redmond, WA',
            startDate: 'Jun 2011', endDate: 'Aug 2011', current: false,
            description: 'Developed automated testing infrastructure for the Office 365 team\nBuilt a performance monitoring dashboard tracking 50+ metrics in real-time\nWon the intern hackathon with a natural language query tool for internal documentation',
        },
    ],
    education: [
        { id: 1, school: 'Stanford University', degree: 'MBA, Technology Management', startDate: '2014', endDate: '2016', gpa: '3.9' },
        { id: 2, school: 'UC Berkeley', degree: 'B.S. Computer Science, Magna Cum Laude', startDate: '2008', endDate: '2012', gpa: '3.85' },
        { id: 3, school: 'MIT Sloan', degree: 'Executive Certificate in Strategy & Innovation', startDate: '2022', endDate: '2022', gpa: '' },
    ],
    skills: [
        'Product Strategy & Vision', 'Agile / Scrum / SAFe', 'SQL & Data Analysis',
        'Figma & Sketch', 'A/B Testing & Experimentation', 'User Research & Synthesis',
        'Roadmap Planning & Prioritization', 'Stakeholder Management', 'Python & R',
        'JIRA & Confluence', 'Machine Learning / AI', 'Revenue Growth & Monetization',
        'Team Building & Mentorship', 'Public Speaking & Thought Leadership', 'API Design & Developer Experience',
    ],
    languages: [
        { id: 1, language: 'English', level: 'Native' },
        { id: 2, language: 'Mandarin Chinese', level: 'Fluent (HSK 6)' },
        { id: 3, language: 'Spanish', level: 'Professional Working' },
        { id: 4, language: 'Japanese', level: 'Conversational' },
    ],
    certifications: [
        { id: 1, name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: '2022' },
        { id: 2, name: 'Google Analytics Professional Certificate', issuer: 'Google', date: '2021' },
        { id: 3, name: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2020' },
        { id: 4, name: 'Stanford LEAD Certificate in Corporate Innovation', issuer: 'Stanford GSB', date: '2023' },
        { id: 5, name: 'Professional Scrum Master I (PSM I)', issuer: 'Scrum.org', date: '2019' },
    ],
    projects: [
        { id: 1, name: 'AI Resume Builder (ResumeCraft)', description: 'Full-stack resume creation platform with AI-powered content suggestions, ATS optimization scoring, and 50+ premium templates. Serving 10K+ monthly active users.', tech: 'Next.js, TypeScript, Supabase, Claude AI, Puppeteer', url: 'resumecraft.io' },
        { id: 2, name: 'Market Pulse Dashboard', description: 'Real-time competitive analysis dashboard for product teams with automated alerts, sentiment tracking, and quarterly trend reports.', tech: 'Python, D3.js, PostgreSQL, Redis', url: 'github.com/alexchen/marketpulse' },
        { id: 3, name: 'DevMetrics CLI', description: 'Open-source command-line tool for engineering teams to track DORA metrics, deployment frequency, and change failure rates.', tech: 'Go, GitHub API, Datadog', url: 'github.com/alexchen/devmetrics' },
        { id: 4, name: 'Product Analytics Toolkit', description: 'Internal analytics framework for rapid experimentation, user segmentation, and impact measurement across product teams.', tech: 'Python, Apache Spark, Looker', url: '' },
    ],
} as any

const ALL_TEMPLATE_IDS = Object.keys(PREVIEW_MAP)

export default function TestTemplatePage() {
    const params = useSearchParams()
    const templateId = params.get('id') || 'classic'
    const dataMode = params.get('data') || 'standard'
    const showAll = templateId === 'all'
    const templatesToRender = showAll ? ALL_TEMPLATE_IDS : [templateId]
    const resumeData = dataMode === 'extended' ? EXTENDED_DATA : FAKE_DATA

    return (
        <div style={{ background: '#e5e5e5', minHeight: '100vh', padding: showAll ? '20px' : 0 }}>
            {/* Page title for "all" mode */}
            {showAll && (
                <div style={{ textAlign: 'center', padding: '20px 0 30px', fontFamily: 'Inter, sans-serif' }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                        All Templates ({ALL_TEMPLATE_IDS.length}) {dataMode === 'extended' && '— 2-Page Mode'}
                    </h1>
                    <p style={{ fontSize: 14, color: '#666', marginTop: 6 }}>
                        {dataMode === 'extended'
                            ? 'Extended data (2-page) — "Alexandra Chen, VP of Product & Engineering"'
                            : 'Rendered with fake data — "Alexandra Chen, Senior Product Manager"'
                        }
                    </p>
                </div>
            )}

            {templatesToRender.map((id) => {
                const Component = PREVIEW_MAP[id]
                if (!Component) {
                    return (
                        <div key={id} style={{ padding: 40, color: 'red', fontFamily: 'monospace' }}>
                            Template "{id}" not found in PREVIEW_MAP
                        </div>
                    )
                }

                return (
                    <div key={id} style={{ marginBottom: showAll ? 40 : 0 }}>
                        {/* Template label for "all" mode */}
                        {showAll && (
                            <div style={{
                                fontFamily: 'Inter, monospace', fontSize: 13, fontWeight: 600,
                                color: '#333', padding: '8px 16px', background: '#d4d4d4',
                                borderRadius: '8px 8px 0 0', maxWidth: 794, margin: '0 auto',
                                letterSpacing: 0.5,
                            }}>
                                {id}
                            </div>
                        )}
                        <div
                            id={showAll ? `template-${id}` : 'resume-preview-root'}
                            data-template-id={id}
                            style={{ width: 794, margin: '0 auto', boxShadow: showAll ? '0 4px 24px rgba(0,0,0,0.15)' : 'none' }}
                        >
                            <Component data={resumeData} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
