"use client"

import React from "react"
import { useNavigation } from "@/contexts/NavigationContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LoadingSpinner from "@/components/LoadingSpinner"
import PageTransition from "@/components/PageTransition"
import HomePage from "@/components/pages/HomePage"
import AboutPage from "@/components/pages/AboutPage"
import ContactPage from "@/components/pages/ContactPage"
import PlacementPage from "@/components/pages/PlacementPage"

export default function SPA() {
  const { currentPage, isLoading } = useNavigation()

  const renderPage = () => {
    if (isLoading) {
      return <LoadingSpinner />
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'about':
        return <AboutPage />
      case 'placement':
        return <PlacementPage />
      case 'contact':
        return <ContactPage />
      case 'privacy':
        return <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl">Privacy Page - Coming Soon</h1>
        </div>
      case 'disclosure':
        return <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl">Disclosure Page - Coming Soon</h1>
        </div>
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <main className="main-content">
        <PageTransition pageKey={currentPage}>
          {renderPage()}
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}
