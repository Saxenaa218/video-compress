import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

interface CarPageProps {
  params: Promise<{ id: string }>
}

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params
  
  const car = await prisma.car.findUnique({
    where: { id }
  })

  if (!car) {
    notFound()
  }

  const images = JSON.parse(car.images || '[]')
  const primaryImage = images[0]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage)
  }

  const carTitle = `${car.year} ${car.make} ${car.model}`

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to listings
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="h-96 bg-gray-200">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={carTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Car Details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{carTitle}</h1>
                  <p className="text-gray-500 flex items-center mt-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {car.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{formatPrice(car.price)}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    car.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {car.status === 'available' ? 'Available' : car.status}
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Mileage</p>
                  <p className="font-semibold text-gray-900">{formatMileage(car.mileage)} mi</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Fuel Type</p>
                  <p className="font-semibold text-gray-900">{car.fuelType}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Transmission</p>
                  <p className="font-semibold text-gray-900">{car.transmission}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Color</p>
                  <p className="font-semibold text-gray-900">{car.color}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{car.description}</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Seller Information</h2>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {car.sellerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{car.sellerName}</p>
                  <p className="text-gray-500 text-sm">Member since {new Date(car.createdAt).getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ContactForm carId={car.id} carTitle={carTitle} />
              
              {/* Quick Contact */}
              <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Contact</h3>
                <a
                  href={`tel:${car.sellerPhone}`}
                  className="flex items-center justify-center w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium mb-3"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Seller
                </a>
                <a
                  href={`mailto:${car.sellerEmail}?subject=Inquiry about ${carTitle}`}
                  className="flex items-center justify-center w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Seller
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
