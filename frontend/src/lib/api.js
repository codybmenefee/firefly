import { supabase } from './supabase'

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`
  }
}

export const api = {
  // Sightings
  async createSighting(sightingData) {
    const response = await fetch(`${API_BASE}/sightings`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(sightingData)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create sighting')
    }
    return response.json()
  },

  async getSightings(userId = null) {
    const url = userId 
      ? `${API_BASE}/sightings?user_id=${userId}`
      : `${API_BASE}/sightings`
    
    const response = await fetch(url, {
      headers: await getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error('Failed to fetch sightings')
    }
    return response.json()
  },

  async getSighting(id) {
    const response = await fetch(`${API_BASE}/sightings/${id}`, {
      headers: await getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error('Failed to fetch sighting')
    }
    return response.json()
  },

  async updateSighting(id, sightingData) {
    const response = await fetch(`${API_BASE}/sightings/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(sightingData)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update sighting')
    }
    return response.json()
  },

  async deleteSighting(id) {
    const response = await fetch(`${API_BASE}/sightings/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error('Failed to delete sighting')
    }
    return response.ok
  },

  // Neighborhoods
  async getNeighborhoods() {
    const response = await fetch(`${API_BASE}/neighborhoods`, {
      headers: await getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error('Failed to fetch neighborhoods')
    }
    return response.json()
  },

  // Health checks
  async ping() {
    const response = await fetch(`${API_BASE}/ping`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    })
    if (!response.ok) {
      throw new Error('Failed to ping')
    }
    return response.json()
  },

  async testDb() {
    const response = await fetch(`${API_BASE}/db-test`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    })
    if (!response.ok) {
      throw new Error('Failed to test database')
    }
    return response.json()
  }
}