import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import axe from 'axe-core';

const url = 'http://localhost:8080/ott-platform.html';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });
await page.addScriptTag({ content: axe.source });

const results = await page.evaluate(async () => {
  return await window.axe.run(document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'best-practice']
    }
  });
});

const outPath = path.resolve('axe-results.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');

console.log(`Violations: ${results.violations.length}`);
for (const v of results.violations) {
  console.log(`- ${v.id}: ${v.help}`);
}

await browser.close();
