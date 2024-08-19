const { test, expect, chromium } = require('@playwright/test');
const { AuthPage } = require('../pages/AuthPage');
const { HomePage } = require('../pages/HomePage');
const { CartPage } = require('../pages/CartPage');

let page, homePage, authPage, cartPage, browser;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('http://demowebshop.tricentis.com');

  homePage = new HomePage(page, expect);
  authPage = new AuthPage(page, expect);
  cartPage = new CartPage(page, expect);
});

test.afterEach(async () => {
  await browser.close();
});

test('user validates adding an item to cart', async ({ page }) => {
  // Validate elements are visible
  await homePage.validateHomeHeader();

  await homePage.clickFirstAddToCartButton();

  await homePage.clickCartLink();

  await cartPage.validateCartPageLoads();
});