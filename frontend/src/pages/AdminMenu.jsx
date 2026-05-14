import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const categories = ['juice', 'lassi', 'milkshake', 'coldcoffee', 'colorTea', 'milkTea', 'coffee']
const categoryNames = {
  juice: 'জুস',
  lassi: 'লাচ্ছি',
  milkshake: 'মিল্ক শেক',
  coldcoffee: 'কোল্ড কফি',
  colorTea: 'রং চা',
  milkTea: 'দুধ চা',
  coffee: 'কফি'
}

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    description: '',
    price: '',
    category: 'juice',
    isAvailable: true,
    imageUrl: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }

    loadMenu()
  }, [user, navigate])

  const loadMenu = async () => {
    try {
      const data = await api.getAdminMenu()
      setMenuItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price)
      }

      if (editingItem) {
        await api.updateMenuItem(editingItem.id, itemData, selectedImage)
      } else {
        await api.createMenuItem(itemData, selectedImage)
      }

      setFormData({
        name: '',
        nameBn: '',
        description: '',
        price: '',
        category: 'juice',
        isAvailable: true,
        imageUrl: ''
      })
      setSelectedImage(null)
      setImagePreview(null)
      setShowForm(false)
      setEditingItem(null)
      loadMenu()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      nameBn: item.nameBn || '',
      description: item.description || '',
      price: item.price?.toString() || '',
      category: item.category || 'juice',
      isAvailable: item.isAvailable,
      imageUrl: item.imageUrl || ''
    })
    setImagePreview(item.imageUrl ? `http://localhost:3001${item.imageUrl}` : null)
    setSelectedImage(null)
    setShowForm(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিত?')) return
    try {
      await api.deleteMenuItem(id)
      loadMenu()
    } catch (err) {
      alert(err.message)
    }
  }

  const toggleAvailability = async (item) => {
    try {
      await api.updateMenuItem(item.id, { ...item, isAvailable: !item.isAvailable })
      loadMenu()
    } catch (err) {
      alert(err.message)
    }
  }

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
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px'
          }}>
            অর্ডার ম্যানেজমেন্ট
          </Link>
          <Link to="/admin/menu" style={{
            padding: '0.75rem 1rem',
            background: '#8b4513',
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h1>মেনু ম্যানেজমেন্ট</h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditingItem(null); setFormData({
              name: '', nameBn: '', description: '', price: '', category: 'juice', isAvailable: true
            })}}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#8b4513',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {showForm ? 'বন্ধ করুন' : 'নতুন আইটেম যোগ করুন'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>
              {editingItem ? 'আইটেম সম্পাদনা' : 'নতুন আইটেম যোগ'}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>নাম (ইংরেজি)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>নাম (বাংলা)</label>
                <input
                  type="text"
                  value={formData.nameBn}
                  onChange={e => setFormData(prev => ({ ...prev, nameBn: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>দাম</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>ক্যাটাগরি</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{categoryNames[c] || c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>বিবরণ</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>ছবি</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>উপলব্ধ</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={e => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  />
                  হ্যাঁ
                </label>
              </div>
            </div>
            <button
              type="submit"
              style={{
                marginTop: '1rem',
                padding: '0.75rem 2rem',
                background: '#8b4513',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {editingItem ? 'আপডেট করুন' : 'সেভ করুন'}
            </button>
          </form>
        )}

        <div style={{
          background: '#fff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>নাম</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>ক্যাটাগরি</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>দাম</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>স্ট্যাটাস</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>{item.nameBn || item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.name}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{categoryNames[item.category] || item.category}</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>৳ {item.price}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => toggleAvailability(item)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: item.isAvailable ? '#27ae60' : '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      {item.isAvailable ? 'উপলব্ধ' : 'অনুপলব্ধ'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: '0.5rem',
                        background: '#3498db',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                      }}
                    >
                      সম্পাদনা
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '0.5rem',
                        background: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      মুছুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}