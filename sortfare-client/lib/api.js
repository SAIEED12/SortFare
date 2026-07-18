export async function fetchFlights({ origin, destination, date, passengers } = {}) {
  const params = new URLSearchParams()
  if (origin) params.set('origin', origin)
  if (destination) params.set('destination', destination)
  if (date) params.set('date', date)
  if (passengers) params.set('passengers', passengers)

  const queryString = params.toString()
  const url = `${process.env.NEXT_PUBLIC_API_URL}/flights${queryString ? `?${queryString}` : ''}`

  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch flights')
  return res.json()
}
