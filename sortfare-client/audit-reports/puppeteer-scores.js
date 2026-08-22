const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function extractScores() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = {};
  
  for (const page of ['home', 'flights', 'chat']) {
    const filePath = path.join(__dirname, 'before-' + page + '.html');
    const pageObj = await browser.newPage();
    await pageObj.goto('file://' + filePath, { waitUntil: 'networkidle0' });
    
    // Wait for the gauges to render
    await pageObj.waitForSelector('.lh-exp-gauge__percentage', { timeout: 10000 }).catch(() => {});
    
    const scores = await pageObj.evaluate(() => {
      const gauges = document.querySelectorAll('.lh-exp-gauge-component');
      const result = {};
      gauges.forEach(gauge => {
        const label = gauge.querySelector('.lh-exp-gauge__label')?.textContent?.trim();
        const score = gauge.querySelector('.lh-exp-gauge__percentage')?.textContent?.trim();
        if (label && score) {
          result[label.toLowerCase().replace(/[^a-z]/g, '-')] = parseInt(score);
        }
      });
      return result;
    });
    
    results[page] = scores;
    console.log(`\n=== ${page.toUpperCase()} ===`);
    for (const [k, v] of Object.entries(scores)) {
      console.log(`  ${k}: ${v}`);
    }
    
    await pageObj.close();
  }
  
  await browser.close();
  
  // Save results
  fs.writeFileSync(path.join(__dirname, 'before-scores.json'), JSON.stringify(results, null, 2));
  console.log('\nScores saved to before-scores.json');
}

extractScores().catch(console.error);
