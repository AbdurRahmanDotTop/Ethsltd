"use client"
import { useState, useEffect } from "react"
import { format } from "date-fns"

export function EconomicCalendar() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, this would fetch from ForexFactory or similar API
    // We mock the structure here as a placeholder for the UI component
    const fetchEvents = async () => {
      setLoading(true)
      try {
        // Mocking some events since we don't have a direct API integration for this yet
        const mockEvents = [
          { id: 1, country: 'USD', title: 'Non-Farm Employment Change', impact: 'High', actual: '254K', forecast: '147K', previous: '159K', date: new Date().toISOString() },
          { id: 2, country: 'USD', title: 'Unemployment Rate', impact: 'High', actual: '4.1%', forecast: '4.2%', previous: '4.2%', date: new Date().toISOString() },
          { id: 3, country: 'EUR', title: 'ECB President Lagarde Speaks', impact: 'Medium', actual: '', forecast: '', previous: '', date: new Date(Date.now() + 3600000).toISOString() },
          { id: 4, country: 'GBP', title: 'Construction PMI', impact: 'Low', actual: '57.2', forecast: '53.1', previous: '53.6', date: new Date(Date.now() - 3600000).toISOString() },
        ]
        setEvents(mockEvents)
      } catch (e) {
        console.error("Failed to fetch economic calendar")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (loading) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Loading calendar...</div>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="text-muted-foreground border-b border-border text-xs sticky top-0 bg-background z-10">
        <tr>
          <th className="py-3 pl-4 font-medium">Time</th>
          <th className="py-3 font-medium">Currency</th>
          <th className="py-3 font-medium">Impact</th>
          <th className="py-3 font-medium">Event</th>
          <th className="py-3 font-medium">Actual</th>
          <th className="py-3 font-medium">Forecast</th>
          <th className="py-3 pr-4 font-medium">Previous</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
            <td className="py-3 pl-4 whitespace-nowrap">{format(new Date(event.date), "HH:mm")}</td>
            <td className="py-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                event.country === 'USD' ? 'bg-blue-500/10 text-blue-500' :
                event.country === 'EUR' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-slate-500/10 text-slate-500'
              }`}>
                {event.country}
              </span>
            </td>
            <td className="py-3">
              <div className="flex gap-0.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full ${
                    event.impact === 'High' ? (i <= 3 ? 'bg-danger' : 'bg-muted') :
                    event.impact === 'Medium' ? (i <= 2 ? 'bg-warning' : 'bg-muted') :
                    (i <= 1 ? 'bg-success' : 'bg-muted')
                  }`} />
                ))}
              </div>
            </td>
            <td className="py-3 font-medium">{event.title}</td>
            <td className={`py-3 font-mono font-bold ${
              event.actual > event.forecast ? 'text-success' :
              event.actual < event.forecast ? 'text-danger' : ''
            }`}>{event.actual || '-'}</td>
            <td className="py-3 font-mono text-muted-foreground">{event.forecast || '-'}</td>
            <td className="py-3 pr-4 font-mono text-muted-foreground">{event.previous || '-'}</td>
          </tr>
        ))}
        {events.length === 0 && (
          <tr>
            <td colSpan={7} className="text-center py-8 text-muted-foreground">
              No upcoming events
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
