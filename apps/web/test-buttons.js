const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const issues = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      issues.push(`Console Error: ${msg.text()}`);
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Find all buttons and links
  const elements = await page.evaluate(() => {
    const interactables = Array.from(document.querySelectorAll('a, button'));
    return interactables.map((el, i) => {
      const isLink = el.tagName.toLowerCase() === 'a';
      const href = isLink ? el.getAttribute('href') : null;
      const text = el.innerText.trim() || el.getAttribute('aria-label') || 'No Text';
      
      let issue = null;
      if (isLink && (!href || href === '#' || href === '')) {
        issue = 'Link has missing or empty href';
      }
      
      return { index: i, tag: el.tagName, text, href, issue };
    });
  });

  const brokenElements = elements.filter(e => e.issue);
  console.log("=== BROKEN LINKS/BUTTONS DETECTED ===");
  console.log(JSON.stringify(brokenElements, null, 2));

  // We could also click buttons to see if they do anything, but static href checks find most issues.
  console.log("=== CONSOLE ISSUES ===");
  console.log(issues);

  await browser.close();
})();
