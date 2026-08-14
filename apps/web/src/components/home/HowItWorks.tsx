export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      desc: "Register and complete required verification.",
    },
    {
      step: "02",
      title: "Explore Markets",
      desc: "Discover available assets and trading pairs.",
    },
    {
      step: "03",
      title: "Practice or Trade",
      desc: "Use demo trading or eligible live trading functionality.",
    },
    {
      step: "04",
      title: "Manage Your Portfolio",
      desc: "Monitor assets, orders and account activity.",
    },
  ]

  return (
    <section className="bg-muted py-24 border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-16 text-center">
          How ETHSLTD Works
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-foreground/10 -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center font-display font-bold text-xl text-[var(--brand-foreground)] mb-6 shadow-xl">
                {step.step}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
