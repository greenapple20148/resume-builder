import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import {
    INTERVIEW_TYPES,
    MOCK_ROLES,
    generateQuestion,
    evaluateAnswer,
    generateSummary,
    getPracticeHistory,
    InterviewQuestion,
    InterviewConfig,
    InterviewSummary,
    PracticeHistoryEntry,
} from '../lib/ai'

type Phase = 'select' | 'configure' | 'interview' | 'summary'

export default function MockInterviewPage() {
    const { profile } = useStore()
    const plan = profile?.plan || 'free'
    const canAccess = plan === 'premium' || plan === 'career_plus'

    // ── State
    const [phase, setPhase] = useState<Phase>('select')
    const [config, setConfig] = useState<InterviewConfig>({
        type: '',
        role: '',
        difficulty: 'medium',
        questionCount: 6,
    })
    const [questions, setQuestions] = useState<InterviewQuestion[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const [currentQuestion, setCurrentQuestion] = useState('')
    const [currentEvaluation, setCurrentEvaluation] = useState<InterviewQuestion['evaluation']>(null)
    const [summary, setSummary] = useState<InterviewSummary | null>(null)
    const [expandedReview, setExpandedReview] = useState<number | null>(null)
    const [error, setError] = useState('')
    const [practiceHistory, setPracticeHistory] = useState<PracticeHistoryEntry[]>([])
    const [showHistory, setShowHistory] = useState(false)

    // Load practice history on mount
    useEffect(() => {
        if (canAccess) {
            getPracticeHistory()
                .then(setPracticeHistory)
                .catch(() => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canAccess])

    // ── Premium gate
    if (!canAccess) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-[560px] mx-auto px-10 py-20 text-center">
                    <div className="text-[56px] mb-5">🤖</div>
                    <h1>AI Mock Interview</h1>
                    <p className="text-base text-ink-40 mb-10 leading-relaxed">Practice with an AI interviewer that adapts to your role, evaluates your answers in real-time, and gives actionable feedback.</p>
                    <div className="flex flex-col gap-4 text-left mb-10">
                        <div className="flex gap-4 items-start p-5 bg-[var(--white)] border border-ink-10 rounded-xl">
                            <div><strong className="text-[15px] block mb-1">Premium — $24.99/mo</strong><span className="text-[13px] text-ink-40">3 mock interviews/month</span></div>
                        </div>
                        <div className="flex gap-4 items-start p-5 bg-[var(--white)] border border-ink-10 rounded-xl">
                            <div><strong className="text-[15px] block mb-1">Career+ — $34.99/mo</strong><span className="text-[13px] text-ink-40">20 mock interviews/month + JD match</span></div>
                        </div>
                    </div>
                    <Link to="/pricing" className="btn btn-gold btn-lg">Unlock Mock Interviews →</Link>
                </div>
            </div>
        )
    }

    // ── Select interview type
    const handleTypeSelect = (typeId: string) => {
        const typeInfo = (INTERVIEW_TYPES as any)[typeId]
        setConfig(prev => ({ ...prev, type: typeId, questionCount: typeInfo.defaultQuestions }))
        setPhase('configure')
    }

    // ── Start interview
    const handleStart = async () => {
        if (!config.role) return
        setPhase('interview')
        setQuestions([])
        setCurrentIndex(0)
        setCurrentAnswer('')
        setCurrentEvaluation(null)
        setError('')
        await loadNextQuestion(0, [])
    }

    // ── Load next question
    const loadNextQuestion = async (index: number, history: InterviewQuestion[]) => {
        setIsLoading(true)
        setLoadingText('AI is preparing your next question…')
        try {
            const q = await generateQuestion(config, history, index)
            setCurrentQuestion(q)
            setCurrentAnswer('')
            setCurrentEvaluation(null)
        } catch (err: any) {
            setError(err.message || 'Failed to generate question')
        } finally {
            setIsLoading(false)
            setLoadingText('')
        }
    }

    // ── Submit answer
    const handleSubmitAnswer = async () => {
        if (!currentAnswer.trim()) return
        setIsLoading(true)
        setLoadingText('AI is evaluating your answer…')
        setError('')
        try {
            const evaluation = await evaluateAnswer(config, currentQuestion, currentAnswer)
            setCurrentEvaluation(evaluation)
            const updatedQ: InterviewQuestion = { question: currentQuestion, answer: currentAnswer, evaluation }
            setQuestions(prev => [...prev, updatedQ])
        } catch (err: any) {
            setError(err.message || 'Failed to evaluate answer')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Next question or finish
    const handleNext = async () => {
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        if (nextIndex >= config.questionCount) {
            setIsLoading(true)
            setLoadingText('AI is preparing your interview summary…')
            try {
                const sum = await generateSummary(config, questions)
                setSummary(sum)
                setPhase('summary')
                // Refresh history
                getPracticeHistory().then(setPracticeHistory).catch(() => { })
            } catch (err: any) {
                setError(err.message || 'Failed to generate summary')
            } finally {
                setIsLoading(false)
            }
        } else {
            await loadNextQuestion(nextIndex, questions)
        }
    }

    // ── Reset
    const handleReset = () => {
        setPhase('select')
        setQuestions([])
        setCurrentIndex(0)
        setSummary(null)
        setCurrentEvaluation(null)
        setError('')
    }

    const scoreColor = (score: number) =>
        score >= 8 ? 'bg-gradient-to-br from-green-500 to-green-600' : score >= 5 ? 'bg-gradient-to-br from-gold to-gold-light' : 'bg-gradient-to-br from-red-500 to-red-600'

    const typeInfo = (INTERVIEW_TYPES as any)[config.type]

    const ScoreGauge = ({ label, value, max = 10 }: { label: string; value: number; max?: number }) => (
        <div className="py-2">
            <div className="h-1.5 bg-ink-10 rounded-full overflow-hidden mb-1">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${value >= 8 ? 'bg-gradient-to-r from-green-500 to-green-600' : value >= 5 ? 'bg-gradient-to-r from-gold to-gold-light' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                    style={{ width: `${(value / max) * 100}%` }}
                />
            </div>
            <div className="flex justify-between items-center text-[11px] text-ink-40">
                <span>{label}</span>
                <span className="font-bold text-ink-60">{value}/{max}</span>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <Navbar />
            <div className="max-w-[900px] mx-auto px-6 pt-10 pb-20">

                {/* ── SELECT TYPE ─────────────────────────── */}
                {phase === 'select' && (
                    <>
                        <div className="text-center mb-10">
                            <div className="mb-2">
                                <span className="badge badge-gold">{plan === 'career_plus' ? 'Career+' : 'Premium'}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-ink my-2">AI Mock <em className="not-italic bg-gradient-to-br from-gold to-gold-light bg-clip-text text-transparent">Interview</em></h1>
                            <p className="text-[15px] text-ink-40">Choose an interview mode and practice with AI-powered feedback.</p>
                            <div className="flex items-center justify-center gap-3 flex-wrap mt-4 px-5 py-3 bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl text-[13px] text-ink-60">
                                {plan === 'career_plus' ? (
                                    <><span className="font-bold text-gold text-[15px]">{20 - (profile?.mock_sessions_used || 0)}</span> of 20 sessions remaining</>
                                ) : (
                                    <><span className="font-bold text-gold text-[15px]">{3 - (profile?.mock_sessions_used || 0)}</span> sessions remaining this month</>
                                )}
                                {practiceHistory.length > 0 && (
                                    <button className="bg-[var(--bg)] border border-ink-10 text-ink-60 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all hover:border-gold hover:text-gold" onClick={() => setShowHistory(!showHistory)}>
                                        📊 {showHistory ? 'Hide' : 'View'} History ({practiceHistory.length})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Practice History */}
                        {showHistory && practiceHistory.length > 0 && (
                            <div className="mb-8">
                                <div className="text-sm font-bold text-ink mb-3">Practice History</div>
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
                                    {practiceHistory.map((entry) => {
                                        const typeData = (INTERVIEW_TYPES as any)[entry.interview_type]
                                        return (
                                            <div key={entry.id} className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl p-4 transition-colors hover:border-gold">
                                                <div className="flex items-center gap-2.5 mb-2.5">
                                                    <span className="text-2xl">{typeData?.icon || '🎯'}</span>
                                                    <div>
                                                        <div className="text-[13px] font-bold text-ink">{typeData?.name || entry.interview_type}</div>
                                                        <div className="text-[11px] text-ink-40">{entry.role} · {entry.difficulty}</div>
                                                    </div>
                                                    <div className={`ml-auto w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-extrabold text-white ${scoreColor(entry.overall_score)}`}>
                                                        {entry.overall_score}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2.5 flex-wrap text-[11px] text-ink-40 mb-1.5">
                                                    <span>🎯 Clarity: {entry.clarity_avg}/10</span>
                                                    <span>💪 Confidence: {entry.confidence_avg}/10</span>
                                                    <span>🔑 Keywords: {entry.keyword_relevance_avg}/10</span>
                                                </div>
                                                <div className="text-[11px] text-ink-20">
                                                    {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    {' · '}{entry.question_count} questions
                                                    {entry.star_usage_rate !== 'N/A' && ` · STAR: ${entry.star_usage_rate}`}
                                                </div>
                                                {entry.verdict && <div className="text-xs text-ink-60 mt-1.5 italic">{entry.verdict}</div>}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 mb-8">
                            {Object.entries(INTERVIEW_TYPES).map(([id, type]) => (
                                <div key={id} className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-6 cursor-pointer transition-all text-left hover:border-gold hover:-translate-y-0.5 hover:shadow-xl" onClick={() => handleTypeSelect(id)}>
                                    <span className="text-[32px] mb-3 block">{type.icon}</span>
                                    <div className="font-bold text-base text-ink mb-1.5">{type.name}</div>
                                    <div className="text-[13px] text-ink-40 leading-relaxed">{type.description}</div>
                                    <div className="mt-2.5 text-[11px] text-ink-20 uppercase tracking-wide font-semibold">{type.defaultQuestions} questions</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ── CONFIGURE ───────────────────────────── */}
                {phase === 'configure' && typeInfo && (
                    <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-8 mb-6">
                        <div className="text-lg font-bold text-ink mb-1">{typeInfo.icon} {typeInfo.name}</div>
                        <div className="text-[13px] text-ink-40 mb-6">{typeInfo.description}</div>

                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5 mb-6">
                            <div>
                                <label className="block text-xs font-semibold text-ink-60 mb-1.5 uppercase tracking-wide">Target Role</label>
                                <select className="w-full px-3.5 py-2.5 border border-ink-10 rounded-xl bg-[var(--bg)] text-ink text-sm" value={config.role} onChange={e => setConfig(prev => ({ ...prev, role: e.target.value }))}>
                                    <option value="">Select a role…</option>
                                    {MOCK_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-ink-60 mb-1.5 uppercase tracking-wide">Questions</label>
                                <select className="w-full px-3.5 py-2.5 border border-ink-10 rounded-xl bg-[var(--bg)] text-ink text-sm" value={config.questionCount} onChange={e => setConfig(prev => ({ ...prev, questionCount: Number(e.target.value) }))}>
                                    {[3, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-ink-60 mb-1.5 uppercase tracking-wide">Difficulty</label>
                            <div className="flex gap-2">
                                {(['easy', 'medium', 'hard'] as const).map(d => (
                                    <button key={d} className={`px-4 py-2 rounded-lg border text-[13px] cursor-pointer transition-all ${config.difficulty === d ? 'bg-gradient-to-br from-gold to-gold-light text-black border-gold font-semibold' : 'border-ink-10 bg-[var(--bg)] text-ink-60 hover:border-gold'}`} onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}>
                                        {d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="btn btn-gold" onClick={handleStart} disabled={!config.role}>Start Interview →</button>
                            <button className="btn btn-ghost" onClick={() => setPhase('select')}>← Back</button>
                        </div>
                    </div>
                )}

                {/* ── ACTIVE INTERVIEW ────────────────────── */}
                {phase === 'interview' && (
                    <div className="max-w-[740px] mx-auto">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="flex-1 h-1.5 bg-ink-10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-400" style={{ width: `${((currentIndex + (currentEvaluation ? 1 : 0)) / config.questionCount) * 100}%` }} />
                            </div>
                            <span className="text-xs text-ink-40 font-semibold whitespace-nowrap">{currentIndex + 1} / {config.questionCount}</span>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4 text-red-500 text-sm">
                                {error.includes('MOCK_LIMIT') ? (
                                    <>You've reached your session limit. <Link to="/pricing" className="text-gold">Upgrade your plan</Link></>
                                ) : error}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex items-center gap-3 p-5 bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl mb-5 text-ink-60 text-sm">
                                <div className="spinner" style={{ width: 18, height: 18 }} />
                                {loadingText}
                            </div>
                        )}

                        {!isLoading && currentQuestion && (
                            <>
                                <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-7 mb-5">
                                    <div className="text-[11px] uppercase tracking-wide font-bold text-gold mb-2.5">{typeInfo?.icon} Question {currentIndex + 1}</div>
                                    <div className="text-[17px] font-semibold text-ink leading-relaxed">{currentQuestion}</div>
                                </div>

                                {/* Answer input */}
                                {!currentEvaluation && (
                                    <div className="mb-5">
                                        <textarea
                                            className="w-full min-h-[150px] p-4 border border-ink-10 rounded-xl bg-white dark:bg-[var(--surface)] text-ink text-sm leading-relaxed resize-y transition-colors focus:outline-none focus:border-gold"
                                            placeholder={config.type === 'salary' ? 'Type your negotiation response…' : 'Type your answer here… Be specific and use examples where possible.'}
                                            value={currentAnswer}
                                            onChange={e => setCurrentAnswer(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <div className="flex gap-2.5 mt-3">
                                            <button className="btn btn-gold" onClick={handleSubmitAnswer} disabled={!currentAnswer.trim() || isLoading}>Submit Answer</button>
                                            <button className="btn btn-ghost btn-sm" onClick={handleReset}>End Interview</button>
                                        </div>
                                        <div className="text-xs text-ink-20 mt-2">
                                            {config.type === 'behavioral' && '💡 Tip: Use the STAR method (Situation → Task → Action → Result)'}
                                            {config.type === 'system_design' && '💡 Tip: Start with requirements, then high-level design, then deep-dive'}
                                            {config.type === 'technical' && '💡 Tip: Explain your thought process, not just the solution'}
                                            {config.type === 'salary' && '💡 Tip: Back your ask with market data and specific achievements'}
                                        </div>
                                    </div>
                                )}

                                {/* Evaluation with enhanced metrics */}
                                {currentEvaluation && (
                                    <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-6 mb-5 animate-[slideUp_0.3s_ease]">
                                        {/* Score header */}
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[22px] font-extrabold text-white shrink-0 ${scoreColor(currentEvaluation.score)}`}>
                                                {currentEvaluation.score}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-ink">
                                                    {currentEvaluation.score >= 8 ? 'Excellent answer!' :
                                                        currentEvaluation.score >= 6 ? 'Good answer' :
                                                            currentEvaluation.score >= 4 ? 'Needs improvement' : 'Weak answer'}
                                                </div>
                                                <div className="text-xs text-ink-40 mt-0.5">Overall: {currentEvaluation.score}/10</div>
                                            </div>
                                        </div>

                                        {/* Metric gauges */}
                                        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 mb-4">
                                            <ScoreGauge label="🎯 Clarity" value={currentEvaluation.clarity_score} />
                                            <ScoreGauge label="💪 Confidence" value={currentEvaluation.confidence_score} />
                                            <ScoreGauge label="🔑 Keywords" value={currentEvaluation.keyword_relevance} />
                                            {currentEvaluation.technical_accuracy !== undefined && (
                                                <ScoreGauge label="⚙️ Tech Accuracy" value={currentEvaluation.technical_accuracy} />
                                            )}
                                        </div>

                                        {/* STAR Detection */}
                                        {currentEvaluation.star_detected && currentEvaluation.star_breakdown && (
                                            <div className="mb-4">
                                                <div className="text-xs font-bold text-gold mb-2">⭐ STAR Structure Detected</div>
                                                <div className="grid grid-cols-4 gap-2 mb-4">
                                                    {Object.entries(currentEvaluation.star_breakdown).map(([key, val]) => (
                                                        <div key={key} className="text-center py-2.5 px-1.5 bg-[var(--bg)] rounded-lg border border-ink-10">
                                                            <div className="text-lg font-extrabold text-gold">{key[0].toUpperCase()}</div>
                                                            <div className="text-xs text-ink-40 mt-0.5">{val}/10</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {currentEvaluation.star_detected === false && config.type === 'behavioral' && (
                                            <div className="px-3.5 py-2.5 bg-amber-500/[0.08] border border-amber-500/20 rounded-lg text-xs text-amber-500 mb-4">
                                                ⚠️ No STAR structure detected. Try structuring with Situation → Task → Action → Result.
                                            </div>
                                        )}

                                        {/* Keywords */}
                                        {(currentEvaluation.keywords_found?.length > 0 || currentEvaluation.keywords_missing?.length > 0) && (
                                            <div className="mb-4 p-3 bg-[var(--bg)] rounded-xl border border-ink-10">
                                                {currentEvaluation.keywords_found?.length > 0 && (
                                                    <div className="mb-2 last:mb-0">
                                                        <span className="block text-[11px] font-semibold text-green-500 mb-1">✅ Keywords used:</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {currentEvaluation.keywords_found.map((k, i) => (
                                                                <span key={i} className="inline-block px-2 py-0.5 rounded text-[11px] bg-green-500/10 text-green-500 border border-green-500/20">{k}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {currentEvaluation.keywords_missing?.length > 0 && (
                                                    <div className="mb-2 last:mb-0">
                                                        <span className="block text-[11px] font-semibold text-amber-500 mb-1">⚠️ Missing keywords:</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {currentEvaluation.keywords_missing.map((k, i) => (
                                                                <span key={i} className="inline-block px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-500 border border-amber-500/20">{k}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Strengths & Improvements */}
                                        {currentEvaluation.strengths?.length > 0 && (
                                            <div className="mb-4">
                                                <div className="text-xs uppercase tracking-wide font-bold text-green-500 mb-2">Strengths</div>
                                                <ul className="list-none p-0 m-0">
                                                    {currentEvaluation.strengths.map((s, i) => <li key={i} className="text-[13px] text-ink-60 py-1 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-ink-20">{s}</li>)}
                                                </ul>
                                            </div>
                                        )}

                                        {currentEvaluation.improvements?.length > 0 && (
                                            <div className="mb-4">
                                                <div className="text-xs uppercase tracking-wide font-bold text-amber-500 mb-2">Areas to Improve</div>
                                                <ul className="list-none p-0 m-0">
                                                    {currentEvaluation.improvements.map((s, i) => <li key={i} className="text-[13px] text-ink-60 py-1 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-ink-20">{s}</li>)}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Improved answer */}
                                        {currentEvaluation.improved_answer && (
                                            <div className="mt-4 p-3.5 bg-gradient-to-br from-gold/[0.06] to-gold/[0.02] rounded-xl border border-gold/20">
                                                <div className="text-[11px] uppercase tracking-wide font-bold text-gold mb-1.5">✨ Suggested Improved Answer</div>
                                                <div className="text-[13px] text-ink-60 leading-relaxed">{currentEvaluation.improved_answer}</div>
                                            </div>
                                        )}

                                        {/* Ideal answer */}
                                        {currentEvaluation.sample_answer && (
                                            <div className="mt-3 p-3.5 bg-[var(--bg)] rounded-xl border border-ink-10">
                                                <div className="text-[11px] uppercase tracking-wide font-bold text-ink-40 mb-1.5">💎 Ideal Answer</div>
                                                <div className="text-[13px] text-ink-60 leading-relaxed">{currentEvaluation.sample_answer}</div>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <button className="btn btn-gold" onClick={handleNext}>
                                                {currentIndex + 1 >= config.questionCount ? 'Finish Interview →' : 'Next Question →'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ── SUMMARY ─────────────────────────────── */}
                {phase === 'summary' && summary && (
                    <div className="max-w-[700px] mx-auto">
                        <div className="text-center mb-8">
                            <div className={`w-[100px] h-[100px] rounded-full mx-auto mb-4 flex items-center justify-center text-[38px] font-extrabold text-white ${scoreColor(summary.overall_score)}`}>
                                {summary.overall_score}
                            </div>
                            <div className="text-lg font-bold text-ink mb-1">{summary.verdict}</div>
                            <div className="text-[13px] text-ink-40">{typeInfo?.icon} {typeInfo?.name} · {config.role} · {config.difficulty}</div>
                        </div>

                        {isLoading && (
                            <div className="flex items-center gap-3 p-5 bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl mb-5 text-ink-60 text-sm">
                                <div className="spinner" style={{ width: 18, height: 18 }} />
                                {loadingText}
                            </div>
                        )}

                        {/* Summary metrics */}
                        <div className="flex justify-center gap-6 mb-7 flex-wrap">
                            {[
                                { value: summary.clarity_avg, label: 'Clarity' },
                                { value: summary.confidence_avg, label: 'Confidence' },
                                { value: summary.keyword_relevance_avg, label: 'Keywords' },
                            ].map(m => (
                                <div key={m.label} className="text-center px-5 py-3.5 bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl min-w-[90px]">
                                    <div className="text-2xl font-extrabold text-gold">{m.value}</div>
                                    <div className="text-[11px] text-ink-40 uppercase tracking-wide mt-0.5">{m.label}</div>
                                </div>
                            ))}
                            {summary.star_usage_rate !== 'N/A' && (
                                <div className="text-center px-5 py-3.5 bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl min-w-[90px]">
                                    <div className="text-base font-extrabold text-gold">{summary.star_usage_rate}</div>
                                    <div className="text-[11px] text-ink-40 uppercase tracking-wide mt-0.5">STAR Usage</div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-6">
                            <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl p-5">
                                <div className="text-xs uppercase tracking-wide font-bold text-green-500 mb-2">Top Strengths</div>
                                <ul className="list-none p-0 m-0">
                                    {summary.top_strengths.map((s, i) => <li key={i} className="text-[13px] text-ink-60 py-1 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-ink-20">{s}</li>)}
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl p-5">
                                <div className="text-xs uppercase tracking-wide font-bold text-amber-500 mb-2">Areas to Improve</div>
                                <ul className="list-none p-0 m-0">
                                    {summary.areas_to_improve.map((s, i) => <li key={i} className="text-[13px] text-ink-60 py-1 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-ink-20">{s}</li>)}
                                </ul>
                            </div>
                        </div>

                        {summary.final_offer && (
                            <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl p-5 mb-4">
                                <h4 className="text-sm font-bold text-ink mb-2">💰 Estimated Final Offer</h4>
                                <p className="text-[13px] text-ink-60 leading-relaxed">{summary.final_offer}</p>
                            </div>
                        )}

                        <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl p-5 mb-6">
                            <h4 className="text-sm font-bold text-ink mb-2">📋 Recommendation</h4>
                            <p className="text-[13px] text-ink-60 leading-relaxed">{summary.recommendation}</p>
                        </div>

                        {/* Q&A Review */}
                        <div className="mb-8">
                            <div className="text-sm font-bold text-ink mb-3">Question-by-Question Review</div>
                            {questions.map((q, i) => (
                                <div key={i} className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-xl mb-2 overflow-hidden">
                                    <div className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors hover:bg-ink-05" onClick={() => setExpandedReview(expandedReview === i ? null : i)}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0 ${scoreColor(q.evaluation?.score || 0)}`}>
                                            {q.evaluation?.score || '—'}
                                        </div>
                                        <div className="flex-1 text-[13px] font-medium text-ink truncate">Q{i + 1}: {q.question.slice(0, 80)}{q.question.length > 80 ? '…' : ''}</div>
                                        <div>
                                            {q.evaluation && (
                                                <span className="text-[11px] text-ink-40">
                                                    C:{q.evaluation.clarity_score} · K:{q.evaluation.keyword_relevance}
                                                    {q.evaluation.star_detected && ' · ⭐'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {expandedReview === i && q.evaluation && (
                                        <div className="px-5 py-4 border-t border-ink-10 text-[13px] text-ink-60 leading-relaxed">
                                            <p><strong>Your answer:</strong> {q.answer}</p>
                                            {q.evaluation.improved_answer && (
                                                <p className="mt-2 text-gold"><strong>✨ Improved:</strong> {q.evaluation.improved_answer}</p>
                                            )}
                                            {q.evaluation.sample_answer && (
                                                <p className="mt-2"><strong>💎 Ideal:</strong> {q.evaluation.sample_answer}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button className="btn btn-gold" onClick={handleReset}>Start New Interview</button>
                            <Link to="/dashboard" className="btn btn-ghost">Back to Dashboard</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
