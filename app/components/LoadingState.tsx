"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LoadingStateProps {
  title: string
  message: string
}

export function LoadingState({ title, message }: LoadingStateProps) {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader className="space-y-4">
        <div className="mx-auto w-16 h-16 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{message}</p>
      </CardContent>
    </Card>
  )
} 