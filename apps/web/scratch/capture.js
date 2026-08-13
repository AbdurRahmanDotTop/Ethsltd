const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[BROWSER ${type.toUpperCase()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[BROWSER UNCAUGHT EXCEPTION] ${err.message}`);
  });

  try {
    console.log('Navigating to http://localhost:3000/p2p ...');
    await page.goto('http://localhost:3000/p2p', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Give it a second to render
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: 'p2p-screenshot.png', fullPage: true });
    console.log('Screenshot saved to p2p-screenshot.png');
    
  } catch (error) {
    console.error('Error during navigation or screenshot:', error);
  } finally {
    await browser.close();
  }
})();
