import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
      <p style={{ fontSize: 72, fontWeight: 500, color: 'var(--p-cream)', lineHeight: 1 }}>404</p>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--p-darkest)', margin: '16px 0 8px' }}>Page not found</h1>
      <p className="text-muted" style={{ marginBottom: 32 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{
        padding: '10px 24px',
        background: 'var(--p-charcoal)',
        color: 'var(--p-cream)',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 500,
        fontSize: 14
      }}>
        Go home
      </Link>
    </div>
  );
}