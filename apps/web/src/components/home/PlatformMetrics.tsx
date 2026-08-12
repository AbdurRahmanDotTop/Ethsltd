export function PlatformMetrics() {
  const metrics = [
    { label: "Real-Time Markets", value: "100+", subtext: "Supported trading pairs" },
    { label: "Digital Assets", value: "50+", subtext: "Curated for security" },
    { label: "Trading Tools", value: "Advanced", subtext: "For professional traders" },
    { label: "Availability", value: "24/7", subtext: "Always-on infrastructure" },
  ]

  return (
    <section className="bg-background py-16 border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/5">
          {metrics.map((metric, i) => (
            <div key={i} className={`flex flex-col ${i !== 0 ? 'pl-8 md:pl-12' : ''}`}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{metric.label}</h4>
              <p className="font-display text-4xl font-bold text-foreground mb-2 tracking-tight">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
