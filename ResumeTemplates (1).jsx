import { useState, useRef } from "react";

// ─── Sample Data ────────────────────────────────────────────────
const defaultData = {
  name: "Alexandra Morgan",
  title: "Senior Product Manager",
  email: "alexandra.morgan@email.com",
  phone: "(555) 432-8901",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexandramorgan",
  summary:
    "Results-driven product manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of driving $50M+ in revenue growth through strategic product development, user-centered design, and data-driven decision making.",
  experience: [
    {
      company: "TechVision Inc.",
      role: "Senior Product Manager",
      dates: "Jan 2021 – Present",
      location: "San Francisco, CA",
      bullets: [
        "Led product strategy for a SaaS platform serving 2M+ users, increasing annual revenue by 35%",
        "Managed cross-functional team of 18 engineers, designers, and data scientists across 12 major releases",
        "Implemented A/B testing framework improving conversion rates by 28% and reducing churn by 15%",
        "Collaborated with C-suite to define 3-year vision, securing $12M in additional funding",
      ],
    },
    {
      company: "InnovateTech Solutions",
      role: "Product Manager",
      dates: "Mar 2018 – Dec 2020",
      location: "New York, NY",
      bullets: [
        "Spearheaded mobile-first e-commerce platform achieving 500K downloads and $8M first-year revenue",
        "Conducted 200+ user interviews, translating insights into features that improved NPS from 32 to 67",
        "Reduced development cycle time by 40% through agile sprints and continuous delivery practices",
        "Defined and tracked KPIs, presenting monthly reports to board of directors",
      ],
    },
    {
      company: "Digital Dynamics Corp.",
      role: "Associate Product Manager",
      dates: "Jun 2015 – Feb 2018",
      location: "Boston, MA",
      bullets: [
        "Assisted in launch of 3 enterprise software products contributing to $20M in ARR",
        "Created detailed PRDs, user stories, and wireframes for 4 product lines",
        "Analyzed competitive landscape delivering quarterly strategic positioning reports",
      ],
    },
  ],
  education: [
    { degree: "Master of Business Administration (MBA)", school: "Stanford Graduate School of Business", year: "2015", details: "Concentration in Technology Management" },
    { degree: "B.S. Computer Science", school: "UC Berkeley", year: "2013", details: "Magna Cum Laude · GPA 3.85" },
  ],
  skills: ["Product Strategy", "Agile & Scrum", "User Research & UX", "Data Analytics", "SQL & Python", "Jira & Figma", "Stakeholder Mgmt", "Revenue Optimization", "Market Analysis", "Cross-functional Leadership", "API Products", "Growth Strategy"],
  certifications: ["Certified Scrum Product Owner (CSPO) – Scrum Alliance, 2020", "Pragmatic Institute Certified Level III – 2019", "Google Analytics Professional Certificate – 2018"],
};

// ─── Template Components ────────────────────────────────────────
function ClassicExecutive({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#333", lineHeight: 1.5 }}>
      <style>{`
        .t1 { --accent: #1B365D; }
        .t1 h1 { font-size: 28px; letter-spacing: 6px; color: var(--accent); text-align: center; margin: 0 0 4px; font-weight: 700; text-transform: uppercase; }
        .t1 .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 6px; }
        .t1 .contact { text-align: center; color: #888; font-size: 10.5px; margin-bottom: 16px; }
        .t1 .divider { border-bottom: 2.5px solid var(--accent); margin-bottom: 16px; }
        .t1 .section-title { font-size: 12px; font-weight: 700; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; border-bottom: 1px solid var(--accent); padding-bottom: 4px; margin: 18px 0 10px; }
        .t1 .summary { color: #555; font-size: 11px; margin-bottom: 12px; }
        .t1 .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-top: 12px; }
        .t1 .job-role { font-weight: 700; font-size: 12.5px; color: #222; }
        .t1 .job-dates { font-size: 11px; color: #777; }
        .t1 .job-company { font-size: 11.5px; color: var(--accent); font-style: italic; }
        .t1 .job-loc { color: #888; font-size: 11px; }
        .t1 ul { margin: 6px 0 0 0; padding-left: 16px; }
        .t1 li { font-size: 11px; color: #555; margin-bottom: 3px; }
        .t1 li::marker { color: var(--accent); }
        .t1 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t1 .edu-degree { font-weight: 700; font-size: 11.5px; }
        .t1 .edu-school { font-style: italic; color: var(--accent); font-size: 11px; }
        .t1 .edu-detail { color: #777; font-size: 10.5px; }
        .t1 .skills-list { font-size: 11px; color: #555; }
        .t1 .cert-item { font-size: 11px; color: #555; margin-bottom: 3px; padding-left: 16px; position: relative; }
        .t1 .cert-item::before { content: "•"; color: var(--accent); position: absolute; left: 4px; }
      `}</style>
      <div className="t1">
        <h1>{d.name}</h1>
        <div className="subtitle">{d.title}</div>
        <div className="contact">{d.email} · {d.phone} · {d.location} · {d.linkedin}</div>
        <div className="divider" />
        <div className="section-title">Professional Summary</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Professional Experience</div>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-header"><span className="job-role">{j.role}</span><span className="job-dates">{j.dates}</span></div>
            <div><span className="job-company">{j.company}</span><span className="job-loc"> – {j.location}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}>
            <div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div>
            <div className="edu-school">{e.school}</div>
            <div className="edu-detail">{e.details}</div>
          </div>
        ))}
        <div className="section-title">Skills & Expertise</div>
        <div className="skills-list">{d.skills.join("  ·  ")}</div>
        <div className="section-title">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

