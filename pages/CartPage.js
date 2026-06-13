const { clickElement, validateElementsPresence } = require('../globalFunctions');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartHeader = 'div.page-title h1';
    this.cartColumns = 'tr.cart-header-row';
    this.updateCartButton = 'input[value="Update shopping cart"]';
    this.continueShoppingButton = 'input[value="Continue shopping"]';
    this.estimateShippingButton = 'input[value="Estimate shipping"]';
    this.checkoutButton = 'input[value="Checkout"]';
    this.giftCardButton = 'input[value="Add gift card"]';
    this.couponButton = 'input[value="Apply coupon"]';

    // Cart item selectors
    this.cartItemRow = 'tr.cart-item-row';
    this.productName = 'td.product a';
    this.quantityInput = 'input.qty-input';
    this.removeCheckbox = 'input[name^="removefromcart"]';
    this.cartTotal = 'span.product-price';
    this.emptyCartMessage = 'div.order-summary-content';
  }

  async validateCartPageLoads() {
    // Just validate the cart header is present
    await validateElementsPresence(this.page, [this.cartHeader]);

    // Wait for page to be fully loaded
    await this.page.waitForLoadState('networkidle');
  }

  // ==================
  // READ Operations
  // ==================

  async getCartItemCount() {
    try {
      const items = await this.page.locator(this.cartItemRow).count();
      return items;
    } catch {
      return 0;
    }
  }

  async getProductNames() {
    const names = [];
    const count = await this.getCartItemCount();

    for (let i = 0; i < count; i++) {
      const name = await this.page.locator(this.cartItemRow).nth(i).locator(this.productName).textContent();
      names.push(name?.trim());
    }

    return names;
  }

  async getItemQuantity(itemIndex = 0) {
    const input = this.page.locator(this.cartItemRow).nth(itemIndex).locator(this.quantityInput);
    const value = await input.inputValue();
    return parseInt(value);
  }

  async getCartTotal() {
    // Get the total from the cart summary
    try {
      const total = await this.page.locator('.cart-total .product-price').textContent();
      return total?.trim();
    } catch {
      return null;
    }
  }

  async isCartEmpty() {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  // ==================
  // UPDATE Operations
  // ==================

  async updateQuantity(itemIndex, newQuantity) {
    const input = this.page.locator(this.cartItemRow).nth(itemIndex).locator(this.quantityInput);
    await input.clear();
    await input.fill(newQuantity.toString());
    await this.page.locator(this.updateCartButton).click();

    // Wait for page to update
    await this.page.waitForLoadState('networkidle');
  }

  async incrementQuantity(itemIndex = 0) {
    const currentQty = await this.getItemQuantity(itemIndex);
    await this.updateQuantity(itemIndex, currentQty + 1);
  }

  async decrementQuantity(itemIndex = 0) {
    const currentQty = await this.getItemQuantity(itemIndex);
    if (currentQty > 1) {
      await this.updateQuantity(itemIndex, currentQty - 1);
    }
  }

  // ==================
  // DELETE Operations
  // ==================

  async removeItem(itemIndex = 0) {
    // Check the remove checkbox for the item
    const checkbox = this.page.locator(this.cartItemRow).nth(itemIndex).locator(this.removeCheckbox);
    await checkbox.check();

    // Click update cart button to remove
    await this.page.locator(this.updateCartButton).click();

    // Wait for page to update
    await this.page.waitForLoadState('networkidle');
  }

  async removeAllItems() {
    const count = await this.getCartItemCount();

    // Check all remove checkboxes
    for (let i = 0; i < count; i++) {
      const checkbox = this.page.locator(this.removeCheckbox).nth(i);
      await checkbox.check();
    }

    // Click update cart button
    await this.page.locator(this.updateCartButton).click();

    // Wait for page to update
    await this.page.waitForLoadState('networkidle');
  }

  async clearCart() {
    // Alternative method: remove all items one by one if needed
    await this.removeAllItems();
  }

  // ==================
  // VALIDATION Helpers
  // ==================

  async validateItemInCart(productName) {
    const names = await this.getProductNames();
    return names.some(name => name?.includes(productName));
  }

  async validateCartIsEmpty() {
    const isEmpty = await this.isCartEmpty();
    if (!isEmpty) {
      throw new Error('Cart is not empty');
    }
  }

  async validateCartHasItems(expectedCount) {
    const actualCount = await this.getCartItemCount();
    if (actualCount !== expectedCount) {
      throw new Error(`Expected ${expectedCount} items, but found ${actualCount}`);
    }
  }

  // ==================
  // NAVIGATION
  // ==================

  async continueShopping() {
    await this.page.locator(this.continueShoppingButton).click();
  }

  async proceedToCheckout() {
    await this.page.locator(this.checkoutButton).click();
  }
}

module.exports = { CartPage };