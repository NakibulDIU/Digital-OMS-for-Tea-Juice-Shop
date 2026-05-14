import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOrder(id)
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>লোড হচ্ছে...</div>
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>অর্ডার পাওয়া যায়নি</h2>
        <Link to="/" style={{ color: '#8b4513' }}>হোম পেজে যান</Link>
      </div>
    )
  }

  const statusColors = {
    pending: '#f39c12',
    confirmed: '#3498db',
    preparing: '#9b59b6',
    ready: '#27ae60',
    completed: '#2ecc71',
    cancelled: '#e74c3c'
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          ✅
        </div>
        <h2 style={{ color: '#27ae60' }}>অর্ডার সফল!</h2>
        <p style={{ color: '#666' }}>আপনার অর্ডারটি গ্রহণ করা হয়েছে</p>
      </div>

      <div style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: '#666' }}>অর্ডার নম্বর</span>
          <span style={{ fontWeight: '700' }}>{order.orderNumber}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: '#666' }}>স্ট্যাটাস</span>
          <span style={{
            background: statusColors[order.status],
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            {order.status}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#666' }}>মোট</span>
          <span style={{ fontWeight: '700', fontSize: '1.3rem', color: '#8b4513' }}>
            ৳ {order.totalAmount}
          </span>
        </div>
      </div>

      <div style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h4 style={{ marginBottom: '1rem' }}>অর্ডার বিবরণ</h4>
        {order.items.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee'
          }}>
            <span>{item.menuItem?.nameBn || item.menuItem?.name} x {item.quantity}</span>
            <span>৳ {item.subtotal}</span>
          </div>
        ))}
      </div>

      <div style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h4 style={{ marginBottom: '1rem' }}>গ্রাহক তথ্য</h4>
        <p><strong>নাম:</strong> {order.customerName}</p>
        <p><strong>ফোন:</strong> {order.customerContact}</p>
        {order.customerAddress && <p><strong>ঠিকানা:</strong> {order.customerAddress}</p>}
      </div>

      <Link to="/" style={{
        display: 'block',
        textAlign: 'center',
        padding: '1rem',
        background: '#8b4513',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600'
      }}>
        আরও অর্ডার করুন
      </Link>
    </div>
  )
}