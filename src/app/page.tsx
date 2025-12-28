'use client'

import { useState, useEffect } from 'react'
import CarCard from '@/components/CarCard'
import SearchFilters, { SearchFilters as Filters } from '@/components/SearchFilters'
import { Car } from '@/lib/types'

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCars = async (filters?: Filters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters?.make) params.append('make', filters.make)
      if (filters?.minPrice) params.append('minPrice', filters.minPrice)
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters?.year) params.append('year', filters.year)
      if (filters?.fuelType) params.append('fuelType', filters.fuelType)

      const response = await fetch(`/api/cars?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch cars')
      const data = await response.json()
      setCars(data)
    } catch {
      setError('Failed to load cars. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleSearch = (filters: Filters) => {
    fetchCars(filters)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Used Car
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse thousands of quality used cars from trusted sellers. 
            Buy with confidence or sell your car today.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="#browse" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse Cars
            </a>
            <a 
              href="/sell" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sell Your Car
            </a>
          </div>
        </div>
      </section>

      {/* Search and Listings */}
      <section id="browse" className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters onSearch={handleSearch} />

        {/* Results */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Cars
              {!loading && <span className="text-gray-500 text-lg ml-2">({cars.length} listings)</span>}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => fetchCars()} 
                className="mt-4 text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No cars found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search filters or be the first to list a car!</p>
              <a 
                href="/sell" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sell Your Car
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose AutoMart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Trusted Sellers</h3>
              <p className="text-gray-600">All listings are from verified sellers you can trust.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Best Prices</h3>
              <p className="text-gray-600">Find competitive prices on quality used cars.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick & Easy</h3>
              <p className="text-gray-600">List or find your car in minutes with our simple platform.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
