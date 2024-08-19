const { clickElement, validateElementsPresence } = require('../globalFunctions');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartHeader = this.page.locator('div.page-title h1');
    this.cartColumns = 'tr.cart-header-row';
    this.updateCartButton = this.page.locator('input[value="Update shopping cart"]');
    this.continueShoppingButton = this.page.locator('input[value="Continue shopping"]');
    this.estimateShippingButton = this.page.locator('input[value="Estimate shipping"]');
    this.checkoutButton = this.page.locator('input[value="Checkout"]');
    this.giftCardButton = this.page.locator('input[value="Add gift card"]');
    this.couponButton = this.page.locator('input[value="Apply coupon"]');
  }

  async validateCartPageLoads() {
    // Use the global validateElementsPresence function to check if elements are visible
    await validateElementsPresence(this.page, 
      [
        this.cartHeader, 
        this.cartColumns, 
        this.updateCartButton, 
        this.continueShoppingButton, 
        this.estimateShippingButton, 
        this.checkoutButton, 
        this.giftCardButton, 
        this.couponButton
    ]);
  }
}

module.exports = { CartPage };