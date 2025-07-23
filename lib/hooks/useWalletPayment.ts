import { useState } from 'react'
import { useAccount, useConnect, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { APP_OWNER_ADDRESS, PAYMENT_AMOUNT } from '../wagmi'

export function useWalletPayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { sendTransactionAsync } = useSendTransaction()

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      // If not connected, connect wallet first
      if (!isConnected) {
        const connector = connectors[0] // Using first available connector (injected)
        if (!connector) {
          throw new Error('No wallet connector available')
        }
        await connect({ connector })
      }

      // Send payment transaction
      const hash = await sendTransactionAsync({
        to: APP_OWNER_ADDRESS,
        value: parseEther(PAYMENT_AMOUNT.toString()),
      })

      return { success: true, hash }
    } catch (err) {
      console.error('Payment error:', err)
      setError(err instanceof Error ? err.message : 'Payment failed')
      return { success: false, error: err }
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    handlePayment,
    isProcessing,
    error,
    isConnected,
    address
  }
} 