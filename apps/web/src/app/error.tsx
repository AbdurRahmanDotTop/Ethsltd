"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertOctagon } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertOctagon className="w-8 h-8 text-destructive" />
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong.</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        An unexpected error occurred. Our engineering team has been notified.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" onClick={() => reset()}>
          Try Again
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link href="/support">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
