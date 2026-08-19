"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, Eye, EyeOff, Star, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export function GlobalWalletDashboard() {
  const [balance, setBalance] = useState<any>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [hideSmallAssets, setHideSmallAssets] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const fetchBalance = async () => {
    try {
      const res = await apiClient.getWalletPortfolio();
      if (res.success && res.data) {
        setBalance(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const totalUsdt = balance?.totalValue || 0;
  
  // Dummy individual assets if real ones aren't available in structure
  const assets = balance?.assets || [
    { asset: "BTC", available: 0, inOrder: 0, usdValue: 0 },
    { asset: "ETH", available: 0, inOrder: 0, usdValue: 0 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white font-sans w-full max-w-[1280px] mx-auto pb-24">
      {/* Top Bar */}
      <div className="px-4 py-3">
        <div className="bg-[#1A1C24] border border-white/10 rounded-lg flex items-center justify-between px-3 py-2">
          <Star className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium">ETHSLTD</span>
          <button onClick={fetchBalance}><RefreshCw className="w-4 h-4 text-gray-400" /></button>
        </div>
      </div>

      <h1 className="text-center font-bold text-lg mt-1 mb-4">Assets</h1>

      {/* Sub-navigation Tabs */}
      <div className="flex bg-[#1A1C24]">
        <button className="flex-1 py-3 text-sm font-bold bg-[#00C087] text-[#121212]">Currency Account</button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-400">Contract Account</button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-400 hidden sm:block">Options Account</button>
      </div>

      {/* Total Assets Overview */}
      <div className="px-4 py-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Total Assets(USDT)</span>
          <button onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
        <div className="mt-3">
          <h2 className="text-3xl font-bold">
            {showBalance ? totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '********'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            ≈{showBalance ? totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '********'} USD
          </p>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-400">UID: {user?.id?.substring(0, 8) || 'Loading...'}</span>
        </div>
      </div>

      {/* Currency Account Card */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-b from-[#2A2D38] to-[#1A1C24] rounded-xl overflow-hidden shadow-lg border border-white/5 relative">
          <div className="absolute top-0 right-0 bg-[#00C087] text-[#121212] px-3 py-1 rounded-bl-lg text-xs font-bold">
            Currency Account
          </div>
          
          <div className="p-5 border-b border-white/5">
            <span className="text-xs text-gray-300">Asset valuations (USDT)</span>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-[#00C087]">
                {showBalance ? totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '********'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                ≈{showBalance ? totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '********'} USD
              </p>
            </div>
          </div>

          <div className="flex">
            <button onClick={() => router.push('/wallet/deposit')} className="flex-1 py-4 flex items-center justify-center gap-2 border-r border-white/5 hover:bg-white/5 transition-colors">
              <ArrowDownToLine className="w-5 h-5 text-[#00C087]" />
              <span className="text-sm font-medium">Deposit</span>
            </button>
            <button onClick={() => router.push('/wallet/withdraw')} className="flex-1 py-4 flex items-center justify-center gap-2 border-r border-white/5 hover:bg-white/5 transition-colors">
              <ArrowUpFromLine className="w-5 h-5 text-[#00C087]" />
              <span className="text-sm font-medium">Withdraw</span>
            </button>
            <button className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <ArrowRightLeft className="w-5 h-5 text-[#00C087]" />
              <span className="text-sm font-medium">Transfer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asset List Controls */}
      <div className="px-4 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Search</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Hide small assets</span>
          <button 
            onClick={() => setHideSmallAssets(!hideSmallAssets)}
            className={`w-5 h-5 rounded-full border ${hideSmallAssets ? 'border-[#00C087] bg-[#00C087]/20 flex items-center justify-center' : 'border-gray-500'}`}
          >
            {hideSmallAssets && <div className="w-2 h-2 bg-[#00C087] rounded-full"></div>}
          </button>
        </div>
      </div>

      {/* Asset List Items */}
      <div className="mt-4 px-4 flex flex-col gap-3">
        {assets.map((asset: any, i: number) => (
          <div key={i} className="bg-[#1A1C24] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#00C087] font-bold text-xs">
                  {(asset.asset || asset.symbol || 'C').charAt(0)}
                </div>
                <span className="font-bold text-lg">{asset.asset || asset.symbol}</span>
              </div>
              <div className="text-right">
                <p className="font-bold">{showBalance ? (asset.total || (asset.available + (asset.inOrder || 0))).toFixed(8) : '********'}</p>
                <p className="text-xs text-gray-400">≈{showBalance ? (asset.usdValue || asset.value || 0).toFixed(4) : '********'} USD</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 text-xs text-gray-400">
              <div className="flex flex-col">
                <span>Available {showBalance ? asset.available.toFixed(8) : '********'}</span>
              </div>
              <div className="flex flex-col text-right">
                <span>On orders {showBalance ? (asset.inOrder || asset.onOrders || 0).toFixed(8) : '********'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
