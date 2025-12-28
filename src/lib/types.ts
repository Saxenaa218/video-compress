export interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  transmission: string
  color: string
  description: string
  images: string
  location: string
  sellerName: string
  sellerEmail: string
  sellerPhone: string
  createdAt: string
  updatedAt: string
  status: string
}

export interface Inquiry {
  id: string
  carId: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  message: string
  createdAt: string
}
