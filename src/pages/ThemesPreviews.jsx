import './ThemesPreviews.css'
import '../styles/terminal.css'
import '../styles/scifi.css'
import '../styles/sophisticated.css'
import '../styles/healthcare.css'
import '../styles/nature.css'
import '../styles/vintage.css'
import '../styles/graduate.css'

function useDynamicData(data) {
    const d = data || {};
    const p = d.personal || {};

    return {
        name: p.fullName || 'Alex Morgan',
        role: p.jobTitle || 'Product Manager',
        email: p.email || 'alex@example.com',
        phone: p.phone || '(555) 012-3456',
        location: p.location || 'New York, NY',
        experience: d.experience && d.experience.length > 0 ? d.experience : [
            { title: 'Senior Product Manager', company: 'Google', startDate: '2020', endDate: 'Present', current: true, description: 'Led cross-functional teams to ship major products.' },
            { title: 'Product Manager', company: 'Stripe', startDate: '2017', endDate: '2020', current: false, description: 'Owned payments dashboard experience.' }
        ],
        education: d.education && d.education.length > 0 ? d.education : [
            { degree: 'B.S. Computer Science', school: 'MIT', endDate: '2017' }
        ],
        skills: d.skills && d.skills.length > 0 ? d.skills : ['Product Strategy', 'SQL', 'Figma', 'Analytical Thinking']
    };
}

