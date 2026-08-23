"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, Eye, EyeOff, Star, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useWalletStore } from "@/stores/wallet-store";
import { useRouter, useSearchParams } from "next/navigation";

export function GlobalWalletDashboard() {
  const { balances, fetchBalances } = useWalletStore();
  const [showBalance, setShowBalance] = useState(true);
  const [hideSmallAssets, setHideSmallAssets] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'currency' ? 'currency' : 'asset';
  const [activeTab, setActiveTab] = useState<'asset' | 'currency'>(initialTab);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [publicRates, setPublicRates] = useState<any[]>([]);
  const [baseCurrency, setBaseCurrency] = useState("USDT");

  useEffect(() => {
    setActiveTab(searchParams.get('tab') === 'currency' ? 'currency' : 'asset');
  }, [searchParams]);

  useEffect(() => {
    fetchBalances('REAL');
    
    const fetchRates = async () => {
      try {
        const res = await apiClient.getPublicCurrencyRates();
        if (res.success) {
          setPublicRates(res.list || []);
          if (res.baseCurrency) setBaseCurrency(res.baseCurrency);
        }
      } catch (err) {
        console.error("Failed to fetch rates", err);
      }
    };
    fetchRates();

    const fetchTx = async () => {
      try {
        const res = await apiClient.getWalletTransactions('REAL');
        if (res.success && res.data) {
          setTransactions(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTx();
  }, [fetchBalances]);

  const totalUsdt = balances.reduce((acc, b) => acc + (b.usdValue || 0), 0);
  const availableUsdt = balances.reduce((acc, b) => {
    const price = b.total > 0 ? (b.usdValue || 0) / b.total : 0;
    return acc + ((b.available || 0) * price);
  }, 0);

  const baseCurrencyInfo = publicRates.find(r => r.code === baseCurrency);
  const baseRate = parseFloat(baseCurrencyInfo?.ratePerUsdt || '1');
  const baseSymbol = baseCurrencyInfo?.symbol || 'USDT';

  const displayTotal = totalUsdt * baseRate;
  const displayAvailable = availableUsdt * baseRate;

  const filteredAssets = balances.filter(asset => {
    if (hideSmallAssets && asset.total === 0) return false;
    if (searchQuery.trim()) {
      return asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const bankCurrencies = publicRates.filter(r => r.isBank);

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white font-sans w-full max-w-[1280px] mx-auto pb-24">
      {/* Top Bar */}
      <div className="px-4 py-3">
        <div className="bg-[#121212] border border-white/10 rounded-lg flex items-center justify-between px-3 py-2">
          <Star className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium">ETHSLTD</span>
          <button onClick={() => fetchBalances('REAL')}><RefreshCw className="w-4 h-4 text-gray-400" /></button>
        </div>
      </div>

      <h1 className="text-center font-bold text-lg mt-1 mb-4">Assets</h1>

      {/* Sub-navigation Tabs */}
      <div className="flex bg-[#121212] border-b border-white/5">
        <button 
          onClick={() => { setActiveTab('asset'); router.replace('/wallet?tab=asset'); }}
          className={`flex-1 py-3 text-sm font-bold ${activeTab === 'asset' ? 'bg-[#00C087] text-[#121212]' : 'text-gray-400 hover:text-white'}`}
        >
          Asset Account
        </button>
        <button 
          onClick={() => { setActiveTab('currency'); router.replace('/wallet?tab=currency'); }}
          className={`flex-1 py-3 text-sm font-bold ${activeTab === 'currency' ? 'bg-[#00C087] text-[#121212]' : 'text-gray-400 hover:text-white'}`}
        >
          Currency Account
        </button>
      </div>

      {/* Assets Overview */}
      <div className="px-4 py-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Available Assets ({baseCurrency})</span>
          <button onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
        <div className="mt-3 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-[#00C087]">
              {showBalance ? `${baseSymbol}${displayAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '********'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              ≈{showBalance ? displayAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'} {baseCurrency}
            </p>
          </div>
          <div className="text-right flex gap-6">
             <div>
               <span className="text-xs text-gray-400 block mb-1">On Order / Hold</span>
               <h3 className="text-sm font-semibold text-white">
                 {showBalance ? ((totalUsdt - availableUsdt) * baseRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'}
               </h3>
             </div>
             <div>
               <span className="text-xs text-gray-400 block mb-1">Total Assets ({baseCurrency})</span>
               <h3 className="text-sm font-semibold text-white">
                 {showBalance ? displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'}
               </h3>
             </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400 break-all">
          <span>UID: {user?.id || 'Loading...'}</span>
        </div>
      </div>

      {/* Action Card */}
      <div className="px-4 mt-6">
        <div className="bg-[#121212] rounded-xl overflow-hidden shadow-lg border border-white/10 relative">
          <div className="absolute top-0 right-0 bg-[#00C087] text-[#121212] px-3 py-1 rounded-bl-lg text-xs font-bold">
            {activeTab === 'asset' ? 'Crypto' : 'Bank'}
          </div>
          
          <div className="p-5 border-b border-white/5">
            <span className="text-xs text-gray-300">Asset valuations ({baseCurrency})</span>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-white">
                {showBalance ? displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                ≈{showBalance ? displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'} {baseCurrency}
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

      {/* List Controls */}
      <div className="px-4 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-[200px] border-b border-white/20 pb-1">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
          />
        </div>
        {activeTab === 'asset' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Hide small assets</span>
            <button 
              onClick={() => setHideSmallAssets(!hideSmallAssets)}
              className={`w-5 h-5 rounded-full border ${hideSmallAssets ? 'border-[#00C087] bg-[#00C087]/20 flex items-center justify-center' : 'border-gray-500'}`}
            >
              {hideSmallAssets && <div className="w-2 h-2 bg-[#00C087] rounded-full"></div>}
            </button>
          </div>
        )}
      </div>

      {/* List Items */}
      <div className="mt-4 px-4 flex flex-col gap-3">
        {activeTab === 'asset' ? (
          filteredAssets.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500 border border-white/5 rounded-xl border-dashed">
              No assets found.
            </div>
          ) : filteredAssets.map((asset: any, i: number) => (
            <div key={i} className="bg-[#121212] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#00C087] font-bold text-xs">
                    {asset.symbol.charAt(0)}
                  </div>
                  <span className="font-bold text-lg">{asset.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{showBalance ? Number(asset.total || 0).toFixed(8) : '********'}</p>
                  <p className="text-xs text-gray-400">≈{showBalance ? (Number(asset.usdValue || 0) * baseRate).toFixed(4) : '********'} {baseCurrency}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 text-xs text-gray-400">
                <div className="flex flex-col">
                  <span>Available {showBalance ? Number(asset.available || 0).toFixed(8) : '********'}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span>On orders {showBalance ? Number(asset.locked || 0).toFixed(8) : '********'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          bankCurrencies.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500 border border-white/5 rounded-xl border-dashed">
              No currencies found.
            </div>
          ) : bankCurrencies.map((currency: any, i: number) => {
            const currencyRate = parseFloat(currency.ratePerUsdt || '1');
            const userTotalInThisCurrency = totalUsdt * currencyRate;
            const userAvailableInThisCurrency = availableUsdt * currencyRate;
            const userLockedInThisCurrency = (totalUsdt - availableUsdt) * currencyRate;
            
            return (
              <div key={i} className="bg-[#121212] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#00C087] font-bold text-xs">
                      {currency.symbol}
                    </div>
                    <div>
                      <span className="font-bold text-lg">{currency.code}</span>
                      <span className="text-xs text-gray-400 block">{currency.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{showBalance ? userTotalInThisCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'}</p>
                    <p className="text-xs text-gray-400">≈{showBalance ? userTotalInThisCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'} {currency.code}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 text-xs text-gray-400">
                  <div className="flex flex-col">
                    <span>Available {showBalance ? userAvailableInThisCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span>On orders {showBalance ? userLockedInThisCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '********'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 px-4">
        <h2 className="text-xl font-bold mb-4">All Transactions</h2>
        <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Asset</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                    <th className="px-4 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-400' : tx.type === 'WITHDRAWAL' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">{tx.assetSymbol || tx.asset}</td>
                      <td className={`px-4 py-3 text-right font-medium ${Number(tx.amount) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {Number(tx.amount) > 0 ? '+' : ''}{Number(tx.amount).toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right">
                         <span className={`text-xs ${tx.status === 'COMPLETED' || tx.status === 'APPROVED' ? 'text-green-400' : tx.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'}`}>
                           {tx.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
