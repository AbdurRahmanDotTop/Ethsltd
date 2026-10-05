import { Metadata } from "next"
import { QuotesList } from "@/components/markets/QuotesList"

export const metadata: Metadata = {
  title: "Quotes | ETHSLTD",
  description: "Live crypto market quotes and prices.",
}

export default function QuotesPage() {
  return (
    <div className="min-h-screen bg-black">
      <QuotesList />
    </div>
  )
}
