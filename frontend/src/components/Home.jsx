import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SightingsMap from './SightingsMap'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Sightings</h2>
        <p className="text-gray-600 mb-6">
          Track firefly populations in your neighborhood. Each glowing dot represents a reported sighting.
        </p>
        <SightingsMap />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">How it works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Spot Fireflies</h4>
            <p className="text-sm text-gray-500">
              When you see fireflies in your area, open the app to record your sighting.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Report Details</h4>
            <p className="text-sm text-gray-500">
              Log the date, time, count, and optionally add a photo of your sighting.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Track Trends</h4>
            <p className="text-sm text-gray-500">
              View sightings on the map and track firefly population trends over time.
            </p>
          </div>
        </div>
      </div>

      {!user && (
        <div className="mt-8 bg-indigo-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Join the Firefly Tracking Community
          </h3>
          <p className="text-gray-600 mb-4">
            Create an account to start logging your firefly sightings and contribute to citizen science.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  )
}