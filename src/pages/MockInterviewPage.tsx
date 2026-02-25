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
import styles from './MockInterviewPage.module.css'

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
            <div className={styles.page}>
                <Navbar />
                <div className={styles.gate}>
                    <div className={styles.gateIcon}>🤖</div>
                    <h1>AI Mock Interview</h1>
                    <p>Practice with an AI interviewer that adapts to your role, evaluates your answers in real-time, and gives actionable feedback.</p>
                    <div className={styles.gatePlans}>
                        <div className={styles.gatePlan}>
                            <strong>Premium — $24.99/mo</strong>
                            <span>3 mock interviews/month</span>
                        </div>
                        <div className={styles.gatePlan}>
                            <strong>Career+ — $34.99/mo</strong>
                            <span>20 mock interviews/month + JD match</span>
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

    const scoreClass = (score: number) =>
        score >= 8 ? styles.scoreHigh : score >= 5 ? styles.scoreMedium : styles.scoreLow

    const typeInfo = (INTERVIEW_TYPES as any)[config.type]

    const ScoreGauge = ({ label, value, max = 10 }: { label: string; value: number; max?: number }) => (
        <div className={styles.gauge}>
            <div className={styles.gaugeBar}>
                <div
                    className={`${styles.gaugeFill} ${value >= 8 ? styles.gaugeGreen : value >= 5 ? styles.gaugeGold : styles.gaugeRed}`}
                    style={{ width: `${(value / max) * 100}%` }}
                />
            </div>
            <div className={styles.gaugeLabel}>
                <span>{label}</span>
                <span className={styles.gaugeValue}>{value}/{max}</span>
            </div>
        </div>
    )

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>

                {/* ── SELECT TYPE ─────────────────────────── */}
                {phase === 'select' && (
                    <>
                        <div className={styles.header}>
                            <div className={styles.headerBadge}>
                                <span className="badge badge-gold">{plan === 'career_plus' ? 'Career+' : 'Premium'}</span>
                            </div>
                            <h1>AI Mock <em>Interview</em></h1>
                            <p>Choose an interview mode and practice with AI-powered feedback.</p>
                            <div className={styles.usageBar}>
                                {plan === 'career_plus' ? (
                                    <><span className={styles.usageCount}>{20 - (profile?.mock_sessions_used || 0)}</span> of 20 sessions remaining</>
                                ) : (
                                    <><span className={styles.usageCount}>{3 - (profile?.mock_sessions_used || 0)}</span> sessions remaining this month</>
                                )}
                                {practiceHistory.length > 0 && (
                                    <button className={styles.historyBtn} onClick={() => setShowHistory(!showHistory)}>
                                        📊 {showHistory ? 'Hide' : 'View'} History ({practiceHistory.length})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Practice History */}
                        {showHistory && practiceHistory.length > 0 && (
                            <div className={styles.historySection}>
                                <div className={styles.historyTitle}>Practice History</div>
                                <div className={styles.historyGrid}>
                                    {practiceHistory.map((entry) => {
                                        const typeData = (INTERVIEW_TYPES as any)[entry.interview_type]
                                        return (
                                            <div key={entry.id} className={styles.historyCard}>
                                                <div className={styles.historyCardHeader}>
                                                    <span className={styles.historyCardIcon}>{typeData?.icon || '🎯'}</span>
                                                    <div>
                                                        <div className={styles.historyCardType}>{typeData?.name || entry.interview_type}</div>
                                                        <div className={styles.historyCardRole}>{entry.role} · {entry.difficulty}</div>
                                                    </div>
                                                    <div className={`${styles.historyCardScore} ${scoreClass(entry.overall_score)}`}>
                                                        {entry.overall_score}
                                                    </div>
                                                </div>
                                                <div className={styles.historyCardMetrics}>
                                                    <span>🎯 Clarity: {entry.clarity_avg}/10</span>
                                                    <span>💪 Confidence: {entry.confidence_avg}/10</span>
                                                    <span>🔑 Keywords: {entry.keyword_relevance_avg}/10</span>
                                                </div>
                                                <div className={styles.historyCardDate}>
                                                    {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    {' · '}{entry.question_count} questions
                                                    {entry.star_usage_rate !== 'N/A' && ` · STAR: ${entry.star_usage_rate}`}
                                                </div>
                                                {entry.verdict && <div className={styles.historyCardVerdict}>{entry.verdict}</div>}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className={styles.typeGrid}>
                            {Object.entries(INTERVIEW_TYPES).map(([id, type]) => (
                                <div key={id} className={styles.typeCard} onClick={() => handleTypeSelect(id)}>
                                    <span className={styles.typeCardIcon}>{type.icon}</span>
                                    <div className={styles.typeCardName}>{type.name}</div>
                                    <div className={styles.typeCardDesc}>{type.description}</div>
                                    <div className={styles.typeCardQuestions}>{type.defaultQuestions} questions</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ── CONFIGURE ───────────────────────────── */}
                {phase === 'configure' && typeInfo && (
                    <div className={styles.configPanel}>
                        <div className={styles.configTitle}>{typeInfo.icon} {typeInfo.name}</div>
                        <div className={styles.configSubtitle}>{typeInfo.description}</div>

                        <div className={styles.configGrid}>
                            <div className={styles.configField}>
                                <label>Target Role</label>
                                <select
                                    value={config.role}
                                    onChange={e => setConfig(prev => ({ ...prev, role: e.target.value }))}
                                >
                                    <option value="">Select a role…</option>
                                    {MOCK_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className={styles.configField}>
                                <label>Questions</label>
                                <select
                                    value={config.questionCount}
                                    onChange={e => setConfig(prev => ({ ...prev, questionCount: Number(e.target.value) }))}
                                >
                                    {[3, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
                                </select>
                            </div>
                        </div>

                        <div className={styles.configField} style={{ marginBottom: 24 }}>
                            <label>Difficulty</label>
                            <div className={styles.difficultyChips}>
                                {(['easy', 'medium', 'hard'] as const).map(d => (
                                    <button
                                        key={d}
                                        className={`${styles.difficultyChip} ${config.difficulty === d ? styles.difficultyChipActive : ''}`}
                                        onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}
                                    >
                                        {d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.configActions}>
                            <button className="btn btn-gold" onClick={handleStart} disabled={!config.role}>
                                Start Interview →
                            </button>
                            <button className="btn btn-ghost" onClick={() => setPhase('select')}>
                                ← Back
                            </button>
                        </div>
                    </div>
                )}

                {/* ── ACTIVE INTERVIEW ────────────────────── */}
                {phase === 'interview' && (
                    <div className={styles.interviewContainer}>
                        <div className={styles.progressBar}>
                            <div className={styles.progressTrack}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${((currentIndex + (currentEvaluation ? 1 : 0)) / config.questionCount) * 100}%` }}
                                />
                            </div>
                            <span className={styles.progressLabel}>
                                {currentIndex + 1} / {config.questionCount}
                            </span>
                        </div>

                        {error && (
                            <div style={{ padding: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 16, color: '#ef4444', fontSize: 14 }}>
                                {error.includes('MOCK_LIMIT') ? (
                                    <>You've reached your session limit. <Link to="/pricing" style={{ color: 'var(--gold)' }}>Upgrade your plan</Link></>
                                ) : error}
                            </div>
                        )}

                        {isLoading && (
                            <div className={styles.aiThinking}>
                                <div className="spinner" style={{ width: 18, height: 18 }} />
                                {loadingText}
                            </div>
                        )}

                        {!isLoading && currentQuestion && (
                            <>
                                <div className={styles.questionCard}>
                                    <div className={styles.questionLabel}>
                                        {typeInfo?.icon} Question {currentIndex + 1}
                                    </div>
                                    <div className={styles.questionText}>{currentQuestion}</div>
                                </div>

                                {/* Answer input */}
                                {!currentEvaluation && (
                                    <div className={styles.answerSection}>
                                        <textarea
                                            className={styles.answerTextarea}
                                            placeholder={config.type === 'salary'
                                                ? 'Type your negotiation response…'
                                                : 'Type your answer here… Be specific and use examples where possible.'}
                                            value={currentAnswer}
                                            onChange={e => setCurrentAnswer(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <div className={styles.answerActions}>
                                            <button
                                                className="btn btn-gold"
                                                onClick={handleSubmitAnswer}
                                                disabled={!currentAnswer.trim() || isLoading}
                                            >
                                                Submit Answer
                                            </button>
                                            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                                                End Interview
                                            </button>
                                        </div>
                                        <div className={styles.answerHint}>
                                            {config.type === 'behavioral' && '💡 Tip: Use the STAR method (Situation → Task → Action → Result)'}
                                            {config.type === 'system_design' && '💡 Tip: Start with requirements, then high-level design, then deep-dive'}
                                            {config.type === 'technical' && '💡 Tip: Explain your thought process, not just the solution'}
                                            {config.type === 'salary' && '💡 Tip: Back your ask with market data and specific achievements'}
                                        </div>
                                    </div>
                                )}

                                {/* Evaluation with enhanced metrics */}
                                {currentEvaluation && (
                                    <div className={styles.evaluationCard}>
                                        {/* Score header */}
                                        <div className={styles.scoreRow}>
                                            <div className={`${styles.scoreCircle} ${scoreClass(currentEvaluation.score)}`}>
                                                {currentEvaluation.score}
                                            </div>
                                            <div>
                                                <div className={styles.scoreLabel}>
                                                    {currentEvaluation.score >= 8 ? 'Excellent answer!' :
                                                        currentEvaluation.score >= 6 ? 'Good answer' :
                                                            currentEvaluation.score >= 4 ? 'Needs improvement' : 'Weak answer'}
                                                </div>
                                                <div className={styles.scoreSubLabel}>Overall: {currentEvaluation.score}/10</div>
                                            </div>
                                        </div>

                                        {/* Metric gauges */}
                                        <div className={styles.metricsGrid}>
                                            <ScoreGauge label="🎯 Clarity" value={currentEvaluation.clarity_score} />
                                            <ScoreGauge label="💪 Confidence" value={currentEvaluation.confidence_score} />
                                            <ScoreGauge label="🔑 Keywords" value={currentEvaluation.keyword_relevance} />
                                            {currentEvaluation.technical_accuracy !== undefined && (
                                                <ScoreGauge label="⚙️ Tech Accuracy" value={currentEvaluation.technical_accuracy} />
                                            )}
                                        </div>

                                        {/* STAR Detection */}
                                        {currentEvaluation.star_detected && currentEvaluation.star_breakdown && (
                                            <div className={styles.starSection}>
                                                <div className={styles.starLabel}>⭐ STAR Structure Detected</div>
                                                <div className={styles.starBreakdown}>
                                                    {Object.entries(currentEvaluation.star_breakdown).map(([key, val]) => (
                                                        <div key={key} className={styles.starItem}>
                                                            <div className={styles.starItemLetter}>{key[0].toUpperCase()}</div>
                                                            <div className={styles.starItemScore}>{val}/10</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {currentEvaluation.star_detected === false && config.type === 'behavioral' && (
                                            <div className={styles.starMissing}>
                                                ⚠️ No STAR structure detected. Try structuring with Situation → Task → Action → Result.
                                            </div>
                                        )}

                                        {/* Keywords */}
                                        {(currentEvaluation.keywords_found?.length > 0 || currentEvaluation.keywords_missing?.length > 0) && (
                                            <div className={styles.keywordsSection}>
                                                {currentEvaluation.keywords_found?.length > 0 && (
                                                    <div className={styles.keywordRow}>
                                                        <span className={styles.keywordLabel}>✅ Keywords used:</span>
                                                        <div className={styles.keywordTags}>
                                                            {currentEvaluation.keywords_found.map((k, i) => (
                                                                <span key={i} className={styles.keywordTag}>{k}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {currentEvaluation.keywords_missing?.length > 0 && (
                                                    <div className={styles.keywordRow}>
                                                        <span className={styles.keywordLabelMissing}>⚠️ Missing keywords:</span>
                                                        <div className={styles.keywordTags}>
                                                            {currentEvaluation.keywords_missing.map((k, i) => (
                                                                <span key={i} className={`${styles.keywordTag} ${styles.keywordTagMissing}`}>{k}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Strengths & Improvements */}
                                        {currentEvaluation.strengths?.length > 0 && (
                                            <div className={styles.feedbackSection}>
                                                <div className={`${styles.feedbackTitle} ${styles.strengths}`}>Strengths</div>
                                                <ul className={styles.feedbackList}>
                                                    {currentEvaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                        )}

                                        {currentEvaluation.improvements?.length > 0 && (
                                            <div className={styles.feedbackSection}>
                                                <div className={`${styles.feedbackTitle} ${styles.improvements}`}>Areas to Improve</div>
                                                <ul className={styles.feedbackList}>
                                                    {currentEvaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Improved answer */}
                                        {currentEvaluation.improved_answer && (
                                            <div className={styles.improvedAnswer}>
                                                <div className={styles.improvedAnswerLabel}>✨ Suggested Improved Answer</div>
                                                <div className={styles.improvedAnswerText}>{currentEvaluation.improved_answer}</div>
                                            </div>
                                        )}

                                        {/* Ideal answer */}
                                        {currentEvaluation.sample_answer && (
                                            <div className={styles.sampleAnswer}>
                                                <div className={styles.sampleAnswerLabel}>💎 Ideal Answer</div>
                                                <div className={styles.sampleAnswerText}>{currentEvaluation.sample_answer}</div>
                                            </div>
                                        )}

                                        <div style={{ marginTop: 16 }}>
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
                    <div className={styles.summaryPage}>
                        <div className={styles.summaryHeader}>
                            <div className={`${styles.summaryScore} ${scoreClass(summary.overall_score)}`}>
                                {summary.overall_score}
                            </div>
                            <div className={styles.summaryVerdict}>{summary.verdict}</div>
                            <div className={styles.summaryMeta}>
                                {typeInfo?.icon} {typeInfo?.name} · {config.role} · {config.difficulty}
                            </div>
                        </div>

                        {isLoading && (
                            <div className={styles.aiThinking}>
                                <div className="spinner" style={{ width: 18, height: 18 }} />
                                {loadingText}
                            </div>
                        )}

                        {/* Summary metrics */}
                        <div className={styles.summaryMetrics}>
                            <div className={styles.summaryMetric}>
                                <div className={styles.summaryMetricValue}>{summary.clarity_avg}</div>
                                <div className={styles.summaryMetricLabel}>Clarity</div>
                            </div>
                            <div className={styles.summaryMetric}>
                                <div className={styles.summaryMetricValue}>{summary.confidence_avg}</div>
                                <div className={styles.summaryMetricLabel}>Confidence</div>
                            </div>
                            <div className={styles.summaryMetric}>
                                <div className={styles.summaryMetricValue}>{summary.keyword_relevance_avg}</div>
                                <div className={styles.summaryMetricLabel}>Keywords</div>
                            </div>
                            {summary.star_usage_rate !== 'N/A' && (
                                <div className={styles.summaryMetric}>
                                    <div className={styles.summaryMetricValue} style={{ fontSize: 16 }}>{summary.star_usage_rate}</div>
                                    <div className={styles.summaryMetricLabel}>STAR Usage</div>
                                </div>
                            )}
                        </div>

                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryCard}>
                                <div className={`${styles.summaryCardTitle} ${styles.green}`}>Top Strengths</div>
                                <ul className={`${styles.summaryCardList} ${styles.strengths}`}>
                                    {summary.top_strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div className={styles.summaryCard}>
                                <div className={`${styles.summaryCardTitle} ${styles.amber}`}>Areas to Improve</div>
                                <ul className={`${styles.summaryCardList} ${styles.improvements}`}>
                                    {summary.areas_to_improve.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        </div>

                        {summary.final_offer && (
                            <div className={styles.recommendationCard}>
                                <h4>💰 Estimated Final Offer</h4>
                                <p>{summary.final_offer}</p>
                            </div>
                        )}

                        <div className={styles.recommendationCard}>
                            <h4>📋 Recommendation</h4>
                            <p>{summary.recommendation}</p>
                        </div>

                        {/* Q&A Review */}
                        <div className={styles.reviewSection}>
                            <div className={styles.reviewTitle}>Question-by-Question Review</div>
                            {questions.map((q, i) => (
                                <div key={i} className={styles.reviewItem}>
                                    <div
                                        className={styles.reviewItemHeader}
                                        onClick={() => setExpandedReview(expandedReview === i ? null : i)}
                                    >
                                        <div className={`${styles.reviewItemScore} ${scoreClass(q.evaluation?.score || 0)}`}>
                                            {q.evaluation?.score || '—'}
                                        </div>
                                        <div className={styles.reviewItemQuestion}>
                                            Q{i + 1}: {q.question.slice(0, 80)}{q.question.length > 80 ? '…' : ''}
                                        </div>
                                        <div className={styles.reviewItemMeta}>
                                            {q.evaluation && (
                                                <span style={{ fontSize: 11, color: 'var(--ink-40)' }}>
                                                    C:{q.evaluation.clarity_score} · K:{q.evaluation.keyword_relevance}
                                                    {q.evaluation.star_detected && ' · ⭐'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {expandedReview === i && q.evaluation && (
                                        <div className={styles.reviewItemBody}>
                                            <p><strong>Your answer:</strong> {q.answer}</p>
                                            {q.evaluation.improved_answer && (
                                                <p style={{ marginTop: 8, color: 'var(--gold)' }}><strong>✨ Improved:</strong> {q.evaluation.improved_answer}</p>
                                            )}
                                            {q.evaluation.sample_answer && (
                                                <p style={{ marginTop: 8 }}><strong>💎 Ideal:</strong> {q.evaluation.sample_answer}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={styles.summaryActions}>
                            <button className="btn btn-gold" onClick={handleReset}>
                                Start New Interview
                            </button>
                            <Link to="/dashboard" className="btn btn-ghost">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
