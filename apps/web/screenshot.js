const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/wallet', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'wallet-after-fix.png' });
  await browser.close();
  console.log('Screenshot taken!');
})();
