"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Page = 'home' | 'about' | 'placement' | 'contact' | 'privacy' | 'disclosure'

interface NavigationContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <NavigationContext.Provider 
      value={{ 
        currentPage, 
        setCurrentPage, 
        isLoading, 
        setIsLoading 
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
