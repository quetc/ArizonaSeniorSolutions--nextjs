"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Filter, Navigation, Plus, Loader2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import MapView from './MapView'
import FacilityCard from './FacilityCard'
import SearchFilters from './SearchFilters'
import TourPlanner from './TourPlanner'
import { useFacilities } from '@/hooks/useFacilities'
import type { Facility } from '@/types/facility'

export default function MapDashboard() {
  const { facilities, loading, error, refreshData } = useFacilities()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [clientLocation, setClientLocation] = useState('')
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([])
  const [nearbyFacilities, setNearbyFacilities] = useState<Facility[]>([])
  const [tourList, setTourList] = useState<Facility[]>([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [facilityType, setFacilityType] = useState('')
  const [showTourPlanner, setShowTourPlanner] = useState(false)
  const [showFacilityPanel, setShowFacilityPanel] = useState(true)

  // Proximity search function
  const findNearbyFacilities = async (location: string) => {
    if (!facilities || !location.trim()) return
    
    // Mock distance calculation - in production, use Google Maps Distance Matrix API
    const mockDistances = facilities.map(facility => ({
      ...facility,
      distance: Math.random() * 20 + 1, // Mock distance in miles
      driveTime: Math.floor(Math.random() * 30 + 5) // Mock drive time in minutes
    }))
    
    // Sort by distance and take top 7
    const sorted = mockDistances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 7)
    
    setNearbyFacilities(sorted)
    setFilteredFacilities(sorted)
  }

  // Handle client location search
  const handleLocationSearch = () => {
    if (clientLocation.trim()) {
      findNearbyFacilities(clientLocation)
      setShowTourPlanner(true)
    }
  }

  // Filter facilities based on criteria
  useEffect(() => {
    if (!facilities) return
    
    let filtered = nearbyFacilities.length > 0 ? nearbyFacilities : facilities
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(facility =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(facility => {
        const facilityMin = parseFloat(facility.price_min?.toString() || '0')
        const facilityMax = parseFloat(facility.price_max?.toString() || '999999')
        const filterMin = parseFloat(priceRange.min || '0')
        const filterMax = parseFloat(priceRange.max || '999999')
        
        return facilityMin >= filterMin && facilityMax <= filterMax
      })
    }
    
    // Apply facility type filter
    if (facilityType) {
      filtered = filtered.filter(facility => 
        facility.facility_type.toLowerCase().includes(facilityType.toLowerCase())
      )
    }
    
    setFilteredFacilities(filtered)
  }, [facilities, nearbyFacilities, searchTerm, priceRange, facilityType])

  // Tour management functions
  const addToTour = (facility: Facility) => {
    if (!tourList.find(f => f.id === facility.id)) {
      setTourList([...tourList, facility])
    }
  }

  const removeFromTour = (facility: Facility) => {
    setTourList(tourList.filter(f => f.id !== facility.id))
  }

  const clearTour = () => {
    setTourList([])
  }

  const optimizeRoute = () => {
    // Mock route optimization - in production, use Google Maps Directions API
    const optimized = [...tourList].sort(() => Math.random() - 0.5)
    setTourList(optimized)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid Glass Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-brand-glass-light border-b border-brand-blue-light/30 shadow-2xl"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <motion.h1 
              className="text-xl md:text-2xl font-bold text-white flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              <span className="hidden sm:inline">Care Home Locator</span>
              <span className="sm:hidden">Locator</span>
            </motion.h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={loading}
              className="text-white hover:bg-white/20 backdrop-blur-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              placeholder="Search facilities or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-brand-glass-light border-brand-blue-light/30 text-gray-800 placeholder:text-gray-600 backdrop-blur-sm focus:bg-brand-glass-medium focus:border-brand-blue-primary/50"
            />
          </div>

          {/* Client Location Input */}
          <div className="relative mb-3">
            <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              placeholder="Enter ZIP code or address to find nearby facilities..."
              value={clientLocation}
              onChange={(e) => setClientLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
              className="pl-10 pr-20 bg-brand-glass-light border-brand-blue-light/30 text-gray-800 placeholder:text-gray-600 backdrop-blur-sm focus:bg-brand-glass-medium focus:border-brand-blue-primary/50"
            />
            <Button
              onClick={handleLocationSearch}
              disabled={!clientLocation.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-3 bg-blue-500/30 text-white hover:bg-blue-500/40 disabled:opacity-50"
            >
              Find
            </Button>
          </div>

          {/* Quick Filters */}
          {nearbyFacilities.length > 0 && (
            <div className="mb-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Min price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30 focus:border-blue-400/50"
                />
                <Input
                  placeholder="Max price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30 focus:border-blue-400/50"
                />
              </div>
              <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white text-sm backdrop-blur-sm focus:bg-white/30 focus:border-blue-400/50 focus:outline-none"
              >
                <option value="" className="bg-slate-800">All Facility Types</option>
                <option value="memory care" className="bg-slate-800">Memory Care</option>
                <option value="assisted living home" className="bg-slate-800">Assisted Living Home</option>
                <option value="assisted living center" className="bg-slate-800">Assisted Living Center</option>
                <option value="independent living" className="bg-slate-800">Independent Living</option>
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 min-w-0 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <Filter className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-blue-500/30 text-white hover:bg-blue-500/40 backdrop-blur-sm border border-blue-400/30"
            >
              <MapPin className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{filteredFacilities.length} {nearbyFacilities.length > 0 ? 'Nearby' : 'Found'}</span>
              <span className="sm:hidden">{filteredFacilities.length}</span>
            </Button>
            {tourList.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTourPlanner(!showTourPlanner)}
                className="bg-green-500/30 text-white hover:bg-green-500/40 backdrop-blur-sm border border-green-400/30"
              >
                <span className="hidden sm:inline">Tour ({tourList.length})</span>
                <span className="sm:hidden">T({tourList.length})</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFacilityPanel(!showFacilityPanel)}
              className="bg-purple-500/30 text-white hover:bg-purple-500/40 backdrop-blur-sm border border-purple-400/30 md:hidden"
            >
              {showFacilityPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <SearchFilters 
                facilities={facilities || []}
                onFilterChange={setFilteredFacilities}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-280px)] md:h-[calc(100vh-200px)]">
        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative transition-all duration-300 ${
            showFacilityPanel 
              ? 'h-64 md:h-full md:flex-1' 
              : 'h-[calc(100vh-280px)] md:h-full md:flex-1'
          }`}
        >
          <Card className="h-full m-2 overflow-hidden glass-brand-light shadow-2xl">
            <MapView
              facilities={filteredFacilities}
              selectedFacility={selectedFacility}
              onFacilitySelect={setSelectedFacility}
              clientLocation={clientLocation}
            />
          </Card>
        </motion.div>

        {/* Right Sidebar - Facilities & Tour Planner */}
        <AnimatePresence>
          {showFacilityPanel && (
            <motion.div 
              initial={{ x: 0, opacity: 0, height: 0 }}
              animate={{ x: 0, opacity: 1, height: 'auto' }}
              exit={{ x: 0, opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-96 md:max-w-md flex flex-col flex-1 relative"
            >
              {/* Mobile Panel Header */}
              <div className="md:hidden sticky top-0 z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 p-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">
                    {nearbyFacilities.length > 0 ? `${filteredFacilities.length} Nearby` : `${filteredFacilities.length} Facilities`}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFacilityPanel(false)}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
          {/* Tour Planner - Collapsible on mobile */}
          {showTourPlanner && (
            <div className="p-2 pb-0">
              <TourPlanner
                tourList={tourList}
                onRemoveFromTour={removeFromTour}
                onClearTour={clearTour}
                onOptimizeRoute={optimizeRoute}
              />
            </div>
          )}

          {/* Facility List - Scrollable on mobile */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-96 md:max-h-full">
            {loading && (
              <Card className="p-6 glass-brand-light shadow-xl">
                <div className="flex items-center justify-center text-white">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Loading facilities...
                </div>
              </Card>
            )}

            {error && (
              <Card className="p-4 bg-red-500/20 backdrop-blur-xl border-red-400/30 shadow-xl">
                <p className="text-red-200 text-sm">{error}</p>
              </Card>
            )}

            {filteredFacilities.map((facility) => (
              <motion.div
                key={facility.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FacilityCard
                  facility={facility}
                  isSelected={selectedFacility?.id === facility.id}
                  onClick={() => setSelectedFacility(facility)}
                  clientLocation={clientLocation}
                  onAddToTour={nearbyFacilities.length > 0 ? addToTour : undefined}
                  isInTour={tourList.some(f => f.id === facility.id)}
                />
              </motion.div>
            ))}

            {!loading && filteredFacilities.length === 0 && (
              <Card className="p-6 glass-brand-light shadow-xl">
                <div className="text-center text-white/80">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-white/60" />
                  <p className="text-lg font-medium mb-2">
                    {clientLocation ? 'No nearby facilities found' : 'No facilities found'}
                  </p>
                  <p className="text-sm text-white/60">
                    {clientLocation 
                      ? 'Try expanding your search radius or adjusting filters'
                      : 'Enter a client address to find nearby facilities'
                    }
                  </p>
                </div>
              </Card>
            )}
          </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Show Panel Button */}
        {!showFacilityPanel && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 z-50 md:hidden"
          >
            <Button
              onClick={() => setShowFacilityPanel(true)}
              className="bg-blue-500/90 text-white hover:bg-blue-500 backdrop-blur-sm shadow-2xl rounded-full w-14 h-14 flex items-center justify-center"
            >
              <ChevronUp className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
