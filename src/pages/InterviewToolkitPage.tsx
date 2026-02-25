import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { verifySubscription } from '../lib/stripe'
import styles from './InterviewToolkitPage.module.css'

// ── Role-specific interview questions database ──────
const ROLE_QUESTIONS: Record<string, { category: string; questions: string[] }[]> = {
    'Software Engineer': [
        {
            category: 'Technical', questions: [
                'Walk me through your approach to system design.',
                'How do you handle technical debt in a fast-moving codebase?',
                'Describe a time you optimized a critical performance bottleneck.',
                'How do you decide between building vs. buying a solution?',
                'Tell me about a production incident you resolved.',
            ]
        },
        {
            category: 'Behavioral', questions: [
                'Describe a time you disagreed with your manager on a technical decision.',
                'How do you mentor junior engineers?',
                'Tell me about a project where requirements changed mid-sprint.',
                'How do you prioritize tasks when everything is urgent?',
                'Describe a time you shipped something you were proud of.',
            ]
        },
        {
            category: 'Culture & Leadership', questions: [
                'How do you give and receive code review feedback?',
                'What does engineering excellence mean to you?',
                'How do you stay current with new technologies?',
                'Describe your ideal engineering culture.',
                'What would you do in your first 90 days here?',
            ]
        },
        {
            category: 'Problem Solving', questions: [
                'How would you design a URL shortener at scale?',
                'Walk me through debugging a slow API endpoint.',
                'How would you migrate a monolith to microservices?',
                'Design a real-time notification system.',
                'How would you handle data consistency in a distributed system?',
            ]
        },
    ],
    'Product Manager': [
        {
            category: 'Product Strategy', questions: [
                'How do you prioritize features when you have limited resources?',
                'Describe a product you took from 0 to 1.',
                'How do you measure product-market fit?',
                'Walk me through your product discovery process.',
                'How do you handle competing stakeholder priorities?',
            ]
        },
        {
            category: 'Execution', questions: [
                'Describe a product launch that didn\'t go as planned.',
                'How do you write effective PRDs?',
                'Tell me about a time you had to kill a feature.',
                'How do you work with engineering teams during sprints?',
                'Describe your approach to A/B testing.',
            ]
        },
        {
            category: 'Data & Metrics', questions: [
                'What metrics would you track for a new social media feature?',
                'How do you use data to make product decisions?',
                'Tell me about a time data contradicted your intuition.',
                'How do you set up a metrics framework for a new product?',
                'Describe how you communicate metrics to stakeholders.',
            ]
        },
        {
            category: 'Leadership', questions: [
                'How do you manage relationships with design and engineering?',
                'Describe a time you influenced without authority.',
                'How do you handle pushback on your product vision?',
                'What\'s your approach to roadmap planning?',
                'How do you build trust with cross-functional teams?',
            ]
        },
    ],
    'UX Designer': [
        {
            category: 'Design Process', questions: [
                'Walk me through your design process from research to delivery.',
                'How do you validate design decisions?',
                'Describe a time you had to simplify a complex workflow.',
                'How do you balance user needs with business goals?',
                'What tools do you use and why?',
            ]
        },
        {
            category: 'User Research', questions: [
                'How do you conduct user interviews?',
                'Describe a research finding that changed a product direction.',
                'How do you create effective personas?',
                'What\'s your approach to usability testing?',
                'How do you synthesize research data into actionable insights?',
            ]
        },
        {
            category: 'Collaboration', questions: [
                'How do you handle design critique?',
                'Describe working with engineers to implement a complex interaction.',
                'How do you present design decisions to stakeholders?',
                'Tell me about a time you compromised on a design.',
                'How do you maintain a design system?',
            ]
        },
        {
            category: 'Portfolio', questions: [
                'Walk me through your favorite project and why.',
                'What design are you most proud of?',
                'Tell me about a design that failed and what you learned.',
                'How do you approach accessibility in your designs?',
                'Describe a project where you drove measurable impact.',
            ]
        },
    ],
    'Data Scientist': [
        {
            category: 'Technical', questions: [
                'Explain the difference between L1 and L2 regularization.',
                'How do you handle class imbalance in classification problems?',
                'Walk me through your feature engineering process.',
                'How do you validate a machine learning model?',
                'Describe a time you chose a simpler model over a complex one.',
            ]
        },
        {
            category: 'Business Impact', questions: [
                'How do you translate business problems into data problems?',
                'Describe a project where your analysis changed a business decision.',
                'How do you communicate results to non-technical stakeholders?',
                'What metrics would you use to measure recommendation quality?',
                'How do you prioritize which data problems to solve?',
            ]
        },
        {
            category: 'Behavioral', questions: [
                'Tell me about a time your model didn\'t perform as expected.',
                'How do you handle ambiguous problem statements?',
                'Describe working with cross-functional teams on a data project.',
                'How do you stay current with ML research?',
                'Tell me about an ethical consideration you faced with data.',
            ]
        },
        {
            category: 'Case Study', questions: [
                'How would you build a churn prediction model?',
                'Design an A/B test for a new pricing page.',
                'How would you detect fraud in real-time transactions?',
                'Build a recommendation system for our product.',
                'How would you measure the ROI of a new ML feature?',
            ]
        },
    ],
    'Marketing Manager': [
        {
            category: 'Strategy', questions: [
                'How do you develop a go-to-market strategy?',
                'Describe a campaign that exceeded expectations.',
                'How do you allocate budget across channels?',
                'What\'s your approach to brand positioning?',
                'How do you identify and size target segments?',
            ]
        },
        {
            category: 'Execution', questions: [
                'Walk me through a multi-channel campaign you managed.',
                'How do you create compelling content at scale?',
                'Describe your approach to email marketing.',
                'How do you manage agency relationships?',
                'Tell me about a campaign that failed and what you learned.',
            ]
        },
        {
            category: 'Analytics', questions: [
                'What metrics do you track for content marketing?',
                'How do you measure brand awareness?',
                'Describe your approach to attribution modeling.',
                'How do you use data to optimize campaigns?',
                'What tools do you use for marketing analytics?',
            ]
        },
        {
            category: 'Leadership', questions: [
                'How do you manage a team of marketers?',
                'Describe aligning marketing goals with sales.',
                'How do you handle budget cuts mid-quarter?',
                'What\'s your approach to hiring for your team?',
                'How do you foster creativity in your team?',
            ]
        },
    ],
    'Sales Executive': [
        {
            category: 'Sales Process', questions: [
                'Walk me through your sales methodology.',
                'How do you qualify prospects?',
                'Describe your approach to enterprise deal cycles.',
                'How do you handle objections?',
                'Tell me about your biggest closed deal.',
            ]
        },
        {
            category: 'Strategy', questions: [
                'How do you build a territory plan?',
                'Describe your approach to account-based selling.',
                'How do you prioritize your pipeline?',
                'What\'s your approach to competitive deals?',
                'How do you forecast accurately?',
            ]
        },
        {
            category: 'Behavioral', questions: [
                'Tell me about a deal you lost and what you learned.',
                'How do you handle a quarter where you\'re behind quota?',
                'Describe a time you turned a churning customer around.',
                'How do you build relationships with C-suite buyers?',
                'Tell me about a time you collaborated with product on a deal.',
            ]
        },
        {
            category: 'Metrics', questions: [
                'What metrics do you track daily/weekly?',
                'How do you measure sales efficiency?',
                'Describe your approach to pipeline coverage.',
                'What does a healthy pipeline look like to you?',
                'How do you balance new business vs. expansion revenue?',
            ]
        },
    ],
    'Engineering Manager': [
        {
            category: 'Leadership', questions: [
                'How do you balance technical work with people management?',
                'Describe your approach to building and scaling an engineering team.',
                'How do you handle underperforming engineers?',
                'What does a healthy engineering culture look like to you?',
                'How do you retain top engineering talent?',
            ]
        },
        {
            category: 'Technical Strategy', questions: [
                'How do you make build-vs-buy decisions for your team?',
                'Describe how you manage technical debt across multiple teams.',
                'How do you evaluate and adopt new technologies?',
                'Walk me through your approach to architectural reviews.',
                'How do you ensure code quality at scale?',
            ]
        },
        {
            category: 'Execution', questions: [
                'How do you plan and communicate roadmaps to stakeholders?',
                'Describe a time you had to deliver a project with aggressive timelines.',
                'How do you handle competing priorities from product and business?',
                'What metrics do you use to measure team productivity?',
                'How do you manage dependencies across multiple teams?',
            ]
        },
        {
            category: 'People & Growth', questions: [
                'How do you conduct effective 1:1s?',
                'Describe your approach to career development for engineers.',
                'How do you give feedback on promotions and compensation?',
                'Tell me about a difficult conversation you had with a report.',
                'How do you foster diversity and inclusion on your team?',
            ]
        },
    ],
    'Project Manager': [
        {
            category: 'Planning & Execution', questions: [
                'Walk me through how you plan a complex project from start to finish.',
                'How do you handle scope creep?',
                'Describe a project that went off track and how you got it back.',
                'What project management methodologies do you prefer and why?',
                'How do you manage project budgets and timelines?',
            ]
        },
        {
            category: 'Stakeholder Management', questions: [
                'How do you manage expectations with senior leadership?',
                'Describe a time you had to say no to a stakeholder request.',
                'How do you communicate project status and risks?',
                'Tell me about a time you resolved a conflict between stakeholders.',
                'How do you handle cross-functional dependencies?',
            ]
        },
        {
            category: 'Risk & Problem Solving', questions: [
                'How do you identify and mitigate project risks?',
                'Describe a time you had to make a critical decision with incomplete information.',
                'How do you handle resource constraints?',
                'Tell me about a project failure and what you learned.',
                'How do you prioritize when everything is urgent?',
            ]
        },
        {
            category: 'Tools & Process', questions: [
                'What tools do you use for project tracking and why?',
                'How do you run effective project retrospectives?',
                'Describe your approach to change management.',
                'How do you ensure team alignment on project goals?',
                'What does a successful project handoff look like?',
            ]
        },
    ],
    'Business Analyst': [
        {
            category: 'Requirements & Analysis', questions: [
                'How do you gather and document business requirements?',
                'Walk me through your process for stakeholder interviews.',
                'How do you handle conflicting requirements from different teams?',
                'Describe a time you identified a hidden business need.',
                'What techniques do you use for requirements validation?',
            ]
        },
        {
            category: 'Data & Modeling', questions: [
                'How do you use data to support business decisions?',
                'Describe your experience with process modeling (BPMN, UML).',
                'Walk me through a cost-benefit analysis you performed.',
                'How do you create effective user stories and acceptance criteria?',
                'What SQL or BI tools do you use for analysis?',
            ]
        },
        {
            category: 'Communication', questions: [
                'How do you translate technical concepts for non-technical stakeholders?',
                'Describe a time you presented a recommendation that was adopted.',
                'How do you facilitate workshops and discovery sessions?',
                'Tell me about a time you had to push back on a solution.',
                'How do you document and share your analysis?',
            ]
        },
        {
            category: 'Problem Solving', questions: [
                'How do you approach root cause analysis?',
                'Describe a process improvement you identified and implemented.',
                'How do you evaluate build vs. buy options?',
                'Tell me about a time you identified a gap in a system.',
                'How do you ensure your solutions align with business strategy?',
            ]
        },
    ],
    'DevOps / Cloud Engineer': [
        {
            category: 'Infrastructure & Architecture', questions: [
                'How do you design a CI/CD pipeline from scratch?',
                'Describe your experience with infrastructure as code.',
                'How do you approach multi-cloud vs. single-cloud strategy?',
                'Walk me through your container orchestration experience.',
                'How do you design for high availability and disaster recovery?',
            ]
        },
        {
            category: 'Reliability & Monitoring', questions: [
                'How do you implement observability across microservices?',
                'Describe your incident response process.',
                'What SLIs and SLOs do you define and how?',
                'How do you handle on-call rotations and burnout?',
                'Tell me about a production outage you resolved.',
            ]
        },
        {
            category: 'Security & Compliance', questions: [
                'How do you implement security in a DevOps pipeline?',
                'Describe your approach to secrets management.',
                'How do you handle compliance requirements (SOC2, HIPAA)?',
                'What is your strategy for vulnerability scanning?',
                'How do you implement zero-trust networking?',
            ]
        },
        {
            category: 'Automation & Scaling', questions: [
                'How do you decide what to automate?',
                'Describe a time you significantly reduced deployment time.',
                'How do you handle scaling during traffic spikes?',
                'What cost optimization strategies have you implemented?',
                'How do you manage configuration drift?',
            ]
        },
    ],
    'Financial Analyst': [
        {
            category: 'Financial Modeling', questions: [
                'Walk me through how you build a DCF model.',
                'How do you approach sensitivity analysis?',
                'Describe a financial model that drove a key business decision.',
                'How do you validate assumptions in your models?',
                'What is your approach to forecasting revenue?',
            ]
        },
        {
            category: 'Analysis & Reporting', questions: [
                'How do you analyze financial statements to identify trends?',
                'Describe your approach to variance analysis.',
                'How do you present financial data to non-finance stakeholders?',
                'What KPIs do you focus on and why?',
                'How do you handle data discrepancies in financial reports?',
            ]
        },
        {
            category: 'Strategy & Decision Support', questions: [
                'Describe a recommendation you made that impacted company strategy.',
                'How do you evaluate investment opportunities?',
                'Walk me through a scenario planning exercise you led.',
                'How do you assess risk in financial decisions?',
                'Tell me about a time your analysis changed a business direction.',
            ]
        },
        {
            category: 'Tools & Process', questions: [
                'What financial tools and systems do you use?',
                'How do you automate repetitive financial processes?',
                'Describe your experience with ERP systems.',
                'How do you ensure accuracy in your financial work?',
                'What is your approach to the annual budgeting process?',
            ]
        },
    ],
    'HR Manager': [
        {
            category: 'Talent Acquisition', questions: [
                'How do you design an effective hiring process?',
                'Describe your approach to employer branding.',
                'How do you reduce time-to-hire while maintaining quality?',
                'What metrics do you track for recruitment?',
                'How do you ensure diversity in the hiring pipeline?',
            ]
        },
        {
            category: 'Employee Relations', questions: [
                'How do you handle workplace conflicts?',
                'Describe a sensitive employee situation you navigated.',
                'How do you build a culture of trust and transparency?',
                'What is your approach to performance improvement plans?',
                'How do you handle terminations with empathy and compliance?',
            ]
        },
        {
            category: 'Learning & Development', questions: [
                'How do you identify skill gaps across the organization?',
                'Describe a training program you designed and its impact.',
                'How do you measure the ROI of L&D initiatives?',
                'What is your approach to succession planning?',
                'How do you foster a culture of continuous learning?',
            ]
        },
        {
            category: 'Strategy & Compliance', questions: [
                'How do you align HR strategy with business goals?',
                'Describe your experience with compensation and benefits design.',
                'How do you stay current with employment law changes?',
                'What HR technologies have you implemented?',
                'How do you measure employee engagement and satisfaction?',
            ]
        },
    ],
    'Operations Manager': [
        {
            category: 'Process Optimization', questions: [
                'How do you identify bottlenecks in an operational process?',
                'Describe a process improvement that delivered measurable results.',
                'What frameworks do you use for continuous improvement (Lean, Six Sigma)?',
                'How do you balance efficiency with quality?',
                'Walk me through how you standardize a process across teams.',
            ]
        },
        {
            category: 'Team & Resource Management', questions: [
                'How do you manage a team with diverse skill sets?',
                'Describe your approach to workforce planning.',
                'How do you handle peak demand periods?',
                'What is your approach to cross-training employees?',
                'How do you manage vendor and supplier relationships?',
            ]
        },
        {
            category: 'Metrics & Reporting', questions: [
                'What operational KPIs do you track and why?',
                'How do you build dashboards for operational visibility?',
                'Describe a data-driven decision you made in operations.',
                'How do you set and track SLAs?',
                'What is your approach to capacity planning?',
            ]
        },
        {
            category: 'Problem Solving', questions: [
                'Tell me about an operational crisis you managed.',
                'How do you make decisions under pressure?',
                'Describe a time you had to cut costs without impacting quality.',
                'How do you manage change across a large team?',
                'What is your approach to risk management in operations?',
            ]
        },
    ],
    'Management Consultant': [
        {
            category: 'Case & Problem Solving', questions: [
                'Walk me through how you structure a business problem.',
                'How do you size a market for a new product?',
                'Describe your approach to profitability analysis.',
                'How would you advise a company entering a new market?',
                'Walk me through a growth strategy framework.',
            ]
        },
        {
            category: 'Client Management', questions: [
                'How do you build trust with a new client?',
                'Describe a time you managed difficult client expectations.',
                'How do you present findings that challenge a client\'s assumptions?',
                'What is your approach to stakeholder mapping?',
                'How do you ensure client adoption of your recommendations?',
            ]
        },
        {
            category: 'Analytics & Research', questions: [
                'How do you conduct competitive analysis?',
                'Describe your approach to primary research.',
                'How do you synthesize complex data into actionable insights?',
                'What tools do you use for data analysis?',
                'How do you validate hypotheses during an engagement?',
            ]
        },
        {
            category: 'Leadership & Teamwork', questions: [
                'How do you manage a consulting team on a tight deadline?',
                'Describe a time you influenced a senior executive.',
                'How do you develop junior consultants?',
                'Tell me about a time you disagreed with a team\'s approach.',
                'How do you manage multiple engagements simultaneously?',
            ]
        },
    ],
}

