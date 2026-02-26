import { Link } from 'react-router-dom'
import { useSEO } from '../lib/useSEO'

export default function AboutPage() {
    useSEO({ title: 'About Us', description: 'Learn about ResumeBuildIn — beautiful resumes that get you hired.', path: '/about' })

    return (
        <div className="min-h-screen bg-parchment dark:bg-ink flex flex-col">
            {/* Nav */}
            <header className="flex items-center justify-between px-8 py-5">
                <Link to="/" className="font-display text-xl font-light text-ink dark:text-parchment no-underline tracking-tight">◈ Resume<em className="italic text-gold">BuildIn</em></Link>
                <Link to="/" className="btn btn-ghost btn-sm">← Back</Link>
            </header>

            <main className="flex-1 max-w-[720px] mx-auto w-full px-6 py-16">
                <h1 className="font-display text-4xl font-light text-ink dark:text-parchment mb-3 tracking-tight">About <em className="italic text-gold">Us</em></h1>
                <div className="h-px bg-ink-10 mb-10" />

                <section className="space-y-6 text-[15px] text-ink-70 dark:text-[rgba(250,248,243,0.6)] leading-relaxed">
                    <p>
                        <strong className="text-ink dark:text-parchment">ResumeBuildIn</strong> was born from a simple frustration: beautiful resume design shouldn{"'"}t require a design degree. We believe every professional deserves a resume that reflects their talent — crisp, polished, and unmistakably premium.
                    </p>
                    <p>
                        Our team of designers and engineers obsess over typography, whitespace, and the subtle details that make a hiring manager pause and look twice. Every template is ATS-optimized and recruiter-approved, so your resume works as hard as you do.
                    </p>

                    <h2 className="font-display text-2xl font-light text-ink dark:text-parchment pt-6">Our Mission</h2>
                    <p>
                        To democratize professional branding. Whether you{"'"}re a first-time job seeker or a seasoned executive, you deserve tools that present your story with clarity and confidence.
                    </p>

                    <h2 className="font-display text-2xl font-light text-ink dark:text-parchment pt-6">What We Value</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                        {[
                            {
                                icon: '◈', title: 'Craft', desc: 'Every pixel is intentional. We sweat the details so you don\'t have to.'
                            },
                            { icon: '✦', title: 'Simplicity', desc: 'Complex made simple. Build a stunning resume in minutes, not hours.' },
                            { icon: '●', title: 'Impact', desc: 'Your resume should open doors. We optimize for real-world results.' },
                        ].map(v => (
                            <div key={v.title} className="bg-[var(--white)] dark:bg-[rgba(250,248,243,0.03)] border border-ink-10 rounded-xl p-5">
                                <div className="text-gold text-xl mb-3">{v.icon}</div>
                                <h3 className="text-sm font-semibold text-ink dark:text-parchment mb-1.5">{v.title}</h3>
                                <p className="text-[13px] text-ink-40 dark:text-[rgba(250,248,243,0.4)] leading-relaxed m-0">{v.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="font-display text-2xl font-light text-ink dark:text-parchment pt-6">Get in Touch</h2>
                    <p>
                        Have questions, feedback, or partnership inquiries? We{"'"}d love to hear from you at <a href="mailto:hello@resumebuildin.com" className="text-gold underline">hello@resumebuildin.com</a>.
                    </p>
                </section>
            </main>
        </div>
    )
}
