const fs = require('fs');
const path = require('path');

['home', 'flights', 'chat'].forEach(page => {
  const filePath = path.join(__dirname, 'before-' + page + '.html');
  const html = fs.readFileSync(filePath, 'utf-8');
  
  // Lighthouse embeds the JSON-LD report data in a script tag
  // Look for the categories scoring data
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  
  console.log('\n=== ' + page.toUpperCase() + ' ===');
  
  for (const cat of categories) {
    // Look for the gauge score text pattern
    const scorePattern = new RegExp(`id="${cat}"[^>]*>.*?<span[^>]*>(\\d+)<`, 's');
    const match = html.match(scorePattern);
    if (match) {
      console.log(`  ${cat}: ${match[1]}`);
    }
  }
  
  // Also try to find the score from the JSON-LD script
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      if (data.categories) {
        for (const [key, val] of Object.entries(data.categories)) {
          console.log(`  ${key} (json): ${Math.round(val.score * 100)}`);
        }
      }
    } catch (e) {}
  }
  
  // Try another pattern - look for the score wrapper data
  const scoreDataPattern = /data-category="([^"]+)"[^>]*>.*?<span[^>]*class="[^"]*lh-exp-gauge__percentage[^"]*"[^>]*>(\d+)<\/span>/gs;
  let match2;
  while ((match2 = scoreDataPattern.exec(html)) !== null) {
    console.log(`  ${match2[1]} (gauge): ${match2[2]}`);
  }
});
