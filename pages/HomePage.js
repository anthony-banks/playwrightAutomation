const { clickElement, validateElementsPresence } = require('../globalFunctions');

class HomePage {
  constructor(page) {
    this.page = page;
    this.logo = 'img[alt="Tricentis Demo Web Shop"]';
    this.registerLink = 'a[href="/register"]';
    this.loginLink = 'a[href="/login"]';
    this.cartLink = 'a[href="/cart"]';
    this.wishlistLink = 'a[href="/wishlist"]';
    this.profileLink = 'a.account:has-text("abanks47+auto@gmail.com")';
    this.logoutLink = 'a[href="/logout"]';
    this.shippingReturnsLink = 'a[href="/shipping-returns"]';
    this.addToCartButton = this.page.locator('input.button-2.product-box-add-to-cart-button');
    this.addToCartSuccessBanner = this.page.locator('text=THe product has been added to your ');
  }

  async validateHomeHeader() {
    // Use the global validateElementsPresence function to check if elements are visible and have the correct count
    await validateElementsPresence(this.page, [this.logo, this.registerLink, this.loginLink, this.cartLink, this.wishlistLink]);

    // Additional specific checks if needed
    const cartCount = await this.page.locator(this.cartLink).count();
    if (cartCount !== 2) {
      throw new Error(`Expected 2 cart links, but found ${cartCount}`);
    }

    const wishlistCount = await this.page.locator(this.wishlistLink).count();
    if (wishlistCount !== 2) {
      throw new Error(`Expected 2 wishlist links, but found ${wishlistCount}`);
    }
  }

  async validateLoggedInUser() {
    // Wait for the profile link to appear, then validate its presence along with the logout link
    await validateElementsPresence(this.page, [this.profileLink, this.logoutLink], 6000);
  }

  async clickLoginLink() {
    // Use the global clickElement function to click the login link
    await clickElement(this.page, this.loginLink);
  }

  async clickLogoutLink() {
    // Use the global clickElement function to click the logout link
    await clickElement(this.page, this.logoutLink);
  }

  async clickFirstAddToCartButton() {
    await this.addToCartButton.first().click();

    await validateElementsPresence(this.page, [this.addToCartSuccessBanner], 6000);
  }

  async clickCartLink() {
    await clickElement(this.page, this.cartLink);
  }
}

module.exports = { HomePage };