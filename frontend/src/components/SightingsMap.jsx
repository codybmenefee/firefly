import { useState, useEffect } from 'react'
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl'
import { api } from '../lib/api'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function SightingsMap() {
  const [viewState, setViewState] = useState({
    longitude: -87.6298,
    latitude: 41.8781,
    zoom: 10
  })
  const [sightings, setSightings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSightings()
  }, [])

  const fetchSightings = async () => {
    try {
      const data = await api.getSightings()
      setSightings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map requires Mapbox token configuration</p>
      </div>
    )
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-lg">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10">
          {error}
        </div>
      )}

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      >
        <NavigationControl position="top-left" />
        <GeolocateControl position="top-left" />
        
        {sightings.map((sighting) => (
          <Marker
            key={sighting.id}
            longitude={sighting.anonymized_longitude}
            latitude={sighting.anonymized_latitude}
            anchor="bottom"
          >
            <div className="relative group">
              <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse cursor-pointer" />
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <p className="text-sm font-medium">{sighting.count} fireflies</p>
                <p className="text-xs text-gray-500">
                  {new Date(sighting.datetime).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  )
}