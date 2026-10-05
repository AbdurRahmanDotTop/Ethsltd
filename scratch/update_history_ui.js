const fs = require('fs');
const path = require('path');

const tabsPath = path.join(__dirname, '../apps/web/src/components/trading/TradingHistoryTabs.tsx');
let content = fs.readFileSync(tabsPath, 'utf8');

if (!content.includes('activeTab === \'positions\'')) {
  // Add positions state
  content = content.replace(
    /const \[activeTab, setActiveTab\] = useState<'open'\|'history'\|'trades'>\('open'\)/,
    "const [activeTab, setActiveTab] = useState<'positions'|'open'|'history'|'trades'>('positions')"
  );

  content = content.replace(
    /const \[orders, setOrders\] = useState<any\[\]>\(\[\]\)/,
    "const [positions, setPositions] = useState<any[]>([]);\n  const [orders, setOrders] = useState<any[]>([])"
  );

  content = content.replace(
    /const oRes = await apiClient.getOrders\(\)/,
    `const pRes = await apiClient.getPositions().catch(()=>({success:false}));\n      if(pRes.success) setPositions(pRes.data || []);\n\n      const oRes = await apiClient.getOrders()`
  );
  
  // Add handleClosePosition
  const handleClosePos = `
  const handleClosePosition = async (id: string) => {
    try {
      await apiClient.closePosition(id);
      loadData();
    } catch(e) { console.error(e) }
  }
  `;
  content = content.replace(
    /const handleCancel = async/,
    handleClosePos + '\n  const handleCancel = async'
  );

  // Add the tab button
  const tabBtn = `
        <button 
          className={\`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap \${activeTab === 'positions' ? 'border-brand-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}\`}
          onClick={() => setActiveTab('positions')}
        >
          Positions ({positions.filter((p:any)=>p.status==='OPEN').length})
        </button>`;
  
  content = content.replace(
    /<div className="flex border-b border-border overflow-x-auto no-scrollbar">/,
    '<div className="flex border-b border-border overflow-x-auto no-scrollbar">' + tabBtn
  );

  // Add the tab content
  const tabContent = `
        {activeTab === 'positions' && (
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground border-b border-border text-xs sticky top-0 bg-background z-10">
              <tr>
                <th className="py-3 pl-4 font-medium">Ticket</th>
                <th className="py-3 font-medium">Symbol</th>
                <th className="py-3 font-medium">Side</th>
                <th className="py-3 font-medium">Volume</th>
                <th className="py-3 font-medium">Entry</th>
                <th className="py-3 font-medium">S/L</th>
                <th className="py-3 font-medium">T/P</th>
                <th className="py-3 font-medium">Price</th>
                <th className="py-3 font-medium text-right pr-4">Profit</th>
                <th className="py-3 font-medium text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {positions.filter((p:any)=>p.status==='OPEN').length === 0 ? (
                <tr><td colSpan={10} className="py-12 text-center text-muted-foreground">No open positions.</td></tr>
              ) : positions.filter((p:any)=>p.status==='OPEN').map((pos: any) => (
                <tr key={pos.id} className="hover:bg-muted/30">
                  <td className="py-3 pl-4 font-mono text-xs">{pos.ticket}</td>
                  <td className="py-3 font-semibold text-xs">{pos.market}</td>
                  <td className={\`py-3 capitalize text-xs font-semibold \${pos.side === 'LONG' ? 'text-success' : 'text-danger'}\`}>{pos.side === 'LONG' ? 'Buy' : 'Sell'}</td>
                  <td className="py-3 font-mono text-xs">{pos.amount}</td>
                  <td className="py-3 font-mono text-xs">{formatPrice(pos.entryPrice)}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{pos.stopLoss ? formatPrice(pos.stopLoss) : '0.00'}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{pos.takeProfit ? formatPrice(pos.takeProfit) : '0.00'}</td>
                  <td className="py-3 font-mono text-xs">{formatPrice(pos.currentPrice)}</td>
                  <td className={\`py-3 pr-4 text-right font-mono text-xs font-semibold \${pos.unrealizedPnl >= 0 ? 'text-success' : 'text-danger'}\`}>
                    {pos.unrealizedPnl >= 0 ? '+' : ''}{pos.unrealizedPnl.toFixed(2)}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs bg-danger/10 text-danger hover:bg-danger hover:text-white" onClick={() => handleClosePosition(pos.id)}>Close</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  `;

  content = content.replace(
    /<div className="flex-1 overflow-auto max-h-\[400px\]">/,
    '<div className="flex-1 overflow-auto max-h-[400px]">' + tabContent
  );

  fs.writeFileSync(tabsPath, content, 'utf8');
  console.log('Successfully added Positions tab to TradingHistoryTabs');
} else {
  console.log('Positions tab already exists');
}
