import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
      <div className="mb-8">
        <h1 className="text-9xl font-display font-bold text-[var(--brand-foreground)]">404</h1>
        <h2 className="text-2xl font-bold text-foreground mt-4">This page doesn't exist.</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link href="/markets">Explore Markets</Link>
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
