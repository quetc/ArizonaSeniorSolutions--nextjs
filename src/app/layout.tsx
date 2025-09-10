import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavigationProvider } from '@/contexts/NavigationContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Senior Care Solutions of AZ',
  description: 'Providing the best senior care solutions in Arizona with integrity, kindness, and respect.',
  keywords: 'Senior Care, Assisted Living, Memory Care, Independent Living, Arizona',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </body>
    </html>
  )
}
