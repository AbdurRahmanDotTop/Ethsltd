"use client";

import { useState } from "react";
import { 
  Wallet, Network, ArrowRightLeft, ShieldCheck, 
  AlertTriangle, RefreshCw, Lock, Unlock, HardDrive, 
  ArrowDownToLine, ArrowUpFromLine, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
type NetworkStatus = 'operational' | 'congested' | 'suspended';
type WalletType = 'hot' | 'cold';
type WalletHealth = 'healthy' | 'low_balance';

interface BlockchainNetwork {
  id: string;
  name: string;
  symbol: string;
  status: NetworkStatus;
  gasFee: string;
  lastBlock: string;
}

interface PlatformWallet {
  id: string;
  asset: string;
  type: WalletType;
  address: string;
  balance: number;
  targetBalance: number;
  health: WalletHealth;
}

// Mock Data
const MOCK_NETWORKS: BlockchainNetwork[] = [
  { id: "net-1", name: "Bitcoin", symbol: "BTC", status: "operational", gasFee: "15 sat/vB", lastBlock: "834,192" },
  { id: "net-2", name: "Ethereum", symbol: "ETH", status: "congested", gasFee: "45 Gwei", lastBlock: "19,203,115" },
  { id: "net-3", name: "Tron", symbol: "TRX", status: "operational", gasFee: "0.1 TRX", lastBlock: "59,201,440" },
  { id: "net-4", name: "Solana", symbol: "SOL", status: "suspended", gasFee: "0.000005 SOL", lastBlock: "245,102,991" },
];

const MOCK_WALLETS: PlatformWallet[] = [
  { id: "w-1", asset: "USDT", type: "hot", address: "0x7a...9b21", balance: 450000, targetBalance: 2000000, health: "low_balance" },
  { id: "w-2", asset: "USDT", type: "cold", address: "0x8f...3c44", balance: 15500000, targetBalance: 10000000, health: "healthy" },
  { id: "w-3", asset: "BTC", type: "hot", address: "bc1q...x89p", balance: 45.5, targetBalance: 50.0, health: "healthy" },
  { id: "w-4", asset: "BTC", type: "cold", address: "3FZb...m92L", balance: 1250.0, targetBalance: 1000.0, health: "healthy" },
  { id: "w-5", asset: "ETH", type: "hot", address: "0x2e...11a9", balance: 120.5, targetBalance: 500.0, health: "low_balance" },
];

export default function AdminWalletsPage() {
  const [networks, setNetworks] = useState<BlockchainNetwork[]>(MOCK_NETWORKS);
  const [wallets, setWallets] = useState<PlatformWallet[]>(MOCK_WALLETS);
  const [isProcessingNetwork, setIsProcessingNetwork] = useState<string | null>(null);
  const [isProcessingWallet, setIsProcessingWallet] = useState<string | null>(null);

  const toggleNetworkStatus = (id: string, currentStatus: NetworkStatus) => {
    setIsProcessingNetwork(id);
    setTimeout(() => {
      setNetworks(prev => prev.map(n => 
        n.id === id ? { ...n, status: currentStatus === 'suspended' ? 'operational' : 'suspended' } : n
      ));
      setIsProcessingNetwork(null);
    }, 1500);
  };

  const handleWalletAction = (id: string) => {
    setIsProcessingWallet(id);
    setTimeout(() => {
      setWallets(prev => prev.map(w => 
        w.id === id ? { ...w, health: 'healthy', balance: w.targetBalance } : w
      ));
      setIsProcessingWallet(null);
    }, 2000);
  };

  const getNetworkBadge = (status: NetworkStatus) => {
    switch(status) {
      case 'operational': return <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><ShieldCheck className="w-3 h-3"/> Operational</span>;
      case 'congested': return <span className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"><Activity className="w-3 h-3"/> Congested</span>;
      case 'suspended': return <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><Lock className="w-3 h-3"/> Suspended</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-brand-primary" /> Wallets & Treasury
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor platform liquidity, network status, and hot/cold storage.</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Balances
        </Button>
      </div>

      {/* Treasury KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Total Assets Held</span>
            <div className="p-2 rounded-md bg-green-500/10">
              <HardDrive className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">$125.4M</h3>
            <span className="text-xs text-muted-foreground font-medium">Hot + Cold Storage</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Hot Wallet Ratio</span>
            <div className="p-2 rounded-md bg-blue-500/10">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-brand-primary">8.2%</h3>
            <span className="text-xs text-green-500 font-medium">Healthy (Target: 5-10%)</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Pending Withdrawals</span>
            <div className="p-2 rounded-md bg-yellow-500/10">
              <ArrowUpFromLine className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">$452K</h3>
            <span className="text-xs text-muted-foreground">Across 124 transactions</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">24h Net Flow</span>
            <div className="p-2 rounded-md bg-purple-500/10">
              <ArrowRightLeft className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-green-500">+$1.2M</h3>
            <span className="text-xs text-muted-foreground font-medium">Deposits &gt; Withdrawals</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Network & Node Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4" /> Network & Node Status
          </h3>
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
            {networks.map((net) => (
              <div key={net.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 font-bold text-foreground">
                    {net.symbol}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{net.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Gas: {net.gasFee} • Block: {net.lastBlock}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  {getNetworkBadge(net.status)}
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isProcessingNetwork === net.id}
                    onClick={() => toggleNetworkStatus(net.id, net.status)}
                    className={net.status === 'suspended' ? 'text-green-500 hover:text-green-600 hover:bg-green-500/10' : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'}
                  >
                    {isProcessingNetwork === net.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : net.status === 'suspended' ? (
                      <><Unlock className="w-3 h-3 mr-2" /> Resume</>
                    ) : (
                      <><Lock className="w-3 h-3 mr-2" /> Suspend</>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot & Cold Wallets */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Platform Wallets
          </h3>
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${wallet.type === 'hot' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                      {wallet.type}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">{wallet.asset}</h4>
                    {wallet.health === 'low_balance' && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 ml-1" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1.5">{wallet.address}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${wallet.health === 'low_balance' ? 'text-yellow-500' : 'text-foreground'}`}>
                      {wallet.balance.toLocaleString()} {wallet.asset}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Target: {wallet.targetBalance.toLocaleString()}</p>
                  </div>
                  
                  {wallet.type === 'hot' && wallet.health === 'low_balance' && (
                    <Button 
                      size="sm"
                      disabled={isProcessingWallet === wallet.id}
                      onClick={() => handleWalletAction(wallet.id)}
                      className="bg-brand-primary text-primary-foreground hover:bg-brand-primary/90"
                    >
                      {isProcessingWallet === wallet.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-3 h-3 mr-2" />}
                      Top Up
                    </Button>
                  )}
                  {wallet.type === 'hot' && wallet.health === 'healthy' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled={isProcessingWallet === wallet.id}
                      onClick={() => handleWalletAction(wallet.id)}
                    >
                      {isProcessingWallet === wallet.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUpFromLine className="w-3 h-3 mr-2" />}
                      Sweep
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
