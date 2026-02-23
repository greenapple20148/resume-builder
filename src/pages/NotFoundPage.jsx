import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFoundPage() {
  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '120px 40px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '120px', fontWeight: 300, color: 'var(--ink-10)', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ marginTop: 24, marginBottom: 12 }}>Page not found</h2>
        <p style={{ color: 'var(--ink-40)', marginBottom: 32 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-gold btn-lg">
          Back to Home →
        </Link>
      </div>
    </div>
  )
}
