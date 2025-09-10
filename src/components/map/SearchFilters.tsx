"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import type { Facility } from '@/types/facility'

interface SearchFiltersProps {
  facilities: Facility[]
  onFilterChange: (filtered: Facility[]) => void
}

interface Filters {
  facilityType: string
  city: string
  altcsAccepted: string
  availabilityOnly: boolean
  priceMin: string
  priceMax: string
}

export default function SearchFilters({ facilities, onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    facilityType: '',
    city: '',
    altcsAccepted: '',
    availabilityOnly: false,
    priceMin: '',
    priceMax: ''
  })

  // Get unique values for dropdowns
  const uniqueFacilityTypes = [...new Set(facilities.map(f => f.facility_type).filter(Boolean))]
  const uniqueCities = [...new Set(facilities.map(f => f.city).filter(Boolean))].sort()

  useEffect(() => {
    let filtered = facilities

    // Filter by facility type
    if (filters.facilityType) {
      filtered = filtered.filter(f => f.facility_type === filters.facilityType)
    }

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(f => f.city === filters.city)
    }

    // Filter by ALTCS acceptance
    if (filters.altcsAccepted) {
      filtered = filtered.filter(f => f.altcs_accepted === filters.altcsAccepted)
    }

    // Filter by availability
    if (filters.availabilityOnly) {
      filtered = filtered.filter(f => {
        const beds = parseInt(f.available_beds?.toString() || '0')
        return beds > 0
      })
    }

    // Filter by price range
    if (filters.priceMin) {
      const minPrice = parseFloat(filters.priceMin)
      filtered = filtered.filter(f => {
        const facilityMin = parseFloat(f.price_min?.toString() || '0')
        return facilityMin >= minPrice
      })
    }

    if (filters.priceMax) {
      const maxPrice = parseFloat(filters.priceMax)
      filtered = filtered.filter(f => {
        const facilityMax = parseFloat(f.price_max?.toString() || '999999')
        return facilityMax <= maxPrice
      })
    }

    onFilterChange(filtered)
  }, [filters, facilities, onFilterChange])

  const clearFilters = () => {
    setFilters({
      facilityType: '',
      city: '',
      altcsAccepted: '',
      availabilityOnly: false,
      priceMin: '',
      priceMax: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ''
  )

  return (
    <Card className="m-4 p-4 glass-brand-light shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-white" />
          <h3 className="font-semibold text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-white/70 hover:text-white hover:bg-white/20"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Facility Type */}
        <div>
          <Label className="text-white/80 text-sm mb-2 block">Facility Type</Label>
          <select
            value={filters.facilityType}
            onChange={(e) => setFilters(prev => ({ ...prev, facilityType: e.target.value }))}
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white text-sm backdrop-blur-sm focus:bg-white/30 focus:border-blue-400/50 focus:outline-none"
          >
            <option value="" className="bg-slate-800">All Types</option>
            {uniqueFacilityTypes.map(type => (
              <option key={type} value={type} className="bg-slate-800">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <Label className="text-white/80 text-sm mb-2 block">City</Label>
          <select
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white text-sm backdrop-blur-sm focus:bg-white/30 focus:border-blue-400/50 focus:outline-none"
          >
            <option value="" className="bg-slate-800">All Cities</option>
            {uniqueCities.map(city => (
              <option key={city} value={city} className="bg-slate-800">
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* ALTCS Accepted */}
        <div>
          <Label className="text-white/80 text-sm mb-2 block">ALTCS Accepted</Label>
          <select
            value={filters.altcsAccepted}
            onChange={(e) => setFilters(prev => ({ ...prev, altcsAccepted: e.target.value }))}
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white text-sm backdrop-blur-sm focus:bg-white/30 focus:border-blue-400/50 focus:outline-none"
          >
            <option value="" className="bg-slate-800">Any</option>
            <option value="Yes" className="bg-slate-800">Yes</option>
            <option value="No" className="bg-slate-800">No</option>
            <option value="Pending" className="bg-slate-800">Pending</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-white/80 text-sm mb-2 block">Min Price</Label>
          <Input
            type="number"
            placeholder="$0"
            value={filters.priceMin}
            onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30 focus:border-blue-400/50"
          />
        </div>

        <div>
          <Label className="text-white/80 text-sm mb-2 block">Max Price</Label>
          <Input
            type="number"
            placeholder="$10000"
            value={filters.priceMax}
            onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30 focus:border-blue-400/50"
          />
        </div>

        {/* Availability Only */}
        <div className="flex items-center space-x-2 mt-6">
          <input
            type="checkbox"
            id="availability"
            checked={filters.availabilityOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, availabilityOnly: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
          />
          <Label htmlFor="availability" className="text-white/80 text-sm">
            Available beds only
          </Label>
        </div>
      </div>

      {/* Active Filter Count */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-white/20"
        >
          <p className="text-white/70 text-sm">
            {Object.values(filters).filter(value => 
              typeof value === 'boolean' ? value : value !== ''
            ).length} filter{Object.values(filters).filter(value => 
              typeof value === 'boolean' ? value : value !== ''
            ).length !== 1 ? 's' : ''} active
          </p>
        </motion.div>
      )}
    </Card>
  )
}
