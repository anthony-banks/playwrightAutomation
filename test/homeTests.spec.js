const { test, expect, chromium } = require('@playwright/test');
const { AuthPage } = require('../pages/AuthPage');
const { HomePage } = require('../pages/HomePage');

let page, homePage, authPage, browser;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('http://demowebshop.tricentis.com');

  homePage = new HomePage(page, expect);
  authPage = new AuthPage(page, expect);
});

test.afterEach(async () => {
  await browser.close();
});

test('user validates homepage loads', async ({ page }) => {
  // Validate elements are visible
  await homePage.validateHomeHeader();
});