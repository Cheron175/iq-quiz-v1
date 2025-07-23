import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/js' 

export function useFarcaster() {
  const [isReady, setIs] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkFarcasterEnvironment = async () => {
      try {
        await sdk.actions.ready()

        const isFarcaster = typeof window !== 'undefined' && 
          window.parent !== window && 
          window.location.ancestorOrigins?.[0]?.includes('warpcast.com')
        
        setIs(true)
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
