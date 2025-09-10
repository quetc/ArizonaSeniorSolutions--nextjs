import { NextResponse } from 'next/server'
import type { Facility } from '@/types/facility'

// Google Sheets CSV export URL
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1rdW8JWG734RdaZ3NHqin9E4Tdzin-52KuEriQYpM0IY/export?format=csv&gid=0'

// Force dynamic route to prevent static generation issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Geocoding cache to avoid repeated API calls
const geocodeCache = new Map<string, { lat: number, lng: number, geocoded: boolean }>()

// Rate limiting for geocoding API calls
let lastGeocodingCall = 0
const GEOCODING_DELAY = 100 // 100ms between calls to respect rate limits

export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheets data: ${response.status}`)
    }

    const csvText = await response.text()
    const rawFacilities = parseCSVToFacilities(csvText)
    
    // Geocode facilities that don't have coordinates yet
    const facilities = await geocodeFacilities(rawFacilities)

    return NextResponse.json({
      facilities,
      count: facilities.length,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching facilities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch facilities data' },
      { status: 500 }
    )
  }
}

function parseCSVToFacilities(csvText: string): Facility[] {
  const lines = csvText.split('\n')
  if (lines.length < 2) return []

  // Get headers from first line
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  // Expected headers based on your Google Sheet:
  // Name, Added_By, Address, City, Zip, Phone, Contact_Person, Facility_Type, Available_Beds, Price_Min, Price_Max, ALTCS_Accepted, Special_Services, Notes, Date_Added
  
  const facilities: Facility[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = parseCSVLine(line)
    if (values.length < headers.length) continue
    
    // Skip rows where Name is empty (first required field)
    if (!values[0] || values[0].trim() === '') continue
    
    const facility: Facility = {
      id: `facility-${i}`, // Generate unique ID
      name: values[0] || '',
      added_by: values[1] || '',
      address: values[2] || '',
      city: values[3] || '',
      zip: values[4] || '',
      phone: values[5] || '',
      contact_person: values[6] || '',
      facility_type: values[7] || '',
      available_beds: values[8] || '',
      price_min: values[9] || '',
      price_max: values[10] || '',
      altcs_accepted: values[11] || '',
      special_services: values[12] || '',
      notes: values[13] || '',
      date_added: values[14] || '',
    }
    
    facilities.push(facility)
  }
  
  return facilities
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result.map(val => val.replace(/"/g, ''))
}

// Geocode facilities using Google Maps Geocoding API
async function geocodeFacilities(facilities: Facility[]): Promise<Facility[]> {
  const geocodedFacilities: Facility[] = []
  
  for (const facility of facilities) {
    const fullAddress = `${facility.address}, ${facility.city}, AZ ${facility.zip}`.trim()
    
    // Check cache first
    if (geocodeCache.has(fullAddress)) {
      const cached = geocodeCache.get(fullAddress)!
      geocodedFacilities.push({
        ...facility,
        latitude: cached.lat,
        longitude: cached.lng,
        geocoded: cached.geocoded
      })
      continue
    }
    
    try {
      // Rate limiting
      const now = Date.now()
      if (now - lastGeocodingCall < GEOCODING_DELAY) {
        await new Promise(resolve => setTimeout(resolve, GEOCODING_DELAY - (now - lastGeocodingCall)))
      }
      lastGeocodingCall = Date.now()
      
      const coords = await geocodeAddress(fullAddress)
      
      // Cache the result
      geocodeCache.set(fullAddress, coords)
      
      geocodedFacilities.push({
        ...facility,
        latitude: coords.lat,
        longitude: coords.lng,
        geocoded: coords.geocoded
      })
    } catch (error) {
      console.error(`Geocoding failed for ${facility.name} at ${fullAddress}:`, error)
      
      // Fallback to city-based coordinates
      const fallbackCoords = getFallbackCoordinates(facility.city, facility.zip)
      geocodeCache.set(fullAddress, fallbackCoords)
      
      geocodedFacilities.push({
        ...facility,
        latitude: fallbackCoords.lat,
        longitude: fallbackCoords.lng,
        geocoded: fallbackCoords.geocoded
      })
    }
  }
  
  return geocodedFacilities
}

// Use Google Maps Geocoding API
async function geocodeAddress(address: string): Promise<{ lat: number, lng: number, geocoded: boolean }> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    throw new Error('Google Maps API key not configured')
  }
  
  const encodedAddress = encodeURIComponent(address)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Geocoding API request failed: ${response.status}`)
  }
  
  const data = await response.json()
  
  if (data.status !== 'OK' || !data.results || data.results.length === 0) {
    throw new Error(`Geocoding failed: ${data.status} - ${data.error_message || 'No results'}`)
  }
  
  const location = data.results[0].geometry.location
  return {
    lat: location.lat,
    lng: location.lng,
    geocoded: true
  }
}

