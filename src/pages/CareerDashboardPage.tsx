import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../lib/store'
import { useSEO } from '../lib/useSEO'
import { getPracticeHistory, PracticeHistoryEntry } from '../lib/ai'
import { getResumeScore } from '../lib/resumeScore'
import { LandingIcon } from '../components/LandingIcons'
import { getSessionsDisplay } from '../lib/mockPack'

// ── Mini chart: sparkline bar chart ──────────────────
function SparklineChart({ data, color = 'var(--gold)', height = 60 }: { data: number[]; color?: string; height?: number }) {
    if (data.length === 0) return null
    const max = Math.max(...data, 10)
    const barWidth = Math.min(28, Math.max(8, Math.floor(280 / data.length)))
    const gap = 3
    const totalWidth = data.length * (barWidth + gap) - gap
    return (
        <svg width={totalWidth} height={height} viewBox={`0 0 ${totalWidth} ${height}`} style={{ display: 'block' }}>
            {data.map((v, i) => {
                const barH = Math.max(2, (v / max) * (height - 4))
                return (
                    <rect
                        key={i}
                        x={i * (barWidth + gap)}
                        y={height - barH}
                        width={barWidth}
                        height={barH}
                        rx={3}
                        fill={color}
                        opacity={0.3 + (i / data.length) * 0.7}
                    />
                )
            })}
        </svg>
    )
}

// ── Score trend line ─────────────────────────────────
function TrendLine({ data, color = 'var(--gold)', width = 280, height = 60 }: { data: number[]; color?: string; width?: number; height?: number }) {
    if (data.length < 2) return null
    const max = Math.max(...data, 10)
    const min = Math.min(...data, 0)
    const range = max - min || 1
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * (width - 20) + 10
        const y = height - 10 - ((v - min) / range) * (height - 20)
        return `${x},${y}`
    })
    const areaPoints = [
        `10,${height - 5}`,
        ...points,
        `${width - 10},${height - 5}`,
    ]
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
            <defs>
                <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints.join(' ')} fill="url(#trendGrad)" />
            <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((v, i) => {
                const x = (i / (data.length - 1)) * (width - 20) + 10
                const y = height - 10 - ((v - min) / range) * (height - 20)
                return <circle key={i} cx={x} cy={y} r={3.5} fill="white" stroke={color} strokeWidth={2} />
            })}
        </svg>
    )
}

// ── Stat card ────────────────────────────────────────
function StatCard({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon: string; color?: string }) {
    return (
        <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2.5 mb-3">
                <span className="text-gold"><LandingIcon name={icon} size={20} /></span>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-ink-30">{label}</span>
            </div>
            <div className="text-[32px] font-extrabold leading-none" style={{ color: color || 'var(--ink)' }}>{value}</div>
            {sub && <div className="text-[12px] text-ink-40 mt-1.5">{sub}</div>}
        </div>
    )
}

