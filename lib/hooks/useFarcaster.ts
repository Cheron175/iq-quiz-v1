import { useEffect, useState } from 'react'

export function useFarcaster() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkFarcasterEnvironment = async () => {
      try {
        // Check if we're in a Farcaster frame environment
        const isFarcaster = typeof window !== 'undefined' && 
          window.parent !== window && 
          window.location.ancestorOrigins?.[0]?.includes('warpcast.com')
        
        setIsReady(true)
        if (!isFarcaster) {
          console.warn('Not running in a Farcaster frame environment')
        }
      } catch (err) {
        console.error('Failed to initialize Farcaster:', err)
        setError('Failed to initialize Farcaster integration')
      }
    }

    checkFarcasterEnvironment()
  }, [])

  return { isReady, error }
} 