// Fallback coordinates based on city/ZIP when geocoding fails
function getFallbackCoordinates(city: string, zip: string): { lat: number, lng: number, geocoded: boolean } {
  // City coordinates mapping
  const cityCoords: { [key: string]: { lat: number, lng: number } } = {
    'Phoenix': { lat: 33.4484, lng: -112.0740 },
    'Scottsdale': { lat: 33.4942, lng: -111.9261 },
    'Mesa': { lat: 33.4152, lng: -111.8315 },
    'Tempe': { lat: 33.4255, lng: -111.9400 },
    'Chandler': { lat: 33.3062, lng: -111.8413 },
    'Gilbert': { lat: 33.3528, lng: -111.7890 },
    'Glendale': { lat: 33.5387, lng: -112.1860 },
    'Peoria': { lat: 33.5806, lng: -112.2374 },
    'Surprise': { lat: 33.6292, lng: -112.3679 },
    'Avondale': { lat: 33.4356, lng: -112.3496 },
    'Goodyear': { lat: 33.4355, lng: -112.3576 },
    'Buckeye': { lat: 33.3703, lng: -112.5838 },
  }
  
  // ZIP code to city mapping for major areas
  const zipToCity: { [key: string]: string } = {
    // Gilbert ZIP codes
    '85233': 'Gilbert', '85234': 'Gilbert', '85295': 'Gilbert', '85296': 'Gilbert',
    '85297': 'Gilbert', '85298': 'Gilbert',
    // Phoenix ZIP codes
    '85001': 'Phoenix', '85002': 'Phoenix', '85003': 'Phoenix', '85004': 'Phoenix',
    '85006': 'Phoenix', '85007': 'Phoenix', '85008': 'Phoenix', '85009': 'Phoenix',
    '85012': 'Phoenix', '85013': 'Phoenix', '85014': 'Phoenix', '85015': 'Phoenix',
    '85016': 'Phoenix', '85017': 'Phoenix', '85018': 'Phoenix', '85019': 'Phoenix',
    '85020': 'Phoenix', '85021': 'Phoenix', '85022': 'Phoenix', '85023': 'Phoenix',
    '85024': 'Phoenix', '85027': 'Phoenix', '85028': 'Phoenix', '85029': 'Phoenix',
    '85032': 'Phoenix', '85033': 'Phoenix', '85034': 'Phoenix', '85035': 'Phoenix',
    '85037': 'Phoenix', '85040': 'Phoenix', '85041': 'Phoenix', '85042': 'Phoenix',
    '85043': 'Phoenix', '85044': 'Phoenix', '85045': 'Phoenix', '85048': 'Phoenix',
    '85051': 'Phoenix', '85053': 'Phoenix', '85054': 'Phoenix', '85083': 'Phoenix',
    // Scottsdale ZIP codes
    '85250': 'Scottsdale', '85251': 'Scottsdale', '85252': 'Scottsdale', '85253': 'Scottsdale',
    '85254': 'Scottsdale', '85255': 'Scottsdale', '85256': 'Scottsdale', '85257': 'Scottsdale',
    '85258': 'Scottsdale', '85259': 'Scottsdale', '85260': 'Scottsdale', '85261': 'Scottsdale',
    '85262': 'Scottsdale', '85266': 'Scottsdale', '85267': 'Scottsdale', '85268': 'Scottsdale',
    // Mesa ZIP codes  
    '85201': 'Mesa', '85202': 'Mesa', '85203': 'Mesa', '85204': 'Mesa',
    '85205': 'Mesa', '85206': 'Mesa', '85207': 'Mesa', '85208': 'Mesa',
    '85209': 'Mesa', '85210': 'Mesa', '85211': 'Mesa', '85212': 'Mesa',
    '85213': 'Mesa', '85214': 'Mesa', '85215': 'Mesa', '85216': 'Mesa',
    // Tempe ZIP codes
    '85281': 'Tempe', '85282': 'Tempe', '85283': 'Tempe', '85284': 'Tempe', '85285': 'Tempe',
    // Chandler ZIP codes
    '85224': 'Chandler', '85225': 'Chandler', '85226': 'Chandler', '85248': 'Chandler', '85249': 'Chandler',
    // Glendale ZIP codes
    '85301': 'Glendale', '85302': 'Glendale', '85303': 'Glendale', '85304': 'Glendale',
    '85305': 'Glendale', '85306': 'Glendale', '85307': 'Glendale', '85308': 'Glendale', '85309': 'Glendale',
    // Peoria ZIP codes
    '85345': 'Peoria', '85381': 'Peoria', '85382': 'Peoria', '85383': 'Peoria', '85385': 'Peoria',
    // Surprise ZIP codes  
    '85374': 'Surprise', '85378': 'Surprise', '85387': 'Surprise', '85388': 'Surprise',
    // Avondale ZIP codes
    '85323': 'Avondale', '85392': 'Avondale', '85393': 'Avondale',
    // Goodyear ZIP codes
    '85338': 'Goodyear', '85395': 'Goodyear',
    // Buckeye ZIP codes
    '85326': 'Buckeye', '85396': 'Buckeye'
  }
  
  // Check if it's a ZIP code first, then convert to city
  const cityName = zipToCity[zip] || city
  const baseCoords = cityCoords[cityName] || { lat: 33.4484, lng: -112.0740 } // Default to Phoenix
  
  // Add small random offset to avoid overlapping markers
  const hash = city.length + zip.length
  const latOffset = ((hash % 100) / 1000) * 0.02 // Small offset within city bounds
  const lngOffset = (((hash >> 4) % 100) / 1000) * 0.02
  
  return {
    lat: baseCoords.lat + latOffset,
    lng: baseCoords.lng + lngOffset,
    geocoded: false // Mark as fallback coordinates
  }
}