export default function CareerDashboardPage() {
    const { profile, resumes } = useStore()
    const navigate = useNavigate()
    const plan = profile?.plan || 'free'
    const isCareerPlus = plan === 'career_plus'

    const [history, setHistory] = useState<PracticeHistoryEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'interview' | 'resume'>('interview')

    useSEO({
        title: 'Career Intelligence Dashboard',
        description: 'Track your interview performance and resume improvement over time.',
        path: '/tools/career-dashboard',
        noindex: true,
    })

    // Gate: Career+ only
    useEffect(() => {
        if (!isCareerPlus && plan !== 'premium') {
            navigate('/pricing')
        }
    }, [isCareerPlus, plan, navigate])

    // Load interview history
    useEffect(() => {
        if (isCareerPlus) {
            setLoading(true)
            getPracticeHistory()
                .then(setHistory)
                .catch(() => { })
                .finally(() => setLoading(false))
        }
    }, [isCareerPlus])

    // ── Interview stats ────────────────────────────────
    const interviewStats = useMemo(() => {
        if (history.length === 0) return null
        const scores = history.map(h => h.overall_score)
        const clarityScores = history.map(h => h.clarity_avg)
        const confidenceScores = history.map(h => h.confidence_avg)
        const keywordScores = history.map(h => h.keyword_relevance_avg)
        const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10
        const best = Math.max(...scores)
        const latest = scores[0]
        const trend = scores.length >= 2 ? scores[0] - scores[scores.length - 1] : 0

        // Group by interview type
        const byType: Record<string, number[]> = {}
        history.forEach(h => {
            if (!byType[h.interview_type]) byType[h.interview_type] = []
            byType[h.interview_type].push(h.overall_score)
        })

        return {
            total: history.length,
            avgScore: avg(scores),
            bestScore: best,
            latestScore: latest,
            trend,
            avgClarity: avg(clarityScores),
            avgConfidence: avg(confidenceScores),
            avgKeywords: avg(keywordScores),
            scoreHistory: scores.slice().reverse(), // oldest to newest for chart
            clarityHistory: clarityScores.slice().reverse(),
            confidenceHistory: confidenceScores.slice().reverse(),
            byType,
        }
    }, [history])

    // ── Resume score tracking ──────────────────────────
    const resumeStats = useMemo(() => {
        if (resumes.length === 0) return null
        const scored = resumes.map(r => ({
            title: r.title,
            score: getResumeScore(r),
            date: new Date(r.updated_at),
            id: r.id,
        })).sort((a, b) => a.date.getTime() - b.date.getTime())

        const scores = scored.map(s => s.score)
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        const best = Math.max(...scores)
        const worst = Math.min(...scores)

        return { scored, avg, best, worst, scores }
    }, [resumes])

    const scoreColor = (s: number) =>
        s >= 8 ? 'text-green-500' : s >= 5 ? 'text-gold' : 'text-red-500'
    const resumeScoreColor = (s: number) =>
        s > 70 ? '#22c55e' : s > 45 ? '#eab308' : '#ef4444'

    if (!isCareerPlus) {
        // Premium users see a teaser
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-[560px] mx-auto px-10 py-20 text-center">
                    <div className="flex justify-center mb-5 text-gold"><LandingIcon name="trending-up" size={48} /></div>
                    <h1>Career Intelligence <em className="italic text-gold">Dashboard</em></h1>
                    <p className="text-base text-ink-40 mb-8 leading-relaxed">Track your interview performance over time, view score trends, and monitor your resume improvement.</p>
                    <div className="flex flex-col gap-3 text-left mb-10">
                        {['Interview scoring dashboard with trend charts', 'Resume score tracking over time', 'Performance breakdown by interview type', 'Clarity, confidence, and keyword trend analysis'].map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-[var(--white)] border border-ink-10 rounded-xl">
                                <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-[10px] font-bold shrink-0">✦</span>
                                <span className="text-[13px] text-ink-70">{f}</span>
                            </div>
                        ))}
                    </div>
                    <Link to="/pricing" className="btn btn-gold btn-lg">Upgrade to Career+ →</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <Navbar />
            <div className="max-w-[1000px] mx-auto px-6 pt-8 pb-20">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="badge badge-gold">Career+</span>
                        <span className="text-[11px] text-ink-20 uppercase tracking-widest font-semibold">Intelligence Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-bold text-ink mb-1">Career <em className="not-italic bg-gradient-to-br from-gold to-gold-light bg-clip-text text-transparent">Dashboard</em></h1>
                    <p className="text-[15px] text-ink-40">Track your progress across interviews and resumes.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 p-1 bg-ink-05 rounded-xl w-fit">
                    {[
                        { id: 'interview' as const, label: 'Interview Performance', icon: 'brain' },
                        { id: 'resume' as const, label: 'Resume Scores', icon: 'file-text' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-all ${activeTab === tab.id ? 'bg-white dark:bg-[var(--surface)] text-ink shadow-sm' : 'bg-transparent text-ink-40 hover:text-ink'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <LandingIcon name={tab.icon} size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Interview Performance Tab ──────────── */}
                {activeTab === 'interview' && (
                    <>
                        {loading ? (
                            <div className="flex items-center justify-center h-[300px]">
                                <div className="spinner" style={{ color: 'var(--gold)' }} />
                            </div>
                        ) : !interviewStats ? (
                            <div className="text-center py-20">
                                <div className="text-5xl text-ink-10 mb-5">🎙️</div>
                                <h3 className="text-2xl mb-2.5">No interview data yet</h3>
                                <p className="text-[15px] text-ink-40 mb-7">Complete your first AI mock interview to see your performance dashboard.</p>
                                <Link to="/tools/mock-interview" className="btn btn-gold btn-lg">Start Mock Interview →</Link>
                            </div>
                        ) : (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <StatCard label="Total Sessions" value={interviewStats.total} icon="hash" sub={getSessionsDisplay(profile).label} />
                                    <StatCard label="Average Score" value={`${interviewStats.avgScore}/10`} icon="target" color={interviewStats.avgScore >= 7 ? '#22c55e' : interviewStats.avgScore >= 5 ? '#eab308' : '#ef4444'} />
                                    <StatCard label="Best Score" value={`${interviewStats.bestScore}/10`} icon="star" color="#22c55e" />
                                    <StatCard
                                        label="Trend"
                                        value={interviewStats.trend > 0 ? `+${interviewStats.trend}` : `${interviewStats.trend}`}
                                        icon="trending-up"
                                        color={interviewStats.trend >= 0 ? '#22c55e' : '#ef4444'}
                                        sub={interviewStats.trend >= 0 ? 'Improving' : 'Declining'}
                                    />
                                </div>

                                {/* Score Over Time Chart */}
                                <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-6 mb-6">
                                    <div className="text-sm font-bold text-ink mb-1">Interview Score Trend</div>
                                    <div className="text-[12px] text-ink-40 mb-5">Your overall interview scores over time</div>
                                    <div className="flex justify-center">
                                        <TrendLine data={interviewStats.scoreHistory} width={Math.min(600, interviewStats.scoreHistory.length * 60)} />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-ink-20 mt-2 px-2">
                                        <span>Oldest</span>
                                        <span>Most Recent →</span>
                                    </div>
                                </div>

                                {/* Breakdown Charts */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {[
                                        { label: 'Clarity', data: interviewStats.clarityHistory, avg: interviewStats.avgClarity, color: '#3b82f6' },
                                        { label: 'Confidence', data: interviewStats.confidenceHistory, avg: interviewStats.avgConfidence, color: '#22c55e' },
                                        { label: 'Keywords', data: [interviewStats.avgKeywords], avg: interviewStats.avgKeywords, color: '#f59e0b' },
                                    ].map(metric => (
                                        <div key={metric.label} className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[11px] uppercase tracking-widest font-semibold text-ink-30">{metric.label}</span>
                                                <span className="text-xl font-extrabold" style={{ color: metric.color }}>{metric.avg}</span>
                                            </div>
                                            {metric.data.length > 1 ? (
                                                <SparklineChart data={metric.data} color={metric.color} height={40} />
                                            ) : (
                                                <div className="h-2 bg-ink-10 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${(metric.avg / 10) * 100}%`, background: metric.color }} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* By Interview Type */}
                                {Object.keys(interviewStats.byType).length > 0 && (
                                    <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-6 mb-6">
                                        <div className="text-sm font-bold text-ink mb-4">Performance by Interview Type</div>
                                        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                                            {Object.entries(interviewStats.byType).map(([type, scores]) => {
                                                const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10
                                                return (
                                                    <div key={type} className="p-4 bg-[var(--bg)] rounded-xl border border-ink-10">
                                                        <div className="text-[13px] font-bold text-ink mb-1 capitalize">{type.replace(/_/g, ' ')}</div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className={`text-xl font-extrabold ${scoreColor(avg)}`}>{avg}</div>
                                                            <div className="text-[11px] text-ink-40">{scores.length} session{scores.length !== 1 ? 's' : ''}</div>
                                                        </div>
                                                        <div className="h-1.5 bg-ink-10 rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(avg / 10) * 100}%`, background: avg >= 7 ? '#22c55e' : avg >= 5 ? '#eab308' : '#ef4444' }} />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Sessions */}
                                <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-6">
                                    <div className="text-sm font-bold text-ink mb-4">Recent Interview Sessions</div>
                                    <div className="space-y-2">
                                        {history.slice(0, 8).map(entry => (
                                            <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg)] border border-ink-10 transition-colors hover:border-gold">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white shrink-0 ${entry.overall_score >= 8 ? 'bg-gradient-to-br from-green-500 to-green-600' : entry.overall_score >= 5 ? 'bg-gradient-to-br from-gold to-gold-light' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                                                    {entry.overall_score}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[13px] font-semibold text-ink capitalize">{entry.interview_type.replace(/_/g, ' ')}</div>
                                                    <div className="text-[11px] text-ink-40">{entry.role} · {entry.difficulty} · {entry.question_count} questions</div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="flex gap-2 text-[11px] text-ink-30 mb-0.5">
                                                        <span>C:{entry.clarity_avg}</span>
                                                        <span>K:{entry.keyword_relevance_avg}</span>
                                                    </div>
                                                    <div className="text-[10px] text-ink-20">
                                                        {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {history.length > 8 && (
                                        <div className="text-center mt-4 text-[12px] text-ink-30">Showing {Math.min(8, history.length)} of {history.length} sessions</div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* ── Resume Score Tracking Tab ──────────── */}
                {activeTab === 'resume' && (
                    <>
                        {!resumeStats ? (
                            <div className="text-center py-20">
                                <div className="text-5xl text-ink-10 mb-5">📄</div>
                                <h3 className="text-2xl mb-2.5">No resumes yet</h3>
                                <p className="text-[15px] text-ink-40 mb-7">Create your first resume to start tracking your score improvements.</p>
                                <Link to="/dashboard" className="btn btn-gold btn-lg">Go to My Resumes →</Link>
                            </div>
                        ) : (
                            <>
                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <StatCard label="Total Resumes" value={resumeStats.scored.length} icon="file-text" />
                                    <StatCard label="Average Score" value={`${resumeStats.avg}/100`} icon="target" color={resumeScoreColor(resumeStats.avg)} />
                                    <StatCard label="Best Score" value={`${resumeStats.best}/100`} icon="star" color="#22c55e" />
                                    <StatCard label="Lowest Score" value={`${resumeStats.worst}/100`} icon="alert-triangle" color={resumeScoreColor(resumeStats.worst)} />
                                </div>

                                {/* Score Over Time */}
                                {resumeStats.scores.length > 1 && (
                                    <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-6 mb-6">
                                        <div className="text-sm font-bold text-ink mb-1">Resume Score Trend</div>
                                        <div className="text-[12px] text-ink-40 mb-5">Score progression across all your resumes</div>
                                        <div className="flex justify-center">
                                            <TrendLine data={resumeStats.scores} color="#22c55e" width={Math.min(600, resumeStats.scores.length * 80)} />
                                        </div>
                                    </div>
                                )}

                                {/* Individual Resume Scores */}
                                <div className="bg-white dark:bg-[var(--surface)] border border-ink-10 rounded-2xl p-6">
                                    <div className="text-sm font-bold text-ink mb-4">Resume Score Breakdown</div>
                                    <div className="space-y-3">
                                        {resumeStats.scored.map((r, i) => {
                                            const color = resumeScoreColor(r.score)
                                            const label = r.score > 80 ? 'Excellent' : r.score > 60 ? 'Good' : r.score > 40 ? 'Needs Work' : 'Weak'
                                            return (
                                                <Link key={r.id} to={`/editor/${r.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg)] border border-ink-10 transition-all hover:border-gold hover:shadow-sm no-underline">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold text-white shrink-0" style={{ background: color }}>
                                                        {r.score}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[13px] font-semibold text-ink truncate">{r.title}</div>
                                                        <div className="text-[11px] text-ink-40 mt-0.5">{label} · Updated {r.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                    </div>
                                                    <div className="shrink-0" style={{ width: 120 }}>
                                                        <div className="h-2 bg-ink-10 rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.score}%`, background: color }} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mt-8 justify-center">
                    <Link to="/tools/mock-interview" className="btn btn-gold">Start Mock Interview</Link>
                    <Link to="/dashboard" className="btn btn-outline">My Resumes</Link>
                    <Link to="/tools/ai" className="btn btn-ghost">AI Tools</Link>
                </div>
            </div>
        </div>
    )
}
