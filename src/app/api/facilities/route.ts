import { NextResponse } from 'next/server'
import type { Facility } from '@/types/facility'

// Google Sheets CSV export URL
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1rdW8JWG734RdaZ3NHqin9E4Tdzin-52KuEriQYpM0IY/export?format=csv&gid=0'

// Force dynamic route to prevent static generation issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheets data: ${response.status}`)
    }

    const csvText = await response.text()
    const facilities = parseCSVToFacilities(csvText)

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
