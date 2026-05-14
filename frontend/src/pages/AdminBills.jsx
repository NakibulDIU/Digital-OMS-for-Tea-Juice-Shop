import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AdminBills() {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBill, setSelectedBill] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }

    loadBills()
  }, [user, navigate])

  const loadBills = async () => {
    try {
      const data = await api.getBills()
      setBills(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewBill = async (bill) => {
    try {
      const data = await api.getBill(bill.id)
      setSelectedBill(data)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>লোড হচ্ছে...</div>
  }

  const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0)

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
            background: 'rgba(255,255,255,0.1)',
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
            background: '#8b4513',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            বিল ম্যানেজমেন্ট
          </Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>বিল ম্যানেজমেন্ট</h1>

        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>মোট বিল</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#8b4513' }}>{bills.length}</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>মোট রাজস্ব</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#27ae60' }}>৳ {totalRevenue}</p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '1.5rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>বিল নম্বর</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>অর্ডার</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>টোটাল</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr
                    key={bill.id}
                    onClick={() => handleViewBill(bill)}
                    style={{
                      cursor: 'pointer',
                      background: selectedBill?.id === bill.id ? '#f0f0f0' : 'transparent',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{bill.billNumber}</td>
                    <td style={{ padding: '1rem' }}>{bill.order?.orderNumber}</td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#8b4513' }}>৳ {bill.totalAmount}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#666' }}>
                      {new Date(bill.generatedAt).toLocaleDateString('bn-BD')}
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      কোনো বিল নেই
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedBill && (
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              height: 'fit-content'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#8b4513' }}>হৃদয়ের চা ঘর</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>বিল রসিদ</p>
              </div>

              <div style={{ borderBottom: '2px dashed #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <p><strong>বিল নম্বর:</strong> {selectedBill.billNumber}</p>
                <p><strong>অর্ডার নম্বর:</strong> {selectedBill.order?.orderNumber}</p>
                <p><strong>তারিখ:</strong> {new Date(selectedBill.generatedAt).toLocaleString('bn-BD')}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <p><strong>গ্রাহক:</strong> {selectedBill.order?.customerName}</p>
                <p><strong>ফোন:</strong> {selectedBill.order?.customerContact}</p>
              </div>

              <div style={{ borderBottom: '2px dashed #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>আইটেম</h4>
                {selectedBill.order?.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                    <span>{item.menuItem?.nameBn || item.menuItem?.name} x {item.quantity}</span>
                    <span>৳ {item.subtotal}</span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#8b4513' }}>
                মোট: ৳ {selectedBill.totalAmount}
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.85rem' }}>
                ধন্যবাদ! আবার আসবেন!
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}