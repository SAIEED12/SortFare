const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshots() {
  const pages = ['home', 'flights', 'chat'];
  const variants = ['before', 'after'];
  
  for (const variant of variants) {
    for (const page of pages) {
      const htmlFile = path.join(__dirname, `${variant}-${page}.html`);
      if (!fs.existsSync(htmlFile)) {
        console.log(`SKIP: ${variant}-${page}.html not found`);
        continue;
      }
      
      console.log(`Capturing ${variant}-${page}...`);
      const browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      });
      const tab = await browser.newPage();
      await tab.setViewport({ width: 1280, height: 900 });
      await tab.goto('file:///' + htmlFile.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for gauge rendering
      try {
        await tab.waitForSelector('.lh-exp-gauge__percentage', { timeout: 15000 });
      } catch (e) {
        console.log(`  Warning: gauge selector not found, trying alternate...`);
      }
      
      // Small delay for animations
      await new Promise(r => setTimeout(r, 1000));
      
      // Screenshot the full score header area
      const outputPath = path.join(__dirname, `${variant}-${page}-scores.png`);
      
      // Try to capture just the scores section
      const scoresSection = await tab.$('.lh-scores-header');
      if (scoresSection) {
        await scoresSection.screenshot({ path: outputPath });
        console.log(`  Saved: ${variant}-${page}-scores.png`);
      } else {
        // Fallback: capture top portion of page
        await tab.screenshot({ 
          path: outputPath, 
          clip: { x: 0, y: 0, width: 1280, height: 500 } 
        });
        console.log(`  Saved: ${variant}-${page}-scores.png (full viewport clip)`);
      }
      
      await browser.close();
    }
  }
  
  console.log('\nDone! Screenshots saved to audit-reports/');
}

takeScreenshots().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
