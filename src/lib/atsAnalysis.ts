'use client'
// src/lib/atsAnalysis.ts — AI-powered ATS resume analysis with optional JD matching
//
// Uses the unified AI provider (Gemini/Claude) to simulate real ATS parsing,
// keyword detection, and recruiter-level feedback.

import { callAI } from './aiProvider'
import type { ResumeData } from '../types'

// ── Types ─────────────────────────────────────────────────

export interface ATSAnalysisResult {
    ats_score: number
    job_match_score: number | null   // null if no JD provided
    detected_sections: {
        name: boolean
        contact: boolean
        summary: boolean
        skills: boolean
        experience: boolean
        education: boolean
        certifications: boolean
    }
    strengths: string[]
    issues: string[]
    missing_keywords: string[]
    suggested_improvements: string[]
    section_feedback: {
        section: string
        score: number
        feedback: string
    }[]
}

// ── System Prompt ─────────────────────────────────────────

const ATS_SYSTEM_PROMPT = `You are an Applicant Tracking System (ATS) and recruiter assistant.

Your job is to analyze a resume exactly how an ATS would process it when screening candidates for a job.

TASKS:

1. Parse the resume and identify these sections:
- Name
- Contact information (email, phone, location)
- Summary / Objective
- Skills
- Work Experience
- Education
- Certifications

2. Simulate ATS parsing and detect potential issues such as:
- Missing section headers
- Missing contact information
- Weak keyword presence
- Inconsistent job titles
- Lack of quantified achievements (numbers, percentages, dollar amounts)
- Weak action verbs ("helped", "assisted", "worked on" instead of "led", "built", "increased")
- Too short or too long descriptions
- Missing dates

3. If a job description is provided:
- Compare resume keywords against the job description
- Identify missing important keywords (technical skills, tools, certifications)
- Calculate a "Job Match Score" from 0–100

4. Evaluate the resume quality and assign an ATS Score from 0–100.

5. For each detected section, provide a score (0-100) and specific feedback.

SCORING RULES:
- Be realistic and strict like a real ATS filter
- A score of 90+ means the resume is excellent and would pass most ATS systems
- A score of 70-89 means good but has room for improvement
- A score of 50-69 means significant issues that may cause ATS rejection
- Below 50 means the resume needs major work
- Focus on relevance to the job description when provided
- Penalize missing quantified achievements heavily
- Reward strong action verbs and specific metrics

OUTPUT: Return ONLY valid JSON matching this exact schema (no markdown, no code fences):

{
  "ats_score": number,
  "job_match_score": number_or_null,
  "detected_sections": {
    "name": boolean,
    "contact": boolean,
    "summary": boolean,
    "skills": boolean,
    "experience": boolean,
    "education": boolean,
    "certifications": boolean
  },
  "strengths": ["string"],
  "issues": ["string"],
  "missing_keywords": ["string"],
  "suggested_improvements": ["string"],
  "section_feedback": [
    { "section": "string", "score": number, "feedback": "string" }
  ]
}`

// ── Build resume text from structured data ────────────────

function resumeDataToText(data: ResumeData): string {
    const lines: string[] = []

    // Personal
    const p = data.personal || {} as any
    if (p.fullName) lines.push(`Name: ${p.fullName}`)
    if (p.jobTitle) lines.push(`Title: ${p.jobTitle}`)

    const contact: string[] = []
    if (p.email) contact.push(p.email)
    if (p.phone) contact.push(p.phone)
    if (p.location) contact.push(p.location)
    if (p.website) contact.push(p.website)
    if (contact.length) lines.push(`Contact: ${contact.join(' | ')}`)

    // Summary
    if (data.personal?.summary || data.summary) {
        lines.push('\n--- SUMMARY ---')
        lines.push(data.personal?.summary || data.summary || '')
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
        lines.push('\n--- SKILLS ---')
        lines.push(data.skills.join(', '))
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
        lines.push('\n--- WORK EXPERIENCE ---')
        data.experience.forEach((e) => {
            const dateRange = [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ')
            lines.push(`\n${e.title || 'Untitled'} at ${e.company || 'Unknown Company'}`)
            if (e.location) lines.push(`Location: ${e.location}`)
            if (dateRange) lines.push(`Period: ${dateRange}`)
            if (e.description) lines.push(e.description)
        })
    }

    // Education
    if (data.education && data.education.length > 0) {
        lines.push('\n--- EDUCATION ---')
        data.education.forEach((e) => {
            lines.push(`${e.degree || 'Degree'} — ${e.school || 'School'}`)
            if (e.location) lines.push(`Location: ${e.location}`)
            const dateRange = [e.startDate, e.endDate].filter(Boolean).join(' – ')
            if (dateRange) lines.push(`Period: ${dateRange}`)
            if (e.gpa) lines.push(`GPA: ${e.gpa}`)
            if (e.notes) lines.push(e.notes)
        })
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
        lines.push('\n--- CERTIFICATIONS ---')
        data.certifications.forEach((c) => {
            lines.push(`${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}`)
        })
    }

    // Languages
    if (data.languages && data.languages.length > 0) {
        lines.push('\n--- LANGUAGES ---')
        data.languages.forEach((l) => {
            lines.push(`${l.language}${l.level ? ` (${l.level})` : ''}`)
        })
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
        lines.push('\n--- PROJECTS ---')
        data.projects.forEach((p) => {
            lines.push(`${p.name}${p.tech ? ` [${p.tech}]` : ''}`)
            if (p.description) lines.push(p.description)
        })
    }

    return lines.join('\n')
}

// ── Main analysis function ────────────────────────────────

export async function analyzeResume(
    resumeData: ResumeData,
    jobDescription?: string
): Promise<ATSAnalysisResult> {
    const resumeText = resumeDataToText(resumeData)

    let userPrompt = `Analyze this resume:\n\n${resumeText}`

    if (jobDescription && jobDescription.trim().length > 0) {
        userPrompt += `\n\n--- JOB DESCRIPTION ---\n${jobDescription.trim()}`
        userPrompt += `\n\nCompare the resume against this job description and provide a job_match_score.`
    } else {
        userPrompt += `\n\nNo job description provided. Set job_match_score to null.`
    }

    const result = await callAI({
        systemPrompt: ATS_SYSTEM_PROMPT,
        prompt: userPrompt,
        temperature: 0.3,
        maxTokens: 2000,
        jsonMode: true,
        feature: 'ats_analysis',
    })

    // Parse the JSON response
    let parsed: ATSAnalysisResult
    try {
        // Strip any markdown code fences if present
        let cleanText = result.text.trim()
        if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
        }
        parsed = JSON.parse(cleanText)
    } catch (e) {
        console.error('[atsAnalysis] Failed to parse AI response:', result.text)
        throw new Error('Failed to parse ATS analysis. Please try again.')
    }

    // Validate and clamp scores
    parsed.ats_score = Math.max(0, Math.min(100, Math.round(parsed.ats_score || 0)))
    if (parsed.job_match_score !== null && parsed.job_match_score !== undefined) {
        parsed.job_match_score = Math.max(0, Math.min(100, Math.round(parsed.job_match_score)))
    } else {
        parsed.job_match_score = null
    }

    // Ensure arrays exist
    parsed.strengths = parsed.strengths || []
    parsed.issues = parsed.issues || []
    parsed.missing_keywords = parsed.missing_keywords || []
    parsed.suggested_improvements = parsed.suggested_improvements || []
    parsed.section_feedback = parsed.section_feedback || []

    return parsed
}
