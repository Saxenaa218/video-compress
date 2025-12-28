import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const inquiry = await prisma.inquiry.create({
      data: {
        carId: body.carId,
        buyerName: body.buyerName,
        buyerEmail: body.buyerEmail,
        buyerPhone: body.buyerPhone,
        message: body.message
      }
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