export function ClassicPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="classic-resume">
            <div className="cr-name">{res.name}</div>
            <div className="cr-contact">✉ {res.email} · ☎ {res.phone} · {res.location}</div>

            {res.experience.length > 0 && (
                <div className="cr-section">
                    <div className="cr-section-title">Experience</div>
                    {res.experience.slice(0, 2).map((exp, i) => (
                        <div key={i} className="cr-job">
                            <div className="cr-job-title">{exp.title}</div>
                            <div className="cr-job-company">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                            {exp.description && <div className="cr-job-desc">{exp.description.slice(0, 100)}...</div>}
                        </div>
                    ))}
                </div>
            )}

            {res.education.length > 0 && (
                <div className="cr-section">
                    <div className="cr-section-title">Education</div>
                    {res.education.slice(0, 1).map((edu, i) => (
                        <div key={i} className="cr-job">
                            <div className="cr-job-title">{edu.degree} — {edu.school} · {edu.endDate}</div>
                        </div>
                    ))}
                </div>
            )}

            {res.skills.length > 0 && (
                <div className="cr-section">
                    <div className="cr-section-title">Skills</div>
                    <div className="cr-skills">
                        {res.skills.slice(0, 6).map((skill, i) => (
                            <span key={i} className="cr-skill">{skill}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export function MinimalistPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="minimal-resume">
            <div className="mr-name">{res.name}</div>
            <div className="mr-role">{res.role}</div>
            <div className="mr-divider" />

            {res.experience.length > 0 && (
                <div className="mr-section">
                    <div className="mr-label">Experience</div>
                    {res.experience.slice(0, 3).map((exp, i) => (
                        <div key={i} className="mr-item">
                            <div className="mr-item-left">
                                <div className="title">{exp.title}</div>
                                <div className="sub">{exp.company}</div>
                            </div>
                            <div className="mr-item-right">{exp.startDate} – {exp.current ? 'Now' : exp.endDate}</div>
                        </div>
                    ))}
                </div>
            )}

            {res.education.length > 0 && (
                <>
                    <div className="mr-divider" />
                    <div className="mr-section">
                        <div className="mr-label">Education</div>
                        {res.education.slice(0, 1).map((edu, i) => (
                            <div key={i} className="mr-item">
                                <div className="mr-item-left">
                                    <div className="title">{edu.degree}</div>
                                    <div className="sub">{edu.school}</div>
                                </div>
                                <div className="mr-item-right">{edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {res.skills.length > 0 && (
                <>
                    <div className="mr-divider" />
                    <div className="mr-section">
                        <div className="mr-label">Skills</div>
                        <div className="mr-skills">
                            {res.skills.slice(0, 5).map((skill, i) => (
                                <span key={i} className="mr-skill">{skill}</span>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export function SidebarPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="sidebar-resume">
            <div className="sb-left">
                <div className="sb-avatar">{res.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="sb-name">{res.name}</div>
                <div className="sb-role">{res.role}</div>
                <div className="sb-section-title">Contact</div>
                <div className="sb-contact-item">{res.email}</div>
                <div className="sb-contact-item">{res.location}</div>
                <div className="sb-divider" />

                {res.skills.length > 0 && (
                    <>
                        <div className="sb-section-title">Skills</div>
                        {res.skills.slice(0, 4).map((skill, i) => (
                            <div key={i} className="sb-skill-bar">
                                <div className="sb-skill-name">{skill}</div>
                                <div className="sb-bar-bg"><div className="sb-bar-fill" style={{ width: `${95 - (i * 10)}%` }} /></div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="sb-right">
                <div className="sb-r-name">{res.name}</div>
                {res.experience.length > 0 && (
                    <div className="sb-r-section">
                        <div className="sb-r-label">Experience</div>
                        {res.experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="sb-r-job">
                                <div className="sb-r-job-title">{exp.title}</div>
                                <div className="sb-r-job-meta">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                                {exp.description && <div className="sb-r-job-desc">{exp.description.slice(0, 100)}...</div>}
                            </div>
                        ))}
                    </div>
                )}
                {res.education.length > 0 && (
                    <div className="sb-r-section">
                        <div className="sb-r-label">Education</div>
                        {res.education.slice(0, 1).map((edu, i) => (
                            <div key={i} className="sb-r-job">
                                <div className="sb-r-job-title">{edu.degree}</div>
                                <div className="sb-r-job-meta">{edu.school} · {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export function CreativePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="creative-resume">
            <div className="cr2-top">
                <div className="cr2-name">{res.name}</div>
                <div className="cr2-role">{res.role}</div>
                <svg className="cr2-wave" viewBox="0 0 400 30" preserveAspectRatio="none" height="30"><path d="M0,20 Q100,0 200,15 T400,8 L400,30 L0,30Z" fill="#fff" /></svg>
            </div>
            <div className="cr2-body">
                <div className="cr2-contact">
                    <span className="cr2-contact-item">✉ {res.email}</span>
                    <span className="cr2-contact-item">{res.location}</span>
                </div>
                <div className="cr2-cols">
                    <div className="cr2-col">
                        <div className="cr2-section-title">Experience</div>
                        {res.experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="cr2-item">
                                <div className="cr2-item-title">{exp.title}</div>
                                <div className="cr2-item-sub">{exp.company} · {exp.startDate}–{exp.current ? 'Now' : exp.endDate}</div>
                                {exp.description && <div className="cr2-item-desc">{exp.description.slice(0, 60)}...</div>}
                            </div>
                        ))}
                    </div>
                    <div className="cr2-col">
                        {res.skills.length > 0 && (
                            <>
                                <div className="cr2-section-title">Skills</div>
                                <div className="cr2-tags">
                                    {res.skills.slice(0, 5).map((skill, i) => (
                                        <span key={i} className="cr2-tag">{skill}</span>
                                    ))}
                                </div>
                            </>
                        )}
                        {res.education.length > 0 && (
                            <>
                                <div className="cr2-section-title" style={{ marginTop: 14 }}>Education</div>
                                {res.education.slice(0, 1).map((edu, i) => (
                                    <div key={i} className="cr2-item">
                                        <div className="cr2-item-title">{edu.degree}</div>
                                        <div className="cr2-item-sub">{edu.school} · {edu.endDate}</div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function DarkPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="dark-resume">
            <div className="dr-accent-line" />
            <div className="dr-name">{res.name}</div>
            <div className="dr-role">{res.role}</div>
            <div className="dr-divider" />
            {res.experience.length > 0 && (
                <div className="dr-section">
                    <div className="dr-section-title">Professional Experience</div>
                    {res.experience.slice(0, 2).map((exp, i) => (
                        <div key={i} className="dr-job">
                            <div className="dr-job-title">{exp.title}</div>
                            <div className="dr-job-meta">{exp.company} · {exp.startDate}–{exp.current ? 'Present' : exp.endDate}</div>
                            {exp.description && <div className="dr-job-desc">{exp.description.slice(0, 100)}...</div>}
                        </div>
                    ))}
                </div>
            )}
            {res.skills.length > 0 && (
                <div className="dr-section">
                    <div className="dr-section-title">Core Expertise</div>
                    <div className="dr-skills">
                        {res.skills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="dr-skill">{skill}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export function EditorialPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="editorial-resume">
            <div className="er-header">
                <div className="er-issue">Portfolio · Issue No. 001</div>
                <div className="er-name">{res.name}</div>
                <div className="er-tagline">{res.role}</div>
            </div>
            <div className="er-body">
                <div className="er-col-main">
                    {res.experience.length > 0 && (
                        <div className="er-section">
                            <div className="er-section-label">Experience</div>
                            {res.experience.slice(0, 2).map((exp, i) => (
                                <div key={i} className="er-item">
                                    <div className="er-item-title">{exp.title}</div>
                                    <div className="er-item-sub">{exp.company} · {exp.startDate}–{exp.current ? 'Present' : exp.endDate}</div>
                                    {exp.description && <div className="er-item-desc">{exp.description.slice(0, 80)}...</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="er-col-side">
                    {res.education.length > 0 && (
                        <div className="er-section">
                            <div className="er-section-label">Education</div>
                            {res.education.slice(0, 1).map((edu, i) => (
                                <div key={i} className="er-item">
                                    <div className="er-item-title">{edu.degree}</div>
                                    <div className="er-item-sub">{edu.school} · {edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {res.skills.length > 0 && (
                        <div className="er-section">
                            <div className="er-section-label">Skills</div>
                            {res.skills.slice(0, 4).map((skill, i) => (
                                <span key={i} className="er-tag">{skill}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function BoldPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="bold-resume">
            <div className="ba-left">
                <div className="ba-top-block"><div className="ba-avatar">{res.name.split(' ').map(n => n[0]).join('')}</div></div>
                <div className="ba-left-body">
                    <div className="ba-section-head">Contact</div>
                    <div className="ba-contact-item">✉ {res.email}</div>
                    <div className="ba-contact-item">📍 {res.location}</div>

                    {res.education.length > 0 && (
                        <>
                            <div className="ba-section-head">Education</div>
                            {res.education.slice(0, 2).map((edu, i) => (
                                <div key={i} className="ba-edu-item">
                                    <div className="ba-edu-year">{edu.endDate}</div>
                                    <div className="ba-edu-deg">{edu.degree}</div>
                                    <div className="ba-edu-school">{edu.school}</div>
                                </div>
                            ))}
                        </>
                    )}

                    {res.skills.length > 0 && (
                        <>
                            <div className="ba-section-head">Skills</div>
                            {res.skills.slice(0, 4).map((skill, i) => (
                                <div key={i} className="ba-skill-item">
                                    <div className="ba-skill-name">{skill}</div>
                                    <div className="ba-skill-track"><div className="ba-skill-fill" style={{ width: `${90 - (i * 10)}%` }} /></div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="ba-right">
                <div className="ba-name">{res.name.toUpperCase()}</div>
                <div className="ba-title">{res.role.toUpperCase()}</div>
                {data?.summary && (
                    <>
                        <div className="ba-r-section-head">Professional Profile</div>
                        <div className="ba-exp-desc">{data.summary.slice(0, 200)}...</div>
                    </>
                )}
                {res.experience.length > 0 && (
                    <>
                        <div className="ba-r-section-head">Work Experience</div>
                        {res.experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="ba-exp-item">
                                <div className="ba-exp-meta"><span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span></div>
                                <div className="ba-exp-title">{exp.title}</div>
                                <div className="ba-exp-company">{exp.company}</div>
                                {exp.description && <div className="ba-exp-desc">{exp.description.slice(0, 100)}...</div>}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export function TealPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="teal-resume">
            <div className="tl-left">
                <div className="tl-photo"><div className="tl-photo-circle">{res.name.split(' ').map(n => n[0]).join('')}</div></div>
                <div className="tl-body">
                    <div className="tl-section-head">Contacts</div>
                    <div className="tl-contact-item"><div className="tl-dot" />{res.phone}</div>
                    <div className="tl-contact-item"><div className="tl-dot" />{res.email}</div>
                    <div className="tl-contact-item"><div className="tl-dot" />{res.location}</div>
                    {res.education.length > 0 && (
                        <>
                            <div className="tl-section-head">Education</div>
                            {res.education.slice(0, 1).map((edu, i) => (
                                <div key={i} style={{ fontSize: 8, color: 'rgba(224,224,240,0.7)', marginBottom: 4 }}>
                                    From {edu.endDate}<br /><strong style={{ color: '#e0e0f0', fontSize: 9 }}>{edu.degree.toUpperCase()}</strong><br /><span style={{ opacity: 0.6 }}>{edu.school}</span>
                                </div>
                            ))}
                        </>
                    )}
                    {res.skills.length > 0 && (
                        <>
                            <div className="tl-section-head">Tools Skill</div>
                            {res.skills.slice(0, 4).map((skill, i) => (
                                <div key={i} className="tl-skill-item">
                                    <div className="tl-skill-name">{skill}</div>
                                    <div className="tl-dots-row">
                                        {[...Array(7)].map((_, idx) => (
                                            <div key={idx} className={idx < 5 - i ? "tl-dot-filled" : "tl-dot-empty"} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="tl-right">
                <div className="tl-cv-label">CV</div>
                <div className="tl-name">{res.name.toUpperCase()}</div>
                <div className="tl-job">{res.role}</div>
                {data?.summary && (
                    <>
                        <div className="tl-r-section-head">Profile Summary</div>
                        <div style={{ fontSize: '8.5px', color: '#555', lineHeight: 1.5, marginBottom: 10 }}>{data.summary.slice(0, 150)}...</div>
                    </>
                )}
                {res.experience.length > 0 && (
                    <>
                        <div className="tl-r-section-head">Work Experience</div>
                        {res.experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="tl-exp-item">
                                <div className="tl-exp-date">{exp.startDate} – {exp.current ? 'Current' : exp.endDate}</div>
                                <div className="tl-exp-title">{exp.title}</div>
                                <div className="tl-exp-company">{exp.company}</div>
                                {exp.description && <div className="tl-exp-desc">{exp.description.slice(0, 80)}...</div>}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export function TimelinePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="timeline-resume">
            <div className="tl2-header">
                <div className="tl2-name">{res.name.toUpperCase()}</div>
                <div className="tl2-role">{res.role}</div>
            </div>
            <div className="tl2-body">
                <div className="tl2-col">
                    {data?.summary && (
                        <>
                            <div className="tl2-section-label"><span className="tl2-label-box">PROFILE</span></div>
                            <div style={{ fontSize: 8, color: '#555', lineHeight: 1.6, marginBottom: 12 }}>{data.summary.slice(0, 150)}...</div>
                        </>
                    )}
                    {res.experience.length > 0 && (
                        <>
                            <div className="tl2-section-label"><span className="tl2-label-box">WORK EXP.</span></div>
                            {res.experience.slice(0, 2).map((exp, i) => (
                                <div key={i} className="tl2-item">
                                    <div className="tl2-item-sub">{exp.startDate} – {exp.current ? 'Present' : exp.endDate} · {exp.company}</div>
                                    <div className="tl2-item-title">{exp.title}</div>
                                    {exp.description && <div className="tl2-item-desc">{exp.description.slice(0, 60)}...</div>}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="tl2-center">
                    <div className="tl2-center-dot" /><div className="tl2-center-line" /><div className="tl2-center-dot" /><div className="tl2-center-line" /><div className="tl2-center-dot" /><div className="tl2-center-line" />
                </div>
                <div className="tl2-col">
                    <div className="tl2-section-label"><span className="tl2-label-box">CONTACT</span></div>
                    <div style={{ fontSize: 8, color: '#555', lineHeight: 1.8, marginBottom: 10 }}>☎ {res.phone}<br />✉ {res.email}<br />📍 {res.location}</div>
                    {res.education.length > 0 && (
                        <>
                            <div className="tl2-section-label"><span className="tl2-label-box">EDUCATION</span></div>
                            {res.education.slice(0, 1).map((edu, i) => (
                                <div key={i} className="tl2-item">
                                    <div className="tl2-item-sub">{edu.endDate}</div>
                                    <div className="tl2-item-title">{edu.degree}</div>
                                    <div className="tl2-item-desc">{edu.school}</div>
                                </div>
                            ))}
                        </>
                    )}
                    {res.skills.length > 0 && (
                        <>
                            <div className="tl2-section-label"><span className="tl2-label-box">SKILLS</span></div>
                            {res.skills.slice(0, 4).map((skill, i) => (
                                <div key={i} className="tl2-skill-item">
                                    <div className="tl2-skill-name">{skill}</div>
                                    <div className="tl2-skill-bar"><div className="tl2-skill-fill" style={{ width: `${90 - (i * 10)}%` }} /></div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export function GrandePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="grande-resume">
            <div className="gr-header">
                <div className="gr-name">{res.name.toUpperCase()}</div>
                <div className="gr-role">{res.role}</div>
                <div className="gr-divider-line" />
            </div>
            <div className="gr-body">
                <div className="gr-left">
                    <div className="gr-section">
                        <div className="gr-section-title">Contact</div>
                        <div className="gr-contact-item">{res.phone}</div>
                        <div className="gr-contact-item">{res.email}</div>
                        <div className="gr-contact-item">{res.location}</div>
                    </div>
                    {res.education.length > 0 && (
                        <div className="gr-section">
                            <div className="gr-section-title">Education</div>
                            {res.education.slice(0, 2).map((edu, i) => (
                                <div key={i} className="gr-edu-item">
                                    <div className="gr-edu-school">{edu.school.toUpperCase()}</div>
                                    <div className="gr-edu-degree">{edu.degree}</div>
                                    <div className="gr-edu-year">{edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="gr-right">
                    {data?.summary && (
                        <div className="gr-section">
                            <div className="gr-section-title">About Me</div>
                            <div style={{ fontSize: '8.5px', color: '#555', lineHeight: 1.6, marginBottom: 2 }}>{data.summary.slice(0, 180)}...</div>
                        </div>
                    )}
                    {res.experience.length > 0 && (
                        <div className="gr-section">
                            <div className="gr-section-title">Experience</div>
                            {res.experience.slice(0, 2).map((exp, i) => (
                                <div key={i} className="gr-exp-item">
                                    <div className="gr-exp-company">{exp.company}, {exp.startDate} – {exp.current ? 'PRES' : exp.endDate}</div>
                                    <div className="gr-exp-title">{exp.title}</div>
                                    {exp.description && <div className="gr-exp-desc">{exp.description.slice(0, 100)}...</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function BlobPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="blob-resume">
            <div className="bl-blob1" /><div className="bl-blob2" />
            <div className="bl-header">
                <div className="bl-avatar">{res.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="bl-name-block">
                    <div className="bl-name">{res.name}</div>
                    <div className="bl-contact">📍 {res.location}<br />☎ {res.phone}<br />✉ {res.email}</div>
                </div>
            </div>
            <div className="bl-body">
                <div className="bl-col">
                    {data?.summary && (
                        <div className="bl-section">
                            <div className="bl-section-title"><span>Objective</span><div className="bl-section-pill" /></div>
                            <div style={{ fontSize: '8.5px', color: '#555', lineHeight: 1.5 }}>{data.summary.slice(0, 150)}...</div>
                        </div>
                    )}
                    {res.skills.length > 0 && (
                        <div className="bl-section">
                            <div className="bl-section-title"><span>Skills</span><div className="bl-section-pill" /></div>
                            <div style={{ fontSize: 8, color: '#555', lineHeight: 1.9 }}>
                                {res.skills.slice(0, 5).map((skill, i) => (
                                    <div key={i}>• {skill}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="bl-divider-v" />
                <div className="bl-col">
                    {res.education.length > 0 && (
                        <div className="bl-section">
                            <div className="bl-section-title"><span>Education</span><div className="bl-section-pill" /></div>
                            {res.education.slice(0, 1).map((edu, i) => (
                                <div key={i} className="bl-item">
                                    <div className="bl-item-title">{edu.degree}</div>
                                    <div className="bl-item-sub">{edu.school}</div>
                                    <div style={{ fontSize: 8, color: '#aaa' }}>{edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {res.experience.length > 0 && (
                        <div className="bl-section">
                            <div className="bl-section-title"><span>Work Experience</span><div className="bl-section-pill" /></div>
                            {res.experience.slice(0, 1).map((exp, i) => (
                                <div key={i} className="bl-item">
                                    <div className="bl-item-title">{exp.title}</div>
                                    <div className="bl-item-sub">{exp.company}</div>
                                    <div style={{ fontSize: 8, color: '#aaa' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function SplitPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="split-resume">
            <div className="sp-left">
                <div className="sp-name">{res.name.toUpperCase()}</div>
                <div className="sp-role">{res.role}</div>
                <div className="sp-divider" />
                {data?.summary && (
                    <>
                        <div className="sp-section-title">Profile</div>
                        <div style={{ fontSize: '8.5px', color: '#666', lineHeight: 1.55, fontStyle: 'italic', marginBottom: 12 }}>{data.summary.slice(0, 120)}...</div>
                    </>
                )}
                <div className="sp-section-title">Contact</div>
                <div className="sp-contact-item"><span className="sp-contact-icon">🏠</span>{res.location}</div>
                <div className="sp-contact-item"><span className="sp-contact-icon">✉</span>{res.email}</div>
                <div className="sp-contact-item"><span className="sp-contact-icon">☎</span>{res.phone}</div>
                <div className="sp-divider" />
                {res.education.length > 0 && (
                    <>
                        <div className="sp-section-title">Education</div>
                        {res.education.slice(0, 2).map((edu, i) => (
                            <div key={i} className="sp-edu-item">
                                <div className="sp-edu-degree">{edu.degree.toUpperCase()}</div>
                                <div className="sp-edu-school">{edu.school}</div>
                                <div className="sp-edu-year">{edu.endDate}</div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="sp-right">
                {res.experience.length > 0 && (
                    <div className="sp-exp-section">
                        <div className="sp-r-section-title">Experience</div>
                        {res.experience.slice(0, 3).map((exp, i) => (
                            <div key={i} className="sp-exp-item">
                                <div className="sp-exp-company">{exp.company} | {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                                <div className="sp-exp-title">{exp.title}</div>
                                {exp.description && <div className="sp-exp-desc">{exp.description.slice(0, 120)}...</div>}
                            </div>
                        ))}
                    </div>
                )}
                {res.skills.length > 0 && (
                    <>
                        <div className="sp-r-section-title" style={{ marginTop: 10 }}>Skills</div>
                        <div className="sp-skills-grid">
                            {res.skills.slice(0, 4).map((skill, i) => (
                                <div key={i} className="sp-skill-item">
                                    <div className="sp-skill-name">{skill}</div>
                                    <div className="sp-skill-bar"><div className="sp-skill-fill" style={{ width: `${90 - (i * 10)}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export function ObsidianPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="obsidian-resume">
            <div className="ob-border-frame" />
            <div className="ob-corner tl" /><div className="ob-corner tr" /><div className="ob-corner bl" /><div className="ob-corner br" />
            <div className="ob-inner">
                <div className="ob-monogram">{res.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="ob-name">{res.name}</div>
                <div className="ob-title">{res.role}</div>
                <div className="ob-divider"><div className="ob-divider-line" /><div className="ob-divider-gem" /><div className="ob-divider-line" /></div>
                {res.experience.length > 0 && (
                    <div className="ob-section">
                        <div className="ob-section-head">Professional Experience</div>
                        {res.experience.slice(0, 3).map((exp, i) => (
                            <div key={i} className="ob-exp">
                                <div className="ob-exp-title">{exp.title}</div>
                                <div className="ob-exp-meta">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                                {exp.description && <div className="ob-exp-desc">{exp.description.slice(0, 100)}...</div>}
                            </div>
                        ))}
                    </div>
                )}
                {res.skills.length > 0 && (
                    <div className="ob-section">
                        <div className="ob-section-head">Core Expertise</div>
                        <div className="ob-skills">
                            {res.skills.slice(0, 6).map((skill, i) => (
                                <span key={i} className="ob-skill">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="ob-divider" style={{ marginTop: 16 }}><div className="ob-divider-line" /><div className="ob-divider-gem" /><div className="ob-divider-line" /></div>
                <div className="ob-contact">
                    <div className="ob-contact-item"><div className="ob-contact-dot" />{res.email}</div>
                    <div className="ob-contact-item"><div className="ob-contact-dot" />{res.phone}</div>
                    <div className="ob-contact-item"><div className="ob-contact-dot" />{res.location}</div>
                </div>
            </div>
        </div>
    )
}

export function IvoryPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="ivory-resume">
            <div className="iv-top-stripe" />
            <div className="iv-header">
                <div className="iv-header-text">
                    <div className="iv-name">{res.name}</div>
                    <div className="iv-title-bar"><div className="iv-title-dash" /><div className="iv-title">{res.role}</div></div>
                </div>
                <div className="iv-header-contact">
                    <div className="iv-contact-item">{res.email}</div>
                    <div className="iv-contact-item">{res.phone}</div>
                    <div className="iv-contact-item">{res.location}</div>
                </div>
            </div>
            <div className="iv-body">
                <div className="iv-main">
                    {res.experience.length > 0 && (
                        <div className="iv-section">
                            <div className="iv-section-label">Experience</div><div className="iv-section-rule" />
                            {res.experience.slice(0, 3).map((exp, i) => (
                                <div key={i} className="iv-exp-item">
                                    <div className="iv-exp-role">{exp.title}</div>
                                    <div className="iv-exp-where">
                                        <div className="iv-exp-co">{exp.company}</div>
                                        <div className="iv-exp-dot" />
                                        <div className="iv-exp-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                                    </div>
                                    {exp.description && <div className="iv-exp-desc">{exp.description.slice(0, 80)}...</div>}
                                </div>
                            ))}
                        </div>
                    )}
                    {data?.summary && (
                        <div className="iv-section">
                            <div className="iv-section-label">Profile</div><div className="iv-section-rule" />
                            <div className="iv-quote"><p>{data.summary.slice(0, 150)}...</p></div>
                        </div>
                    )}
                </div>
                <div className="iv-aside">
                    {res.education.length > 0 && (
                        <div className="iv-aside-section">
                            <div className="iv-aside-label">Education</div>
                            {res.education.slice(0, 2).map((edu, i) => (
                                <div key={i} className="iv-edu-item">
                                    <div className="iv-edu-degree">{edu.degree}</div>
                                    <div className="iv-edu-school">{edu.school}</div>
                                    <div className="iv-edu-year">{edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {res.skills.length > 0 && (
                        <div className="iv-aside-section">
                            <div className="iv-aside-label">Core Skills</div>
                            {res.skills.slice(0, 4).map((skill, i) => (
                                <div key={i} className="iv-skill-row">
                                    <div className="iv-skill-name">{skill}</div>
                                    <div className="iv-skill-dots">
                                        {[...Array(5)].map((_, idx) => (
                                            <div key={idx} className={idx < 5 - i ? "iv-dot-on" : "iv-dot-off"} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function NoirPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="noir-resume">
            <div className="na-header">
                <div className="na-index">Portfolio — 2026 · Resume</div>
                <div className="na-name">{res.name.split(' ')[0]} <em>{res.name.split(' ').slice(1).join(' ')}</em></div>
                <div className="na-role">{res.role}</div>
                <div className="na-divider"><div className="na-divider-seg" /><div className="na-divider-seg" /><div className="na-divider-seg" /></div>
            </div>
            <div className="na-body">
                <div className="na-left">
                    <div>
                        <div className="na-section-label">Contact</div>
                        <div className="na-contact-item"><span className="na-contact-slash">/</span>{res.email}</div>
                        <div className="na-contact-item"><span className="na-contact-slash">/</span>{res.location}</div>
                        <div className="na-contact-item"><span className="na-contact-slash">/</span>{res.phone}</div>
                    </div>
                    {res.skills.length > 0 && (
                        <div>
                            <div className="na-section-label">Skills</div>
                            {res.skills.slice(0, 5).map((skill, i) => (
                                <div key={i} className="na-skill-item">
                                    <div className="na-skill-name">{skill} <span>{98 - (i * 5)}%</span></div>
                                    <div className="na-skill-bar-bg"><div className="na-skill-bar-fill" style={{ width: `${98 - (i * 5)}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    )}
                    {res.education.length > 0 && (
                        <div>
                            <div className="na-section-label">Education</div>
                            {res.education.slice(0, 1).map((edu, i) => (
                                <div key={i} className="na-exp-item" style={{ marginBottom: 0 }}>
                                    <div className="na-exp-role" style={{ fontSize: 9 }}>{edu.degree}</div>
                                    <div className="na-exp-meta">{edu.school} · {edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="na-right">
                    {res.experience.length > 0 && (
                        <div>
                            <div className="na-section-label">Experience</div>
                            {res.experience.slice(0, 3).map((exp, i) => (
                                <div key={i} className="na-exp-item">
                                    <div className="na-exp-role">{exp.title}</div>
                                    <div className="na-exp-meta">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                                    {exp.description && <div className="na-exp-desc">{exp.description.slice(0, 120)}...</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function RosePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="rose-resume">
            <div className="ra-accent-col" />
            <div className="ra-main">
                <div className="ra-header">
                    <div className="ra-eyebrow">Creative Portfolio · Resume</div>
                    <div className="ra-name">{res.name}</div>
                    <div className="ra-title">{res.role}</div>
                </div>
                <div className="ra-body">
                    <div className="ra-left">
                        <div>
                            <div className="ra-section-head">Contact</div>
                            <div className="ra-contact-item"><div className="ra-contact-pip" />{res.email}</div>
                            <div className="ra-contact-item"><div className="ra-contact-pip" />{res.phone}</div>
                            <div className="ra-contact-item"><div className="ra-contact-pip" />{res.location}</div>
                        </div>
                        {res.skills.length > 0 && (
                            <div>
                                <div className="ra-section-head">Expertise</div>
                                {res.skills.slice(0, 4).map((skill, i) => (
                                    <div key={i} className="ra-skill-item">
                                        <span className="ra-skill-name">{skill}</span>
                                        <div className="ra-skill-pips">
                                            {[...Array(5)].map((_, idx) => (
                                                <div key={idx} className={idx < 5 - i ? "ra-pip-on" : "ra-pip-off"} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="ra-right">
                        {res.experience.length > 0 && (
                            <div>
                                <div className="ra-section-head">Experience</div>
                                {res.experience.slice(0, 3).map((exp, i) => (
                                    <div key={i} className="ra-exp-item">
                                        <div className="ra-exp-title">{exp.title}</div>
                                        <div className="ra-exp-co">{exp.company}</div>
                                        <div className="ra-exp-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                                        {exp.description && <div className="ra-exp-desc">{exp.description.slice(0, 80)}...</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── 17. EXECUTIVE ─────────────────────────────────── */
export function ExecutivePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="executive-resume">
            <div className="ex-name">{res.name}</div>
            <div className="ex-role">{res.role}</div>
            <div className="ex-contact">{res.phone} | {res.email} | {res.location}</div>
            <div className="ex-divider" />
            {data?.summary && (
                <div className="ex-section">
                    <div className="ex-section-title">Profile</div>
                    <div className="ex-profile">{data.summary.slice(0, 250)}...</div>
                </div>
            )}
            <div className="ex-divider" />
            {res.experience.length > 0 && (
                <div className="ex-section">
                    <div className="ex-section-title">Experience</div>
                    {res.experience.slice(0, 2).map((exp, i) => (
                        <div key={i} className="ex-exp-item">
                            <div className="ex-exp-title">{exp.title}</div>
                            <div className="ex-exp-meta">{exp.company} | {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                            {exp.description && <div className="ex-exp-desc">{exp.description.slice(0, 150)}...</div>}
                        </div>
                    ))}
                </div>
            )}
            <div className="ex-footer">
                {res.education.length > 0 && (
                    <div className="ex-footer-col">
                        <div className="ex-footer-title">Education</div>
                        {res.education.slice(0, 2).map((edu, i) => (
                            <div key={i} className="ex-edu-item">
                                <div className="ex-edu-degree">{edu.degree}</div>
                                <div className="ex-edu-school">{edu.school} | {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                )}
                {res.skills.length > 0 && (
                    <div className="ex-footer-col">
                        <div className="ex-footer-title">Skills</div>
                        <div className="ex-skill-list">
                            {res.skills.slice(0, 6).map((skill, i) => (
                                <span key={i} className="ex-skill-item">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ── 18. TERMINAL ──────────────────────────────────── */
export function TerminalPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="terminal-theme-wrapper">
            <div className="terminal-container">
                <div className="terminal-window">
                    <div className="terminal-titlebar">
                        <div className="terminal-titlebar-btn close"></div>
                        <div className="terminal-titlebar-btn min"></div>
                        <div className="terminal-titlebar-btn max"></div>
                        <span className="terminal-titlebar-text">zsh — {res.name.toLowerCase().replace(' ', '_')} — 80×24</span>
                    </div>
                    <div className="terminal-body">
                        <div className="terminal-line" style={{ marginBottom: 2 }}>
                            <span className="terminal-prompt-prefix">user</span><span className="terminal-prompt-dir">@portfolio</span><span className="terminal-prompt-symbol"> $ </span>
                            <span className="terminal-command">cat</span> <span className="terminal-flag">--pretty</span> <span className="terminal-string">~/resume.json</span>
                        </div>
                        <div className="terminal-ascii-box">
                            <div className="terminal-name">{res.name.toUpperCase()}</div>
                            <div className="terminal-title">{res.role}</div>
                        </div>
                        <div className="terminal-section">
                            <div className="terminal-section-cmd">$ grep <span className="terminal-flag">-i</span> "contact" <span className="terminal-string">info.cfg</span></div>
                            <div className="terminal-table-row">
                                <span className="terminal-table-key">  email:</span>
                                <span className="terminal-table-val">{res.email}</span>
                            </div>
                            <div className="terminal-table-row">
                                <span className="terminal-table-key">  phone:</span>
                                <span className="terminal-table-val">{res.phone}</span>
                            </div>
                            <div className="terminal-table-row">
                                <span className="terminal-table-key">  location:</span>
                                <span className="terminal-table-val">{res.location}</span>
                            </div>
                        </div>
                        {data?.summary && (
                            <div className="terminal-section">
                                <div className="terminal-section-cmd">$ echo <span className="terminal-string">$ABOUT_ME</span></div>
                                <div style={{ color: '#c9d1d9', paddingLeft: 4, fontSize: 10, lineHeight: 1.5 }}>
                                    {data.summary.slice(0, 150)}...
                                </div>
                            </div>
                        )}
                        {res.skills.length > 0 && (
                            <div className="terminal-section">
                                <div className="terminal-section-cmd">$ skills <span className="terminal-flag">--list</span> <span className="terminal-flag">--verbose</span></div>
                                {res.skills.slice(0, 3).map((skill, i) => (
                                    <div key={i} className="terminal-skill-bar">
                                        <span className="terminal-skill-label">  {skill}</span>
                                        <div className="terminal-skill-track"><div className="terminal-skill-fill" style={{ width: `${95 - (i * 5)}%`, background: i % 2 === 0 ? 'linear-gradient(90deg, #7ee787, #56d364)' : 'linear-gradient(90deg, #79c0ff, #58a6ff)' }}></div></div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {res.experience.length > 0 && (
                            <div className="terminal-section">
                                <div className="terminal-section-cmd">$ history <span className="terminal-flag">--career</span></div>
                                {res.experience.slice(0, 1).map((exp, i) => (
                                    <div key={i} className="terminal-exp-entry">
                                        <div className="terminal-exp-role">{exp.title}</div>
                                        <div className="terminal-exp-co">{exp.company}</div>
                                        <div className="terminal-exp-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                                        {exp.description && <div className="terminal-exp-desc"><span>{exp.description.slice(0, 70)}...</span></div>}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="terminal-footer-line">
                            <span>
                                <span className="terminal-prompt-prefix">user</span><span className="terminal-prompt-dir">@portfolio</span><span className="terminal-prompt-symbol"> $ </span>
                                <span className="terminal-cursor-blink"></span>
                            </span>
                            <span style={{ color: '#7ee787' }}>uptime: active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function HealthcarePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="health-theme-wrapper">
            <div className="health-hero">
                <div className="health-ekg">
                    <svg viewBox="0 0 1200 60" preserveAspectRatio="none"><polyline fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" points="0,30 50,30 70,30 80,10 90,50 100,20 110,40 120,30 170,30 220,30 240,30 250,10 260,50 270,20 280,40 290,30 340,30" /></svg>
                </div>
                <div className="health-name">{res.name}</div>
                <div className="health-title">{res.role}</div>
                <div className="health-badges">
                    <span className="health-badge health-badge-teal">Specialist</span>
                    <span className="health-badge health-badge-coral">Certified</span>
                </div>
                <div className="health-contact">
                    <span>✉ {res.email}</span>
                    <span>☎ {res.phone}</span>
                    <span>📍 {res.location}</span>
                </div>
            </div>
            <div className="health-vitals">
                <div className="health-vital-card health-vital-1"><div className="health-vital-num">10+</div><div className="health-vital-label">Years Exp</div></div>
                <div className="health-vital-card health-vital-2"><div className="health-vital-num">1k+</div><div className="health-vital-label">Cases</div></div>
                <div className="health-vital-card health-vital-3"><div className="health-vital-num">15</div><div className="health-vital-label">Awards</div></div>
                <div className="health-vital-card health-vital-4"><div className="health-vital-num">99%</div><div className="health-vital-label">Care</div></div>
            </div>
            <div className="health-section">
                {res.experience.length > 0 && (
                    <>
                        <div className="health-section-head">
                            <div className="health-section-label">Experience</div>
                            <div className="health-section-line"></div>
                        </div>
                        {res.experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="health-exp-card">
                                <div className="health-exp-role">{exp.title}</div>
                                <div className="health-exp-co">{exp.company}</div>
                                <div className="health-exp-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                            </div>
                        ))}
                    </>
                )}
                {res.education.length > 0 && (
                    <>
                        <div className="health-section-head" style={{ marginTop: '20px' }}>
                            <div className="health-section-label">Education</div>
                            <div className="health-section-line"></div>
                        </div>
                        {res.education.slice(0, 1).map((edu, i) => (
                            <div key={i} className="health-exp-card">
                                <div className="health-exp-role">{edu.degree}</div>
                                <div className="health-exp-co">{edu.school}</div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export function NaturePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="nature-theme-wrapper">
            <div className="nature-header">
                <h1 className="nature-name">{res.name}</h1>
                <p className="nature-role">{res.role}</p>
                <div className="nature-divider"><div className="nature-divider-line"></div>🌿<div className="nature-divider-line"></div></div>
                <div className="nature-contact">
                    <span>{res.email}</span>
                    <span>{res.phone}</span>
                    <span>{res.location}</span>
                </div>
            </div>
            {res.experience.length > 0 && (
                <div className="nature-section">
                    <h2 className="nature-section-title">Experience</h2>
                    <div className="nature-timeline">
                        {res.experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="nature-exp-item">
                                <div className="nature-exp-role">{exp.title}</div>
                                <div className="nature-exp-co">{exp.company}</div>
                                <div className="nature-exp-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {res.skills.length > 0 && (
                <div className="nature-section">
                    <h2 className="nature-section-title">Specializations</h2>
                    <div className="nature-skill-grid">
                        <div className="nature-skill-plot">
                            <div className="nature-skill-cat">Core Skills</div>
                            <div className="nature-skill-tags">
                                {res.skills.slice(0, 4).map((skill, i) => (
                                    <span key={i} className="nature-skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function SciFiPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="scifi-theme-wrapper">
            <div className="scifi-sys-bar">
                <span>SYSTEM://DOSSIER_ACCESS</span>
                <span>STATUS: ACTIVE</span>
            </div>
            <div className="scifi-header" style={{ padding: '40px 36px 32px' }}>
                <h1 className="scifi-name" data-name={res.name.toUpperCase()}>{res.name.toUpperCase()}</h1>
                <div className="scifi-designation">{res.role.toUpperCase()}</div>
                <div className="scifi-contact">
                    <span>[E] {res.email.toUpperCase()}</span>
                    <span>[P] {res.phone.toUpperCase()}</span>
                    <span>[L] {res.location.toUpperCase()}</span>
                </div>
            </div>
            <div className="scifi-section">
                {(data?.summary || res.experience.length > 0) && (
                    <>
                        <div className="scifi-section-head">
                            <span className="scifi-section-title">MISSION BRIEF</span>
                            <div className="scifi-section-line"></div>
                        </div>
                        <div className="scifi-brief">
                            {data?.summary || "ORCHESTRATING HIGH-LEVEL STRATEGIES AND SCALABLE INFRASTRUCTURE FOR COMPLEX SYSTEMS."}
                        </div>
                    </>
                )}

                {res.experience.length > 0 && (
                    <>
                        <div className="scifi-section-head" style={{ marginTop: '20px' }}>
                            <span className="scifi-section-title">CHRONOLOGY</span>
                            <div className="scifi-section-line"></div>
                        </div>
                        {res.experience.map((exp, i) => (
                            <div key={i} className="scifi-exp-card">
                                <div className="scifi-exp-role">{exp.title.toUpperCase()}</div>
                                <div className="scifi-exp-co">{exp.company.toUpperCase()}</div>
                                <span className="scifi-exp-date">
                                    {exp.startDate.toUpperCase()} - {exp.current ? 'PRES' : (exp.endDate || 'N/A').toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </>
                )}

                {res.skills.length > 0 && (
                    <>
                        <div className="scifi-section-head" style={{ marginTop: '20px' }}>
                            <span className="scifi-section-title">ARRAY_LOAD</span>
                            <div className="scifi-section-line"></div>
                        </div>
                        <div className="scifi-skill-module">
                            <div className="scifi-skill-cat">CORE_LOGIC</div>
                            {res.skills.slice(0, 4).map((skill, i) => (
                                <div key={i} className="scifi-skill-bar" style={{ marginBottom: i < 3 ? '10px' : 0 }}>
                                    <span className="scifi-skill-name">{skill.toUpperCase()}</span>
                                    <div className="scifi-skill-track"><div className="scifi-skill-fill" style={{ width: `${95 - (i * 8)}%` }}></div></div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export function SophisticatedPreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="sophisticated-theme-wrapper">
            <header className="sophisticated-hero">
                <div className="sophisticated-hero-content">
                    <div className="sophisticated-hero-left">
                        <h1 className="sophisticated-name">{res.name.split(' ')[0]} <strong>{res.name.split(' ').slice(1).join(' ')}</strong></h1>
                        <p className="sophisticated-title">{res.role}</p>
                    </div>
                    <div className="sophisticated-contact-box">
                        <div className="sophisticated-contact-label">Contact</div>
                        <div>{res.email}</div>
                        <div>{res.phone}</div>
                        <div>{res.location}</div>
                    </div>
                </div>
            </header>
            <div className="sophisticated-body">
                <div className="sophisticated-main">
                    {data?.summary && (
                        <>
                            <div className="sophisticated-section-label">Executive Summary</div>
                            <div className="sophisticated-summary">{data.summary.slice(0, 180)}...</div>
                        </>
                    )}
                    {res.experience.length > 0 && (
                        <>
                            <div className="sophisticated-section-label">Experience</div>
                            {res.experience.slice(0, 3).map((exp, i) => (
                                <div key={i} className="sophisticated-exp-item">
                                    <div className="sophisticated-exp-header">
                                        <span>{exp.title}</span>
                                        <span>{exp.startDate} – {exp.current ? 'Pres' : exp.endDate}</span>
                                    </div>
                                    <div className="sophisticated-exp-org">{exp.company}</div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="sophisticated-side">
                    {res.skills.length > 0 && (
                        <>
                            <div className="sophisticated-section-label">Competencies</div>
                            {res.skills.slice(0, 4).map((skill, i) => (
                                <div key={i} className="sophisticated-skill-row">
                                    <div className="sophisticated-skill-name">{skill}</div>
                                    <div className="sophisticated-skill-bar"><div className="sophisticated-skill-fill" style={{ width: `${95 - (i * 5)}%` }}></div></div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ── 23. VINTAGE ───────────────────────────────────── */
export function VintagePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="vintage-theme-wrapper">
            <div className="vintage-document">
                <div className="vintage-ornament">
                    <div className="vintage-cv-label">Curriculum Vitæ</div>
                    <h1 className="vintage-name">{res.name}</h1>
                    <div className="vintage-title">{res.role}</div>
                    <div className="vintage-contact">{res.email} · {res.phone} · {res.location}</div>
                </div>
                {data?.summary && (
                    <>
                        <div className="vintage-section-head">
                            <span className="vintage-section-title">Statement</span>
                            <div className="vintage-section-rule"></div>
                        </div>
                        <div className="vintage-summary">
                            {data.summary.slice(0, 150)}...
                        </div>
                    </>
                )}
                {res.experience.length > 0 && (
                    <>
                        <div className="vintage-section-head">
                            <span className="vintage-section-title">Experience</span>
                            <div className="vintage-section-rule"></div>
                        </div>
                        {res.experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="vintage-exp-item">
                                <div className="vintage-role-row">
                                    <span>{exp.title}</span>
                                    <span className="vintage-date">{exp.startDate}</span>
                                </div>
                                <div className="vintage-org">{exp.company}</div>
                            </div>
                        ))}
                    </>
                )}
                {res.education.length > 0 && (
                    <>
                        <div className="vintage-section-head">
                            <span className="vintage-section-title">Education</span>
                            <div className="vintage-section-rule"></div>
                        </div>
                        {res.education.slice(0, 1).map((edu, i) => (
                            <div key={i}>
                                <div style={{ fontStyle: 'italic', fontSize: '14px' }}>{edu.degree}</div>
                                <div style={{ color: '#5c4a32', fontSize: '12px' }}>{edu.school}</div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

/* ── 24. GRADUATE ──────────────────────────────────── */
export function GraduatePreview({ data }) {
    const res = useDynamicData(data);
    return (
        <div className="graduate-theme-wrapper">
            <header className="graduate-header">
                <div className="graduate-greeting">Hello, I'm</div>
                <h1 className="graduate-name">{res.name}</h1>
                <p className="graduate-tagline">{res.role}</p>
                <div className="graduate-contact">
                    <span>✉ {res.email}</span>
                    <span>☎ {res.phone}</span>
                    <span>📍 {res.location}</span>
                </div>
            </header>
            <div className="graduate-section">
                {res.education.length > 0 && (
                    <>
                        <div className="graduate-section-head">
                            <div className="graduate-dot" style={{ backgroundColor: '#8b5cf6' }}></div>
                            <h2 className="graduate-section-title">Education</h2>
                            <div className="graduate-section-line"></div>
                        </div>
                        {res.education.slice(0, 1).map((edu, i) => (
                            <div key={i} className="graduate-card">
                                <div className="graduate-edu-item">
                                    <div className="graduate-edu-badge">🎓</div>
                                    <div>
                                        <div className="graduate-edu-degree">{edu.degree}</div>
                                        <div className="graduate-edu-school">{edu.school}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {res.experience.length > 0 && (
                    <>
                        <div className="graduate-section-head" style={{ marginTop: '20px' }}>
                            <div className="graduate-dot" style={{ backgroundColor: '#0ea5e9' }}></div>
                            <h2 className="graduate-section-title">Experience</h2>
                            <div className="graduate-section-line"></div>
                        </div>
                        {res.experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="graduate-card" style={{ marginBottom: i === 0 ? '8px' : 0 }}>
                                <div className="graduate-exp-row">
                                    <span>{exp.title}</span>
                                    <span className="graduate-exp-date">{exp.startDate}</span>
                                </div>
                                <div className="graduate-exp-co" style={{ fontSize: '12px', marginTop: '4px' }}>{exp.company}</div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}


/** Map of theme IDs to preview components */
export const PREVIEW_MAP = {
    classic: ClassicPreview,
    minimalist: MinimalistPreview,
    sidebar: SidebarPreview,
    creative: CreativePreview,
    dark: DarkPreview,
    editorial: EditorialPreview,
    bold: BoldPreview,
    teal: TealPreview,
    timeline: TimelinePreview,
    grande: GrandePreview,
    blob: BlobPreview,
    split: SplitPreview,
    obsidian: ObsidianPreview,
    ivory: IvoryPreview,
    noir: NoirPreview,
    rose: RosePreview,
    executive: ExecutivePreview,
    terminal: TerminalPreview,
    healthcare: HealthcarePreview,
    nature: NaturePreview,
    scifi: SciFiPreview,
    sophisticated: SophisticatedPreview,
    vintage: VintagePreview,
    graduate: GraduatePreview,
}
