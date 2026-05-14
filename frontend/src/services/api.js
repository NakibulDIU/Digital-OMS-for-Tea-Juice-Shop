const API_URL = '/api'

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export const api = {
  getMenu: () => fetchAPI('/menu'),
  getCategories: () => fetchAPI('/menu/categories'),
  getMenuItem: (id) => fetchAPI(`/menu/${id}`),
  createOrder: (orderData) => fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  getOrders: () => fetchAPI('/orders'),
  getOrder: (id) => fetchAPI(`/orders/${id}`),
  updateOrderStatus: (id, status) => fetchAPI(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  generateBill: (orderId) => fetchAPI(`/bills/orders/${orderId}/bill`, {
    method: 'POST'
  }),
  getBills: () => fetchAPI('/bills'),
  getBill: (id) => fetchAPI(`/bills/${id}`),
  getAdminStats: () => fetchAPI('/admin/stats'),
  getAdminMenu: () => fetchAPI('/admin/menu'),
  createMenuItem: async (item, imageFile) => {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('name', item.name)
    formData.append('nameBn', item.nameBn || '')
    formData.append('description', item.description || '')
    formData.append('price', item.price)
    formData.append('category', item.category)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    const response = await fetch(`${API_URL}/admin/menu`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong')
    }
    return data
  },
  updateMenuItem: async (id, item, imageFile) => {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('name', item.name)
    formData.append('nameBn', item.nameBn || '')
    formData.append('description', item.description || '')
    formData.append('price', item.price)
    formData.append('category', item.category)
    formData.append('isAvailable', item.isAvailable)
    formData.append('existingImageUrl', item.imageUrl || '')
    if (imageFile) {
      formData.append('image', imageFile)
    }

    const response = await fetch(`${API_URL}/admin/menu/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong')
    }
    return data
  },
  deleteMenuItem: (id) => fetchAPI(`/admin/menu/${id}`, {
    method: 'DELETE'
  })
}