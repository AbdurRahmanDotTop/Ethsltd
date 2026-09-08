const fs = require('fs');

function replaceInFile(path, search, replace) {
  try {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(path, content);
    console.log('Fixed ' + path);
  } catch (e) {
    console.log('Error in ' + path + ': ' + e.message);
  }
}

// 1. my-ads/page.tsx
replaceInFile('src/app/p2p/my-ads/page.tsx', /\[mode, setAds\]/, '[setAds]');
replaceInFile('src/app/p2p/my-ads/page.tsx', /\[mode\]/g, '[]');
replaceInFile('src/app/p2p/my-ads/page.tsx', /mode,/g, '');

// 2. P2PTable.tsx
replaceInFile('src/components/p2p/P2PTable.tsx', /\[mode\]/, '[]');

// 3. GlobalWalletDashboard.tsx
replaceInFile('src/components/wallet/GlobalWalletDashboard.tsx', /fetchBalances\(mode\)/g, 'fetchBalances()');

// 4. RealDepositForm.tsx
replaceInFile('src/components/wallet/RealDepositForm.tsx', /mode: mode,?/g, '');
replaceInFile('src/components/wallet/RealDepositForm.tsx', /mode: \'real\',?/g, '');
replaceInFile('src/components/wallet/RealDepositForm.tsx', /mode: \"real\",?/g, '');

// 5. RealWithdrawForm.tsx
replaceInFile('src/components/wallet/RealWithdrawForm.tsx', /const mode = .*?;/g, '');
replaceInFile('src/components/wallet/RealWithdrawForm.tsx', /fetchBalances\(mode\)/g, 'fetchBalances()');
replaceInFile('src/components/wallet/RealWithdrawForm.tsx', /mode: mode,?/g, '');

// 6. admin/orders/page.tsx
replaceInFile('src/app/admin/orders/page.tsx', /adminMode/g, '\"real\"');

// 7. expert/dashboard/earnings/page.tsx
replaceInFile('src/app/expert/dashboard/earnings/page.tsx', /fetchBalances\([^)]*\)/g, 'fetchBalances()');

// 8. p2p/edit-ad/[id]/page.tsx
replaceInFile('src/app/p2p/edit-ad/[id]/page.tsx', /fetchBalances\([^)]*\)/g, 'fetchBalances()');

// 9. p2p/post-ad/page.tsx
replaceInFile('src/app/p2p/post-ad/page.tsx', /fetchBalances\([^)]*\)/g, 'fetchBalances()');
