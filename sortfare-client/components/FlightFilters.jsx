'use client'
import { Select, ListBox, ListBoxItem } from '@heroui/react'

export default function FlightFilters({ filters, updateFilter, uniqueAirlines }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">Stops</label>
        <Select
          selectedKey={filters.stops}
          onSelectionChange={(key) => updateFilter('stops', key)}
          className="w-full"
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBoxItem id="all">Any</ListBoxItem>
              <ListBoxItem id="nonstop">Nonstop</ListBoxItem>
              <ListBoxItem id="1stop">1 Stop</ListBoxItem>
              <ListBoxItem id="2plus">2+ Stops</ListBoxItem>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="min-w-[150px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">Airline</label>
        <Select
          selectedKey={filters.airline}
          onSelectionChange={(key) => updateFilter('airline', key)}
          className="w-full"
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBoxItem id="all">All Airlines</ListBoxItem>
              {uniqueAirlines.map((airline) => (
                <ListBoxItem key={airline} id={airline}>{airline}</ListBoxItem>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="flex items-end gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) => updateFilter('priceMin', e.target.value)}
            placeholder="Min"
            className="w-full sm:w-20 h-10 px-2 rounded-lg border border-gray-200 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) => updateFilter('priceMax', e.target.value)}
            placeholder="Max"
            className="w-full sm:w-20 h-10 px-2 rounded-lg border border-gray-200 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">Sort by</label>
        <Select
          selectedKey={filters.sortBy}
          onSelectionChange={(key) => updateFilter('sortBy', key)}
          className="w-full"
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBoxItem id="price">Price</ListBoxItem>
              <ListBoxItem id="duration">Duration</ListBoxItem>
              <ListBoxItem id="departure">Departure</ListBoxItem>
              <ListBoxItem id="arrival">Arrival</ListBoxItem>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
    </div>
  )
}
