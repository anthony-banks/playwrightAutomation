const { test, expect, chromium } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { SearchPage } = require('../pages/SearchPage');

let page, homePage, searchPage, browser;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('http://demowebshop.tricentis.com');

  homePage = new HomePage(page, expect);
  searchPage = new SearchPage(page, expect);
});

test.afterEach(async () => {
  await browser.close();
});

test('user can perform a basic serach', async () => {
  await homePage.validateHomeHeader();

  await searchPage.searchOptionsDisplayed();
  await searchPage.submitSearch('book');
  await expect(page).toHaveURL('https://demowebshop.tricentis.com/search?q=book');
  await searchPage.resultsDisplayed();
});
