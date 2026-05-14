import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
const statusColors = {
  pending: '#f39c12',
  confirmed: '#3498db',
  preparing: '#9b59b6',
  ready: '#27ae60',
  completed: '#2ecc71',
  cancelled: '#e74c3c'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }

    loadOrders()
  }, [user, navigate])

  const loadOrders = async () => {
    try {
      const data = await api.getOrders()
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus)
      loadOrders()
      if (selectedOrder) {
        const updated = await api.getOrder(orderId)
        setSelectedOrder(updated)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleGenerateBill = async (orderId) => {
    try {
      await api.generateBill(orderId)
      alert('বিল তৈরি হয়েছে!')
      loadOrders()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredOrders = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders

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
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            ড্যাশবোর্ড
          </Link>
          <Link to="/admin/orders" style={{
            padding: '0.75rem 1rem',
            background: '#8b4513',
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
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>অর্ডার ম্যানেজমেন্ট</h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          >
            <option value="">সব স্ট্যাটাস</option>
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
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
                  <th style={{ padding: '1rem', textAlign: 'left' }}>অর্ডার</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>গ্রাহক</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>টোটাল</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>স্ট্যাটাস</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>সময়</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      cursor: 'pointer',
                      background: selectedOrder?.id === order.id ? '#f0f0f0' : 'transparent',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>{order.orderNumber}</td>
                    <td style={{ padding: '1rem' }}>
                      <div>{order.customerName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{order.customerContact}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>৳ {order.totalAmount}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: statusColors[order.status],
                        color: '#fff',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleString('bn-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              height: 'fit-content'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>অর্ডার বিবরণ</h3>
              <p><strong>অর্ডার নম্বর:</strong> {selectedOrder.orderNumber}</p>
              <p><strong>গ্রাহক:</strong> {selectedOrder.customerName}</p>
              <p><strong>ফোন:</strong> {selectedOrder.customerContact}</p>
              {selectedOrder.customerAddress && <p><strong>ঠিকানা:</strong> {selectedOrder.customerAddress}</p>}

              <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>আইটেম</h4>
              {selectedOrder.items?.map(item => (
                <div key={item.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span>{item.menuItem?.nameBn || item.menuItem?.name} x {item.quantity}</span>
                  <span style={{ float: 'right' }}>৳ {item.subtotal}</span>
                </div>
              ))}

              <div style={{ marginTop: '1rem', fontWeight: '700', fontSize: '1.2rem' }}>
                মোট: ৳ {selectedOrder.totalAmount}
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>স্ট্যাটাস পরিবর্তন</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedOrder.status !== 'confirmed' && selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: '0.75rem',
                        background: '#3498db',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      নিশ্চিত
                    </button>
                  )}
                  {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: '0.75rem',
                        background: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      বাতিল
                    </button>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: '0.75rem',
                        background: '#27ae60',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      সম্পন্ন
                    </button>
                  )}
                </div>
              </div>

              {selectedOrder.status === 'completed' && !selectedOrder.bill && (
                <button
                  onClick={() => handleGenerateBill(selectedOrder.id)}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '0.75rem',
                    background: '#27ae60',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  বিল তৈরি করুন
                </button>
              )}

              {selectedOrder.bill && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: '#e8f8f5',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <strong>বিল নম্বর:</strong> {selectedOrder.bill.billNumber}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}