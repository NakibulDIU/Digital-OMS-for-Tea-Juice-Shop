import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#666' }}>আপনার কার্ট খালি</h2>
        <Link to="/" style={{
          color: '#8b4513',
          textDecoration: 'none',
          fontSize: '1.1rem'
        }}>
          মেনু দেখুন →
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#2d2a26' }}>আপনার কার্ট</h2>

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {cart.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #eee'
          }}>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>{item.nameBn || item.name}</h4>
              <span style={{ color: '#8b4513', fontWeight: '600' }}>৳ {item.price} x {item.quantity}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: 'pointer'
                }}>-</button>
                <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: 'pointer'
                }}>+</button>
              </div>
              <span style={{ fontWeight: '700', minWidth: '80px', textAlign: 'right' }}>
                ৳ {item.price * item.quantity}
              </span>
              <button onClick={() => removeFromCart(item.id)} style={{
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1.5rem',
        padding: '1.5rem',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div>
          <span style={{ fontSize: '1.1rem' }}>মোট: </span>
          <span style={{ fontSize: '1.8rem', fontWeight: '700', color: '#8b4513' }}>৳ {cartTotal}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={clearCart} style={{
            padding: '0.75rem 1.5rem',
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            কার্ট খালি করুন
          </button>
          <Link to="/checkout" style={{
            padding: '0.75rem 2rem',
            background: '#8b4513',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            অর্ডার করুন →
          </Link>
        </div>
      </div>
    </div>
  )
}