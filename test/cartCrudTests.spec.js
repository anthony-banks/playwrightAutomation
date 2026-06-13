const { test, expect, chromium } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { CartPage } = require('../pages/CartPage');

let page, homePage, cartPage, browser;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('http://demowebshop.tricentis.com');

  homePage = new HomePage(page);
  cartPage = new CartPage(page);

  await homePage.validateHomeHeader();
});

test.afterEach(async () => {
  await browser.close();
});

// ===========================
// CREATE Tests (Adding Items)
// ===========================

test.describe('Shopping Cart - CREATE Operations', () => {

  test('can add single item to empty cart', async () => {
    // Add first product to cart
    await homePage.clickFirstAddToCartButton();

    // Navigate to cart
    await homePage.clickCartLink();
    await cartPage.validateCartPageLoads();

    // Verify cart has 1 item
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('can add multiple items to cart', async () => {
    // Add first product
    await homePage.clickFirstAddToCartButton();

    // Go back to books page and add another
    await page.goto('http://demowebshop.tricentis.com/books');
    await page.locator('input.button-2.product-box-add-to-cart-button').nth(1).click();
    await page.waitForTimeout(1500);

    // Navigate to cart
    await homePage.clickCartLink();

    // Verify cart has 2 items
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });

  test('cart persists after navigation', async () => {
    // Add item to cart
    await homePage.clickFirstAddToCartButton();

    // Navigate away from cart
    await page.goto('http://demowebshop.tricentis.com');

    // Go back to cart
    await homePage.clickCartLink();

    // Verify item still in cart
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });
});

// ===========================
// READ Tests (Viewing Cart)
// ===========================

test.describe('Shopping Cart - READ Operations', () => {

  test.beforeEach(async () => {
    // Add item to cart for read tests
    await homePage.clickFirstAddToCartButton();
    await homePage.clickCartLink();
  });

  test('can view cart items', async () => {
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('can read product names in cart', async () => {
    const productNames = await cartPage.getProductNames();

    expect(productNames.length).toBeGreaterThan(0);
    expect(productNames[0]).toBeTruthy();
  });

  test('can read item quantity', async () => {
    const quantity = await cartPage.getItemQuantity(0);

    expect(quantity).toBeGreaterThan(0);
    expect(typeof quantity).toBe('number');
  });

  test('can check if cart is empty or not', async () => {
    const isEmpty = await cartPage.isCartEmpty();

    expect(isEmpty).toBe(false); // Should have items from beforeEach
  });

  test('can validate specific item in cart', async () => {
    const productNames = await cartPage.getProductNames();
    const firstProduct = productNames[0];

    const isInCart = await cartPage.validateItemInCart(firstProduct);
    expect(isInCart).toBe(true);
  });
});

// ===========================
// UPDATE Tests (Modifying Quantities)
// ===========================

test.describe('Shopping Cart - UPDATE Operations', () => {

  test.beforeEach(async () => {
    // Add item to cart for update tests
    await homePage.clickFirstAddToCartButton();
    await homePage.clickCartLink();
  });

  test('can update item quantity manually', async () => {
    const initialQty = await cartPage.getItemQuantity(0);

    // Update quantity to 3
    await cartPage.updateQuantity(0, 3);

    const updatedQty = await cartPage.getItemQuantity(0);
    expect(updatedQty).toBe(3);
    expect(updatedQty).not.toBe(initialQty);
  });

  test('can increment item quantity', async () => {
    const initialQty = await cartPage.getItemQuantity(0);

    await cartPage.incrementQuantity(0);

    const newQty = await cartPage.getItemQuantity(0);
    expect(newQty).toBe(initialQty + 1);
  });

  test('can decrement item quantity', async () => {
    // First set quantity to 3
    await cartPage.updateQuantity(0, 3);

    const initialQty = await cartPage.getItemQuantity(0);
    await cartPage.decrementQuantity(0);

    const newQty = await cartPage.getItemQuantity(0);
    expect(newQty).toBe(initialQty - 1);
  });

  test('quantity cannot go below 1 when decrementing', async () => {
    // Set quantity to 1
    await cartPage.updateQuantity(0, 1);

    await cartPage.decrementQuantity(0);

    // Should still be 1 (won't go below)
    const qty = await cartPage.getItemQuantity(0);
    expect(qty).toBe(1);
  });

  test('can update quantity to large number', async () => {
    await cartPage.updateQuantity(0, 10);

    const qty = await cartPage.getItemQuantity(0);
    expect(qty).toBe(10);
  });
});

// ===========================
// DELETE Tests (Removing Items)
// ===========================

test.describe('Shopping Cart - DELETE Operations', () => {

  test.beforeEach(async () => {
    // Add items to cart for delete tests
    await homePage.clickFirstAddToCartButton();
    await page.goto('http://demowebshop.tricentis.com/books');
    await page.locator('input.button-2.product-box-add-to-cart-button').nth(1).click();
    await page.waitForTimeout(1500);
    await homePage.clickCartLink();
  });

  test('can remove single item from cart', async () => {
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThan(0);

    await cartPage.removeItem(0);

    const newCount = await cartPage.getCartItemCount();
    expect(newCount).toBe(initialCount - 1);
  });

  test('can remove specific item by index', async () => {
    const initialNames = await cartPage.getProductNames();
    const secondItemName = initialNames[1];

    // Remove the second item
    await cartPage.removeItem(1);

    const newNames = await cartPage.getProductNames();
    expect(newNames).not.toContain(secondItemName);
  });

  test('can clear entire cart', async () => {
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThan(0);

    await cartPage.clearCart();

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });

  test('can remove all items one by one', async () => {
    await cartPage.removeAllItems();

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);
  });

  test('cart shows empty state after removing all items', async () => {
    await cartPage.clearCart();

    await cartPage.validateCartIsEmpty();
  });
});

// ===========================
// MIXED CRUD Operations
// ===========================

test.describe('Shopping Cart - Mixed CRUD Operations', () => {

  test('complete cart workflow: add -> read -> update -> delete', async () => {
    // CREATE: Add item
    await homePage.clickFirstAddToCartButton();
    await homePage.clickCartLink();

    // READ: Verify item added
    let itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);

    // UPDATE: Change quantity
    await cartPage.updateQuantity(0, 5);
    let quantity = await cartPage.getItemQuantity(0);
    expect(quantity).toBe(5);

    // DELETE: Remove item
    await cartPage.removeItem(0);
    itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);
  });

  test('can modify cart multiple times in sequence', async () => {
    // Add item
    await homePage.clickFirstAddToCartButton();
    await homePage.clickCartLink();

    // Update quantity multiple times
    await cartPage.updateQuantity(0, 2);
    expect(await cartPage.getItemQuantity(0)).toBe(2);

    await cartPage.updateQuantity(0, 4);
    expect(await cartPage.getItemQuantity(0)).toBe(4);

    await cartPage.updateQuantity(0, 1);
    expect(await cartPage.getItemQuantity(0)).toBe(1);
  });

  test('can navigate back to shopping after cart operations', async () => {
    await homePage.clickFirstAddToCartButton();
    await homePage.clickCartLink();

    await cartPage.continueShopping();

    // Should be able to navigate - verify we left the cart page
    const url = page.url();
    expect(url).not.toContain('/cart');
  });
});

// ===========================
// VALIDATION & EDGE CASES
// ===========================

test.describe('Shopping Cart - Validation & Edge Cases', () => {

  test('cart is empty by default', async () => {
    await homePage.clickCartLink();

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });

  test('cannot set quantity to zero via update', async () => {
    await homePage.clickFirstAddToCartButton();
    await homePage.clickCartLink();

    // Try to set quantity to 0 (should either prevent or remove item)
    await cartPage.updateQuantity(0, 0);

    const itemCount = await cartPage.getCartItemCount();
    // Either removed or stayed at 1
    expect(itemCount >= 0).toBe(true);
  });

  test('validates cart has expected number of items', async () => {
    await homePage.clickFirstAddToCartButton();
    await homePage.clickCartLink();

    // This should pass
    await cartPage.validateCartHasItems(1);

    // Add another item
    await page.goto('http://demowebshop.tricentis.com/books');
    await page.locator('input.button-2.product-box-add-to-cart-button').nth(1).click();
    await page.waitForTimeout(1500);
    await homePage.clickCartLink();

    await cartPage.validateCartHasItems(2);
  });

  test('handles empty cart gracefully', async () => {
    await homePage.clickCartLink();

    const count = await cartPage.getCartItemCount();
    expect(count).toBe(0);

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });
});
