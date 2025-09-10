import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        <div className="mt-4 text-center text-muted-foreground">Loading...</div>
      </div>
    </div>
  )
}