const AVAILABLE_ROLES = Object.keys(ROLE_QUESTIONS)

// ── STAR Builder ─────────────────────────────────────
interface StarStory {
    id: string
    bullet: string
    situation: string
    task: string
    action: string
    result: string
}

export default function InterviewToolkitPage() {
    const { user, profile, fetchProfile } = useStore()
    const isPremium = profile?.plan === 'premium' || profile?.plan === 'career_plus'

    // Sync plan from Stripe on mount
    useEffect(() => {
        if (user && !isPremium) {
            verifySubscription()
                .then(() => fetchProfile(user.id))
                .catch(() => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])

    // ── Questions state
    const [selectedRole, setSelectedRole] = useState('')

    // ── STAR state
    const [stories, setStories] = useState<StarStory[]>([])
    const [currentStory, setCurrentStory] = useState<StarStory>({
        id: '', bullet: '', situation: '', task: '', action: '', result: ''
    })
    const [showStarForm, setShowStarForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // ── Copy state
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const startNewStory = () => {
        setCurrentStory({ id: Date.now().toString(), bullet: '', situation: '', task: '', action: '', result: '' })
        setEditingId(null)
        setShowStarForm(true)
    }

    const editStory = (story: StarStory) => {
        setCurrentStory({ ...story })
        setEditingId(story.id)
        setShowStarForm(true)
    }

    const saveStory = () => {
        if (editingId) {
            setStories(stories.map(s => s.id === editingId ? currentStory : s))
        } else {
            setStories([...stories, currentStory])
        }
        setShowStarForm(false)
        setEditingId(null)
    }

    const deleteStory = (id: string) => {
        setStories(stories.filter(s => s.id !== id))
    }

    const formatStarStory = (s: StarStory) =>
        `BULLET: ${s.bullet}\n\nSITUATION: ${s.situation}\n\nTASK: ${s.task}\n\nACTION: ${s.action}\n\nRESULT: ${s.result}`

    // ── Premium gate
    if (!isPremium) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div className={styles.gate}>
                    <div className={styles.gateIcon}>🎤</div>
                    <h1>Interview Toolkit</h1>
                    <p>Prepare for interviews with role-specific questions and the STAR story builder.</p>
                    <div className={styles.gateFeatures}>
                        <div className={styles.gateFeature}>
                            <span className={styles.gateFeatureIcon}>❓</span>
                            <div>
                                <strong>20 Questions by Role</strong>
                                <p>Curated behavioral, technical, and leadership questions for 6+ roles</p>
                            </div>
                        </div>
                        <div className={styles.gateFeature}>
                            <span className={styles.gateFeatureIcon}>⭐</span>
                            <div>
                                <strong>STAR Story Builder</strong>
                                <p>Guided framework: Situation → Task → Action → Result</p>
                            </div>
                        </div>
                    </div>
                    <Link to="/pricing" className="btn btn-gold btn-lg">Upgrade to Premium →</Link>
                    <p className={styles.gateCaveat}>Available on the Premium plan</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerBadge}><span className="badge badge-gold">Premium</span></div>
                    <h1>Interview <em>Toolkit</em></h1>
                    <p>Practice with role-specific questions and build your STAR stories.</p>
                </div>

                {/* ── ROLE QUESTIONS ──────────────────────────── */}
                <section className={styles.tool}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolIcon}>❓</span>
                        <div>
                            <h2>Common Questions by Role</h2>
                            <p>20 curated interview questions organized by category.</p>
                        </div>
                    </div>
                    <div className={styles.toolBody}>
                        <div className={styles.roleSelector}>
                            <label>Select your role:</label>
                            <div className={styles.roleChips}>
                                {AVAILABLE_ROLES.map(role => (
                                    <button
                                        key={role}
                                        className={`${styles.roleChip} ${selectedRole === role ? styles.roleChipActive : ''}`}
                                        onClick={() => setSelectedRole(role)}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedRole && ROLE_QUESTIONS[selectedRole] && (
                            <div className={styles.questionCategories}>
                                {ROLE_QUESTIONS[selectedRole].map((cat, ci) => (
                                    <div key={ci} className={styles.questionCategory}>
                                        <div className={styles.categoryLabel}>{cat.category}</div>
                                        <ol className={styles.questionList}>
                                            {cat.questions.map((q, qi) => (
                                                <li key={qi} className={styles.questionItem}>
                                                    <span className={styles.questionNum}>{ci * 5 + qi + 1}</span>
                                                    <span className={styles.questionText}>{q}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── STAR STORY BUILDER ──────────────────────── */}
                <section className={styles.tool}>
                    <div className={styles.toolHeader}>
                        <span className={styles.toolIcon}>⭐</span>
                        <div>
                            <h2>STAR Story Builder</h2>
                            <p>Structure your experiences into compelling interview answers.</p>
                        </div>
                    </div>
                    <div className={styles.toolBody}>
                        {!showStarForm ? (
                            <>
                                <button className="btn btn-gold" onClick={startNewStory}>
                                    + Build a New STAR Story
                                </button>

                                {stories.length > 0 && (
                                    <div className={styles.savedStories}>
                                        <div className={styles.storiesLabel}>Saved Stories ({stories.length})</div>
                                        {stories.map(story => (
                                            <div key={story.id} className={styles.storyCard}>
                                                <div className={styles.storyCardContent}>
                                                    <div className={styles.storyBullet}>{story.bullet}</div>
                                                    <div className={styles.storyPreview}>
                                                        <span><strong>S:</strong> {story.situation.slice(0, 60)}…</span>
                                                    </div>
                                                </div>
                                                <div className={styles.storyActions}>
                                                    <button className={styles.storyActionBtn} onClick={() => editStory(story)}>Edit</button>
                                                    <button
                                                        className={styles.storyActionBtn}
                                                        onClick={() => copyToClipboard(formatStarStory(story), story.id)}
                                                    >
                                                        {copied === story.id ? '✓' : 'Copy'}
                                                    </button>
                                                    <button className={`${styles.storyActionBtn} ${styles.deleteBtn}`} onClick={() => deleteStory(story.id)}>×</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.starForm}>
                                <div className={styles.starStep}>
                                    <div className={styles.starStepLabel}>
                                        <span className={styles.starStepNum}>📌</span> Resume Bullet
                                    </div>
                                    <p className={styles.starStepHint}>Which achievement do you want to turn into a story?</p>
                                    <input
                                        type="text"
                                        placeholder='e.g. "Reduced cart abandonment by 34% through checkout redesign"'
                                        value={currentStory.bullet}
                                        onChange={e => setCurrentStory({ ...currentStory, bullet: e.target.value })}
                                    />
                                </div>

                                <div className={styles.starStep}>
                                    <div className={styles.starStepLabel}>
                                        <span className={styles.starStepNum}>S</span> Situation
                                    </div>
                                    <p className={styles.starStepHint}>What was the context? Describe the environment, team, and challenge.</p>
                                    <textarea
                                        rows={3}
                                        placeholder="Our e-commerce checkout had a 67% abandonment rate, significantly higher than the industry average of 45%. The product team was under pressure to improve conversion before Q4."
                                        value={currentStory.situation}
                                        onChange={e => setCurrentStory({ ...currentStory, situation: e.target.value })}
                                    />
                                </div>

                                <div className={styles.starStep}>
                                    <div className={styles.starStepLabel}>
                                        <span className={styles.starStepNum}>T</span> Task
                                    </div>
                                    <p className={styles.starStepHint}>What was YOUR specific responsibility?</p>
                                    <textarea
                                        rows={3}
                                        placeholder="I was tasked with leading the checkout redesign — conducting user research, proposing solutions, and shipping the new flow within 6 weeks."
                                        value={currentStory.task}
                                        onChange={e => setCurrentStory({ ...currentStory, task: e.target.value })}
                                    />
                                </div>

                                <div className={styles.starStep}>
                                    <div className={styles.starStepLabel}>
                                        <span className={styles.starStepNum}>A</span> Action
                                    </div>
                                    <p className={styles.starStepHint}>What did you DO? Be specific about your contribution.</p>
                                    <textarea
                                        rows={4}
                                        placeholder="I ran 12 user interviews and identified 3 key friction points. I designed a streamlined single-page checkout with progress indicators, implemented guest checkout, and A/B tested against the original flow."
                                        value={currentStory.action}
                                        onChange={e => setCurrentStory({ ...currentStory, action: e.target.value })}
                                    />
                                </div>

                                <div className={styles.starStep}>
                                    <div className={styles.starStepLabel}>
                                        <span className={styles.starStepNum}>R</span> Result
                                    </div>
                                    <p className={styles.starStepHint}>What was the measurable outcome?</p>
                                    <textarea
                                        rows={3}
                                        placeholder="Cart abandonment dropped from 67% to 44% — a 34% improvement. The new flow generated an additional $2.1M in Q4 revenue."
                                        value={currentStory.result}
                                        onChange={e => setCurrentStory({ ...currentStory, result: e.target.value })}
                                    />
                                </div>

                                <div className={styles.starFormActions}>
                                    <button
                                        className="btn btn-gold"
                                        onClick={saveStory}
                                        disabled={!currentStory.bullet || !currentStory.situation || !currentStory.task || !currentStory.action || !currentStory.result}
                                    >
                                        {editingId ? 'Update Story' : 'Save Story'}
                                    </button>
                                    <button className="btn btn-outline" onClick={() => setShowStarForm(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
