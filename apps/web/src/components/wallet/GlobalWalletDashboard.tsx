"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/logo";
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
  const initialTab = searchParams?.get('tab') === 'currency' ? 'currency' : 'asset';
  const [activeTab, setActiveTab] = useState<'asset' | 'currency'>(initialTab);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [publicRates, setPublicRates] = useState<any[]>([]);
  const [baseCurrency, setBaseCurrency] = useState("USDT");

  useEffect(() => {
    setActiveTab(searchParams?.get('tab') === 'currency' ? 'currency' : 'asset');
  }, [searchParams]);

  useEffect(() => {
    fetchBalances();
    
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
        const res = await apiClient.getWalletTransactions();
        if (res.success && res.data) {
          setTransactions(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTx();
  }, [fetchBalances]);

  const cryptoBalances = balances.filter(b => b.type === 'CRYPTO');
  const fiatBalances = balances.filter(b => b.type === 'FIAT');

  const usdtBalance = cryptoBalances.find(b => b.symbol === 'USDT');
  const usdcBalance = cryptoBalances.find(b => b.symbol === 'USDC');
  
  const totalUsdt = (usdtBalance?.total || 0) + (usdcBalance?.total || 0);
  const availableUsdt = (usdtBalance?.available || 0) + (usdcBalance?.available || 0);

  const baseCurrencyInfo = publicRates.find(r => r.code === baseCurrency);
  const baseRate = parseFloat(baseCurrencyInfo?.ratePerUsdt || '1');
  const baseSymbol = baseCurrencyInfo?.symbol || 'USDT';

  const displayTotal = totalUsdt * baseRate;
  const displayAvailable = availableUsdt * baseRate;

  const targetFiat = publicRates.find(r => r.code === 'INR' && r.status === 'ACTIVE') 
                  || publicRates.find(r => r.code === 'USD' && r.status === 'ACTIVE');
  const fiatRate = targetFiat ? parseFloat(targetFiat.ratePerUsdt || '0') : 0;
  const fiatSymbol = targetFiat?.symbol || '';
  const fiatCode = targetFiat?.code || '';

  const filteredAssets = cryptoBalances.filter(asset => {
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
          <div className="flex items-center">
            <Logo className="h-9 sm:h-10 md:h-12 w-auto" />
          </div>
          <button onClick={() => fetchBalances()}><RefreshCw className="w-4 h-4 text-gray-400" /></button>
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
        <div className="mt-3 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-6">
          <div className="w-full sm:w-auto">
            <h2 className="text-3xl font-bold text-[#00C087] break-all">
              {showBalance ? `${displayAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${baseCurrency}` : '********'}
            </h2>
            {fiatRate > 0 && (
              <p className="text-sm text-gray-400 mt-1 break-all">
                ≈{showBalance ? ` ${fiatSymbol}${(displayAvailable * fiatRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fiatCode}` : '********'}
              </p>
            )}
          </div>
          <div className="text-left sm:text-right flex flex-row flex-wrap gap-x-6 gap-y-4 w-full sm:w-auto">
             <div className="flex-1 sm:flex-none">
               <span className="text-xs text-gray-400 block mb-1">On Order / Hold</span>
               <h3 className="text-sm font-semibold text-white break-all">
                 {showBalance ? `${((totalUsdt - availableUsdt) * baseRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${baseCurrency}` : '********'}
               </h3>
               {fiatRate > 0 && showBalance && (
                 <span className="text-xs text-gray-400 block mt-0.5">
                   ≈ {fiatSymbol}{((totalUsdt - availableUsdt) * baseRate * fiatRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiatCode}
                 </span>
               )}
             </div>
             <div className="flex-1 sm:flex-none">
               <span className="text-xs text-gray-400 block mb-1">Total Assets ({baseCurrency})</span>
               <h3 className="text-sm font-semibold text-white break-all">
                 {showBalance ? `${displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${baseCurrency}` : '********'}
               </h3>
               {fiatRate > 0 && showBalance && (
                 <span className="text-xs text-gray-400 block mt-0.5">
                   ≈ {fiatSymbol}{(displayTotal * fiatRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiatCode}
                 </span>
               )}
             </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-400 break-all bg-white/5 p-2 rounded-lg">
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
              <h3 className="text-2xl font-bold text-white break-all">
                {showBalance ? `${displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${baseCurrency}` : '********'}
              </h3>
              {fiatRate > 0 && (
                <p className="text-xs text-gray-400 mt-1 break-all">
                  ≈{showBalance ? ` ${fiatSymbol}${(displayTotal * fiatRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fiatCode}` : '********'}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap">
            <button onClick={() => router.push('/wallet/deposit')} className="w-1/3 sm:flex-1 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border-r border-white/5 hover:bg-white/5 transition-colors">
              <ArrowDownToLine className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C087]" />
              <span className="text-xs sm:text-sm font-medium">Deposit</span>
            </button>
            <button onClick={() => router.push('/wallet/withdraw')} className="w-1/3 sm:flex-1 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border-r border-white/5 hover:bg-white/5 transition-colors">
              <ArrowUpFromLine className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C087]" />
              <span className="text-xs sm:text-sm font-medium">Withdraw</span>
            </button>
            <button className="w-1/3 sm:flex-1 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 hover:bg-white/5 transition-colors">
              <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C087]" />
              <span className="text-xs sm:text-sm font-medium">Transfer</span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#00C087] font-bold text-xs shrink-0">
                    {asset.symbol.charAt(0)}
                  </div>
                  <span className="font-bold text-lg truncate block min-w-0">{asset.symbol}</span>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold break-all">{showBalance ? Number(asset.total || 0).toFixed(8) : '********'}</p>
                  {fiatRate > 0 ? (
                    <p className="text-xs text-gray-400 break-all">≈{showBalance ? `${fiatSymbol}${(Number(asset.usdValue || 0) * fiatRate).toFixed(4)} ${fiatCode}` : '********'}</p>
                  ) : (
                    <p className="text-xs text-gray-400 break-all">≈{showBalance ? `${(Number(asset.usdValue || 0) * baseRate).toFixed(4)} ${baseCurrency}` : '********'}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 text-xs text-gray-400 gap-2">
                <div className="flex flex-col break-all">
                  <span>Available: {showBalance ? Number(asset.available || 0).toFixed(8) : '********'}</span>
                </div>
                <div className="flex flex-col text-left sm:text-right break-all">
                  <span>On orders: {showBalance ? Number(asset.locked || 0).toFixed(8) : '********'}</span>
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
            const ratePerUsdt = parseFloat(currency.ratePerUsdt || '0');
            // USDT balance converted to this fiat currency
            const usdtValueInThisCurrency = totalUsdt * ratePerUsdt;
            // Actual wallet balance the user holds in this currency
            const wallet = fiatBalances.find(b => b.symbol === currency.code);
            const userWalletBalance = wallet ? wallet.total : 0;
            const userAvailable = wallet ? wallet.available : 0;
            const userLocked = wallet ? wallet.locked : 0;
            
            return (
              <div key={i} className="bg-[#121212] border border-white/10 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#00C087] font-bold text-xs shrink-0">
                      {currency.symbol}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-lg truncate block">{currency.code}</span>
                      <span className="text-xs text-gray-400 block truncate">{currency.name}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    {/* Primary: actual fiat wallet balance OR USDT-converted value */}
                    <p className="font-bold break-all text-[#00C087]">
                      {showBalance
                        ? `${currency.symbol}${(userWalletBalance > 0 ? userWalletBalance : usdtValueInThisCurrency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency.code}`
                        : '********'}
                    </p>
                    {/* Secondary: show USDT equivalent */}
                    <p className="text-xs text-gray-400 break-all">
                      {showBalance
                        ? `≈ ${totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} USDT (your crypto holdings)`
                        : '********'}
                    </p>
                  </div>
                </div>
                {/* Per-asset breakdown for this currency */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 text-xs text-gray-400 gap-2">
                  <div className="flex flex-col break-all gap-1">
                    {userWalletBalance > 0 && (
                      <span className="text-white/70">Wallet: {showBalance ? `${currency.symbol}${userWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency.code}` : '********'}</span>
                    )}
                    <span>Available: {showBalance ? `${currency.symbol}${(userAvailable > 0 ? userAvailable : usdtValueInThisCurrency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency.code}` : '********'}</span>
                  </div>
                  <div className="flex flex-col text-left sm:text-right break-all">
                    <span>Rate: 1 USDT = {currency.symbol}{ratePerUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {currency.code}</span>
                    {userLocked > 0 && <span>On orders: {showBalance ? `${currency.symbol}${userLocked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency.code}` : '********'}</span>}
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
                  {transactions.map((tx: any, i: number) => {
                    const asset = tx.assetSymbol || tx.asset || '';
                    const amt   = Number(tx.amount);
                    // Use 2 decimal places for stablecoins/fiat, 8 for other crypto
                    const stableOrFiat = ['USDT', 'USDC', 'USD', 'INR', 'EUR', 'GBP'].includes(asset.toUpperCase());
                    const amtDisplay   = amt.toFixed(stableOrFiat ? 2 : 8);

                    // Determine human-readable type label
                    let typeLabel = tx.type as string;
                    let typeBadgeClass = 'bg-blue-500/20 text-blue-400';
                    if (tx.type === 'DEPOSIT' && asset === 'USDT') {
                      typeLabel = 'DEPOSIT';
                      typeBadgeClass = 'bg-green-500/20 text-green-400';
                    } else if (tx.type === 'DEPOSIT') {
                      typeLabel = 'DEPOSIT';
                      typeBadgeClass = 'bg-teal-500/20 text-teal-400';
                    } else if (tx.type === 'CONVERSION') {
                      typeLabel = 'CONVERSION';
                      typeBadgeClass = 'bg-yellow-500/20 text-yellow-400';
                    } else if (tx.type === 'WITHDRAWAL') {
                      typeLabel = 'WITHDRAWAL';
                      typeBadgeClass = 'bg-red-500/20 text-red-400';
                    }

                    // Determine human-readable status label
                    let statusLabel = tx.status as string;
                    let statusClass = 'text-gray-400';
                    if (tx.type === 'CONVERSION' && tx.status === 'COMPLETED') {
                      statusLabel = 'Converted to USDT';
                      statusClass = 'text-yellow-400';
                    } else if (tx.type === 'DEPOSIT' && asset === 'USDT' && tx.status === 'COMPLETED') {
                      statusLabel = 'Deposit Completed';
                      statusClass = 'text-green-400';
                    } else if (tx.type === 'DEPOSIT' && tx.status === 'COMPLETED') {
                      statusLabel = 'Deposit / Received';
                      statusClass = 'text-teal-400';
                    } else if (tx.status === 'COMPLETED' || tx.status === 'APPROVED') {
                      statusLabel = 'Completed';
                      statusClass = 'text-green-400';
                    } else if (tx.status === 'PENDING') {
                      statusLabel = 'Pending';
                      statusClass = 'text-yellow-400';
                    } else if (tx.status === 'FAILED' || tx.status === 'REJECTED') {
                      statusLabel = 'Failed';
                      statusClass = 'text-red-400';
                    }

                    return (
                      <tr key={i} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-gray-300">
                          {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${typeBadgeClass}`}>
                            {typeLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold">
                          {tx.originalCurrency && tx.originalCurrency !== asset && tx.type !== 'CONVERSION' ? (
                            <div className="flex flex-col">
                              <span>{asset}</span>
                              <span className="text-[10px] text-gray-500 font-normal">from {tx.originalCurrency}</span>
                            </div>
                          ) : (
                            asset
                          )}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium tabular-nums ${amt < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {amt > 0 ? '+' : ''}{amtDisplay}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-xs ${statusClass}`}>{statusLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
