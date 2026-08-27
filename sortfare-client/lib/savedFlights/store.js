// lib/savedFlights/store.js
//
// Client-side state for saved flights. Hydrates from the Express API when a
// session is present, and exposes optimistic save/remove actions. Uses zustand
// so any FlightCard / FlightRow and the /saved page share one source of truth.
import { create } from 'zustand'
import { fetchSavedFlights, saveFlight, removeSavedFlight } from './client'

export const useSavedFlights = create((set, get) => ({
  flights: [],
  ids: {},
  status: 'idle', // idle | loading | ready | error
  error: null,

  hydrate: async (userId) => {
    if (!userId) return
    const { status } = get()
    if (status === 'loading' || status === 'ready') return

    set({ status: 'loading' })
    try {
      const flights = await fetchSavedFlights(userId)
      set({
        flights,
        ids: Object.fromEntries(flights.map((f) => [f.flightId, true])),
        status: 'ready',
      })
    } catch (err) {
      set({ status: 'error', error: err.message })
    }
  },

  toggleSave: async (userId, flight) => {
    const { ids } = get()
    if (ids[flight.id]) {
      await removeSavedFlight(userId, flight.id)
      set((state) => {
        const nextIds = { ...state.ids }
        delete nextIds[flight.id]
        return {
          ids: nextIds,
          flights: state.flights.filter((f) => f.flightId !== flight.id),
        }
      })
      return
    }

    const saved = await saveFlight(userId, flight)
    set((state) => ({
      ids: { ...state.ids, [flight.id]: true },
      flights: saved ? [saved, ...state.flights] : state.flights,
    }))
  },

  remove: async (userId, flightId) => {
    await removeSavedFlight(userId, flightId)
    set((state) => {
      const nextIds = { ...state.ids }
      delete nextIds[flightId]
      return {
        ids: nextIds,
        flights: state.flights.filter((f) => f.flightId !== flightId),
      }
    })
  },
}))
