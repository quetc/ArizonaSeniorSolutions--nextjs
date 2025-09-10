"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Navigation, X, Clock, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Facility } from '@/types/facility'

interface TourPlannerProps {
  tourList: Facility[]
  onRemoveFromTour: (facility: Facility) => void
  onClearTour: () => void
  onOptimizeRoute: () => void
}

export default function TourPlanner({ 
  tourList, 
  onRemoveFromTour, 
  onClearTour,
  onOptimizeRoute 
}: TourPlannerProps) {
  const getTotalEstimatedTime = () => {
    // Estimate 30 minutes per facility + 15 minutes travel time
    return tourList.length * 45
  }

  const getAveragePriceRange = () => {
    if (tourList.length === 0) return { min: 0, max: 0 }
    
    const prices = tourList.map(f => ({
      min: parseFloat(f.price_min?.toString() || '0'),
      max: parseFloat(f.price_max?.toString() || '0')
    }))
    
    const avgMin = prices.reduce((sum, p) => sum + p.min, 0) / prices.length
    const avgMax = prices.reduce((sum, p) => sum + p.max, 0) / prices.length
    
    return { min: Math.round(avgMin), max: Math.round(avgMax) }
  }

  if (tourList.length === 0) {
    return (
      <Card className="p-6 glass-brand-light shadow-xl text-center">
        <MapPin className="w-12 h-12 mx-auto mb-3 text-white/60" />
        <h3 className="text-lg font-semibold text-white mb-2">Tour Itinerary</h3>
        <p className="text-white/70 text-sm">
          Add facilities to build a tour route for your client
        </p>
      </Card>
    )
  }

  const avgPrices = getAveragePriceRange()

  return (
    <Card className="p-4 glass-brand-light shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Tour Itinerary ({tourList.length})
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOptimizeRoute}
            className="text-blue-200 hover:bg-blue-500/20 border border-blue-400/30"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Optimize
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearTour}
            className="text-red-200 hover:bg-red-500/20 border border-red-400/30"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Tour Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-brand-glass-light rounded-lg">
          <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
          <div className="text-sm font-medium text-white">
            {Math.floor(getTotalEstimatedTime() / 60)}h {getTotalEstimatedTime() % 60}m
          </div>
          <div className="text-xs text-white/60">Est. Time</div>
        </div>
        <div className="text-center p-3 bg-brand-glass-light rounded-lg">
          <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-400" />
          <div className="text-sm font-medium text-white">
            ${avgPrices.min.toLocaleString()} - ${avgPrices.max.toLocaleString()}
          </div>
          <div className="text-xs text-white/60">Avg Range</div>
        </div>
        <div className="text-center p-3 bg-brand-glass-light rounded-lg">
          <Users className="w-4 h-4 mx-auto mb-1 text-purple-400" />
          <div className="text-sm font-medium text-white">
            {new Set(tourList.map(f => f.facility_type)).size}
          </div>
          <div className="text-xs text-white/60">Types</div>
        </div>
      </div>

      {/* Tour List */}
      <div className="space-y-2 max-h-48 md:max-h-60 overflow-y-auto">
        <AnimatePresence>
          {tourList.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 p-3 bg-brand-glass-light rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">
                  {facility.name}
                </h4>
                <p className="text-xs text-white/70 truncate">
                  {facility.address}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-green-400">
                    ${facility.price_min} - ${facility.price_max}
                  </span>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const address = encodeURIComponent(`${facility.address}, ${facility.city}, AZ`)
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
                  }}
                  className="p-1 h-8 w-8 text-blue-200 hover:bg-blue-500/20"
                >
                  <Navigation className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFromTour(facility)}
                  className="p-1 h-8 w-8 text-red-200 hover:bg-red-500/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Export Options */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const tourData = tourList.map((f, i) => 
              `${i + 1}. ${f.name}\n   ${f.address}\n   ${f.phone || 'No phone'}\n   $${f.price_min} - $${f.price_max}\n`
            ).join('\n')
            
            const subject = `Tour Itinerary - ${tourList.length} Facilities`
            const body = `Tour Itinerary:\n\n${tourData}\nEstimated Time: ${Math.floor(getTotalEstimatedTime() / 60)}h ${getTotalEstimatedTime() % 60}m`
            
            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
          }}
          className="flex-1 text-white hover:bg-white/20"
        >
          Email Tour
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const tourData = tourList.map((f, i) => 
              `${i + 1}. ${f.name} - ${f.address} - $${f.price_min}-$${f.price_max}`
            ).join('\n')
            
            navigator.clipboard.writeText(tourData)
            // You could add a toast notification here
          }}
          className="flex-1 text-white hover:bg-white/20"
        >
          Copy List
        </Button>
      </div>
    </Card>
  )
}
