const fs = require('fs');
const path = require('path');

['home', 'flights', 'chat'].forEach(page => {
  const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'before-' + page + '.json'), 'utf-8'));
  
  console.log('\n========================================');
  console.log('  ' + page.toUpperCase() + ' PAGE');
  console.log('========================================');
  
  // Color contrast details
  const cc = d.audits['color-contrast'];
  if (cc) {
    console.log('\n--- COLOR CONTRAST ---');
    console.log('Score:', cc.score === 0 ? 'FAIL' : 'PASS');
    if (cc.details && cc.details.items) {
      cc.details.items.forEach((item, i) => {
        console.log('  Element ' + (i+1) + ':', item.node?.snippet || 'unknown');
        console.log('    Selector:', item.node?.selector || 'unknown');
      });
    }
  }
  
  // Performance metrics
  console.log('\n--- PERFORMANCE METRICS ---');
  const metrics = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index', 'interactive'];
  metrics.forEach(m => {
    const a = d.audits[m];
    if (a && a.displayValue) {
      console.log('  ' + a.title + ': ' + a.displayValue);
    }
  });
  
  // Unused JS
  const unused = d.audits['unused-javascript'];
  if (unused && unused.details && unused.details.items) {
    console.log('\n--- UNUSED JAVASCRIPT ---');
    unused.details.items.slice(0, 5).forEach(item => {
      const savings = item.wastedBytes ? Math.round(item.wastedBytes / 1024) + ' KiB' : 'N/A';
      console.log('  ' + (item.url || '').substring(0, 80) + ' (' + savings + ' wasted)');
    });
  }
  
  // Layout shift details
  const cls = d.audits['layout-shifts'];
  if (cls && cls.details && cls.details.items) {
    console.log('\n--- LAYOUT SHIFTS ---');
    cls.details.items.forEach(item => {
      console.log('  Score:', item.score);
      if (item.subItems) {
        item.subItems.forEach(sub => {
          console.log('    Element:', sub.node?.snippet || 'unknown');
        });
      }
    });
  }
});
