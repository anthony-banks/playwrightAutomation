const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { SearchPage } = require('../pages/SearchPage');
const hooks = require('../hooks'); // Import the hooks file

// Setup the hooks with the necessary classes and expect function
test.beforeAll(() => {
  hooks.setup(HomePage, SearchPage, null, expect);
});

test.beforeEach(async () => {
  await hooks.beforeEach();
});

test.afterEach(async () => {
  await hooks.afterEach();
});

test('user can perform a basic search', async () => {
  const { homePage, searchPage, page } = hooks;  // Destructure from hooks

  await homePage.validateHomeHeader();
  await searchPage.searchOptionsDisplayed();
  await searchPage.submitSearch('book');
  await expect(page).toHaveURL('https://demowebshop.tricentis.com/search?q=book');
  await searchPage.resultsDisplayed();
});