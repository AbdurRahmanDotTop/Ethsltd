"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Announcement Bar */}
      {announcementVisible && (
        <div className="bg-brand-700 text-white px-4 py-2 text-sm flex justify-center items-center relative">
          <span>ETHSLTD Markets are live — Explore the latest digital assets &rarr;</span>
          <button 
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-4 text-white/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display font-bold text-xl text-foreground tracking-tight">
              ETHSLTD
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/markets" className={`text-sm font-medium transition-colors ${pathname === '/markets' ? 'text-brand-foreground font-semibold border-b-2 border-brand-foreground pb-1' : 'text-muted-foreground hover:text-foreground'}`}>Markets</Link>
              <Link href="/trade" className={`text-sm font-medium transition-colors ${pathname.startsWith('/trade') ? 'text-brand-foreground font-semibold border-b-2 border-brand-foreground pb-1' : 'text-muted-foreground hover:text-foreground pb-1'}`}>Trade</Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-1">P2P</Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-1">Assets</Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-1">Learn</Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pb-1">More ▾</Link>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors w-9 h-9 flex items-center justify-center">
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-2">Log In</Link>
            <Button variant="default">Sign Up</Button>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <button className="text-foreground">
              <Search className="h-5 w-5" />
            </button>
            <button 
              className="text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full h-screen bg-background border-t border-border p-4">
          <nav className="flex flex-col gap-4">
            <Link href="/markets" className={`text-lg font-medium py-2 border-b border-border ${pathname === '/markets' ? 'text-brand-foreground font-semibold' : 'text-foreground'}`}>Markets</Link>
            <Link href="/trade" className={`text-lg font-medium py-2 border-b border-border ${pathname.startsWith('/trade') ? 'text-brand-foreground font-semibold' : 'text-foreground'}`}>Trade</Link>
            <Link href="#" className="text-lg font-medium text-foreground py-2 border-b border-border">P2P</Link>
            <Link href="#" className="text-lg font-medium text-foreground py-2 border-b border-border">Assets</Link>
            <Link href="#" className="text-lg font-medium text-foreground py-2 border-b border-border">Learn</Link>
            <div className="flex flex-col gap-3 mt-4">
              <Button variant="outline" className="w-full justify-center">Log In</Button>
              <Button variant="default" className="w-full justify-center">Sign Up</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
