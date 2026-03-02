import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { verifySubscription } from '../lib/stripe'
import { LandingIcon } from '../components/LandingIcons'


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

// ── Interview tips database ─────────────────────────
const INTERVIEW_TIPS = [
    { icon: 'target', title: 'Use the STAR Method', desc: 'Structure behavioral answers with Situation, Task, Action, and Result for clear, compelling stories.' },
    { icon: 'zap', title: 'Keep Answers Under 2 Minutes', desc: 'Practice concise answers. Use the timer below to build muscle memory for the right length.' },
    { icon: 'refresh', title: 'Prepare 5-8 Core Stories', desc: 'Most behavioral questions can be answered with 5-8 well-prepared stories from your experience.' },
    { icon: 'search', title: 'Mirror Their Language', desc: 'Use terminology from the job description in your answers to show alignment with the role.' },
    { icon: 'bar-chart', title: 'Quantify Everything', desc: 'Numbers make stories memorable. "Improved by 34%" beats "made things better" every time.' },
    { icon: 'lightbulb', title: 'Ask Smart Questions', desc: 'Prepare 3-5 thoughtful questions about the team, challenges, and success metrics for the role.' },
]

// ── STAR Builder ─────────────────────────────────────
interface StarStory {
    id: string
    bullet: string
    situation: string
    task: string
    action: string
    result: string
}

// ── Practice Timer Component ─────────────────────────
function PracticeTimer() {
    const [seconds, setSeconds] = useState(120)
    const [isRunning, setIsRunning] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (isRunning && seconds > 0) {
            intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000)
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [isRunning, seconds])

    useEffect(() => {
        if (seconds === 0) setIsRunning(false)
    }, [seconds])

    const toggle = () => {
        if (!hasStarted) setHasStarted(true)
        setIsRunning(!isRunning)
    }
    const reset = () => { setSeconds(120); setIsRunning(false); setHasStarted(false) }
    const pct = ((120 - seconds) / 120) * 100
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    const isWarning = seconds <= 30 && seconds > 0
    const isDone = seconds === 0

    return (
        <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                    <circle cx="72" cy="72" r="64" fill="none" stroke="var(--ink-10)" strokeWidth="6" />
                    <circle cx="72" cy="72" r="64" fill="none"
                        stroke={isDone ? '#ef4444' : isWarning ? '#f59e0b' : 'var(--gold)'}
                        strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 64}`}
                        strokeDashoffset={`${2 * Math.PI * 64 * (1 - pct / 100)}`}
                        className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-mono text-3xl font-bold tabular-nums ${isDone ? 'text-[#ef4444]' : isWarning ? 'text-[#f59e0b]' : 'text-ink'}`}>
                        {min}:{sec.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-ink-40 mt-0.5">
                        {isDone ? 'TIME\'S UP' : isRunning ? 'speaking' : hasStarted ? 'paused' : 'ready'}
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <button className={`px-5 py-2 text-sm font-semibold rounded-full border cursor-pointer transition-all ${isRunning ? 'border-[#f59e0b] bg-[rgba(245,158,11,0.08)] text-[#f59e0b]' : 'border-gold bg-[rgba(201,146,60,0.08)] text-gold'} hover:shadow-md`} onClick={toggle}>
                    {isRunning ? '⏸ Pause' : hasStarted ? '▶ Resume' : '▶ Start'}
                </button>
                {hasStarted && (
                    <button className="px-4 py-2 text-sm font-medium rounded-full border border-ink-10 text-ink-40 cursor-pointer transition-all hover:border-ink-20 hover:text-ink" onClick={reset}>
                        ↺ Reset
                    </button>
                )}
            </div>
            <p className="text-[11px] text-ink-20 text-center max-w-[260px] leading-relaxed">
                Most interviewers expect answers between 1–2 minutes. Practice keeping your responses concise and impactful.
            </p>
        </div>
    )
}

