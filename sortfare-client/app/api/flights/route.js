import { NextResponse } from 'next/server'
import { searchLiveFlights } from '@/lib/flights-server'

const CODE_RE = /^[A-Za-z]{3}$/

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const date = searchParams.get('departureDate')
  const returnDate = searchParams.get('returnDate')
  const passengers = searchParams.get('adults')

  if (origin && !CODE_RE.test(origin)) {
    return NextResponse.json({ error: 'Invalid origin code' }, { status: 400 })
  }
  if (destination && !CODE_RE.test(destination)) {
    return NextResponse.json({ error: 'Invalid destination code' }, { status: 400 })
  }

  const result = await searchLiveFlights({
    origin,
    destination,
    date,
    returnDate,
    passengers,
  })

  return NextResponse.json(result)
}
