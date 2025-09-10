"use client"

import { useState, useEffect } from 'react'
import type { Facility } from '@/types/facility'

export function useFacilities() {
  const [facilities, setFacilities] = useState<Facility[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFacilities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/facilities')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch facilities: ${response.status}`)
      }
      
      const data = await response.json()
      setFacilities(data.facilities || [])
    } catch (err) {
      console.error('Error fetching facilities:', err)
      setError(err instanceof Error ? err.message : 'Failed to load facilities')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    fetchFacilities()
  }

  useEffect(() => {
    fetchFacilities()
  }, [])

  return {
    facilities,
    loading,
    error,
    refreshData
  }
}
