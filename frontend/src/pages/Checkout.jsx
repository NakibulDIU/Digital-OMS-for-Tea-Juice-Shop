import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    customerAddress: ''
  })

  if (cart.length === 0) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      }

      const result = await api.createOrder(orderData)
      clearCart()
      navigate(`/order/${result.id}`)
    } catch (err) {
      alert(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>চেকআউট</h2>

      <div style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h4 style={{ marginBottom: '1rem' }}>অর্ডার সারাংশ</h4>
        {cart.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee'
          }}>
            <span>{item.nameBn || item.name} x {item.quantity}</span>
            <span>৳ {item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          fontWeight: '700',
          fontSize: '1.2rem'
        }}>
          <span>মোট</span>
          <span style={{ color: '#8b4513' }}>৳ {cartTotal}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h4 style={{ marginBottom: '1rem' }}>আপনার তথ্য</h4>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            নাম *
          </label>
          <input
            type="text"
            required
            value={formData.customerName}
            onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            ফোন নম্বর (ঐচ্ছিক)
          </label>
          <input
            type="tel"
            value={formData.customerContact}
            onChange={e => setFormData(prev => ({ ...prev, customerContact: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            ঠিকানা (ঐচ্ছিক)
          </label>
          <textarea
            value={formData.customerAddress}
            onChange={e => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#8b4513',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'অর্ডার হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}
        </button>
      </form>
    </div>
  )
}