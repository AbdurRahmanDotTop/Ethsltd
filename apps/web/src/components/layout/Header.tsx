"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, X, User, ChevronDown, LogOut, LayoutDashboard, Shield, Settings, Bell, Info } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { useTradingModeStore } from "@/stores/trading-mode-store"
import { apiClient } from "@ethsltd/api-client"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { NotificationBell } from "@/components/notifications/NotificationBell"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { user, status, logout } = useAuthStore()
  const { mode, toggleMode } = useTradingModeStore()

  const handleLogout = async () => {
    await apiClient.logout()
    logout()
    setDropdownOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Sync mode with API client and reload page if needed or invalidate queries
  useEffect(() => {
    apiClient.setMode(mode);
  }, [mode]);

  const renderToggle = () => (
    <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border">
      <span className={`text-xs font-medium ${mode === 'REAL' ? 'text-green-500' : 'text-muted-foreground'}`}>Real</span>
      <button 
        onClick={toggleMode}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${mode === 'PAPER' ? 'bg-orange-500' : 'bg-muted-foreground/30'}`}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${mode === 'PAPER' ? 'translate-x-4.5' : 'translate-x-1'}`} />
      </button>
      <span className={`text-xs font-medium ${mode === 'PAPER' ? 'text-orange-500' : 'text-muted-foreground'}`}>Paper</span>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Paper Trading Banner */}
      {mode === 'PAPER' && (
        <div className="bg-orange-500 text-white px-4 py-1.5 text-[10px] sm:text-xs font-bold flex justify-center items-center tracking-wider sm:tracking-widest uppercase">
          ⚠️ YOU ARE IN PAPER TRADING MODE — NO REAL FUNDS AT RISK ⚠️
        </div>
      )}
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
              <Link href="/p2p" className={`text-sm font-medium transition-colors ${pathname.startsWith('/p2p') ? 'text-brand-foreground font-semibold border-b-2 border-brand-foreground pb-1' : 'text-muted-foreground hover:text-foreground pb-1'}`}>P2P</Link>
              <Link href="/wallet" className={`text-sm font-medium transition-colors ${pathname.startsWith('/wallet') ? 'text-brand-foreground font-semibold border-b-2 border-brand-foreground pb-1' : 'text-muted-foreground hover:text-foreground pb-1'}`}>Wallet</Link>
              <Link href="/markets" className={`text-sm font-medium transition-colors ${pathname === '/markets' ? 'text-brand-foreground font-semibold border-b-2 border-brand-foreground pb-1' : 'text-muted-foreground hover:text-foreground pb-1'}`}>Assets</Link>
              <Link href="/learn" className={`text-sm font-medium transition-colors ${pathname.startsWith('/learn') ? 'text-brand-foreground font-semibold border-b-2 border-brand-foreground pb-1' : 'text-muted-foreground hover:text-foreground pb-1'}`}>Learn</Link>
              
              {/* More Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setMoreDropdownOpen(true)}
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <button 
                  className={`text-sm font-medium transition-colors flex items-center gap-1 ${moreDropdownOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} pb-1`}
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                >
                  More <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {moreDropdownOpen && (
                  <div className="absolute top-full right-0 pt-2 w-48 z-50">
                    <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden py-1">
                      <Link href="/fees" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">Fees</Link>
                      <Link href="/account/security" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">Security</Link>
                      <Link href="/support" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">Support</Link>
                      <Link href="/developer" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">Developer API</Link>
                      <Link href="/about" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">About ETHSLTD</Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors w-9 h-9 flex items-center justify-center">
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            
            {/* Paper Trading Toggle */}
            {renderToggle()}

            {status === "authenticated" && user ? (
              <>
                <NotificationBell />
                <div className="relative ml-2">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-muted/50 py-1.5 px-3 rounded-full transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{user.displayName || user.email.split('@')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-border mb-2">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Account ID: {user.id.substring(0,8)}...</p>
                    </div>
                    <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" /> Account
                    </Link>
                    <Link href="/account/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => setDropdownOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link href="/account/security" className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => setDropdownOpen(false)}>
                      <Shield className="w-4 h-4" /> Security
                    </Link>
                    <Link href="/account/preferences" className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => setDropdownOpen(false)}>
                      <Settings className="w-4 h-4" /> Preferences
                    </Link>
                    <div className="border-t border-border mt-2 pt-2">
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-2">Log In</Link>
                <Button variant="default" asChild><Link href="/register">Sign Up</Link></Button>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {/* Paper Trading Toggle Mobile */}
            <div className="scale-90 origin-right">
              {renderToggle()}
            </div>
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
            <Link href="/markets" className={`text-lg font-medium py-2 border-b border-border ${pathname === '/markets' ? 'text-brand-foreground font-semibold' : 'text-foreground'}`} onClick={() => setMobileMenuOpen(false)}>Markets</Link>
            <Link href="/trade" className={`text-lg font-medium py-2 border-b border-border ${pathname.startsWith('/trade') ? 'text-brand-foreground font-semibold' : 'text-foreground'}`} onClick={() => setMobileMenuOpen(false)}>Trade</Link>
            <Link href="/p2p" className={`text-lg font-medium py-2 border-b border-border ${pathname.startsWith('/p2p') ? 'text-brand-foreground font-semibold' : 'text-foreground'}`} onClick={() => setMobileMenuOpen(false)}>P2P</Link>
            <Link href="/wallet" className={`text-lg font-medium py-2 border-b border-border ${pathname.startsWith('/wallet') ? 'text-brand-foreground font-semibold' : 'text-foreground'}`} onClick={() => setMobileMenuOpen(false)}>Wallet</Link>
            <Link href="/markets" className="text-lg font-medium text-foreground py-2 border-b border-border" onClick={() => setMobileMenuOpen(false)}>Assets</Link>
            <Link href="/learn" className="text-lg font-medium text-foreground py-2 border-b border-border" onClick={() => setMobileMenuOpen(false)}>Learn</Link>
            
            <div className="py-2 border-b border-border">
              <span className="text-lg font-medium text-muted-foreground mb-2 block">More</span>
              <div className="flex flex-col gap-2 pl-4">
                <Link href="/fees" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>Fees</Link>
                <Link href="/account/security" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>Security</Link>
                <Link href="/support" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>Support</Link>
                <Link href="/developer" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>Developer API</Link>
                <Link href="/about" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>About ETHSLTD</Link>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {status === "authenticated" && user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{user.displayName || user.email.split('@')[0]}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/account" className="text-lg font-medium text-foreground py-2 border-b border-border" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                  <Link href="/account/security" className="text-lg font-medium text-foreground py-2 border-b border-border" onClick={() => setMobileMenuOpen(false)}>Security</Link>
                  <Button variant="outline" className="w-full justify-center text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Log Out</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full justify-center" asChild><Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link></Button>
                  <Button variant="default" className="w-full justify-center" asChild><Link href="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link></Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* P2P Demo Banner */}
      {pathname.startsWith('/p2p') && mode === 'PAPER' && (
        <div className="bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-4 py-2 text-sm flex items-center justify-center gap-2 border-b border-blue-100 dark:border-blue-900/50 w-full z-50">
          <Info className="w-4 h-4 shrink-0" />
          <span className="font-medium">P2P Demo Mode:</span>
          <span className="hidden sm:inline">Transactions on ETHSLTD are currently simulated. No real money or cryptocurrency is transferred.</span>
          <span className="sm:hidden">Transactions are currently simulated.</span>
        </div>
      )}
    </header>
  )
}
