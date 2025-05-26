import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import { format } from 'date-fns'

export default function SightingForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    count: 1,
    notes: ''
  })
  const [photo, setPhoto] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'count' ? parseInt(value) || 0 : value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Photo must be less than 5MB')
      return
    }
    setPhoto(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Get current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        })
      })

      const sightingData = {
        ...formData,
        datetime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }

      // Upload photo if provided
      let photoUrl = null
      if (photo) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('sighting-photos')
          .upload(fileName, photo)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('sighting-photos')
          .getPublicUrl(fileName)

        photoUrl = publicUrl
      }

      // Create sighting via API
      await api.createSighting({
        ...sightingData,
        photo_url: photoUrl
      })

      navigate('/dashboard')
    } catch (err) {
      if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
        setError('Location permission denied. Please enable location access.')
      } else {
        setError(err.message || 'Failed to submit sighting')
      }
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Report a Firefly Sighting</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              name="time"
              id="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700">
            Number of Fireflies
          </label>
          <input
            type="number"
            name="count"
            id="count"
            min="1"
            required
            value={formData.count}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any additional observations..."
          />
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
            Photo (optional)
          </label>
          <input
            type="file"
            name="photo"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Sighting'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}