// ── Mock Interview Component ─────────────────────────
function MockInterview({ role }: { role: string }) {
    const allQuestions = ROLE_QUESTIONS[role]?.flatMap(c => c.questions) || []
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * allQuestions.length))
    const [showTip, setShowTip] = useState(false)
    const [answeredCount, setAnsweredCount] = useState(0)

    const nextQuestion = useCallback(() => {
        setCurrentIndex(Math.floor(Math.random() * allQuestions.length))
        setShowTip(false)
        setAnsweredCount(c => c + 1)
    }, [allQuestions.length])

    if (allQuestions.length === 0) return null

    const question = allQuestions[currentIndex]
    const category = ROLE_QUESTIONS[role]?.find(c => c.questions.includes(question))?.category || ''

    return (
        <div className="flex flex-col items-center text-center py-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold mb-3">{category}</div>
            <div className="text-lg font-semibold text-ink leading-relaxed max-w-[560px] mb-6 min-h-[56px]" style={{ animation: 'fadeUp 0.4s ease both' }} key={currentIndex}>
                "{question}"
            </div>

            <div className="flex gap-2 mb-4">
                <button className="px-5 py-2.5 text-sm font-semibold rounded-full border border-gold bg-[rgba(201,146,60,0.08)] text-gold cursor-pointer transition-all hover:shadow-md" onClick={nextQuestion}>
                    Next Question →
                </button>
                <button className={`px-4 py-2.5 text-sm font-medium rounded-full border cursor-pointer transition-all ${showTip ? 'border-gold bg-[rgba(201,146,60,0.08)] text-gold' : 'border-ink-10 text-ink-40 hover:border-ink-20'}`} onClick={() => setShowTip(!showTip)}>
                    {showTip ? 'Hide Tip' : 'Show Tip'}
                </button>
            </div>

            {showTip && (
                <div className="bg-ink-05 border border-ink-10 rounded-xl px-5 py-4 text-left max-w-[480px] text-[13px] text-ink-70 leading-relaxed" style={{ animation: 'fadeUp 0.3s ease both' }}>
                    <strong className="text-ink text-xs font-mono uppercase tracking-wider block mb-2">Answer Framework</strong>
                    <ol className="list-decimal pl-4 flex flex-col gap-1.5 m-0">
                        <li><strong>Set context</strong> — briefly describe the situation (10 sec)</li>
                        <li><strong>Explain your role</strong> — what was YOUR specific responsibility</li>
                        <li><strong>Detail your actions</strong> — be specific about what you did</li>
                        <li><strong>Share the result</strong> — quantify impact wherever possible</li>
                        <li><strong>Reflect</strong> — what did you learn or what would you do differently</li>
                    </ol>
                </div>
            )}

            {answeredCount > 0 && (
                <div className="mt-4 text-[11px] font-mono text-ink-20">
                    {answeredCount} question{answeredCount !== 1 ? 's' : ''} practiced this session
                </div>
            )}
        </div>
    )
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
    const [activeTab, setActiveTab] = useState<'questions' | 'mock'>('questions')

    // ── Bookmarks
    const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem('interview_bookmarks') || '[]')) }
        catch { return new Set() }
    })
    const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)

    const toggleBookmark = (q: string) => {
        setBookmarks(prev => {
            const next = new Set(prev)
            if (next.has(q)) next.delete(q); else next.add(q)
            localStorage.setItem('interview_bookmarks', JSON.stringify([...next]))
            return next
        })
    }

    // ── STAR state
    const [stories, setStories] = useState<StarStory[]>(() => {
        try { return JSON.parse(localStorage.getItem('star_stories') || '[]') }
        catch { return [] }
    })
    const [currentStory, setCurrentStory] = useState<StarStory>({
        id: '', bullet: '', situation: '', task: '', action: '', result: ''
    })
    const [showStarForm, setShowStarForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [starStep, setStarStep] = useState(0)

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
        setStarStep(0)
        setShowStarForm(true)
    }

    const editStory = (story: StarStory) => {
        setCurrentStory({ ...story })
        setEditingId(story.id)
        setStarStep(0)
        setShowStarForm(true)
    }

    const saveStory = () => {
        const updated = editingId
            ? stories.map(s => s.id === editingId ? currentStory : s)
            : [...stories, currentStory]
        setStories(updated)
        localStorage.setItem('star_stories', JSON.stringify(updated))
        setShowStarForm(false)
        setEditingId(null)
    }

    const deleteStory = (id: string) => {
        const updated = stories.filter(s => s.id !== id)
        setStories(updated)
        localStorage.setItem('star_stories', JSON.stringify(updated))
    }

    const formatStarStory = (s: StarStory) =>
        `BULLET: ${s.bullet}\n\nSITUATION: ${s.situation}\n\nTASK: ${s.task}\n\nACTION: ${s.action}\n\nRESULT: ${s.result}`

    const STAR_STEPS = [
        { icon: '•', label: 'Resume Bullet', key: 'bullet' as const, type: 'input', hint: 'Which achievement do you want to turn into a story?', placeholder: 'e.g. "Reduced cart abandonment by 34% through checkout redesign"' },
        { icon: 'S', label: 'Situation', key: 'situation' as const, type: 'textarea', hint: 'What was the context? Describe the environment, team, and challenge.', placeholder: 'Our e-commerce checkout had a 67% abandonment rate...' },
        { icon: 'T', label: 'Task', key: 'task' as const, type: 'textarea', hint: 'What was YOUR specific responsibility?', placeholder: 'I was tasked with leading the checkout redesign...' },
        { icon: 'A', label: 'Action', key: 'action' as const, type: 'textarea', hint: 'What did you DO? Be specific about your contribution.', placeholder: 'I ran 12 user interviews and identified 3 key friction points...' },
        { icon: 'R', label: 'Result', key: 'result' as const, type: 'textarea', hint: 'What was the measurable outcome?', placeholder: 'Cart abandonment dropped from 67% to 44%...' },
    ]

    // ── Premium gate
    if (!isPremium) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-[560px] mx-auto px-10 py-20 text-center">
                    <div className="flex justify-center mb-5 text-gold"><LandingIcon name="mic" size={48} /></div>
                    <h1>Interview Toolkit</h1>
                    <p className="text-base text-ink-40 mb-10 leading-relaxed">Prepare for interviews with role-specific questions and the STAR story builder.</p>
                    <div className="flex flex-col gap-4 text-left mb-10">
                        {[
                            { icon: 'lightbulb', title: '20 Questions by Role', desc: 'Curated behavioral, technical, and leadership questions for 14 roles' },
                            { icon: 'star', title: 'STAR Story Builder', desc: 'Guided step-by-step framework: Situation → Task → Action → Result' },
                            { icon: 'target', title: 'Mock Interview Mode', desc: 'Random questions with answer frameworks and a 2-minute practice timer' },
                            { icon: 'flag', title: 'Bookmark & Practice', desc: 'Save your toughest questions and review them before your interview' },
                        ].map((f, i) => (
                            <div key={i} className="flex gap-4 items-start p-5 bg-[var(--white)] border border-ink-10 rounded-xl">
                                <span className="shrink-0 mt-0.5 text-gold"><LandingIcon name={f.icon} size={22} /></span>
                                <div><strong className="text-[15px] block mb-1">{f.title}</strong><p className="text-[13px] text-ink-40 m-0 leading-relaxed">{f.desc}</p></div>
                            </div>
                        ))}
                    </div>
                    <Link to="/pricing" className="btn btn-gold btn-lg">Upgrade to Premium →</Link>
                    <p className="text-xs text-ink-20 mt-3.5 font-mono">Available on the Premium plan</p>
                </div>
            </div>
        )
    }

    // Get filtered questions for bookmarks view
    const getFilteredQuestions = () => {
        if (!selectedRole || !ROLE_QUESTIONS[selectedRole]) return []
        if (!showBookmarksOnly) return ROLE_QUESTIONS[selectedRole]
        return ROLE_QUESTIONS[selectedRole]
            .map(cat => ({ ...cat, questions: cat.questions.filter(q => bookmarks.has(q)) }))
            .filter(cat => cat.questions.length > 0)
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-[860px] mx-auto px-5 sm:px-10 pt-10 pb-20">
                <div className="text-center mb-12">
                    <div className="mb-4"><span className="badge badge-gold">Premium</span></div>
                    <h1>Interview <em className="italic text-gold">Toolkit</em></h1>
                    <p className="text-base text-ink-40">Master your interviews with practice questions, mock sessions, and STAR stories.</p>
                </div>

                {/* ── TIPS BANNER ──────────────────────────────── */}
                <section className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {INTERVIEW_TIPS.map((tip, i) => (
                            <div key={i} className="flex gap-3 items-start p-4 bg-[var(--white)] border border-ink-10 rounded-xl transition-all hover:border-gold-pale hover:shadow-sm" style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                                <span className="shrink-0 text-gold"><LandingIcon name={tip.icon} size={20} /></span>
                                <div>
                                    <strong className="text-[13px] block mb-0.5 text-ink">{tip.title}</strong>
                                    <p className="text-[11.5px] text-ink-40 m-0 leading-[1.6]">{tip.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── ROLE QUESTIONS ──────────────────────────── */}
                <section className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden mb-6">
                    <div className="flex items-start gap-4 px-7 py-6 bg-ink-05 border-b border-ink-10">
                        <span className="text-[28px] shrink-0 mt-0.5">❓</span>
                        <div className="flex-1">
                            <h2 className="text-xl mb-1">Common Questions by Role</h2>
                            <p className="text-[13px] text-ink-40 m-0">20 curated interview questions organized by category. Bookmark your favorites.</p>
                        </div>
                        {bookmarks.size > 0 && (
                            <button className={`shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all ${showBookmarksOnly ? 'border-gold bg-[rgba(201,146,60,0.08)] text-gold' : 'border-ink-10 text-ink-40 hover:border-gold-pale'}`} onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}>
                                {bookmarks.size} saved
                            </button>
                        )}
                    </div>
                    <div className="p-7">
                        <div className="mb-7">
                            <label className="block text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-3">Select your role:</label>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_ROLES.map(role => (
                                    <button key={role} className={`px-4 py-2 text-[13px] font-medium border rounded-full cursor-pointer transition-all ${selectedRole === role ? 'border-gold bg-[rgba(201,146,60,0.08)] text-gold font-semibold' : 'border-ink-10 bg-[var(--white)] text-ink-70 hover:border-gold-pale'}`} onClick={() => { setSelectedRole(role); setShowBookmarksOnly(false) }}>{role}</button>
                                ))}
                            </div>
                        </div>

                        {selectedRole && (
                            <>
                                {/* Tab switcher */}
                                <div className="flex gap-1 p-1 bg-ink-05 rounded-lg mb-6 w-fit">
                                    {([['questions', 'Questions'], ['mock', 'Mock Interview']] as const).map(([key, label]) => (
                                        <button key={key} className={`px-4 py-2 text-[13px] font-medium rounded-md cursor-pointer transition-all border-none ${activeTab === key ? 'bg-[var(--white)] text-ink shadow-sm font-semibold' : 'bg-transparent text-ink-40 hover:text-ink'}`} onClick={() => setActiveTab(key)}>
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'questions' ? (
                                    <div className="flex flex-col gap-6">
                                        {getFilteredQuestions().map((cat, ci) => (
                                            <div key={ci} className="border-l-[3px] border-l-gold pl-5">
                                                <div className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold mb-3">{cat.category}</div>
                                                <ol className="list-none flex flex-col gap-2.5">
                                                    {cat.questions.map((q, qi) => (
                                                        <li key={qi} className="group flex items-start gap-3 text-sm text-ink-70 leading-relaxed">
                                                            <span className="shrink-0 w-6 h-6 rounded-full bg-ink-05 dark:bg-ink-10 text-ink-40 text-[11px] font-bold font-mono flex items-center justify-center">{ci * 5 + qi + 1}</span>
                                                            <span className="flex-1 pt-0.5">{q}</span>
                                                            <button
                                                                className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer transition-all text-sm ${bookmarks.has(q) ? 'border-gold bg-[rgba(201,146,60,0.08)] text-gold' : 'border-transparent text-ink-10 opacity-0 group-hover:opacity-100 hover:border-ink-10 hover:text-ink-40'}`}
                                                                onClick={() => toggleBookmark(q)}
                                                                title={bookmarks.has(q) ? 'Remove bookmark' : 'Bookmark this question'}
                                                            >
                                                                {bookmarks.has(q) ? '★' : '☆'}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        ))}
                                        {showBookmarksOnly && getFilteredQuestions().length === 0 && (
                                            <div className="text-center py-8 text-ink-20 text-sm">
                                                No bookmarked questions for {selectedRole}.<br />
                                                <button className="text-gold underline cursor-pointer bg-transparent border-none text-sm mt-2" onClick={() => setShowBookmarksOnly(false)}>Show all questions</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <MockInterview role={selectedRole} />
                                )}
                            </>
                        )}
                    </div>
                </section>

                {/* ── PRACTICE TIMER ──────────────────────────── */}
                <section className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden mb-6">
                    <div className="flex items-start gap-4 px-7 py-6 bg-ink-05 border-b border-ink-10">
                        <span className="text-[28px] shrink-0 mt-0.5">⏱️</span>
                        <div>
                            <h2 className="text-xl mb-1">Practice Timer</h2>
                            <p className="text-[13px] text-ink-40 m-0">Time your answers to build confidence and conciseness.</p>
                        </div>
                    </div>
                    <div className="p-7">
                        <PracticeTimer />
                    </div>
                </section>

                {/* ── STAR STORY BUILDER ──────────────────────── */}
                <section className="bg-[var(--white)] border border-ink-10 rounded-xl overflow-hidden mb-6">
                    <div className="flex items-start gap-4 px-7 py-6 bg-ink-05 border-b border-ink-10">
                        <span className="text-[28px] shrink-0 mt-0.5">⭐</span>
                        <div>
                            <h2 className="text-xl mb-1">STAR Story Builder</h2>
                            <p className="text-[13px] text-ink-40 m-0">Structure your experiences into compelling interview answers. Stories are saved locally.</p>
                        </div>
                    </div>
                    <div className="p-7">
                        {!showStarForm ? (
                            <>
                                <button className="btn btn-gold" onClick={startNewStory}>+ Build a New STAR Story</button>
                                {stories.length > 0 && (
                                    <div className="mt-7">
                                        <div className="text-xs font-semibold font-mono uppercase tracking-wide text-ink-40 mb-3">Saved Stories ({stories.length})</div>
                                        {stories.map(story => (
                                            <div key={story.id} className="flex items-center justify-between gap-4 px-5 py-4 bg-ink-05 border border-ink-10 rounded-xl mb-2 transition-colors hover:border-gold-pale">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-ink mb-1 truncate">{story.bullet}</div>
                                                    <div className="text-xs text-ink-40 truncate"><span><strong>S:</strong> {story.situation.slice(0, 60)}…</span></div>
                                                </div>
                                                <div className="flex gap-1.5 shrink-0">
                                                    <button className="px-3 py-1 text-xs font-semibold font-mono border border-ink-10 rounded-lg bg-[var(--white)] text-ink-70 cursor-pointer transition-all hover:border-gold hover:text-gold" onClick={() => editStory(story)}>Edit</button>
                                                    <button className="px-3 py-1 text-xs font-semibold font-mono border border-ink-10 rounded-lg bg-[var(--white)] text-ink-70 cursor-pointer transition-all hover:border-gold hover:text-gold" onClick={() => copyToClipboard(formatStarStory(story), story.id)}>{copied === story.id ? '✓' : 'Copy'}</button>
                                                    <button className="px-3 py-1 text-xs font-semibold font-mono border border-ink-10 rounded-lg bg-[var(--white)] text-ink-70 cursor-pointer transition-all hover:border-[#ef4444] hover:text-[#ef4444]" onClick={() => deleteStory(story.id)}>×</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div>
                                {/* Stepper progress */}
                                <div className="flex items-center gap-1 mb-8">
                                    {STAR_STEPS.map((s, i) => (
                                        <div key={i} className="flex items-center gap-1 flex-1">
                                            <button
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer transition-all border-none shrink-0 ${i === starStep ? 'bg-gold text-white shadow-md scale-110' : i < starStep && (currentStory as any)[s.key] ? 'bg-[rgba(76,175,122,0.12)] text-emerald' : 'bg-ink-05 text-ink-40'}`}
                                                onClick={() => setStarStep(i)}
                                            >
                                                {i < starStep && (currentStory as any)[s.key] ? '✓' : s.icon}
                                            </button>
                                            {i < STAR_STEPS.length - 1 && (
                                                <div className={`flex-1 h-0.5 rounded transition-colors ${i < starStep ? 'bg-gold' : 'bg-ink-10'}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Current step */}
                                <div className="p-6 bg-ink-05 rounded-xl border border-ink-10 mb-5" key={starStep} style={{ animation: 'fadeUp 0.3s ease both' }}>
                                    <div className="flex items-center gap-2.5 text-lg font-bold text-ink mb-2">
                                        <span className="w-9 h-9 rounded-full bg-gold text-white text-sm font-bold flex items-center justify-center shrink-0">{STAR_STEPS[starStep].icon}</span>
                                        {STAR_STEPS[starStep].label}
                                    </div>
                                    <p className="text-[13px] text-ink-40 mb-4 leading-relaxed">{STAR_STEPS[starStep].hint}</p>
                                    {STAR_STEPS[starStep].type === 'input' ? (
                                        <input type="text" className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)]" placeholder={STAR_STEPS[starStep].placeholder} value={(currentStory as any)[STAR_STEPS[starStep].key]} onChange={e => setCurrentStory({ ...currentStory, [STAR_STEPS[starStep].key]: e.target.value })} autoFocus />
                                    ) : (
                                        <textarea rows={4} className="w-full px-3.5 py-2.5 text-sm border border-ink-10 rounded-lg bg-[var(--white)] text-ink transition-colors focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,146,60,0.1)] resize-y leading-relaxed" placeholder={STAR_STEPS[starStep].placeholder} value={(currentStory as any)[STAR_STEPS[starStep].key]} onChange={e => setCurrentStory({ ...currentStory, [STAR_STEPS[starStep].key]: e.target.value })} autoFocus />
                                    )}
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {starStep > 0 && (
                                            <button className="btn btn-outline" onClick={() => setStarStep(s => s - 1)}>← Back</button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 text-sm font-medium rounded-lg border border-ink-10 text-ink-40 cursor-pointer transition-all hover:border-ink-20 hover:text-ink bg-transparent" onClick={() => setShowStarForm(false)}>Cancel</button>
                                        {starStep < STAR_STEPS.length - 1 ? (
                                            <button className="btn btn-gold" onClick={() => setStarStep(s => s + 1)} disabled={!(currentStory as any)[STAR_STEPS[starStep].key]}>
                                                Next →
                                            </button>
                                        ) : (
                                            <button className="btn btn-gold" onClick={saveStory} disabled={!currentStory.bullet || !currentStory.situation || !currentStory.task || !currentStory.action || !currentStory.result}>
                                                {editingId ? '✓ Update Story' : '✓ Save Story'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
