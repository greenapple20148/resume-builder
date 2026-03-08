'use client'
import { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "../types";

export async function exportToDocx(resumeData: ResumeData, themeId = 'classic', plan = 'free') {
    const d = resumeData || {};
    const personal = d.personal || {};

    const themeColors: Record<string, string> = {
        classic: "1a1a1a",
        executive: "0c4a6e",
        minimal: "111111",
        bold: "f59e0b",
        mono_clean: "111111",
        mono_sidebar: "111111",
        mono_stack: "111111",
        mono_type: "000000",
        mono_editorial: "111111",
        exec_navy: "0a1e3d",
        exec_marble: "b8963c",
        exec_copper: "b45309",
        creative_neon: "22c55e",
        creative_coral: "dc6843",
        creative_blueprint: "38bdf8",
        creative_sunset: "ea580c",
        dark_obsidian: "e5e5e5",
        dark_midnight: "60a5fa",
        dark_eclipse: "f59e0b",
        dark_void: "a78bfa",
        dark_carbon: "2dd4bf",
        prestige: "c5a572",
        modern_sidebar: "2D8C6F",
        coral_horizon: "E8634A",
        swiss_grid: "FF0000",
        ocean_breeze: "0EA5E9",
        monochrome_editorial: "0a0a0a",
        midnight_luxe: "C9A96E",
        forest_canopy: "2D5016",
        copper_deco: "B87333",
        arctic_frost: "5E81AC",
        sunset_gradient: "E85D26",
        metro_line: "0078D4",
        rose_quartz: "C77D8A",
        concrete_brutalist: "FFD600",
        lavender_fields: "7C6DAF",
        steel_industrial: "37474F",
        obsidian_executive: "7C4DFF",
        ivory_prestige: "C4A97D",
        aurora_borealis: "00C9A7",
        blueprint_architect: "4FC3F7",
        onyx_ember: "FF5722",
        exec_authority: "0a0a0a",
        exec_prestige: "0f0f0f",
        exec_pillar: "0e0e0e",
        exec_regal: "0b0b0b",
        exec_apex: "0c0c0c",
        exec_strata: "0d0d0d",
        exec_counsel: "0e0e0e",
        exec_monogram: "0c0c0c",
        exec_ledger: "0b0b0b",
        exec_architect: "0a0a0a",
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
