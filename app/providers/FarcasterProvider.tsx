"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface FarcasterContextType {
  isReady: boolean
  error: string | null
}

const FarcasterContext = createContext<FarcasterContextType>({
  isReady: false,
  error: null
})

export const useFarcaster = () => useContext(FarcasterContext)

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initFarcaster = async () => {
      try {
        // Check if we're in a Farcaster frame environment
        const isFarcaster = typeof window !== 'undefined' && 
          window.parent !== window && 
          window.location.ancestorOrigins?.[0]?.includes('warpcast.com')
        
        if (mounted) {
          setIsReady(true)
          if (!isFarcaster) {
            console.warn('Not running in a Farcaster frame environment')
          }
        }
      } catch (err) {
        console.error('Failed to initialize Farcaster:', err)
        if (mounted) {
          setError('Failed to initialize Farcaster integration')
        }
      }
    }

    // Initialize immediately
    initFarcaster()

    // Cleanup function
    return () => {
      mounted = false
    }
  }, [])

  return (
    <FarcasterContext.Provider value={{ isReady, error }}>
      {children}
    </FarcasterContext.Provider>
  )
} 