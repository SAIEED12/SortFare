export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">SortFare</h1>
      <p className="mt-3 text-lg text-gray-500">
        Search, compare, and rank flights across airlines by price, duration, and stops.
      </p>

      <form
        action="/flights"
        method="GET"
        className="mt-10 w-full max-w-md space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="origin" className="block text-left text-sm font-medium text-gray-700">
              From
            </label>
            <input
              id="origin"
              name="origin"
              type="text"
              required
              placeholder="e.g. JFK"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-left text-sm font-medium text-gray-700">
              To
            </label>
            <input
              id="destination"
              name="destination"
              type="text"
              required
              placeholder="e.g. ORD"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date" className="block text-left text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="passengers" className="block text-left text-sm font-medium text-gray-700">
              Passengers
            </label>
            <select
              id="passengers"
              name="passengers"
              defaultValue="1"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
}
