const fs = require('fs');
const path = require('path');

const orderEntryPath = path.join(__dirname, '../apps/web/src/components/trading/OrderEntry.tsx');
let content = fs.readFileSync(orderEntryPath, 'utf8');

// Update getOrderSchema
content = content.replace(
  /const getOrderSchema = \(type: OrderType\) => z.object\(\{([\s\S]*?)\}\);/,
  `const getOrderSchema = (type: OrderType) => z.object({$1  stopLoss: z.string().optional(),
  takeProfit: z.string().optional(),
});`
);

// Add stopLoss and takeProfit to defaultValues
content = content.replace(
  /defaultValues: \{ price: orderFormPrice, quantity: orderFormQuantity \}/,
  `defaultValues: { price: orderFormPrice, quantity: orderFormQuantity, stopLoss: "", takeProfit: "" }`
);

// Add to onSubmit
content = content.replace(
  /type: selectedOrderType === 'market' \? 'MARKET' : 'LIMIT',/,
  `type: selectedOrderType === 'market' ? 'MARKET' : 'LIMIT',
          stopLoss: data.stopLoss ? parseFloat(data.stopLoss) : undefined,
          takeProfit: data.takeProfit ? parseFloat(data.takeProfit) : undefined,`
);

// Add UI fields
const slTpFields = `
        {/* MT5 Style SL/TP Fields */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <label className="text-xs text-danger mb-1 block font-semibold">Stop Loss (SL)</label>
            <input 
              {...register("stopLoss")}
              type="text" 
              inputMode="decimal"
              placeholder="0.00"
              className="w-full bg-muted border border-border rounded h-10 px-3 font-mono text-sm focus:outline-none focus:border-danger"
            />
          </div>
          <div className="flex-1 relative">
            <label className="text-xs text-success mb-1 block font-semibold">Take Profit (TP)</label>
            <input 
              {...register("takeProfit")}
              type="text" 
              inputMode="decimal"
              placeholder="0.00"
              className="w-full bg-muted border border-border rounded h-10 px-3 font-mono text-sm focus:outline-none focus:border-success"
            />
          </div>
        </div>
`;

content = content.replace(
  /\{\/\* Percentages \*\/\}/,
  slTpFields + '\n        {/* Percentages */}'
);

// Style the submit buttons like MT5 (Big Red/Blue buttons)
content = content.replace(
  /<Button \s*type="submit" \s*isLoading=\{isSubmitting\}\s*loadingText="Placing..."\s*className=\{cn\("w-full mt-2 font-bold", selectedSide === 'buy' \? "bg-success hover:bg-success\/90 text-white" : "bg-danger hover:bg-danger\/90 text-white"\)\}\s*>\s*\{`\$\{selectedSide === 'buy' \? 'Buy' : 'Sell'\} \$\{base\}`\}\s*<\/Button>/m,
  `<div className="flex gap-2 mt-4">
          <Button 
            type="button" 
            disabled={isSubmitting}
            onClick={() => { setSide('sell'); handleSubmit((data) => {
              requireAuth(() => {
                onSubmit({ ...data, side: 'sell' });
              }, "Please log in.");
            })(); }}
            className="flex-1 h-14 font-bold text-sm bg-danger hover:bg-danger/90 text-white uppercase rounded shadow-lg flex flex-col items-center justify-center"
          >
            <span className="leading-tight">SELL</span>
            <span className="text-[10px] font-normal leading-tight opacity-80">BY MARKET</span>
          </Button>
          <Button 
            type="button" 
            disabled={isSubmitting}
            onClick={() => { setSide('buy'); handleSubmit((data) => {
              requireAuth(() => {
                onSubmit({ ...data, side: 'buy' });
              }, "Please log in.");
            })(); }}
            className="flex-1 h-14 font-bold text-sm bg-info hover:bg-info/90 text-white uppercase rounded shadow-lg flex flex-col items-center justify-center"
          >
            <span className="leading-tight">BUY</span>
            <span className="text-[10px] font-normal leading-tight opacity-80">BY MARKET</span>
          </Button>
        </div>`
);

// Fix the actual onSubmit payload to use selectedSide which is now passed manually or via state, wait, the onClick wrapper calls handleSubmit which calls onSubmit with form data, but `onSubmit` relies on `selectedSide`.
// Let's modify onSubmit to take the side from data if we injected it.
content = content.replace(
  /const onSubmit = \(data: any\) => \{/,
  `const onSubmit = (data: any) => {
    const activeSide = data.side || selectedSide;`
);

content = content.replace(/selectedSide/g, 'activeSide');
// Oh wait, selectedSide is used in the JSX before onSubmit. 
// I'll just replace 'activeSide' back to 'selectedSide' for the JSX.
// This regex will replace all `selectedSide` in the file.
// Better to just change `selectedSide` to `activeSide` *only* inside the `onSubmit` function.

content = fs.readFileSync(orderEntryPath, 'utf8'); // Reload to avoid breaking

content = content.replace(
  /const getOrderSchema = \(type: OrderType\) => z.object\(\{([\s\S]*?)\}\);/,
  `const getOrderSchema = (type: OrderType) => z.object({$1  stopLoss: z.string().optional(),
  takeProfit: z.string().optional(),
});`
);

content = content.replace(
  /defaultValues: \{ price: orderFormPrice, quantity: orderFormQuantity \}/,
  `defaultValues: { price: orderFormPrice, quantity: orderFormQuantity, stopLoss: "", takeProfit: "" }`
);

content = content.replace(
  /type: selectedOrderType === 'market' \? 'MARKET' : 'LIMIT',/,
  `type: selectedOrderType === 'market' ? 'MARKET' : 'LIMIT',
          stopLoss: data.stopLoss ? parseFloat(data.stopLoss) : undefined,
          takeProfit: data.takeProfit ? parseFloat(data.takeProfit) : undefined,`
);

content = content.replace(
  /\{\/\* Percentages \*\/\}/,
  slTpFields + '\n        {/* Percentages */}'
);

const newButtons = `
        <div className="flex gap-2 mt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => setSide('sell')}
            className="flex-1 h-14 font-bold text-lg bg-danger hover:bg-danger/90 text-white uppercase rounded shadow-lg flex flex-col items-center justify-center"
          >
            <span className="leading-tight">SELL</span>
            <span className="text-[10px] font-normal leading-tight opacity-80">BY MARKET</span>
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => setSide('buy')}
            className="flex-1 h-14 font-bold text-lg bg-info hover:bg-info/90 text-white uppercase rounded shadow-lg flex flex-col items-center justify-center"
          >
            <span className="leading-tight">BUY</span>
            <span className="text-[10px] font-normal leading-tight opacity-80">BY MARKET</span>
          </Button>
        </div>
`;
content = content.replace(
  /<Button[\s\S]*?\{`\$\{selectedSide === 'buy' \? 'Buy' : 'Sell'\} \$\{base\}`\}[\s\S]*?<\/Button>/,
  newButtons
);

fs.writeFileSync(orderEntryPath, content, 'utf8');
console.log('Successfully updated OrderEntry.tsx');
