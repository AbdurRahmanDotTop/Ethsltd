const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace 'PAPER' with 'DEMO'
  content = content.replace(/PAPER/g, 'DEMO');
  
  // Replace 'Paper Trading' with 'Demo Trading'
  content = content.replace(/Paper Trading/g, 'Demo Trading');
  
  // Replace 'Paper trading' with 'Demo trading'
  content = content.replace(/Paper trading/g, 'Demo trading');
  
  // Replace 'paper trading' with 'demo trading'
  content = content.replace(/paper trading/g, 'demo trading');

  // Replace 'paper-trading' with 'demo-trading'
  content = content.replace(/paper-trading/g, 'demo-trading');
  
  // Replace 'Paper deposit' with 'Demo deposit'
  content = content.replace(/Paper deposit/g, 'Demo deposit');

  // Replace 'paper deposit' with 'demo deposit'
  content = content.replace(/paper deposit/g, 'demo deposit');
  
  // Replace 'paper wallet' with 'demo wallet'
  content = content.replace(/paper wallet/g, 'demo wallet');
  content = content.replace(/Paper wallet/g, 'Demo wallet');
  content = content.replace(/Paper Wallet/g, 'Demo Wallet');
  
  // Replace 'paper balance' with 'demo balance'
  content = content.replace(/paper balance/g, 'demo balance');
  content = content.replace(/Paper balance/g, 'Demo balance');
  content = content.replace(/Paper Balance/g, 'Demo Balance');

  // Any loose 'Paper'
  content = content.replace(/Paper/g, 'Demo');
  content = content.replace(/paper/g, 'demo');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
};

const walkSync = (dir) => {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.next') || dir.includes('dist')) {
    return;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkSync(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.md')) {
      replaceInFile(fullPath);
    }
  }
};

walkSync('./apps');
walkSync('./packages');
walkSync('./services');
walkSync('./PRD');
