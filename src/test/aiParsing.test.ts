// src/test/aiParsing.test.ts — Unit tests for AI resume parsing normalization
import { describe, it, expect, vi } from 'vitest'

// Mock the AI provider — we only test the normalization logic
vi.mock('../lib/aiProvider', () => ({
    callAI: vi.fn(),
    getSelectedProvider: vi.fn().mockReturnValue('gemini'),
    getGeminiApiKey: vi.fn().mockReturnValue('fake-key'),
    getClaudeApiKey: vi.fn().mockReturnValue(''),
    isProviderConfigured: vi.fn().mockReturnValue(true),
}))

// Mock supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }) },
        from: vi.fn(() => ({})),
    },
}))

import { callAI } from '../lib/aiProvider'
import { parseResumeWithAI } from '../lib/ai'

const mockCallAI = vi.mocked(callAI)

describe('parseResumeWithAI', () => {
    it('normalizes AI output with "position" → "title" for experience', async () => {
        mockCallAI.mockResolvedValueOnce({
            text: JSON.stringify({
                personal: { fullName: 'John Doe', email: 'john@example.com', phone: '555-1234' },
                experience: [
                    { position: 'Software Engineer', company: 'Acme Corp', startDate: '2020', endDate: 'Present', description: 'Built stuff' },
                ],
                education: [
                    { institution: 'MIT', degree: 'B.S.', field: 'Computer Science', endDate: '2020' },
                ],
                skills: ['JavaScript', 'React'],
                languages: [{ language: 'English', proficiency: 'Native' }],
                projects: [{ name: 'Cool App', technologies: 'React, Node', description: 'A cool app' }],
                certifications: [{ name: 'AWS', issuer: 'Amazon', date: '2023' }],
            }),
            provider: 'gemini',
        })

        const result = await parseResumeWithAI('John Doe\nSoftware Engineer at Acme Corp')

        // Experience: position → title
        expect(result.experience[0].title).toBe('Software Engineer')
        expect(result.experience[0].company).toBe('Acme Corp')
        expect(result.experience[0].id).toBe(1)
        expect(result.experience[0].current).toBe(true) // endDate = "Present"

        // Education: institution → school, field merged with degree
        expect(result.education[0].school).toBe('MIT')
        expect(result.education[0].degree).toBe('B.S. in Computer Science')
        expect(result.education[0].id).toBe(1)

        // Personal: all fields present
        expect(result.personal.fullName).toBe('John Doe')
        expect(result.personal.email).toBe('john@example.com')
        expect(result.personal.photo).toBe('')
        expect(result.personal.summary).toBe('') // summary is top-level

        // Languages: proficiency → level
        expect(result.languages[0].level).toBe('Native')
        expect(result.languages[0].id).toBe(1)

        // Projects: technologies → tech
        expect(result.projects[0].tech).toBe('React, Node')
        expect(result.projects[0].id).toBe(1)

        // Certifications
        expect(result.certifications[0].name).toBe('AWS')
        expect(result.certifications[0].id).toBe(1)

        // Skills untouched
        expect(result.skills).toEqual(['JavaScript', 'React'])
    })

    it('handles AI output already in correct format', async () => {
        mockCallAI.mockResolvedValueOnce({
            text: JSON.stringify({
                personal: { fullName: 'Jane Smith', jobTitle: 'Designer', email: 'jane@test.com', phone: '', location: 'NYC', website: '' },
                summary: 'Experienced designer',
                experience: [{ title: 'Lead Designer', company: 'Design Co', startDate: '2019', endDate: '2023', location: 'NYC', description: 'Led team' }],
                education: [{ school: 'Parsons', degree: 'BFA', startDate: '2015', endDate: '2019', gpa: '3.8' }],
                skills: ['Figma', 'Sketch'],
                languages: [],
                certifications: [],
                projects: [],
            }),
            provider: 'gemini',
        })

        const result = await parseResumeWithAI('Jane Smith\nDesigner')

        expect(result.personal.fullName).toBe('Jane Smith')
        expect(result.personal.jobTitle).toBe('Designer')
        expect(result.experience[0].title).toBe('Lead Designer')
        expect(result.education[0].school).toBe('Parsons')
        expect(result.summary).toBe('Experienced designer')
    })

    it('falls back to heuristic parsing when AI throws', async () => {
        mockCallAI.mockRejectedValueOnce(new Error('API error'))

        const result = await parseResumeWithAI('John Doe\njohn@example.com\n555-1234\n\nSummary\nExperienced professional')

        // Heuristic should at least extract name and email
        expect(result.personal.fullName).toBe('John Doe')
        expect(result.personal.email).toBe('john@example.com')
        expect(result.personal.phone).toBeDefined()
    })

    it('handles empty/minimal AI response gracefully', async () => {
        mockCallAI.mockResolvedValueOnce({
            text: JSON.stringify({ personal: {}, skills: [] }),
            provider: 'gemini',
        })

        const result = await parseResumeWithAI('minimal text')

        expect(result.personal.fullName).toBe('')
        expect(result.experience).toEqual([])
        expect(result.education).toEqual([])
        expect(result.skills).toEqual([])
    })

    it('strips markdown code fences from AI response', async () => {
        mockCallAI.mockResolvedValueOnce({
            text: '```json\n{"personal":{"fullName":"Test"},"skills":["JS"]}\n```',
            provider: 'gemini',
        })

        const result = await parseResumeWithAI('Test resume')

        expect(result.personal.fullName).toBe('Test')
        expect(result.skills).toEqual(['JS'])
    })
})
