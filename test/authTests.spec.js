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

  await homePage.validateHomeHeader();
  await homePage.clickLoginLink();
  await expect(page).toHaveURL('https://demowebshop.tricentis.com/login');
  await authPage.validateAuthPageLoads();
});

test.afterEach(async () => {
  await browser.close();
});

test('user can login with valid credentials', async () => {
  await authPage.inputCredentials('abanks47+auto@gmail.com', 'auto1234');
  await expect(page).toHaveURL('https://demowebshop.tricentis.com');

  await homePage.validateLoggedInUser();
  await homePage.clickLogoutLink();
  await homePage.validateHomeHeader();
});

test('user cannot login with invalid credentials', async () => {
  await authPage.inputCredentials('abanks47+auto@gmail.com', 'test');
  await authPage.loginErrorPopulates();
});