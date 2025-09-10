"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { Loader2, MapPin } from 'lucide-react'
import type { Facility } from '@/types/facility'


interface MapViewProps {
  facilities: Facility[]
  selectedFacility: Facility | null
  onFacilitySelect: (facility: Facility) => void
  clientLocation?: string
}

export default function MapView({ 
  facilities, 
  selectedFacility, 
  onFacilitySelect
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        // Check if Google Maps is loaded
        if (typeof window.google === 'undefined') {
          // Load Google Maps script
          const script = document.createElement('script')
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
          script.async = true
          script.defer = true
          
          script.onload = () => {
            createMap()
          }
          
          script.onerror = () => {
            setError('Failed to load Google Maps')
            setIsLoading(false)
          }
          
          document.head.appendChild(script)
        } else {
          createMap()
        }
      } catch {
        setError('Error initializing map')
        setIsLoading(false)
      }
    }

    const createMap = () => {
      if (!mapRef.current) return

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 33.4942, lng: -111.9261 }, // Scottsdale center
        zoom: 11,
        styles: [
          // Hide all POI labels and icons that create visual clutter
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ visibility: 'off' }]
          },
          // Style the base map
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#1a1a2e' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#1a1a2e' }, { weight: 2 }]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#16213e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [{ color: '#2d3748' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#4a5568' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{ color: '#3182ce' }]
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#4a5568' }, { weight: 0.5 }]
          }
        ],
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        },
        gestureHandling: 'cooperative'
      })

      setMap(mapInstance)
      setIsLoading(false)
    }

    initMap()
  }, [])

  // Update markers when facilities change
  useEffect(() => {
    if (!map || !facilities) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    
    const newMarkers: google.maps.Marker[] = []
    const bounds = new window.google.maps.LatLngBounds()

    facilities.forEach((facility) => {
      // For demo purposes, we'll use a geocoding service or mock coordinates
      // In production, you'd want to geocode the addresses
      const mockCoords = getMockCoordinates(facility.city)
      
      // Get facility type color
      const getFacilityColor = (type: string) => {
        const lowerType = type.toLowerCase()
        if (lowerType.includes('memory care')) return '#9333ea' // Purple
        if (lowerType.includes('assisted living home')) return '#3b82f6' // Blue
        if (lowerType.includes('assisted living center')) return '#10b981' // Green
        if (lowerType.includes('independent living')) return '#f59e0b' // Yellow
        return '#6b7280' // Gray default
      }

      const facilityColor = getFacilityColor(facility.facility_type)
      const isSelected = selectedFacility?.id === facility.id

      // Create custom marker with better visibility
      const marker = new window.google.maps.Marker({
        position: mockCoords,
        map: map,
        title: facility.name,
        icon: {
          path: 'M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z',
          fillColor: isSelected ? '#ff6b6b' : facilityColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
          scale: isSelected ? 2.2 : 1.8,
          anchor: new window.google.maps.Point(12, 24)
        },
        zIndex: isSelected ? 1000 : 100,
        animation: isSelected ? window.google.maps.Animation.BOUNCE : undefined
      })

      // Add info window on hover
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="color: #1f2937; font-family: system-ui; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${facility.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${facility.address}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${facility.city}, AZ ${facility.zip}</p>
            <div style="margin-top: 8px; padding: 4px 8px; background: ${facilityColor}20; border-radius: 4px; font-size: 11px; color: ${facilityColor}; font-weight: 500;">
              ${facility.facility_type}
            </div>
          </div>
        `
      })

      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker)
      })

      marker.addListener('mouseout', () => {
        infoWindow.close()
      })

      marker.addListener('click', () => {
        onFacilitySelect(facility)
        // Smooth pan to marker
        map.panTo(mockCoords)
      })

      newMarkers.push(marker)
      bounds.extend(mockCoords)
    })

    setMarkers(newMarkers)
    
    if (facilities.length > 0) {
      map.fitBounds(bounds)
    }
  }, [map, facilities, selectedFacility, onFacilitySelect, markers])

  // Mock coordinates for Arizona cities (replace with real geocoding)
  const getMockCoordinates = (city: string) => {
    const cityCoords: { [key: string]: { lat: number, lng: number } } = {
      'Phoenix': { lat: 33.4484 + (Math.random() - 0.5) * 0.1, lng: -112.0740 + (Math.random() - 0.5) * 0.1 },
      'Scottsdale': { lat: 33.4942 + (Math.random() - 0.5) * 0.05, lng: -111.9261 + (Math.random() - 0.5) * 0.05 },
      'Mesa': { lat: 33.4152 + (Math.random() - 0.5) * 0.05, lng: -111.8315 + (Math.random() - 0.5) * 0.05 },
      'Tempe': { lat: 33.4255 + (Math.random() - 0.5) * 0.03, lng: -111.9400 + (Math.random() - 0.5) * 0.03 },
      'Chandler': { lat: 33.3062 + (Math.random() - 0.5) * 0.05, lng: -111.8413 + (Math.random() - 0.5) * 0.05 },
      'Gilbert': { lat: 33.3528 + (Math.random() - 0.5) * 0.03, lng: -111.7890 + (Math.random() - 0.5) * 0.03 },
      'Glendale': { lat: 33.5387 + (Math.random() - 0.5) * 0.05, lng: -112.1860 + (Math.random() - 0.5) * 0.05 },
      'Peoria': { lat: 33.5806 + (Math.random() - 0.5) * 0.05, lng: -112.2374 + (Math.random() - 0.5) * 0.05 },
    }
    
    return cityCoords[city] || { lat: 33.4484 + (Math.random() - 0.5) * 0.2, lng: -112.0740 + (Math.random() - 0.5) * 0.2 }
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
        <div className="text-center text-white">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-red-400" />
          <p className="text-lg font-medium mb-2">Map Error</p>
          <p className="text-sm text-white/60">{error}</p>
          <p className="text-xs text-white/40 mt-2">
            Make sure Google Maps API key is configured
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
          <div className="text-center text-white">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
            <p>Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full rounded-lg" />
    </div>
  )
}
