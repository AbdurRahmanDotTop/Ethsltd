"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Bell, Download, Clock, CreditCard, Share2, MessageCircle } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export function GlobalHomeDashboard() {
  const [tickers, setTickers] = useState<any[]>([]);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    apiClient.getMarkets().then(res => {
      if (res.success && mounted && res.data) {
        setTickers(res.data);
      }
    }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  const topMarkets = tickers.slice(0, 3);
  const gainers = [...tickers].sort((a, b) => b.priceChange24h - a.priceChange24h).slice(0, 5);

  const quickActions = [
    { name: "Deposit", icon: Download, href: "/wallet/deposit" },
    { name: "Option", icon: Clock, href: "/trade" },
    { name: "P2P", icon: CreditCard, href: "/p2p" },
    { name: "Share", icon: Share2, href: "/" },
    { name: "Chat", icon: MessageCircle, href: "/support" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white font-sans w-full max-w-[1280px] mx-auto pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 mt-2">
        <button onClick={() => router.push('/account/profile')} className="w-8 h-8 rounded-full bg-[#00C087]/10 flex items-center justify-center text-[#00C087]">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>
        <h1 className="text-xl font-semibold tracking-wide">ETHSLTD</h1>
        <button onClick={() => router.push('/account/notifications')} className="relative p-1 text-[#00C087]">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#121212]" />
        </button>
      </div>

      {/* Hero Banner */}
      <div className="px-4 mt-2">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl p-5 relative overflow-hidden shadow-lg h-36 flex flex-col justify-center">
          <h2 className="text-xl font-bold leading-tight relative z-10 w-2/3">Brand New Rates<br/><span className="text-yellow-400">0 Trading Fees</span><br/>for Spot Trade!</h2>
          <div className="absolute right-[-20px] top-0 bottom-0 flex items-center justify-center opacity-90 z-0">
            <span className="text-[120px] font-black text-yellow-500 leading-none drop-shadow-2xl italic">0</span>
          </div>
        </div>
        <div className="flex justify-center gap-1.5 mt-3">
          <div className="w-4 h-1 bg-[#00C087] rounded-full"></div>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Top Markets Grid */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-6">
        {topMarkets.map((market, i) => (
          <div key={i} className="bg-[#1A1C24] rounded-lg p-3 flex flex-col items-center justify-center border border-white/5">
            <span className="text-xs font-medium text-gray-400">{market.symbol}</span>
            <span className={`text-lg font-bold mt-1 ${market.priceChange24h >= 0 ? 'text-[#00C087]' : 'text-red-500'}`}>
              {market.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
            </span>
            <span className={`text-[10px] mt-0.5 ${market.priceChange24h >= 0 ? 'text-[#00C087]' : 'text-red-500'}`}>
              {market.priceChange24h >= 0 ? '+' : ''}{market.priceChange24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-5 gap-2 px-2 mt-6">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={i} href={action.href} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#1A1C24] flex items-center justify-center text-[#00C087]">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-gray-300">{action.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Gainers Table */}
      <div className="mt-8 px-4 flex-1">
        <div className="flex items-center justify-center relative mb-4">
          <div className="absolute w-full h-[1px] bg-white/10"></div>
          <h3 className="bg-[#121212] px-4 text-[#00C087] font-semibold relative z-10">Gainers</h3>
        </div>

        <div className="bg-[#1A1C24] rounded-full px-4 py-2 flex items-center justify-between text-xs text-gray-400 mb-4">
          <span className="flex-1">Pair</span>
          <span className="flex-1 text-center">Latest Price</span>
          <span className="flex-1 text-right">24H Change</span>
        </div>

        <div className="flex flex-col gap-5 px-1">
          {gainers.map((market, i) => (
            <Link href={`/trade/${market.symbol.replace('/', '_')}`} key={i} className="flex items-center justify-between group">
              <span className="flex-1 font-bold text-sm text-gray-200">{market.symbol}</span>
              <span className="flex-1 text-center font-mono text-[15px] font-medium text-gray-200">
                {market.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </span>
              <div className="flex-1 flex justify-end">
                <span className={`px-3 py-1.5 rounded-[4px] text-xs font-bold min-w-[70px] text-center ${market.priceChange24h >= 0 ? 'bg-[#00C087] text-[#121212]' : 'bg-red-500 text-white'}`}>
                  {market.priceChange24h >= 0 ? '+' : ''}{market.priceChange24h.toFixed(2)}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
