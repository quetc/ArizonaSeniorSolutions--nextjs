export interface Facility {
  id: string
  name: string
  address: string
  city: string
  zip: string
  phone: string
  contact_person?: string
  facility_type: string
  available_beds?: number | string
  price_min?: number | string
  price_max?: number | string
  altcs_accepted?: 'Yes' | 'No' | 'Pending' | string
  special_services?: string
  notes?: string
  date_added?: string
  added_by?: string
}

export interface FacilityFilters {
  facilityType?: string
  city?: string
  altcsAccepted?: string
  availabilityOnly?: boolean
  priceMin?: number
  priceMax?: number
}
