import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Your wallet address for receiving ETH payments
export const APP_OWNER_ADDRESS = '0xaE57aA122e6afA07490FDDf024400BF5766BE671'

// Payment amount in ETH
export const PAYMENT_AMOUNT = 0.001

// Base network configuration
const baseChain = {
  ...base,
  rpcUrls: {
    ...base.rpcUrls,
    // Using Base's public RPC for Mini App compatibility
    default: { 
      http: ['https://mainnet.base.org']
    },
    public: {
      http: ['https://mainnet.base.org']
    }
  }
}

// Wagmi config with Base network
export const config = createConfig({
  chains: [baseChain],
  connectors: [
    injected(),
  ],
  transports: {
    [baseChain.id]: http(),
  },
}) 