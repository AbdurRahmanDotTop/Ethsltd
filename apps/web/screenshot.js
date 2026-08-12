const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to http://localhost:3000/trade");
  await page.goto('http://localhost:3000/trade', { waitUntil: 'networkidle0' });

  console.log("Waiting for components to load");
  await new Promise(r => setTimeout(r, 3000)); // wait for chart to render and mock data to fetch
  
  // Save directly to the artifacts directory so the user and AI can view it
  const screenshotPath = 'C:\\Users\\abdur\\.gemini\\antigravity-ide\\brain\\c6681cee-c472-4791-adbc-c7dbc99f120b\\trade-screenshot.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);

  await browser.close();
})().catch(console.error);
