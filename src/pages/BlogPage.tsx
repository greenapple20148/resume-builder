import { Link } from 'react-router-dom'
import { useSEO } from '../lib/useSEO'

export default function BlogPage() {
    useSEO({ title: 'Blog', description: 'Resume tips, career advice, and product updates from ResumeBuildIn.', path: '/blog' })

    const posts = [
        {
            date: 'Feb 24, 2026', title: '10 Resume Mistakes That Cost You Interviews', excerpt: 'Small formatting errors and vague descriptions can tank your chances. Here\'s what to fix today.', tag: 'Career Tips'
        },
        { date: 'Feb 18, 2026', title: 'ATS-Friendly Resumes: The Complete Guide', excerpt: 'Learn how applicant tracking systems parse your resume and how to optimize for them.', tag: 'Guides' },
        { date: 'Feb 10, 2026', title: 'New Templates: Swiss Grid & Purple Dusk', excerpt: 'We just launched two stunning new templates designed for creative and technical professionals.', tag: 'Product' },
        { date: 'Jan 28, 2026', title: 'How to Write a Summary That Stands Out', excerpt: 'Your professional summary is prime real estate. Make every word count with these proven formulas.', tag: 'Career Tips' },
        { date: 'Jan 15, 2026', title: 'The Power of Quantified Achievements', excerpt: 'Numbers speak louder than adjectives. Learn how to transform vague bullets into impact statements.', tag: 'Guides' },
    ]

    return (
        <div className="min-h-screen bg-parchment dark:bg-ink flex flex-col">
            <header className="flex items-center justify-between px-8 py-5">
                <Link to="/" className="font-display text-xl font-light text-ink dark:text-parchment no-underline tracking-tight">◈ Resume<em className="italic text-gold">BuildIn</em></Link>
                <Link to="/" className="btn btn-ghost btn-sm">← Back</Link>
            </header>

            <main className="flex-1 max-w-[720px] mx-auto w-full px-6 py-16">
                <h1 className="font-display text-4xl font-light text-ink dark:text-parchment mb-3 tracking-tight">Blog</h1>
                <p className="text-[15px] text-ink-40 dark:text-[rgba(250,248,243,0.4)] mb-10">Resume tips, career advice, and product updates.</p>
                <div className="h-px bg-ink-10 mb-10" />

                <div className="space-y-8">
                    {posts.map((post, i) => (
                        <article key={i} className="group bg-[var(--white)] dark:bg-[rgba(250,248,243,0.03)] border border-ink-10 rounded-xl p-6 transition-all hover:shadow-md hover:border-gold-pale cursor-pointer">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-20">{post.date}</span>
                                <span className="text-[11px] font-medium text-gold bg-gold-pale px-2 py-0.5 rounded-full">{post.tag}</span>
                            </div>
                            <h2 className="text-lg font-display font-normal text-ink dark:text-parchment mb-2 tracking-tight group-hover:text-gold transition-colors">{post.title}</h2>
                            <p className="text-[13.5px] text-ink-40 dark:text-[rgba(250,248,243,0.4)] leading-relaxed m-0">{post.excerpt}</p>
                        </article>
                    ))}
                </div>

                <div className="text-center pt-12 text-[13px] text-ink-20">
                    More articles coming soon. Stay tuned!
                </div>
            </main>
        </div>
    )
}
