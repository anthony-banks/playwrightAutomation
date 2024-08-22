const { clickElement, validateElementsPresence } = require('../globalFunctions');

class SearchPage {
  constructor(page) {
    this.page = page;
    this.searchField = 'input#small-searchterms';
    this.searchButton = 'input[value="Search"]';
    this.productItems = '.product-item';
  }

  async resultsDisplayed() {
    // Use the global validateElementsPresence function to check that the product items are visible
    await validateElementsPresence(this.page, this.productItems);
    // Additionally, you can check that exactly one product item is visible
    const count = await this.page.locator(this.productItems).count();
    if (count !== 1) {
      throw new Error(`Expected 1 product item, but found ${count}`);
    }
  }

  async searchOptionsDisplayed() {
    // Use the global validateElementsPresence function to check if the search field and button are visible
    await validateElementsPresence(this.page, [this.searchField, this.searchButton]);
  }

  async submitSearch(searchTerm) {
    // Input text into the search field
    await this.page.fill(this.searchField, searchTerm);
    // Use the global clickElement function to click the search button
    await clickElement(this.page, this.searchButton);
  }
}

module.exports = { SearchPage };