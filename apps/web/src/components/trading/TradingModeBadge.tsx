export function TradingModeBadge() {
  return (
    <div className="flex items-center gap-2 bg-brand-foreground/10 text-brand-foreground px-3 py-1 rounded-full text-xs font-semibold border border-brand-foreground/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-foreground opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-foreground"></span>
      </span>
      PAPER TRADING
    </div>
  )
}
