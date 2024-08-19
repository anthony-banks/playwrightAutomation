const { test, expect, chromium } = require('@playwright/test');
const { clickElement } = require('../globalFunctions');
const { HomePage } = require('../pages/HomePage');

let page, homePage, browser;

// Array of footer links with corresponding expected URLs
const footerLinks = [
  { locator: 'a[href="/search"]', expectedUrl: 'https://demowebshop.tricentis.com/search' },
  { locator: 'a[href="/news"]', expectedUrl: 'https://demowebshop.tricentis.com/news' },
  { locator: 'a[href="/blog"]', expectedUrl: 'https://demowebshop.tricentis.com/blog' },
  { locator: 'a[href="/recentlyviewedproducts"]', expectedUrl: 'https://demowebshop.tricentis.com/recentlyviewedproducts' },
  { locator: 'a[href="/compareproducts"]', expectedUrl: 'https://demowebshop.tricentis.com/compareproducts' },
  { locator: 'a[href="/newproducts"]', expectedUrl: 'https://demowebshop.tricentis.com/newproducts' }
];

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('http://demowebshop.tricentis.com');

  homePage = new HomePage(page, expect);
  // Validate elements are visible
  await homePage.validateHomeHeader();
});

test.afterEach(async () => {
  await browser.close();
});

// Parameterized test for each footer link
test.describe('Customer service Footer Link Tests', () => {
  for (const link of footerLinks) {
    test(`should redirect to correct URL when clicking ${link.locator}`, async () => {
      // Click the footer link
      await clickElement(page, link.locator);

      // Verify the correct URL
      await expect(page).toHaveURL(link.expectedUrl);
    });
  }
});
