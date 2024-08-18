class HomePage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.registerLink = this.page.locator('a[href="/register"]');
    this.loginLink = this.page.locator('a[href="/login"]');
    this.cartLink = this.page.locator('a[href="/cart"]');
    this.wishlistLink = this.page.locator('a[href="/wishlist"]');
    this.profileLink = this.page.locator('a.account:has-text("abanks47+auto@gmail.com")');
    this.logoutLink = this.page.locator('a[href="/logout"]');
  }

  async validateHomeHeader() {
    await this.expect(this.registerLink).toBeVisible();
    await this.expect(this.loginLink).toBeVisible();
    await this.expect(this.cartLink).toHaveCount(2);
    await this.expect(this.wishlistLink).toHaveCount(2);
  }

  async validateLoggedInUser() {
    await this.profileLink.waitFor({ timeout: 6000 });
    await this.expect(this.profileLink).toBeVisible();
    await this.expect(this.logoutLink).toBeVisible();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async clickLogoutLink() {
    await this.logoutLink.click();
  }
}

module.exports = { HomePage };