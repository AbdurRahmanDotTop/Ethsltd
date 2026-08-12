import { Button } from "@/components/ui/button"

export function EducationalSection() {
  const articles = [
    { category: "Crypto Basics", title: "What is Crypto Trading?", desc: "Introductory explanation to digital assets." },
    { category: "Trading", title: "How Spot Trading Works", desc: "Understand buy and sell orders." },
    { category: "Trading", title: "What is Paper Trading?", desc: "Learn how to use simulated trading." },
    { category: "Security", title: "Understanding Market Risk", desc: "An overview of volatility and risk management." },
  ]

  return (
    <section className="bg-background py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              New to Crypto? Start Here.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Access guides and insights to understand the platform and digital asset markets.
            </p>
          </div>
          <Button variant="outline" className="border-border">Explore Learning Center</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <div key={i} className="bg-muted border border-border rounded-xl p-6 hover:bg-card transition-colors group cursor-pointer flex flex-col h-full">
              <span className="text-xs font-medium text-[var(--brand-foreground)] uppercase tracking-wider mb-4">
                {article.category}
              </span>
              <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-[var(--brand-foreground)] transition-colors">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-8 flex-1">
                {article.desc}
              </p>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground/80 mt-auto">
                <span>5 min read</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
