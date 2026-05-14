import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { cartCount } = useCart()
  const { user, logout } = useAuth()

  return (
    <header style={{
      background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{
          color: '#fff',
          fontSize: '1.8rem',
          fontWeight: '700',
          letterSpacing: '1px'
        }}>
          🍵 হৃদয়ের চা ঘর
        </h1>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/cart" style={{
          position: 'relative',
          textDecoration: 'none'
        }}>
          <span style={{
            background: '#fff',
            color: '#8b4513',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontWeight: '600'
          }}>
            🛒 কার্ট ({cartCount})
          </span>
        </Link>

        {user?.role === 'admin' ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/admin" style={{
              background: '#2d2a26',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              ড্যাশবোর্ড
            </Link>
            <button onClick={logout} style={{
              background: '#c0392b',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}>
              লগআউট
            </button>
          </div>
        ) : (
          <Link to="/admin/login" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            অ্যাডমিন
          </Link>
        )}
      </div>
    </header>
  )
}