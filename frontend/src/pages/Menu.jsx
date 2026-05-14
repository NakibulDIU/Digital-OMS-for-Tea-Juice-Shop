import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'

const categoryNames = {
  juice: 'জুস',
  lassi: 'লাচ্ছি',
  milkshake: 'মিল্ক শেক',
  coldcoffee: 'কোল্ড কফি',
  colorTea: 'রং চা',
  milkTea: 'দুধ চা',
  coffee: 'কফি'
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [quantities, setQuantities] = useState({})
  const { addToCart } = useCart()

  useEffect(() => {
    api.getMenu()
      .then(data => {
        setMenuItems(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const categories = [...new Set(menuItems.map(item => item.category))]
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems

  const handleAddToCart = (item) => {
    const qty = quantities[item.id] || 1
    addToCart(item, qty)
    setQuantities(prev => ({ ...prev, [item.id]: 1 }))
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>লোড হচ্ছে...</h2>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <button onClick={() => setSelectedCategory(null)} style={{
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '25px',
          background: selectedCategory === null ? '#8b4513' : '#e0d5c8',
          color: selectedCategory === null ? '#fff' : '#2d2a26',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}>
          সব
        </button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '25px',
            background: selectedCategory === cat ? '#8b4513' : '#e0d5c8',
            color: selectedCategory === cat ? '#fff' : '#2d2a26',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}>
            {categoryNames[cat] || cat}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredItems.map(item => (
          <div key={item.id} style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
          }}>
            {item.imageUrl ? (
              <div style={{
                height: '140px',
                backgroundImage: `url(http://localhost:3001${item.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
            ) : (
              <div style={{
                height: '140px',
                background: `linear-gradient(135deg, #f5e6d3 0%, #e8d5c0 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                🍵
              </div>
            )}
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{
                fontSize: '1.1rem',
                marginBottom: '0.25rem',
                color: '#2d2a26'
              }}>
                {item.nameBn || item.name}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#666',
                marginBottom: '0.5rem'
              }}>
                {item.name}
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: '#888',
                marginBottom: '1rem',
                minHeight: '40px'
              }}>
                {item.description || 'সুস্বাদু পানীয়'}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: '#8b4513'
                }}>
                  ৳ {item.price}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    value={quantities[item.id] || 1}
                    onChange={e => setQuantities(prev => ({
                      ...prev,
                      [item.id]: parseInt(e.target.value) || 1
                    }))}
                    style={{
                      width: '50px',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}
                  />
                  <button onClick={() => handleAddToCart(item)} style={{
                    background: '#8b4513',
                    color: '#fff',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}>
                    যোগ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}