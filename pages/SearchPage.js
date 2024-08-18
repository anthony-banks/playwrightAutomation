class SearchPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.searchField = this.page.locator('input#small-searchterms');
    this.searchButton = this.page.locator('input[value="Search"]');
    this.productItems = this.page.locator('.product-item');
  }

  async searchOptionsDisplayed() {
    await this.expect(this.searchField).toBeVisible();
    await this.expect(this.searchButton).toBeVisible();
  }

  async submitSearch(searchTerm) {
    // Input text into the search field
    await this.searchField.fill(searchTerm);
    // Click the search button
    await this.searchButton.click();
  }

  async resultsDisplayed() {
    // Check that exactly one product item is visible
    await this.expect(this.productItems).toHaveCount(1);
  }
}

module.exports = { SearchPage };