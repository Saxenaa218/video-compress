import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const make = searchParams.get('make')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const year = searchParams.get('year')
    const fuelType = searchParams.get('fuelType')

    const where: Record<string, unknown> = {
      status: 'available'
    }

    if (make) {
      where.make = { contains: make }
    }
    if (minPrice) {
      where.price = { ...((where.price as object) || {}), gte: parseFloat(minPrice) }
    }
    if (maxPrice) {
      where.price = { ...((where.price as object) || {}), lte: parseFloat(maxPrice) }
    }
    if (year) {
      where.year = parseInt(year)
    }
    if (fuelType) {
      where.fuelType = fuelType
    }

    const cars = await prisma.car.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(cars)
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const car = await prisma.car.create({
      data: {
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        price: parseFloat(body.price),
        mileage: parseInt(body.mileage),
        fuelType: body.fuelType,
        transmission: body.transmission,
        color: body.color,
        description: body.description,
        images: JSON.stringify(body.images || []),
        location: body.location,
        sellerName: body.sellerName,
        sellerEmail: body.sellerEmail,
        sellerPhone: body.sellerPhone,
        status: 'available'
      }
    })

    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    console.error('Error creating car:', error)
    return NextResponse.json({ error: 'Failed to create car listing' }, { status: 500 })
  }
}
