const { test, expect, chromium } = require('@playwright/test');
const { clickElement } = require('../globalFunctions');
const { HomePage } = require('../pages/HomePage');

let page, homePage, browser;

// Array of footer links with corresponding expected URLs
const footerLinks = [
  { locator: 'a[href="/shipping-returns"]', expectedUrl: 'https://demowebshop.tricentis.com/shipping-returns' },
  { locator: 'a[href="/sitemap"]', expectedUrl: 'https://demowebshop.tricentis.com/sitemap' },
  { locator: 'a[href="/privacy-policy"]', expectedUrl: 'https://demowebshop.tricentis.com/privacy-policy' },
  { locator: 'a[href="/conditions-of-use"]', expectedUrl: 'https://demowebshop.tricentis.com/conditions-of-use' },
  { locator: 'a[href="/about-us"]', expectedUrl: 'https://demowebshop.tricentis.com/about-us' },
  { locator: 'a[href="/contactus"]', expectedUrl: 'https://demowebshop.tricentis.com/contactus' }
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
test.describe('Information column Footer Link Tests', () => {
  for (const link of footerLinks) {
    test(`should redirect to correct URL when clicking ${link.locator}`, async () => {
      // Click the footer link
      await clickElement(page, link.locator);

      // Verify the correct URL
      await expect(page).toHaveURL(link.expectedUrl);
    });
  }
});
