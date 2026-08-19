import { format } from "date-fns";

export function AssetConversionsTable({ conversions }: { conversions: any[] }) {
  if (!conversions || conversions.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-y-4">
        <h3 className="font-semibold text-lg text-foreground">Asset Conversions</h3>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4 text-right">Deposited</th>
                <th className="px-6 py-4 text-right">Rate</th>
                <th className="px-6 py-4 text-right">Fee</th>
                <th className="px-6 py-4 text-right">Net USDT</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {conversions.map((conv) => (
                <tr key={conv.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {format(new Date(conv.createdAt), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {conv.originalAsset}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {parseFloat(conv.originalAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {conv.originalAsset === 'USDT' ? '-' : `1 ${conv.originalAsset} = ${parseFloat(conv.conversionRate).toLocaleString()} USDT`}
                  </td>
                  <td className="px-6 py-4 text-right text-destructive">
                    {parseFloat(conv.depositFee) > 0 ? `-${parseFloat(conv.depositFee).toFixed(2)} USDT` : '0.00'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-brand-500">
                    +{parseFloat(conv.netUsdt).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${conv.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                      {conv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