function ModernSidebar({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#333", lineHeight: 1.5 }}>
      <style>{`
        .t2 { --accent: #2D8C6F; --dark: #1A1A2E; }
        .t2 .header { margin-bottom: 14px; border-bottom: 3px solid var(--accent); padding-bottom: 10px; }
        .t2 .header h1 { font-size: 30px; letter-spacing: 4px; color: var(--dark); margin: 0; text-transform: uppercase; font-weight: 800; }
        .t2 .header .title { font-size: 14px; color: var(--accent); margin-top: 2px; }
        .t2 .layout { display: flex; gap: 24px; }
        .t2 .sidebar { width: 200px; flex-shrink: 0; background: #F0F5F3; border-radius: 6px; padding: 14px; }
        .t2 .main { flex: 1; min-width: 0; }
        .t2 .side-heading { font-size: 10.5px; font-weight: 700; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; border-bottom: 1.5px solid var(--accent); padding-bottom: 3px; margin: 14px 0 8px; }
        .t2 .side-heading:first-child { margin-top: 0; }
        .t2 .side-item { font-size: 10.5px; color: #555; margin-bottom: 4px; display: flex; align-items: baseline; gap: 5px; }
        .t2 .side-dot { color: var(--accent); font-size: 8px; flex-shrink: 0; }
        .t2 .side-edu-title { font-size: 10.5px; font-weight: 700; color: #222; }
        .t2 .side-edu-school { font-size: 10px; color: #666; }
        .t2 .side-edu-year { font-size: 10px; color: var(--accent); }
        .t2 .side-edu-detail { font-size: 9.5px; color: #888; font-style: italic; margin-bottom: 10px; }
        .t2 .main-heading { font-size: 12px; font-weight: 700; color: var(--dark); letter-spacing: 3px; text-transform: uppercase; border-bottom: 1.5px solid var(--accent); padding-bottom: 4px; margin: 16px 0 10px; }
        .t2 .main-heading:first-child { margin-top: 0; }
        .t2 .profile-text { font-size: 11px; color: #555; }
        .t2 .job-role { font-size: 13px; font-weight: 700; color: var(--dark); margin-top: 10px; }
        .t2 .job-meta { font-size: 11px; }
        .t2 .job-company { color: var(--accent); font-weight: 600; }
        .t2 .job-loc { color: #aaa; }
        .t2 .job-dates { font-size: 10.5px; color: #aaa; font-style: italic; }
        .t2 ul { margin: 5px 0 0; padding-left: 14px; }
        .t2 li { font-size: 10.5px; color: #555; margin-bottom: 3px; }
        .t2 li::marker { content: "▸ "; color: var(--accent); }
        .t2 .cert-text { font-size: 10px; color: #555; margin-bottom: 6px; }
      `}</style>
      <div className="t2">
        <div className="header">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
        </div>
        <div className="layout">
          <div className="sidebar">
            <div className="side-heading">Contact</div>
            <div className="side-item">{d.email}</div>
            <div className="side-item">{d.phone}</div>
            <div className="side-item">{d.location}</div>
            <div className="side-item" style={{ color: "#2D8C6F" }}>{d.linkedin}</div>
            <div className="side-heading">Skills</div>
            {d.skills.map((s, i) => <div key={i} className="side-item"><span className="side-dot">●</span>{s}</div>)}
            <div className="side-heading">Certifications</div>
            {d.certifications.map((c, i) => <div key={i} className="cert-text">{c}</div>)}
            <div className="side-heading">Education</div>
            {d.education.map((e, i) => (
              <div key={i}>
                <div className="side-edu-title">{e.degree}</div>
                <div className="side-edu-school">{e.school}</div>
                <div className="side-edu-year">{e.year}</div>
                <div className="side-edu-detail">{e.details}</div>
              </div>
            ))}
          </div>
          <div className="main">
            <div className="main-heading">Profile</div>
            <div className="profile-text">{d.summary}</div>
            <div className="main-heading">Experience</div>
            {d.experience.map((j, i) => (
              <div key={i}>
                <div className="job-role">{j.role}</div>
                <div className="job-meta"><span className="job-company">{j.company}</span><span className="job-loc"> | {j.location}</span></div>
                <div className="job-dates">{j.dates}</div>
                <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalistClean({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#2C3E50", lineHeight: 1.55 }}>
      <style>{`
        .t3 { --accent: #E74C3C; }
        .t3 h1 { font-size: 34px; font-weight: 300; color: #2C3E50; margin: 0 0 4px; }
        .t3 .title-line { font-size: 13px; color: #888; margin-bottom: 8px; }
        .t3 .title-dash { color: var(--accent); }
        .t3 .contact { font-size: 10.5px; color: #aaa; border-bottom: 1px solid #eee; padding-bottom: 14px; margin-bottom: 18px; }
        .t3 .section-title { font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 4px; text-transform: uppercase; margin: 20px 0 10px; }
        .t3 .summary { font-size: 11px; color: #666; margin-bottom: 10px; }
        .t3 .job-role { font-size: 12.5px; font-weight: 700; color: #2C3E50; margin-top: 12px; }
        .t3 .job-meta { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
        .t3 .job-company { color: var(--accent); }
        .t3 .job-loc { color: #aaa; }
        .t3 .job-dates { color: #bbb; }
        .t3 ul { margin: 4px 0 0; padding-left: 16px; }
        .t3 li { font-size: 10.5px; color: #666; margin-bottom: 3px; }
        .t3 li::marker { content: "– "; color: var(--accent); }
        .t3 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t3 .edu-degree { font-weight: 700; font-size: 11.5px; }
        .t3 .edu-school { font-size: 11px; color: #777; }
        .t3 .edu-detail { font-size: 10.5px; color: #aaa; font-style: italic; }
        .t3 .skills-wrap { font-size: 11px; color: #666; }
        .t3 .skill-sep { color: var(--accent); margin: 0 6px; }
      `}</style>
      <div className="t3">
        <h1>{d.name}</h1>
        <div className="title-line"><span className="title-dash">— </span>{d.title}</div>
        <div className="contact">{d.email} &nbsp;|&nbsp; {d.phone} &nbsp;|&nbsp; {d.location} &nbsp;|&nbsp; {d.linkedin}</div>
        <div className="section-title">About</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-role">{j.role}</div>
            <div className="job-meta">
              <span><span className="job-company">{j.company}</span><span className="job-loc">, {j.location}</span></span>
              <span className="job-dates">{j.dates}</span>
            </div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}>
            <div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div>
            <div className="edu-school">{e.school} — <span className="edu-detail">{e.details}</span></div>
          </div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skills-wrap">{d.skills.map((s, i) => <span key={i}>{i > 0 && <span className="skill-sep">·</span>}{s}</span>)}</div>
        <div className="section-title">Certifications</div>
        <ul>{d.certifications.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>
    </div>
  );
}

function BoldModern({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#333", lineHeight: 1.5 }}>
      <style>{`
        .t4 { --accent: #6C3FC5; --dark: #1E1E2F; --light: #F5F3FA; }
        .t4 .header-bar { background: var(--dark); color: #fff; padding: 24px 28px; border-radius: 0 0 8px 8px; margin: -2px -2px 0; }
        .t4 .header-bar h1 { font-size: 28px; letter-spacing: 5px; font-weight: 800; margin: 0; text-transform: uppercase; }
        .t4 .header-bar .title { font-size: 14px; color: #C8B6FF; margin-top: 4px; }
        .t4 .header-bar .contact { font-size: 10px; color: #bbb; margin-top: 8px; }
        .t4 .body { padding: 0 4px; }
        .t4 .section-title { font-size: 12px; font-weight: 700; color: var(--accent); letter-spacing: 3.5px; text-transform: uppercase; border-bottom: 2px solid var(--accent); padding-bottom: 4px; margin: 20px 0 12px; }
        .t4 .summary-box { border-left: 3.5px solid var(--accent); padding: 10px 14px; background: var(--light); font-size: 11px; color: #666; margin-bottom: 10px; border-radius: 0 4px 4px 0; }
        .t4 .job-role { font-size: 13px; font-weight: 700; color: var(--dark); margin-top: 12px; }
        .t4 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t4 .job-company { color: var(--accent); font-weight: 600; }
        .t4 .job-dates { color: #aaa; }
        .t4 ul { margin: 5px 0 0; padding-left: 16px; }
        .t4 li { font-size: 10.5px; color: #555; margin-bottom: 3px; }
        .t4 li::marker { color: var(--accent); }
        .t4 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t4 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--dark); }
        .t4 .edu-school { font-size: 11px; color: var(--accent); }
        .t4 .edu-detail { font-size: 10.5px; color: #aaa; font-style: italic; }
        .t4 .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .t4 .skill-tag { background: var(--light); color: var(--accent); font-size: 10px; padding: 4px 10px; border-radius: 12px; font-weight: 600; }
      `}</style>
      <div className="t4">
        <div className="header-bar">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} · {d.phone} · {d.location} · {d.linkedin}</div>
        </div>
        <div className="body">
          <div className="section-title">Profile</div>
          <div className="summary-box">{d.summary}</div>
          <div className="section-title">Professional Experience</div>
          {d.experience.map((j, i) => (
            <div key={i}>
              <div className="job-role">{j.role}</div>
              <div className="job-meta">
                <span><span className="job-company">{j.company} — {j.location}</span></span>
                <span className="job-dates">{j.dates}</span>
              </div>
              <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          ))}
          <div className="section-title">Education</div>
          {d.education.map((e, i) => (
            <div key={i}>
              <div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div>
              <div className="edu-school">{e.school}</div>
              <div className="edu-detail">{e.details}</div>
            </div>
          ))}
          <div className="section-title">Skills & Tools</div>
          <div className="skill-tags">{d.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
          <div className="section-title">Certifications</div>
          <ul>{d.certifications.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

function ElegantProfessional({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#2B2B2B", lineHeight: 1.55 }}>
      <style>{`
        .t5 { --gold: #B8860B; --charcoal: #2B2B2B; --warm: #F8F6F3; }
        .t5 .ornament { text-align: center; color: var(--gold); font-size: 14px; letter-spacing: 4px; margin: 2px 0; }
        .t5 h1 { text-align: center; font-size: 28px; letter-spacing: 8px; color: var(--charcoal); margin: 6px 0 4px; text-transform: uppercase; font-weight: 600; }
        .t5 .title { text-align: center; font-size: 13px; color: var(--gold); font-style: italic; }
        .t5 .contact { text-align: center; font-size: 10.5px; color: #aaa; margin: 12px 0 18px; }
        .t5 .section-title { font-size: 11.5px; font-weight: 700; color: var(--charcoal); letter-spacing: 3.5px; text-transform: uppercase; margin: 22px 0 10px; text-align: center; }
        .t5 .section-title span { color: var(--gold); }
        .t5 .summary-box { background: var(--warm); border-top: 1px solid var(--gold); border-bottom: 1px solid var(--gold); padding: 12px 16px; font-size: 11px; color: #666; font-style: italic; text-align: justify; }
        .t5 .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-top: 12px; }
        .t5 .job-role { font-weight: 700; font-size: 12.5px; color: var(--charcoal); }
        .t5 .job-dates { font-size: 11px; color: var(--gold); font-style: italic; }
        .t5 .job-company { color: var(--gold); font-size: 11px; }
        .t5 .job-loc { color: #bbb; font-size: 11px; }
        .t5 ul { margin: 5px 0 0; padding-left: 16px; }
        .t5 li { font-size: 10.5px; color: #666; margin-bottom: 3px; }
        .t5 li::marker { color: var(--gold); }
        .t5 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t5 .edu-degree { font-weight: 700; font-size: 11.5px; }
        .t5 .edu-school { font-size: 11px; font-style: italic; color: #777; }
        .t5 .edu-detail { font-size: 10.5px; color: #aaa; }
        .t5 .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 16px; margin-top: 6px; }
        .t5 .skill-item { font-size: 10.5px; color: #666; }
        .t5 .skill-diamond { color: var(--gold); font-size: 8px; margin-right: 5px; }
      `}</style>
      <div className="t5">
        <div className="ornament">———————</div>
        <h1>{d.name}</h1>
        <div className="title">{d.title}</div>
        <div className="ornament">———————</div>
        <div className="contact">{d.email} &nbsp;•&nbsp; {d.phone} &nbsp;•&nbsp; {d.location} &nbsp;•&nbsp; {d.linkedin}</div>
        <div className="section-title"><span>— </span>Professional Summary<span> —</span></div>
        <div className="summary-box">{d.summary}</div>
        <div className="section-title"><span>— </span>Career History<span> —</span></div>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-header"><span className="job-role">{j.role}</span><span className="job-dates">{j.dates}</span></div>
            <div><span className="job-company">{j.company}</span><span className="job-loc"> | {j.location}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title"><span>— </span>Education<span> —</span></div>
        {d.education.map((e, i) => (
          <div key={i}>
            <div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div>
            <div className="edu-school">{e.school}</div>
            <div className="edu-detail">{e.details}</div>
          </div>
        ))}
        <div className="section-title"><span>— </span>Areas of Expertise<span> —</span></div>
        <div className="skills-grid">
          {d.skills.map((s, i) => <div key={i} className="skill-item"><span className="skill-diamond">◆</span>{s}</div>)}
        </div>
        <div className="section-title"><span>— </span>Certifications<span> —</span></div>
        <ul>{d.certifications.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>
    </div>
  );
}

// ==================== TEMPLATE 6: TECH SLATE ====================
function TechSlate({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#E0E0E0", lineHeight: 1.5 }}>
      <style>{`
        .t6 { --accent: #00E5A0; --bg: #0F1923; --card: #162231; --muted: #8A9BB0; background: var(--bg); padding: 28px 32px; border-radius: 6px; }
        .t6 h1 { font-size: 30px; font-weight: 800; color: #fff; margin: 0; letter-spacing: 1px; }
        .t6 .title { font-size: 14px; color: var(--accent); margin-top: 2px; font-weight: 600; }
        .t6 .contact { font-size: 10.5px; color: var(--muted); margin: 8px 0 18px; }
        .t6 .contact a { color: var(--accent); text-decoration: none; }
        .t6 .divider { height: 1px; background: linear-gradient(90deg, var(--accent), transparent); margin-bottom: 18px; }
        .t6 .section-title { font-size: 10.5px; font-weight: 700; color: var(--accent); letter-spacing: 4px; text-transform: uppercase; margin: 20px 0 10px; display: flex; align-items: center; gap: 8px; }
        .t6 .section-title::after { content: ""; flex: 1; height: 1px; background: #1E3044; }
        .t6 .summary { font-size: 11px; color: var(--muted); background: var(--card); padding: 12px 16px; border-radius: 6px; border-left: 3px solid var(--accent); }
        .t6 .job-role { font-size: 13px; font-weight: 700; color: #fff; margin-top: 12px; }
        .t6 .job-meta { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
        .t6 .job-company { color: var(--accent); font-weight: 600; }
        .t6 .job-dates { color: var(--muted); font-family: monospace; font-size: 10px; }
        .t6 .job-loc { color: #546A7B; }
        .t6 ul { margin: 5px 0 0; padding-left: 16px; }
        .t6 li { font-size: 10.5px; color: #B0BEC5; margin-bottom: 3px; }
        .t6 li::marker { color: var(--accent); }
        .t6 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t6 .edu-degree { font-weight: 700; font-size: 11.5px; color: #fff; }
        .t6 .edu-school { font-size: 11px; color: var(--muted); }
        .t6 .edu-detail { font-size: 10.5px; color: #546A7B; }
        .t6 .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .t6 .skill-tag { background: var(--card); color: var(--accent); font-size: 10px; padding: 4px 10px; border-radius: 4px; border: 1px solid #1E3044; font-weight: 600; font-family: monospace; }
        .t6 .cert-item { font-size: 10.5px; color: #B0BEC5; margin-bottom: 4px; padding-left: 14px; position: relative; }
        .t6 .cert-item::before { content: "›"; color: var(--accent); position: absolute; left: 2px; font-weight: 700; }
      `}</style>
      <div className="t6">
        <h1>{d.name}</h1>
        <div className="title">{d.title}</div>
        <div className="contact">{d.email} &nbsp;/&nbsp; {d.phone} &nbsp;/&nbsp; {d.location} &nbsp;/&nbsp; {d.linkedin}</div>
        <div className="divider" />
        <div className="section-title">Summary</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-role">{j.role}</div>
            <div className="job-meta">
              <span><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span></span>
              <span className="job-dates">{j.dates}</span>
            </div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}>
            <div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div>
            <div className="edu-school">{e.school}</div>
            <div className="edu-detail">{e.details}</div>
          </div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skill-tags">{d.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
        <div className="section-title">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 7: CORAL HORIZON ====================
function CoralHorizon({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#3D3D3D", lineHeight: 1.55 }}>
      <style>{`
        .t7 { --coral: #E8634A; --sand: #FFF8F5; --stone: #4A4A4A; }
        .t7 .top-band { background: linear-gradient(135deg, var(--coral), #F4845F); padding: 24px 28px; border-radius: 8px 8px 0 0; color: #fff; }
        .t7 .top-band h1 { font-size: 28px; font-weight: 300; letter-spacing: 3px; margin: 0; text-transform: uppercase; }
        .t7 .top-band .title { font-size: 13px; font-weight: 600; opacity: 0.9; margin-top: 4px; letter-spacing: 1px; }
        .t7 .top-band .contact { font-size: 10px; opacity: 0.8; margin-top: 10px; }
        .t7 .body { padding: 4px 0 0; }
        .t7 .two-col { display: flex; gap: 20px; margin-top: 16px; }
        .t7 .left-col { flex: 1; min-width: 0; }
        .t7 .right-col { width: 190px; flex-shrink: 0; background: var(--sand); border-radius: 6px; padding: 14px; }
        .t7 .section-title { font-size: 11px; font-weight: 700; color: var(--coral); letter-spacing: 3px; text-transform: uppercase; margin: 16px 0 8px; }
        .t7 .section-title:first-child { margin-top: 0; }
        .t7 .summary { font-size: 11px; color: #666; margin-bottom: 4px; }
        .t7 .job-role { font-size: 12.5px; font-weight: 700; color: var(--stone); margin-top: 10px; }
        .t7 .job-meta { font-size: 11px; display: flex; justify-content: space-between; }
        .t7 .job-company { color: var(--coral); font-weight: 600; }
        .t7 .job-dates { color: #bbb; font-style: italic; }
        .t7 .job-loc { color: #bbb; }
        .t7 ul { margin: 4px 0 0; padding-left: 14px; }
        .t7 li { font-size: 10.5px; color: #666; margin-bottom: 3px; }
        .t7 li::marker { color: var(--coral); }
        .t7 .side-heading { font-size: 10px; font-weight: 700; color: var(--coral); letter-spacing: 2.5px; text-transform: uppercase; margin: 14px 0 6px; }
        .t7 .side-heading:first-child { margin-top: 0; }
        .t7 .side-skill { font-size: 10px; color: #666; padding: 3px 0; border-bottom: 1px solid #F0E8E5; }
        .t7 .side-skill:last-child { border-bottom: none; }
        .t7 .side-edu-title { font-size: 10.5px; font-weight: 700; color: var(--stone); }
        .t7 .side-edu-school { font-size: 10px; color: #888; }
        .t7 .side-edu-year { font-size: 10px; color: var(--coral); margin-bottom: 8px; }
        .t7 .cert-text { font-size: 10px; color: #888; margin-bottom: 5px; }
      `}</style>
      <div className="t7">
        <div className="top-band">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} &nbsp;·&nbsp; {d.phone} &nbsp;·&nbsp; {d.location} &nbsp;·&nbsp; {d.linkedin}</div>
        </div>
        <div className="body">
          <div className="section-title" style={{ marginTop: 16 }}>Summary</div>
          <div className="summary">{d.summary}</div>
          <div className="two-col">
            <div className="left-col">
              <div className="section-title">Experience</div>
              {d.experience.map((j, i) => (
                <div key={i}>
                  <div className="job-role">{j.role}</div>
                  <div className="job-meta">
                    <span><span className="job-company">{j.company}</span><span className="job-loc">, {j.location}</span></span>
                    <span className="job-dates">{j.dates}</span>
                  </div>
                  <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="right-col">
              <div className="side-heading">Skills</div>
              {d.skills.map((s, i) => <div key={i} className="side-skill">{s}</div>)}
              <div className="side-heading">Education</div>
              {d.education.map((e, i) => (
                <div key={i}>
                  <div className="side-edu-title">{e.degree}</div>
                  <div className="side-edu-school">{e.school}</div>
                  <div className="side-edu-year">{e.year} · {e.details}</div>
                </div>
              ))}
              <div className="side-heading">Certifications</div>
              {d.certifications.map((c, i) => <div key={i} className="cert-text">{c}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TEMPLATE 8: SWISS GRID ====================
function SwissGrid({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#222", lineHeight: 1.5 }}>
      <style>{`
        .t8 { --black: #111; --red: #FF0000; --gray: #888; }
        .t8 .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid var(--black); padding-bottom: 12px; margin-bottom: 16px; }
        .t8 .header-left h1 { font-size: 36px; font-weight: 900; color: var(--black); margin: 0; line-height: 1; text-transform: uppercase; }
        .t8 .header-left .title { font-size: 13px; color: var(--red); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
        .t8 .header-right { text-align: right; font-size: 10.5px; color: var(--gray); line-height: 1.6; }
        .t8 .section-title { font-size: 10px; font-weight: 900; color: var(--black); letter-spacing: 4px; text-transform: uppercase; margin: 20px 0 8px; padding: 4px 0; border-top: 1px solid #ddd; }
        .t8 .summary { font-size: 11px; color: #555; }
        .t8 .job-grid { display: grid; grid-template-columns: 120px 1fr; gap: 2px 16px; margin-top: 10px; }
        .t8 .job-period { font-size: 10px; color: var(--gray); font-family: monospace; padding-top: 2px; }
        .t8 .job-role { font-size: 12px; font-weight: 800; color: var(--black); text-transform: uppercase; }
        .t8 .job-company { font-size: 11px; color: var(--red); font-weight: 600; }
        .t8 .job-loc { color: var(--gray); font-weight: 400; }
        .t8 ul { margin: 4px 0 10px; padding-left: 14px; }
        .t8 li { font-size: 10.5px; color: #555; margin-bottom: 2px; }
        .t8 li::marker { color: var(--red); content: "■ "; font-size: 6px; }
        .t8 .edu-grid { display: grid; grid-template-columns: 120px 1fr; gap: 2px 16px; margin-top: 6px; }
        .t8 .edu-year { font-size: 10px; color: var(--gray); font-family: monospace; }
        .t8 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--black); }
        .t8 .edu-school { font-size: 11px; color: #555; }
        .t8 .edu-detail { font-size: 10.5px; color: var(--gray); margin-bottom: 6px; }
        .t8 .skill-row { display: flex; flex-wrap: wrap; gap: 0; margin-top: 4px; }
        .t8 .skill-item { font-size: 10px; color: #555; padding: 4px 0; width: 50%; }
        .t8 .skill-item::before { content: "→ "; color: var(--red); font-weight: 700; }
        .t8 .cert-item { font-size: 10.5px; color: #555; margin-bottom: 3px; }
        .t8 .cert-item::before { content: "■ "; color: var(--red); font-size: 6px; }
      `}</style>
      <div className="t8">
        <div className="header">
          <div className="header-left">
            <h1>{d.name}</h1>
            <div className="title">{d.title}</div>
          </div>
          <div className="header-right">
            {d.email}<br />{d.phone}<br />{d.location}<br />{d.linkedin}
          </div>
        </div>
        <div className="section-title">Profile</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i} className="job-grid">
            <div className="job-period">{j.dates}</div>
            <div>
              <div className="job-role">{j.role}</div>
              <div className="job-company">{j.company} <span className="job-loc">· {j.location}</span></div>
              <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i} className="edu-grid">
            <div className="edu-year">{e.year}</div>
            <div>
              <div className="edu-degree">{e.degree}</div>
              <div className="edu-school">{e.school}</div>
              <div className="edu-detail">{e.details}</div>
            </div>
          </div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skill-row">{d.skills.map((s, i) => <div key={i} className="skill-item">{s}</div>)}</div>
        <div className="section-title">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 9: OCEAN BREEZE ====================
function OceanBreeze({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#334155", lineHeight: 1.55 }}>
      <style>{`
        .t9 { --sky: #0EA5E9; --deep: #0C4A6E; --foam: #F0F9FF; --sand: #FEF3C7; }
        .t9 .header { text-align: center; padding-bottom: 16px; margin-bottom: 16px; position: relative; }
        .t9 .header::after { content: ""; position: absolute; bottom: 0; left: 15%; right: 15%; height: 2px; background: linear-gradient(90deg, transparent, var(--sky), transparent); }
        .t9 h1 { font-size: 32px; font-weight: 300; color: var(--deep); margin: 0; letter-spacing: 4px; text-transform: uppercase; }
        .t9 .title { font-size: 14px; color: var(--sky); font-weight: 600; margin-top: 4px; }
        .t9 .contact { font-size: 10.5px; color: #94A3B8; margin-top: 8px; }
        .t9 .section-title { display: inline-block; font-size: 10.5px; font-weight: 700; color: var(--deep); letter-spacing: 3px; text-transform: uppercase; margin: 20px 0 10px; background: var(--foam); padding: 4px 14px; border-radius: 20px; }
        .t9 .summary { font-size: 11px; color: #64748B; padding: 10px 0; }
        .t9 .job-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-top: 10px; border-left: 3px solid var(--sky); }
        .t9 .job-role { font-size: 13px; font-weight: 700; color: var(--deep); }
        .t9 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t9 .job-company { color: var(--sky); font-weight: 600; }
        .t9 .job-dates { color: #94A3B8; }
        .t9 .job-loc { color: #CBD5E1; }
        .t9 ul { margin: 5px 0 0; padding-left: 14px; }
        .t9 li { font-size: 10.5px; color: #64748B; margin-bottom: 3px; }
        .t9 li::marker { color: var(--sky); }
        .t9 .edu-card { background: var(--foam); border-radius: 6px; padding: 10px 14px; margin-top: 8px; }
        .t9 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--deep); }
        .t9 .edu-school { font-size: 11px; color: var(--sky); }
        .t9 .edu-row { display: flex; justify-content: space-between; }
        .t9 .edu-detail { font-size: 10.5px; color: #94A3B8; }
        .t9 .skill-cloud { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .t9 .skill-pill { background: var(--foam); color: var(--deep); font-size: 10px; padding: 4px 12px; border-radius: 20px; font-weight: 600; border: 1px solid #BAE6FD; }
        .t9 .cert-item { font-size: 10.5px; color: #64748B; margin-bottom: 4px; padding-left: 14px; position: relative; }
        .t9 .cert-item::before { content: "✦"; color: var(--sky); position: absolute; left: 0; font-size: 8px; top: 2px; }
      `}</style>
      <div className="t9">
        <div className="header">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} &nbsp;·&nbsp; {d.phone} &nbsp;·&nbsp; {d.location} &nbsp;·&nbsp; {d.linkedin}</div>
        </div>
        <div className="section-title">Summary</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i} className="job-card">
            <div className="job-role">{j.role}</div>
            <div className="job-meta">
              <span><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span></span>
              <span className="job-dates">{j.dates}</span>
            </div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i} className="edu-card">
            <div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div>
            <div className="edu-school">{e.school}</div>
            <div className="edu-detail">{e.details}</div>
          </div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skill-cloud">{d.skills.map((s, i) => <span key={i} className="skill-pill">{s}</span>)}</div>
        <div style={{ marginTop: 8 }}><div className="section-title">Certifications</div></div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 10: MONOCHROME EDITORIAL ====================
function MonochromeEditorial({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#1a1a1a", lineHeight: 1.55 }}>
      <style>{`
        .t10 { --black: #0a0a0a; --mid: #6b6b6b; --light: #a0a0a0; --rule: #d4d4d4; --bg: #fafafa; }
        .t10 .masthead { border-bottom: 4px double var(--black); padding-bottom: 14px; margin-bottom: 16px; }
        .t10 .masthead h1 { font-size: 38px; font-weight: 300; color: var(--black); margin: 0; letter-spacing: 8px; text-transform: uppercase; text-align: center; }
        .t10 .masthead .rule-thin { height: 1px; background: var(--black); margin: 8px 0; }
        .t10 .masthead .meta-row { display: flex; justify-content: center; gap: 20px; font-size: 10px; color: var(--mid); text-transform: uppercase; letter-spacing: 2px; }
        .t10 .masthead .title-center { text-align: center; font-size: 12px; color: var(--mid); font-style: italic; margin-top: 6px; }
        .t10 .section-label { font-size: 9px; font-weight: 800; color: var(--black); letter-spacing: 5px; text-transform: uppercase; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 5px 0; margin: 18px 0 10px; text-align: center; }
        .t10 .summary { font-size: 11px; color: var(--mid); text-align: justify; font-style: italic; }
        .t10 .job-block { margin-top: 12px; padding-bottom: 10px; border-bottom: 1px dotted var(--rule); }
        .t10 .job-block:last-child { border-bottom: none; }
        .t10 .job-top { display: flex; justify-content: space-between; align-items: baseline; }
        .t10 .job-role { font-size: 13px; font-weight: 700; color: var(--black); }
        .t10 .job-dates { font-size: 10px; color: var(--light); font-style: italic; }
        .t10 .job-company { font-size: 11px; color: var(--mid); }
        .t10 .job-loc { color: var(--light); }
        .t10 ul { margin: 5px 0 0; padding-left: 14px; }
        .t10 li { font-size: 10.5px; color: var(--mid); margin-bottom: 3px; }
        .t10 li::marker { content: "— "; color: var(--light); }
        .t10 .edu-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 8px; }
        .t10 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--black); }
        .t10 .edu-year { font-size: 10px; color: var(--light); font-style: italic; }
        .t10 .edu-school { font-size: 11px; color: var(--mid); }
        .t10 .edu-detail { font-size: 10.5px; color: var(--light); }
        .t10 .skills-line { font-size: 10.5px; color: var(--mid); text-align: center; margin-top: 6px; }
        .t10 .skills-sep { color: var(--rule); margin: 0 4px; }
        .t10 .cert-item { font-size: 10.5px; color: var(--mid); text-align: center; margin-bottom: 3px; }
      `}</style>
      <div className="t10">
        <div className="masthead">
          <h1>{d.name}</h1>
          <div className="rule-thin" />
          <div className="meta-row">
            <span>{d.email}</span><span>{d.phone}</span><span>{d.location}</span><span>{d.linkedin}</span>
          </div>
          <div className="title-center">{d.title}</div>
        </div>
        <div className="section-label">Profile</div>
        <div className="summary">{d.summary}</div>
        <div className="section-label">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i} className="job-block">
            <div className="job-top"><span className="job-role">{j.role}</span><span className="job-dates">{j.dates}</span></div>
            <div className="job-company">{j.company} <span className="job-loc">· {j.location}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-label">Education</div>
        {d.education.map((e, i) => (
          <div key={i}>
            <div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="edu-year">{e.year}</span></div>
            <div className="edu-school">{e.school}</div>
            <div className="edu-detail">{e.details}</div>
          </div>
        ))}
        <div className="section-label">Skills</div>
        <div className="skills-line">{d.skills.map((s, i) => <span key={i}>{i > 0 && <span className="skills-sep">/</span>}{s}</span>)}</div>
        <div className="section-label">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 11: MIDNIGHT LUXE ====================
function MidnightLuxe({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#D4C5A9", lineHeight: 1.55 }}>
      <style>{`
        .t11 { --bg: #1A1A2E; --gold: #C9A96E; --cream: #E8DCC8; --dim: #7A7A8E; background: var(--bg); padding: 30px 34px; border-radius: 4px; }
        .t11 h1 { font-size: 30px; font-weight: 300; color: var(--cream); letter-spacing: 10px; text-transform: uppercase; text-align: center; margin: 0; }
        .t11 .gold-rule { height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); margin: 10px 60px; }
        .t11 .title { text-align: center; font-size: 13px; color: var(--gold); letter-spacing: 3px; text-transform: uppercase; font-weight: 600; }
        .t11 .contact { text-align: center; font-size: 10px; color: var(--dim); margin: 10px 0 20px; letter-spacing: 1px; }
        .t11 .section-title { font-size: 10px; font-weight: 700; color: var(--gold); letter-spacing: 4px; text-transform: uppercase; text-align: center; margin: 22px 0 10px; }
        .t11 .summary { font-size: 11px; color: var(--dim); text-align: center; font-style: italic; padding: 0 20px; }
        .t11 .job-role { font-size: 13px; font-weight: 700; color: var(--cream); margin-top: 14px; }
        .t11 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t11 .job-company { color: var(--gold); }
        .t11 .job-dates { color: var(--dim); font-style: italic; }
        .t11 .job-loc { color: var(--dim); }
        .t11 ul { margin: 5px 0 0; padding-left: 16px; }
        .t11 li { font-size: 10.5px; color: #9A9AAE; margin-bottom: 3px; }
        .t11 li::marker { color: var(--gold); }
        .t11 .edu-row { display: flex; justify-content: space-between; margin-top: 10px; }
        .t11 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--cream); }
        .t11 .edu-school { font-size: 11px; color: var(--gold); }
        .t11 .edu-detail { font-size: 10.5px; color: var(--dim); }
        .t11 .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 8px; }
        .t11 .skill-tag { border: 1px solid #333355; color: var(--gold); font-size: 9.5px; padding: 3px 10px; border-radius: 2px; letter-spacing: 0.5px; }
        .t11 .cert-item { font-size: 10.5px; color: #9A9AAE; text-align: center; margin-bottom: 4px; }
      `}</style>
      <div className="t11">
        <h1>{d.name}</h1>
        <div className="gold-rule" />
        <div className="title">{d.title}</div>
        <div className="contact">{d.email} &nbsp;|&nbsp; {d.phone} &nbsp;|&nbsp; {d.location} &nbsp;|&nbsp; {d.linkedin}</div>
        <div className="section-title">About</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-role">{j.role}</div>
            <div className="job-meta"><span><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span></span><span className="job-dates">{j.dates}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skill-tags">{d.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
        <div className="section-title">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 12: FOREST CANOPY ====================
function ForestCanopy({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#2D3B2D", lineHeight: 1.55 }}>
      <style>{`
        .t12 { --pine: #2D5016; --moss: #6B8F4E; --leaf: #A8C686; --bark: #5C4033; --parchment: #FEFCF3; }
        .t12 .header { border-left: 5px solid var(--pine); padding-left: 18px; margin-bottom: 18px; }
        .t12 h1 { font-size: 30px; font-weight: 800; color: var(--pine); margin: 0; }
        .t12 .title { font-size: 13px; color: var(--moss); font-weight: 600; margin-top: 2px; }
        .t12 .contact { font-size: 10.5px; color: #8A8A7A; margin-top: 6px; }
        .t12 .section-title { font-size: 11px; font-weight: 700; color: var(--pine); letter-spacing: 3px; text-transform: uppercase; margin: 20px 0 8px; padding-bottom: 4px; border-bottom: 2px solid var(--leaf); }
        .t12 .summary { font-size: 11px; color: #5A6B5A; background: var(--parchment); padding: 10px 14px; border-radius: 4px; border: 1px solid #E8E4D4; }
        .t12 .timeline-item { position: relative; padding-left: 20px; margin-top: 14px; border-left: 2px solid #D4DEC8; }
        .t12 .timeline-item::before { content: "●"; position: absolute; left: -6px; top: 0; color: var(--moss); font-size: 10px; background: #fff; }
        .t12 .job-role { font-size: 12.5px; font-weight: 700; color: var(--pine); }
        .t12 .job-meta { font-size: 11px; }
        .t12 .job-company { color: var(--moss); font-weight: 600; }
        .t12 .job-dates { color: #A0A090; font-style: italic; }
        .t12 .job-loc { color: #B0B0A0; }
        .t12 ul { margin: 4px 0 0; padding-left: 14px; }
        .t12 li { font-size: 10.5px; color: #5A6B5A; margin-bottom: 3px; }
        .t12 li::marker { color: var(--leaf); }
        .t12 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t12 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--pine); }
        .t12 .edu-school { font-size: 11px; color: var(--moss); }
        .t12 .edu-detail { font-size: 10.5px; color: #A0A090; }
        .t12 .skill-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .t12 .skill-chip { background: #EDF3E5; color: var(--pine); font-size: 10px; padding: 4px 10px; border-radius: 4px; font-weight: 600; }
        .t12 .cert-item { font-size: 10.5px; color: #5A6B5A; margin-bottom: 4px; padding-left: 14px; position: relative; }
        .t12 .cert-item::before { content: "✓"; color: var(--moss); position: absolute; left: 0; font-weight: 700; font-size: 11px; }
      `}</style>
      <div className="t12">
        <div className="header">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} · {d.phone} · {d.location} · {d.linkedin}</div>
        </div>
        <div className="section-title">Summary</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i} className="timeline-item">
            <div className="job-role">{j.role}</div>
            <div className="job-meta"><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span> &nbsp; <span className="job-dates">{j.dates}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skill-wrap">{d.skills.map((s, i) => <span key={i} className="skill-chip">{s}</span>)}</div>
        <div className="section-title">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 13: COPPER DECO ====================
function CopperDeco({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#3E2723", lineHeight: 1.55 }}>
      <style>{`
        .t13 { --copper: #B87333; --dark: #2C1810; --cream: #FFF8F0; --warm: #8B6914; }
        .t13 .header { text-align: center; padding-bottom: 16px; }
        .t13 .deco-line { display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--copper); font-size: 12px; margin-bottom: 6px; }
        .t13 .deco-line::before, .t13 .deco-line::after { content: ""; width: 60px; height: 1px; background: var(--copper); }
        .t13 h1 { font-size: 32px; font-weight: 700; color: var(--dark); margin: 0; letter-spacing: 5px; text-transform: uppercase; }
        .t13 .title { font-size: 13px; color: var(--copper); letter-spacing: 2px; margin-top: 4px; }
        .t13 .contact { font-size: 10px; color: #A0887A; margin-top: 8px; letter-spacing: 1px; }
        .t13 .section-title { font-size: 11px; font-weight: 700; color: var(--dark); letter-spacing: 4px; text-transform: uppercase; margin: 22px 0 10px; text-align: center; position: relative; }
        .t13 .section-title::before, .t13 .section-title::after { content: " ◈ "; color: var(--copper); font-size: 9px; }
        .t13 .summary { font-size: 11px; color: #6D5D53; text-align: center; border-top: 1px solid #E8D5C4; border-bottom: 1px solid #E8D5C4; padding: 10px 16px; background: var(--cream); }
        .t13 .job-role { font-size: 12.5px; font-weight: 700; color: var(--dark); margin-top: 12px; }
        .t13 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t13 .job-company { color: var(--copper); font-weight: 600; }
        .t13 .job-dates { color: #B0A090; font-style: italic; }
        .t13 .job-loc { color: #B0A090; }
        .t13 ul { margin: 5px 0 0; padding-left: 16px; }
        .t13 li { font-size: 10.5px; color: #6D5D53; margin-bottom: 3px; }
        .t13 li::marker { color: var(--copper); }
        .t13 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t13 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--dark); }
        .t13 .edu-school { font-size: 11px; color: var(--copper); }
        .t13 .edu-detail { font-size: 10.5px; color: #B0A090; }
        .t13 .skill-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 14px; margin-top: 6px; }
        .t13 .skill-item { font-size: 10.5px; color: #6D5D53; text-align: center; padding: 3px 0; border-bottom: 1px dotted #E8D5C4; }
        .t13 .cert-item { font-size: 10.5px; color: #6D5D53; text-align: center; margin-bottom: 3px; }
      `}</style>
      <div className="t13">
        <div className="header">
          <div className="deco-line">◆</div>
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} &nbsp;·&nbsp; {d.phone} &nbsp;·&nbsp; {d.location} &nbsp;·&nbsp; {d.linkedin}</div>
        </div>
        <div className="section-title">Summary</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-role">{j.role}</div>
            <div className="job-meta"><span><span className="job-company">{j.company}</span><span className="job-loc">, {j.location}</span></span><span className="job-dates">{j.dates}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
        ))}
        <div className="section-title">Expertise</div>
        <div className="skill-grid">{d.skills.map((s, i) => <div key={i} className="skill-item">{s}</div>)}</div>
        <div className="section-title">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 14: ARCTIC FROST ====================
function ArcticFrost({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#2E3440", lineHeight: 1.55 }}>
      <style>{`
        .t14 { --frost: #5E81AC; --ice: #88C0D0; --snow: #ECEFF4; --polar: #D8DEE9; --night: #2E3440; --aurora: #A3BE8C; }
        .t14 .header { background: linear-gradient(135deg, #2E3440, #3B4252); color: #fff; padding: 22px 26px; border-radius: 6px; margin-bottom: 16px; }
        .t14 .header h1 { font-size: 26px; font-weight: 700; margin: 0; letter-spacing: 2px; }
        .t14 .header .title { font-size: 13px; color: var(--ice); margin-top: 3px; }
        .t14 .header .contact { font-size: 10px; color: #8892A4; margin-top: 8px; }
        .t14 .two-col { display: flex; gap: 20px; }
        .t14 .col-left { width: 180px; flex-shrink: 0; }
        .t14 .col-right { flex: 1; min-width: 0; }
        .t14 .side-section { background: var(--snow); border-radius: 6px; padding: 12px; margin-bottom: 12px; }
        .t14 .side-title { font-size: 9.5px; font-weight: 700; color: var(--frost); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 8px; }
        .t14 .side-skill { font-size: 10px; color: #4C566A; padding: 3px 0; display: flex; align-items: center; gap: 6px; }
        .t14 .side-skill::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--ice); flex-shrink: 0; }
        .t14 .side-edu-title { font-size: 10.5px; font-weight: 700; color: var(--night); }
        .t14 .side-edu-school { font-size: 10px; color: var(--frost); }
        .t14 .side-edu-year { font-size: 9.5px; color: #8892A4; margin-bottom: 8px; }
        .t14 .cert-text { font-size: 9.5px; color: #4C566A; margin-bottom: 5px; }
        .t14 .main-title { font-size: 11px; font-weight: 700; color: var(--frost); letter-spacing: 3px; text-transform: uppercase; margin: 0 0 10px; border-bottom: 2px solid var(--polar); padding-bottom: 4px; }
        .t14 .summary { font-size: 11px; color: #4C566A; margin-bottom: 16px; }
        .t14 .job-card { background: var(--snow); border-radius: 6px; padding: 12px 14px; margin-bottom: 10px; }
        .t14 .job-role { font-size: 12.5px; font-weight: 700; color: var(--night); }
        .t14 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t14 .job-company { color: var(--frost); font-weight: 600; }
        .t14 .job-dates { color: #8892A4; }
        .t14 .job-loc { color: #B0B8C8; }
        .t14 ul { margin: 5px 0 0; padding-left: 14px; }
        .t14 li { font-size: 10.5px; color: #4C566A; margin-bottom: 2px; }
        .t14 li::marker { color: var(--ice); }
      `}</style>
      <div className="t14">
        <div className="header">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} &nbsp;·&nbsp; {d.phone} &nbsp;·&nbsp; {d.location} &nbsp;·&nbsp; {d.linkedin}</div>
        </div>
        <div className="two-col">
          <div className="col-left">
            <div className="side-section">
              <div className="side-title">Skills</div>
              {d.skills.map((s, i) => <div key={i} className="side-skill">{s}</div>)}
            </div>
            <div className="side-section">
              <div className="side-title">Education</div>
              {d.education.map((e, i) => (
                <div key={i}><div className="side-edu-title">{e.degree}</div><div className="side-edu-school">{e.school}</div><div className="side-edu-year">{e.year} · {e.details}</div></div>
              ))}
            </div>
            <div className="side-section">
              <div className="side-title">Certifications</div>
              {d.certifications.map((c, i) => <div key={i} className="cert-text">{c}</div>)}
            </div>
          </div>
          <div className="col-right">
            <div className="main-title">Profile</div>
            <div className="summary">{d.summary}</div>
            <div className="main-title">Experience</div>
            {d.experience.map((j, i) => (
              <div key={i} className="job-card">
                <div className="job-role">{j.role}</div>
                <div className="job-meta"><span><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span></span><span className="job-dates">{j.dates}</span></div>
                <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TEMPLATE 15: SUNSET GRADIENT ====================
function SunsetGradient({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#3D2C2C", lineHeight: 1.55 }}>
      <style>{`
        .t15 { --flame: #E85D26; --plum: #8B2F5F; --peach: #FEF0E7; --wine: #5C1A3A; }
        .t15 .header { background: linear-gradient(135deg, var(--flame), var(--plum)); color: #fff; padding: 26px 30px; border-radius: 0 0 16px 16px; margin: -2px -2px 0; text-align: center; }
        .t15 h1 { font-size: 28px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase; margin: 0; }
        .t15 .header .title { font-size: 13px; opacity: 0.9; margin-top: 4px; letter-spacing: 2px; }
        .t15 .header .contact { font-size: 10px; opacity: 0.75; margin-top: 10px; }
        .t15 .body { padding: 0 4px; }
        .t15 .section-title { font-size: 11px; font-weight: 700; letter-spacing: 3.5px; text-transform: uppercase; margin: 20px 0 8px; background: linear-gradient(90deg, var(--flame), var(--plum)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .t15 .summary { font-size: 11px; color: #6B5A5A; background: var(--peach); padding: 10px 14px; border-radius: 8px; }
        .t15 .job-role { font-size: 12.5px; font-weight: 700; color: var(--wine); margin-top: 12px; }
        .t15 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t15 .job-company { color: var(--flame); font-weight: 600; }
        .t15 .job-dates { color: #C0A0A0; font-style: italic; }
        .t15 .job-loc { color: #C0A0A0; }
        .t15 ul { margin: 5px 0 0; padding-left: 16px; }
        .t15 li { font-size: 10.5px; color: #6B5A5A; margin-bottom: 3px; }
        .t15 li::marker { color: var(--flame); }
        .t15 .edu-row { display: flex; justify-content: space-between; margin-top: 10px; }
        .t15 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--wine); }
        .t15 .edu-school { font-size: 11px; color: var(--plum); }
        .t15 .edu-detail { font-size: 10.5px; color: #C0A0A0; }
        .t15 .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .t15 .skill-tag { background: linear-gradient(135deg, #FEF0E7, #FCE4EC); color: var(--wine); font-size: 10px; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
        .t15 .cert-item { font-size: 10.5px; color: #6B5A5A; margin-bottom: 4px; padding-left: 14px; position: relative; }
        .t15 .cert-item::before { content: "★"; color: var(--flame); position: absolute; left: 0; font-size: 9px; }
      `}</style>
      <div className="t15">
        <div className="header">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} · {d.phone} · {d.location} · {d.linkedin}</div>
        </div>
        <div className="body">
          <div className="section-title">Profile</div>
          <div className="summary">{d.summary}</div>
          <div className="section-title">Experience</div>
          {d.experience.map((j, i) => (
            <div key={i}>
              <div className="job-role">{j.role}</div>
              <div className="job-meta"><span><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span></span><span className="job-dates">{j.dates}</span></div>
              <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          ))}
          <div className="section-title">Education</div>
          {d.education.map((e, i) => (
            <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
          ))}
          <div className="section-title">Skills</div>
          <div className="skill-tags">{d.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
          <div className="section-title">Certifications</div>
          {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
        </div>
      </div>
    </div>
  );
}

// ==================== TEMPLATE 16: METRO LINE ====================
function MetroLine({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#333", lineHeight: 1.5 }}>
      <style>{`
        .t16 { --blue: #0078D4; --dark: #1B1B1B; --light-bg: #F3F3F3; }
        .t16 .header { display: flex; align-items: center; gap: 18px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 3px solid var(--blue); }
        .t16 .header-block { width: 56px; height: 56px; background: var(--blue); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; font-weight: 800; flex-shrink: 0; }
        .t16 h1 { font-size: 24px; font-weight: 800; color: var(--dark); margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .t16 .title { font-size: 13px; color: var(--blue); font-weight: 600; }
        .t16 .contact { font-size: 10px; color: #888; margin-top: 3px; }
        .t16 .section-title { font-size: 10.5px; font-weight: 800; color: #fff; letter-spacing: 3px; text-transform: uppercase; background: var(--blue); display: inline-block; padding: 3px 12px; margin: 18px 0 10px; }
        .t16 .summary { font-size: 11px; color: #555; padding: 8px 12px; background: var(--light-bg); border-left: 3px solid var(--blue); }
        .t16 .job-row { display: flex; gap: 14px; margin-top: 12px; }
        .t16 .job-date-col { width: 90px; flex-shrink: 0; font-size: 10px; color: #888; padding-top: 2px; text-align: right; font-family: monospace; }
        .t16 .job-content { flex: 1; min-width: 0; border-left: 2px solid #D0D0D0; padding-left: 14px; padding-bottom: 8px; }
        .t16 .job-role { font-size: 12.5px; font-weight: 700; color: var(--dark); }
        .t16 .job-company { font-size: 11px; color: var(--blue); font-weight: 600; }
        .t16 .job-loc { color: #aaa; font-weight: 400; }
        .t16 ul { margin: 4px 0 0; padding-left: 14px; }
        .t16 li { font-size: 10.5px; color: #555; margin-bottom: 2px; }
        .t16 li::marker { color: var(--blue); content: "▪ "; }
        .t16 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t16 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--dark); }
        .t16 .edu-year { font-size: 10px; color: #888; font-family: monospace; }
        .t16 .edu-school { font-size: 11px; color: var(--blue); }
        .t16 .edu-detail { font-size: 10.5px; color: #aaa; }
        .t16 .skill-blocks { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
        .t16 .skill-block { background: var(--light-bg); color: var(--dark); font-size: 10px; padding: 4px 10px; font-weight: 600; border-left: 3px solid var(--blue); }
        .t16 .cert-item { font-size: 10.5px; color: #555; margin-bottom: 3px; padding-left: 14px; position: relative; }
        .t16 .cert-item::before { content: "▪"; color: var(--blue); position: absolute; left: 2px; }
      `}</style>
      <div className="t16">
        <div className="header">
          <div className="header-block">{d.name.split(" ").map(w => w[0]).join("")}</div>
          <div><h1>{d.name}</h1><div className="title">{d.title}</div><div className="contact">{d.email} · {d.phone} · {d.location} · {d.linkedin}</div></div>
        </div>
        <div className="section-title">Profile</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i} className="job-row">
            <div className="job-date-col">{j.dates}</div>
            <div className="job-content">
              <div className="job-role">{j.role}</div>
              <div className="job-company">{j.company} <span className="job-loc">· {j.location}</span></div>
              <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="edu-year">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skill-blocks">{d.skills.map((s, i) => <div key={i} className="skill-block">{s}</div>)}</div>
        <div className="section-title">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 17: ROSE QUARTZ ====================
function RoseQuartz({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#4A3B3B", lineHeight: 1.55 }}>
      <style>{`
        .t17 { --rose: #C77D8A; --blush: #F5E6EA; --deep: #6B3A4A; --soft: #E8CDD3; }
        .t17 .header { text-align: center; padding-bottom: 16px; border-bottom: 1px solid var(--soft); margin-bottom: 16px; }
        .t17 h1 { font-size: 30px; font-weight: 300; color: var(--deep); letter-spacing: 6px; text-transform: uppercase; margin: 0; }
        .t17 .title { font-size: 13px; color: var(--rose); margin-top: 4px; font-weight: 600; letter-spacing: 1px; }
        .t17 .contact { font-size: 10.5px; color: #B0A0A4; margin-top: 8px; }
        .t17 .section-title { font-size: 10.5px; font-weight: 700; color: var(--rose); letter-spacing: 3px; text-transform: uppercase; margin: 20px 0 8px; display: flex; align-items: center; gap: 10px; }
        .t17 .section-title::before, .t17 .section-title::after { content: ""; flex: 1; height: 1px; background: var(--soft); }
        .t17 .summary { font-size: 11px; color: #7A6A6A; text-align: center; padding: 10px 24px; background: var(--blush); border-radius: 8px; }
        .t17 .job-role { font-size: 12.5px; font-weight: 700; color: var(--deep); margin-top: 12px; }
        .t17 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t17 .job-company { color: var(--rose); font-weight: 600; }
        .t17 .job-dates { color: #C0B0B4; font-style: italic; }
        .t17 .job-loc { color: #C0B0B4; }
        .t17 ul { margin: 5px 0 0; padding-left: 16px; }
        .t17 li { font-size: 10.5px; color: #7A6A6A; margin-bottom: 3px; }
        .t17 li::marker { color: var(--rose); content: "♦ "; font-size: 7px; }
        .t17 .edu-row { display: flex; justify-content: space-between; margin-top: 10px; }
        .t17 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--deep); }
        .t17 .edu-school { font-size: 11px; color: var(--rose); }
        .t17 .edu-detail { font-size: 10.5px; color: #C0B0B4; }
        .t17 .skill-wrap { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 6px; }
        .t17 .skill-pill { background: var(--blush); color: var(--deep); font-size: 10px; padding: 4px 12px; border-radius: 20px; font-weight: 600; border: 1px solid var(--soft); }
        .t17 .cert-item { font-size: 10.5px; color: #7A6A6A; text-align: center; margin-bottom: 4px; }
      `}</style>
      <div className="t17">
        <div className="header">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} &nbsp;·&nbsp; {d.phone} &nbsp;·&nbsp; {d.location} &nbsp;·&nbsp; {d.linkedin}</div>
        </div>
        <div className="section-title">Summary</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-role">{j.role}</div>
            <div className="job-meta"><span><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span></span><span className="job-dates">{j.dates}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skill-wrap">{d.skills.map((s, i) => <span key={i} className="skill-pill">{s}</span>)}</div>
        <div className="section-title">Certifications</div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 18: CONCRETE BRUTALIST ====================
function ConcreteBrutalist({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#1a1a1a", lineHeight: 1.5 }}>
      <style>{`
        .t18 { --concrete: #8C8C8C; --black: #0a0a0a; --yellow: #FFD600; --light: #F2F2F2; }
        .t18 .header { border: 3px solid var(--black); padding: 18px 20px; margin-bottom: 16px; }
        .t18 h1 { font-size: 34px; font-weight: 900; color: var(--black); margin: 0; text-transform: uppercase; line-height: 1; }
        .t18 .title { font-size: 13px; font-weight: 800; color: var(--black); text-transform: uppercase; letter-spacing: 4px; margin-top: 4px; background: var(--yellow); display: inline-block; padding: 2px 8px; }
        .t18 .contact { font-size: 10px; color: var(--concrete); margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .t18 .section-title { font-size: 11px; font-weight: 900; color: var(--black); letter-spacing: 4px; text-transform: uppercase; margin: 20px 0 8px; background: var(--yellow); display: inline-block; padding: 2px 10px; }
        .t18 .summary { font-size: 11px; color: #444; border: 1px solid #ddd; padding: 10px 14px; background: var(--light); }
        .t18 .job-role { font-size: 13px; font-weight: 900; color: var(--black); text-transform: uppercase; margin-top: 14px; }
        .t18 .job-meta { display: flex; justify-content: space-between; font-size: 11px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 4px; }
        .t18 .job-company { color: var(--black); font-weight: 700; }
        .t18 .job-dates { color: var(--concrete); font-family: monospace; font-size: 10px; }
        .t18 .job-loc { color: var(--concrete); font-weight: 400; }
        .t18 ul { margin: 4px 0 0; padding-left: 16px; }
        .t18 li { font-size: 10.5px; color: #444; margin-bottom: 2px; }
        .t18 li::marker { color: var(--yellow); content: "■ "; font-size: 8px; }
        .t18 .edu-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .t18 .edu-degree { font-weight: 900; font-size: 11.5px; color: var(--black); text-transform: uppercase; }
        .t18 .edu-school { font-size: 11px; color: #444; }
        .t18 .edu-detail { font-size: 10.5px; color: var(--concrete); }
        .t18 .skill-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px; margin-top: 6px; }
        .t18 .skill-item { font-size: 10px; font-weight: 700; color: var(--black); text-transform: uppercase; padding: 4px 8px; background: var(--light); border-left: 3px solid var(--yellow); }
        .t18 .cert-item { font-size: 10.5px; color: #444; margin-bottom: 3px; font-family: monospace; }
        .t18 .cert-item::before { content: "// "; color: var(--concrete); }
      `}</style>
      <div className="t18">
        <div className="header">
          <h1>{d.name}</h1>
          <div className="title">{d.title}</div>
          <div className="contact">{d.email} / {d.phone} / {d.location} / {d.linkedin}</div>
        </div>
        <div className="section-title">Profile</div><br/>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div><br/>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-role">{j.role}</div>
            <div className="job-meta"><span><span className="job-company">{j.company}</span><span className="job-loc"> / {j.location}</span></span><span className="job-dates">{j.dates}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div><br/>
        {d.education.map((e, i) => (
          <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
        ))}
        <div className="section-title">Skills</div><br/>
        <div className="skill-grid">{d.skills.map((s, i) => <div key={i} className="skill-item">{s}</div>)}</div>
        <div style={{marginTop:12}}><div className="section-title">Certifications</div></div><br/>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 19: LAVENDER FIELDS ====================
function LavenderFields({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#3D3557", lineHeight: 1.55 }}>
      <style>{`
        .t19 { --lav: #7C6DAF; --lilac: #E8E0F0; --deep: #2E2348; --soft: #F5F2FA; --muted: #9B8EC0; }
        .t19 .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--lav); padding-bottom: 12px; margin-bottom: 16px; }
        .t19 .header-left h1 { font-size: 28px; font-weight: 700; color: var(--deep); margin: 0; }
        .t19 .header-left .title { font-size: 13px; color: var(--lav); font-weight: 600; }
        .t19 .header-right { text-align: right; font-size: 10.5px; color: var(--muted); line-height: 1.7; }
        .t19 .section-title { font-size: 11px; font-weight: 700; color: var(--deep); letter-spacing: 3px; text-transform: uppercase; margin: 20px 0 8px; padding: 4px 12px; background: var(--lilac); border-radius: 4px; display: inline-block; }
        .t19 .summary { font-size: 11px; color: #6B5E80; padding: 10px 14px; background: var(--soft); border-radius: 6px; border-left: 3px solid var(--muted); }
        .t19 .job-role { font-size: 12.5px; font-weight: 700; color: var(--deep); margin-top: 12px; }
        .t19 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t19 .job-company { color: var(--lav); font-weight: 600; }
        .t19 .job-dates { color: var(--muted); font-style: italic; }
        .t19 .job-loc { color: #B8B0C8; }
        .t19 ul { margin: 5px 0 0; padding-left: 16px; }
        .t19 li { font-size: 10.5px; color: #6B5E80; margin-bottom: 3px; }
        .t19 li::marker { color: var(--lav); }
        .t19 .edu-row { display: flex; justify-content: space-between; margin-top: 10px; }
        .t19 .edu-degree { font-weight: 700; font-size: 11.5px; color: var(--deep); }
        .t19 .edu-school { font-size: 11px; color: var(--lav); }
        .t19 .edu-detail { font-size: 10.5px; color: var(--muted); }
        .t19 .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .t19 .skill-tag { background: var(--soft); color: var(--deep); font-size: 10px; padding: 4px 10px; border-radius: 4px; font-weight: 600; border: 1px solid var(--lilac); }
        .t19 .cert-item { font-size: 10.5px; color: #6B5E80; margin-bottom: 4px; padding-left: 14px; position: relative; }
        .t19 .cert-item::before { content: "◇"; color: var(--lav); position: absolute; left: 0; font-size: 10px; }
      `}</style>
      <div className="t19">
        <div className="header">
          <div className="header-left"><h1>{d.name}</h1><div className="title">{d.title}</div></div>
          <div className="header-right">{d.email}<br/>{d.phone}<br/>{d.location}<br/>{d.linkedin}</div>
        </div>
        <div className="section-title">Summary</div>
        <div className="summary">{d.summary}</div>
        <div className="section-title">Experience</div>
        {d.experience.map((j, i) => (
          <div key={i}>
            <div className="job-role">{j.role}</div>
            <div className="job-meta"><span><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span></span><span className="job-dates">{j.dates}</span></div>
            <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
          </div>
        ))}
        <div className="section-title">Education</div>
        {d.education.map((e, i) => (
          <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
        ))}
        <div className="section-title">Skills</div>
        <div className="skill-tags">{d.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
        <div style={{marginTop: 8}}><div className="section-title">Certifications</div></div>
        {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
      </div>
    </div>
  );
}

// ==================== TEMPLATE 20: STEEL INDUSTRIAL ====================
function SteelIndustrial({ d }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", color: "#333", lineHeight: 1.5 }}>
      <style>{`
        .t20 { --steel: #607D8B; --iron: #37474F; --rivet: #FF6F00; --plate: #ECEFF1; }
        .t20 .header { background: var(--iron); color: #fff; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
        .t20 .header-left h1 { font-size: 26px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
        .t20 .header-left .title { font-size: 12px; color: var(--rivet); font-weight: 700; text-transform: uppercase; letter-spacing: 3px; margin-top: 2px; }
        .t20 .header-right { text-align: right; font-size: 10px; color: #90A4AE; line-height: 1.7; }
        .t20 .body { padding: 0 2px; }
        .t20 .section-title { font-size: 10.5px; font-weight: 900; color: var(--iron); letter-spacing: 4px; text-transform: uppercase; margin: 20px 0 8px; padding-bottom: 4px; border-bottom: 2px solid var(--iron); display: flex; align-items: center; gap: 8px; }
        .t20 .section-title::before { content: ""; width: 8px; height: 8px; background: var(--rivet); border-radius: 50%; flex-shrink: 0; }
        .t20 .summary { font-size: 11px; color: #546E7A; background: var(--plate); padding: 10px 14px; border-left: 4px solid var(--steel); }
        .t20 .job-role { font-size: 13px; font-weight: 800; color: var(--iron); text-transform: uppercase; margin-top: 14px; }
        .t20 .job-meta { display: flex; justify-content: space-between; font-size: 11px; }
        .t20 .job-company { color: var(--rivet); font-weight: 700; }
        .t20 .job-dates { color: var(--steel); font-family: monospace; font-size: 10px; }
        .t20 .job-loc { color: #90A4AE; }
        .t20 ul { margin: 4px 0 0; padding-left: 14px; }
        .t20 li { font-size: 10.5px; color: #546E7A; margin-bottom: 2px; }
        .t20 li::marker { color: var(--rivet); content: "▸ "; }
        .t20 .edu-row { display: flex; justify-content: space-between; margin-top: 10px; }
        .t20 .edu-degree { font-weight: 800; font-size: 11.5px; color: var(--iron); text-transform: uppercase; }
        .t20 .edu-school { font-size: 11px; color: var(--steel); }
        .t20 .edu-detail { font-size: 10.5px; color: #90A4AE; }
        .t20 .skill-blocks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 6px; }
        .t20 .skill-block { background: var(--plate); color: var(--iron); font-size: 10px; padding: 5px 8px; font-weight: 700; text-transform: uppercase; text-align: center; border-top: 2px solid var(--rivet); }
        .t20 .cert-item { font-size: 10.5px; color: #546E7A; margin-bottom: 3px; font-family: monospace; font-size: 10px; }
        .t20 .cert-item::before { content: "⬡ "; color: var(--rivet); }
      `}</style>
      <div className="t20">
        <div className="header">
          <div className="header-left"><h1>{d.name}</h1><div className="title">{d.title}</div></div>
          <div className="header-right">{d.email}<br/>{d.phone}<br/>{d.location}<br/>{d.linkedin}</div>
        </div>
        <div className="body">
          <div className="section-title">Profile</div>
          <div className="summary">{d.summary}</div>
          <div className="section-title">Experience</div>
          {d.experience.map((j, i) => (
            <div key={i}>
              <div className="job-role">{j.role}</div>
              <div className="job-meta"><span><span className="job-company">{j.company}</span><span className="job-loc"> · {j.location}</span></span><span className="job-dates">{j.dates}</span></div>
              <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          ))}
          <div className="section-title">Education</div>
          {d.education.map((e, i) => (
            <div key={i}><div className="edu-row"><span className="edu-degree">{e.degree}</span><span className="job-dates">{e.year}</span></div><div className="edu-school">{e.school}</div><div className="edu-detail">{e.details}</div></div>
          ))}
          <div className="section-title">Skills</div>
          <div className="skill-blocks">{d.skills.map((s, i) => <div key={i} className="skill-block">{s}</div>)}</div>
          <div className="section-title">Certifications</div>
          {d.certifications.map((c, i) => <div key={i} className="cert-item">{c}</div>)}
        </div>
      </div>
    </div>
  );
}

// ─── Template Registry ──────────────────────────────────────────
const templates = [
  { id: "classic", name: "Classic Executive", color: "#1B365D", component: ClassicExecutive },
  { id: "sidebar", name: "Modern Sidebar", color: "#2D8C6F", component: ModernSidebar },
  { id: "minimal", name: "Minimalist Clean", color: "#E74C3C", component: MinimalistClean },
  { id: "bold", name: "Bold Modern", color: "#6C3FC5", component: BoldModern },
  { id: "elegant", name: "Elegant Professional", color: "#B8860B", component: ElegantProfessional },
  { id: "tech", name: "Tech Slate", color: "#00E5A0", component: TechSlate },
  { id: "coral", name: "Coral Horizon", color: "#E8634A", component: CoralHorizon },
  { id: "swiss", name: "Swiss Grid", color: "#FF0000", component: SwissGrid },
  { id: "ocean", name: "Ocean Breeze", color: "#0EA5E9", component: OceanBreeze },
  { id: "mono", name: "Monochrome Editorial", color: "#333333", component: MonochromeEditorial },
  { id: "midnight", name: "Midnight Luxe", color: "#C9A96E", component: MidnightLuxe },
  { id: "forest", name: "Forest Canopy", color: "#2D5016", component: ForestCanopy },
  { id: "copper", name: "Copper Deco", color: "#B87333", component: CopperDeco },
  { id: "arctic", name: "Arctic Frost", color: "#5E81AC", component: ArcticFrost },
  { id: "sunset", name: "Sunset Gradient", color: "#E85D26", component: SunsetGradient },
  { id: "metro", name: "Metro Line", color: "#0078D4", component: MetroLine },
  { id: "rose", name: "Rose Quartz", color: "#C77D8A", component: RoseQuartz },
  { id: "brutalist", name: "Concrete Brutalist", color: "#FFD600", component: ConcreteBrutalist },
  { id: "lavender", name: "Lavender Fields", color: "#7C6DAF", component: LavenderFields },
  { id: "steel", name: "Steel Industrial", color: "#FF6F00", component: SteelIndustrial },
];

// ─── Main App ───────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const resumeRef = useRef(null);
  const d = defaultData;
  const current = templates.find((t) => t.id === activeTemplate);
  const TemplateComponent = current.component;

  const handlePrint = () => {
    const content = resumeRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Resume</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { padding: 0; }
        @media print {
          @page { size: letter; margin: 0.65in 0.7in; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style></head><body>${content.innerHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F0ED", fontFamily: "'Source Sans 3', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>

      {/* Top Bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0ddd8", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: current.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#2B2B2B", letterSpacing: 0.5 }}>Resume Templates</span>
          <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4, background: "#f5f4f1", padding: "2px 8px", borderRadius: 10 }}>20 designs</span>
        </div>
        <button
          onClick={handlePrint}
          style={{ background: current.color, color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.target.style.opacity = 0.85)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Save PDF
        </button>
      </div>

      {/* Template Selector */}
      <div style={{ display: "flex", gap: 8, padding: "16px 24px", overflowX: "auto", flexWrap: "wrap" }}>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTemplate(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 16px", borderRadius: 8,
              border: activeTemplate === t.id ? `2px solid ${t.color}` : "2px solid transparent",
              background: activeTemplate === t.id ? "#fff" : "#fafaf8",
              boxShadow: activeTemplate === t.id ? `0 2px 12px ${t.color}22` : "0 1px 3px rgba(0,0,0,0.06)",
              cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: activeTemplate === t.id ? 700 : 500, color: activeTemplate === t.id ? t.color : "#666" }}>
              {t.name}
            </span>
          </button>
        ))}
      </div>

      {/* Resume Preview */}
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 24px 40px" }}>
        <div
          ref={resumeRef}
          style={{
            width: 680, minHeight: 880,
            background: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            borderRadius: 4,
            padding: "32px 40px",
            overflow: "auto",
          }}
        >
          <TemplateComponent d={d} />
        </div>
      </div>

      {/* Integration hint */}
      <div style={{ textAlign: "center", padding: "0 24px 32px", color: "#aaa", fontSize: 12, maxWidth: 600, margin: "0 auto" }}>
        To integrate: replace <code style={{ background: "#f0efec", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", fontSize: 11 }}>defaultData</code> with your form state. Each template is a pure component that accepts a <code style={{ background: "#f0efec", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", fontSize: 11 }}>{`{d}`}</code> prop. Use Print / Save PDF to export.
      </div>
    </div>
  );
}
