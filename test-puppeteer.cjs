const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('_serverFn')) {
      console.log(`URL: ${url}`);
      console.log(`STATUS: ${response.status()}`);
      try {
        console.log(`BODY: ${await response.text()}`);
      } catch(e) {
        console.log("No body");
      }
    }
  });

  await page.goto('https://stiribursa.netlify.app/?q=&src=%5B%5D&th=%5B%5D&imp=%5B%5D&sort=newest', { waitUntil: 'networkidle0' });
  
  await browser.close();
})();
