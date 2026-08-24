import { NextResponse } from 'next/server'

export async function POST(request) {
  const { ignav_id } = await request.json()

  if (!ignav_id) {
    return NextResponse.json({ error: 'ignav_id required' }, { status: 400 })
  }

  const res = await fetch('https://ignav.com/api/fares/booking-links', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.IGNAV_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ignav_id }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch booking links' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
