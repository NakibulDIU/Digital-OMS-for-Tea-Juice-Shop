import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }

    api.getAdminStats()
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user, navigate])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>লোড হচ্ছে...</div>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '250px',
        background: '#2d2a26',
        color: '#fff',
        padding: '1.5rem'
      }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>⚙️ অ্যাডমিন প্যানেল</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/admin" style={{
            padding: '0.75rem 1rem',
            background: '#8b4513',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            ড্যাশবোর্ড
          </Link>
          <Link to="/admin/orders" style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            অর্ডার ম্যানেজমেন্ট
          </Link>
          <Link to="/admin/menu" style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            মেনু ম্যানেজমেন্ট
          </Link>
          <Link to="/admin/bills" style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            বিল ম্যানেজমেন্ট
          </Link>
          <Link to="/" style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            ওয়েবসাইট দেখুন
          </Link>
        </nav>
        <button onClick={() => { logout(); navigate('/') }} style={{
          marginTop: 'auto',
          padding: '0.75rem 1rem',
          background: '#c0392b',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%'
        }}>
          লগআউট
        </button>
      </aside>

      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <h1 style={{ marginBottom: '2rem' }}>ড্যাশবোর্ড</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>আজকের অর্ডার</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b4513' }}>
              {stats?.todayOrders || 0}
            </p>
          </div>
          <div style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>আজকের রাজস্ব</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#27ae60' }}>
              ৳ {stats?.totalRevenue || 0}
            </p>
          </div>
          <div style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>পেন্ডিং অর্ডার</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f39c12' }}>
              {stats?.pendingCount || 0}
            </p>
          </div>
        </div>

        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>অর্ডার স্ট্যাটাস</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {stats?.statusCounts && Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                minWidth: '120px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d2a26' }}>{count}</p>
                <p style={{ fontSize: '0.85rem', color: '#666', textTransform: 'capitalize' }}>{status}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}