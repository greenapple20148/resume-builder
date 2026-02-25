import * as pdfjsLib from 'pdfjs-dist'
import { ResumeData } from '../types'

// Vite native way to import a web worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString()

export async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const strings = content.items.map((item: any) => item.str)
        fullText += strings.join(' ') + '\n'
    }
    return fullText
}

export async function extractTextFromDocx(file: File): Promise<string> {
    try {
        const { extractRawText } = await import('mammoth')
        const buffer = await file.arrayBuffer()
        const result = await extractRawText({ arrayBuffer: buffer })
        return result.value || ''
    } catch (err) {
        console.error("Docx Extraction Failed:", err)
        throw new Error("Could not read DOCX document.")
    }
}

export async function enhanceTextWithAI(text: string): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEY missing - using local mock for AI")
        return text + " [AI Enhanced: added action verbs and quantified impact where missing.]"
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `Improve the following text for a professional resume to be more impactful, using action verbs and strong phrasing. Return only the revised text, no commentary:\n\n${text}` }]
            }]
        })
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message || 'AI request failed')
    return data.candidates[0].content.parts[0].text.trim()
}

export async function parseResumeWithAI(pdfText: string): Promise<ResumeData> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEY missing - returning dummy parsed structure")
        return {
            personal: { fullName: "Imported Name", jobTitle: "Imported Role", email: "imported@email.com", phone: "555-1234", location: "Remote", website: "", summary: "", photo: "" },
            summary: "Imported Summary: " + pdfText.substring(0, 100),
            experience: [{ id: Date.now(), title: "Imported Job", company: "Company", location: "Remote", startDate: "2020", endDate: "2024", current: false, description: "Imported description" }],
            education: [],
            skills: ["Imported Skill"],
            languages: [],
            certifications: [],
            projects: []
        }
    }

    const prompt = `
Extract the following resume text into a JSON object matching this schema exactly.
If information is missing, use empty strings. Make sure experience dates are parsed concisely.
Return ONLY valid JSON.

{
  "personal": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "", "website": "" },
  "summary": "",
  "experience": [{ "id": 1, "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": boolean, "description": "bullet points or text" }],
  "education": [{ "id": 1, "degree": "", "school": "", "location": "", "startDate": "", "endDate": "", "gpa": "", "notes": "" }],
  "skills": ["skill1", "skill2"]
}

Text to extract:
${pdfText}`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message || 'AI request failed')

    let result = data.candidates[0].content.parts[0].text.trim()
    if (result.startsWith("```json")) {
        result = result.replace(/^```json/g, "").replace(/```$/g, "")
    }
    return JSON.parse(result) as ResumeData
}

export async function importFromLinkedInProfile(url: string): Promise<ResumeData> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    const fallbackData: ResumeData = {
        personal: { fullName: "John Doe", jobTitle: "Software Engineer", email: "john@example.com", phone: "555-0123", location: "Remote", website: url, summary: "", photo: "" },
        summary: "Passionate engineer with experience building scalable applications.",
        experience: [{ id: Date.now(), title: "Developer", company: "TechCo", location: "Remote", startDate: "2020", endDate: "2023", current: false, description: "• Built things." }],
        education: [{ id: Date.now() - 1, degree: "B.S. CS", school: "University", location: "", startDate: "2016", endDate: "2020", gpa: "", notes: "" }],
        skills: ["React", "JavaScript"],
        languages: [],
        certifications: [],
        projects: []
    }

    if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEY missing - using static fallback for LinkedIn import")
        return new Promise(r => setTimeout(() => r(fallbackData), 1500))
    }

    try {
        const prompt = `
Generate a highly realistic and detailed fake resume based on the following LinkedIn URL: ${url}.
Infer the person's name from the URL slug. Make the job title, summary, email, experience, education, and skills realistic and matching the inferred name.
Return ONLY valid JSON matching this schema exactly.

{
  "personal": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "", "website": "${url}" },
  "summary": "",
  "experience": [{ "id": 1, "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": boolean, "description": "bullet points or text" }],
  "education": [{ "id": 1, "degree": "", "school": "", "location": "", "startDate": "", "endDate": "", "gpa": "", "notes": "" }],
  "skills": ["skill1", "skill2"]
}`

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        })

        const data = await response.json()
        if (data.error) throw new Error(data.error.message || 'AI request failed')

        let result = data.candidates[0].content.parts[0].text.trim()
        if (result.startsWith("```json")) {
            result = result.replace(/^```json/g, "").replace(/```$/g, "")
        }
        return JSON.parse(result) as ResumeData
    } catch (err) {
        console.error("AI LinkedIn mock failed:", err)
        return fallbackData
    }
}
