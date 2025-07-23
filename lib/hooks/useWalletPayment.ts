import { useState } from 'react'
import { useAccount, useConnect, useSendTransaction, useNetwork, useSwitchNetwork } from 'wagmi'
import { parseEther } from 'viem'
import { APP_OWNER_ADDRESS, PAYMENT_AMOUNT } from '../wagmi'

export function useWalletPayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { sendTransactionAsync } = useSendTransaction()

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      // If not connected, connect wallet first
      if (!isConnected) {
        const connector = connectors[0] // Using first available connector (injected)
        if (!connector) {
          throw new Error('Please install a Web3 wallet that supports Base network')
        }
        await connect({ connector })
      }

      // Check if on Base network
      if (chain?.id !== 8453) {
        if (switchNetwork) {
          await switchNetwork(8453)
        } else {
          throw new Error('Please switch to Base network manually in your wallet')
        }
      }

      // Send ETH payment transaction
      const hash = await sendTransactionAsync({
        to: APP_OWNER_ADDRESS,
        value: parseEther(PAYMENT_AMOUNT.toString()),
        chainId: 8453, // Base mainnet
      })

      return { success: true, hash }
    } catch (err) {
      console.error('Payment error:', err)
      let errorMessage = 'Failed to process payment'
      
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('insufficient funds')) {
          errorMessage = `Insufficient funds. Please make sure you have at least ${PAYMENT_AMOUNT} ETH on Base network`
        } else if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected. Please try again'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
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
    address,
    currentChain: chain
  }
} 