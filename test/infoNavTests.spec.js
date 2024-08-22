const { test, expect } = require('@playwright/test');
const hooks = require('../hooks');
const { clickElement } = require('../globalFunctions');
const { HomePage } = require('../pages/HomePage');

// Array of footer links with corresponding expected URLs
const footerLinks = [
  { locator: 'a[href="/shipping-returns"]', expectedUrl: 'https://demowebshop.tricentis.com/shipping-returns' },
  { locator: 'a[href="/sitemap"]', expectedUrl: 'https://demowebshop.tricentis.com/sitemap' },
  { locator: 'a[href="/privacy-policy"]', expectedUrl: 'https://demowebshop.tricentis.com/privacy-policy' },
  { locator: 'a[href="/conditions-of-use"]', expectedUrl: 'https://demowebshop.tricentis.com/conditions-of-use' },
  { locator: 'a[href="/about-us"]', expectedUrl: 'https://demowebshop.tricentis.com/about-us' },
  { locator: 'a[href="/contactus"]', expectedUrl: 'https://demowebshop.tricentis.com/contactus' }
];

// Set up the hooks with HomePage, no SearchPage, and expect
hooks.setup(HomePage, null, null,  expect);

test.beforeEach(async () => {
  await hooks.beforeEach(); // Call beforeEach from hooks
});

test.afterEach(async () => {
  await hooks.afterEach(); // Call afterEach from hooks
});

// Parameterized test for each footer link
test.describe('Information column Footer Link Tests', () => {
  for (const link of footerLinks) {
    test(`should redirect to correct URL when clicking ${link.locator}`, async () => {
      // Click the footer link using page initialized in hooks
      await clickElement(hooks.page, link.locator);

      // Verify the correct URL
      await expect(hooks.page).toHaveURL(link.expectedUrl);
    });
  }
});