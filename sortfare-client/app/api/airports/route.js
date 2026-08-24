import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const limit = searchParams.get('limit') || '6'

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const res = await fetch(
    `https://ignav.com/api/airports?q=${encodeURIComponent(q)}&limit=${limit}`,
    {
      headers: {
        'X-Api-Key': process.env.IGNAV_API_KEY,
      },
    }
  )

  if (!res.ok) {
    return NextResponse.json([])
  }

  const data = await res.json()
  return NextResponse.json(data)
}
