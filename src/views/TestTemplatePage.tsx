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

const ALL_TEMPLATE_IDS = Object.keys(PREVIEW_MAP)

export default function TestTemplatePage() {
    const params = useSearchParams()
    const templateId = params.get('id') || 'classic'
    const showAll = templateId === 'all'
    const templatesToRender = showAll ? ALL_TEMPLATE_IDS : [templateId]

    return (
        <div style={{ background: '#e5e5e5', minHeight: '100vh', padding: showAll ? '20px' : 0 }}>
            {/* Page title for "all" mode */}
            {showAll && (
                <div style={{ textAlign: 'center', padding: '20px 0 30px', fontFamily: 'Inter, sans-serif' }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                        All Templates ({ALL_TEMPLATE_IDS.length})
                    </h1>
                    <p style={{ fontSize: 14, color: '#666', marginTop: 6 }}>
                        Rendered with fake data — "Alexandra Chen, Senior Product Manager"
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
                            <Component data={FAKE_DATA} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
