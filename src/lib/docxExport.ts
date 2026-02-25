import { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "../types";

export async function exportToDocx(resumeData: ResumeData, themeId = 'classic', plan = 'free') {
    const d = resumeData || {};
    const personal = d.personal || {};

    const themeColors: Record<string, string> = {
        classic: "1a2744",
        minimalist: "333333",
        sidebar: "1e3a5f",
        creative: "ee5a24",
        obsidian: "c69b6b",
        ivory: "1a2744",
        noir: "b4ff50",
        rose: "d4a0a0",
        executive: "111111",
        terminal: "7ee787",
        healthcare: "0d9488",
        nature: "4a6741",
        scifi: "00c3ff",
        sophisticated: "b8953e",
        vintage: "5c4a32",
        graduate: "f43f5e",
    };

    const accent = themeColors[themeId] || "1a1a1a";

    const name = new Paragraph({
        children: [
            new TextRun({
                text: personal.fullName || "Your Name",
                bold: true,
                size: "32pt",
                color: accent,
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
    });

    const parts = [personal.email, personal.phone, personal.location].filter(Boolean);
    const contact = new Paragraph({
        children: [
            new TextRun({
                text: parts.join("  |  "),
                size: "18pt",
                color: "666666",
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
    });

    const children: Paragraph[] = [name, contact];

    if (d.summary) {
        children.push(new Paragraph({
            children: [
                new TextRun({ text: "SUMMARY", bold: true, color: accent, size: "20pt" }),
            ],
            spacing: { after: 120 },
            border: { bottom: { color: accent, space: 1, style: BorderStyle.SINGLE, size: 6 } }
        }));
        children.push(new Paragraph({
            text: d.summary,
            spacing: { after: 300 }
        }));
    }

    if (d.experience && d.experience.length > 0) {
        children.push(new Paragraph({
            children: [
                new TextRun({ text: "EXPERIENCE", bold: true, color: accent, size: "20pt" }),
            ],
            spacing: { before: 200, after: 120 },
            border: { bottom: { color: accent, space: 1, style: BorderStyle.SINGLE, size: 6 } }
        }));

        d.experience.forEach(exp => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: exp.title || "Position", bold: true, size: "22pt" }),
                    new TextRun({ text: exp.company ? `  —  ${exp.company}` : "", size: "22pt" }),
                ],
                spacing: { before: 100 }
            }));

            const dateStr = [exp.startDate, exp.current ? "Present" : exp.endDate].filter(Boolean).join(" - ");
            if (dateStr) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({ text: dateStr, italics: true, color: "888888", size: "18pt" }),
                    ],
                    spacing: { after: 100 }
                }));
            }

            if (exp.description) {
                const lines = exp.description.split(/\n|•/).map(s => s.trim()).filter(Boolean);
                lines.forEach(line => {
                    children.push(new Paragraph({
                        text: line,
                        bullet: { level: 0 },
                        spacing: { after: 40 }
                    }));
                });
            }
        });
    }

    if (d.education && d.education.length > 0) {
        children.push(new Paragraph({
            children: [
                new TextRun({ text: "EDUCATION", bold: true, color: accent, size: "20pt" }),
            ],
            spacing: { before: 300, after: 120 },
            border: { bottom: { color: accent, space: 1, style: BorderStyle.SINGLE, size: 6 } }
        }));

        d.education.forEach(ed => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: ed.degree || "Degree", bold: true, size: "22pt" }),
                    new TextRun({ text: ed.school ? `  —  ${ed.school}` : "", size: "22pt" }),
                ],
                spacing: { before: 100 }
            }));
            const eduDate = [ed.startDate, ed.endDate].filter(Boolean).join(" - ");
            if (eduDate) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({ text: eduDate, italics: true, color: "888888", size: "18pt" }),
                    ],
                    spacing: { after: 80 }
                }));
            }
        });
    }

    if (d.skills && d.skills.length > 0) {
        children.push(new Paragraph({
            children: [
                new TextRun({ text: "SKILLS", bold: true, color: accent, size: "20pt" }),
            ],
            spacing: { before: 300, after: 120 },
            border: { bottom: { color: accent, space: 1, style: BorderStyle.SINGLE, size: 6 } }
        }));
        children.push(new Paragraph({
            text: d.skills.join(", "),
            spacing: { before: 100 }
        }));
    }

    const isFree = plan === 'free';

    const doc = new Document({
        sections: [{
            properties: {},
            children,
            footers: isFree ? {
                default: new Footer({
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: "Made with ResumeBuildIn",
                                    color: "999999",
                                    size: "16pt",
                                }),
                            ],
                        }),
                    ],
                }),
            } : undefined,
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${personal.fullName || "resume"}.docx`);
}
