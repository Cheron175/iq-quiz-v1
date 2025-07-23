import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(),
  },
})

// Placeholder address for the app owner - replace with actual address
export const APP_OWNER_ADDRESS = '0xYourAddressHere'

// Payment amount in ETH
export const PAYMENT_AMOUNT = 0.01 