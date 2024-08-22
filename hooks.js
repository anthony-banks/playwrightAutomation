const { chromium } = require('@playwright/test');

const hooks = {
  browser: null,
  page: null,
  homePage: null,
  searchPage: null,
  authPage: null,
  expect: null,

  // Setup method to initialize HomePage and SearchPage optionally
  async setup(HomePage, SearchPage, AuthPage, expect) {
    this.HomePage = HomePage;
    this.SearchPage = SearchPage;  // SearchPage is optional
    this.AuthPage = AuthPage; // AuthPage is optional
    this.expect = expect;
  },

  async beforeEach() {
    this.browser = await chromium.launch({ headless: true });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    await this.page.goto('http://demowebshop.tricentis.com');

    // Initialize homePage as it's mandatory
    this.homePage = new this.HomePage(this.page, this.expect);

    // Conditionally initialize searchPage if it's provided
    if (this.SearchPage) {
      this.searchPage = new this.SearchPage(this.page, this.expect);
    }

    // Conditionally initialize AuthPage if it's provided
    if (this.AuthPage) {
      this.authpage = new this.AuthPage(this.page, this.expect);
    }

    await this.homePage.validateHomeHeader(); // Use homePage initialized in hooks
  },

  async afterEach() {
    await this.browser.close();
  },
};

module.exports = hooks;