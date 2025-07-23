"use client"

import dynamic from 'next/dynamic'

const QuizClient = dynamic(() => import('./QuizClient'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    </div>
  )
})

export default function QuizWrapper() {
  return <QuizClient />
} 