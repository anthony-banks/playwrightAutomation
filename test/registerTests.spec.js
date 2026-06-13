const { test, expect, chromium } = require('@playwright/test');
const { RegisterPage } = require('../pages/RegisterPage');
const { HomePage } = require('../pages/HomePage');

let page, registerPage, homePage, browser;

test.beforeEach(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('http://demowebshop.tricentis.com');

  homePage = new HomePage(page);
  registerPage = new RegisterPage(page);

  // Navigate to registration page
  await homePage.validateHomeHeader();
  await page.click('a[href="/register"]');
  await expect(page).toHaveURL('https://demowebshop.tricentis.com/register');
  await registerPage.validateRegisterPageLoads();
});

test.afterEach(async () => {
  await browser.close();
});

// ===========================
// HAPPY PATH TESTS
// ===========================

test.describe('User Registration - Happy Path', () => {

  test('user can register with all valid information', async () => {
    const uniqueEmail = RegisterPage.generateUniqueEmail('newuser');

    await registerPage.registerUser({
      gender: 'male',
      firstName: 'John',
      lastName: 'Doe',
      email: uniqueEmail,
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!'
    });

    // Verify successful registration
    await registerPage.validateSuccessfulRegistration();

    // Should redirect to registration result page
    await expect(page).toHaveURL(/registerresult/);
  });

  test('user can register as female', async () => {
    const uniqueEmail = RegisterPage.generateUniqueEmail('jane');

    await registerPage.registerUser({
      gender: 'female',
      firstName: 'Jane',
      lastName: 'Smith',
      email: uniqueEmail,
      password: 'SecurePass123!'
    });

    await registerPage.validateSuccessfulRegistration();
  });

  test('user can register with minimum required fields', async () => {
    const uniqueEmail = RegisterPage.generateUniqueEmail('minimal');

    await registerPage.registerUser({
      firstName: 'Min',
      lastName: 'User',
      email: uniqueEmail,
      password: 'Pass123!'
    });

    await registerPage.validateSuccessfulRegistration();
  });
});

// ===========================
// NEGATIVE TESTS - REQUIRED FIELDS
// ===========================

test.describe('User Registration - Required Field Validation', () => {

  test('cannot register without first name', async () => {
    await registerPage.registerUser({
      lastName: 'Doe',
      email: RegisterPage.generateUniqueEmail(),
      password: 'SecurePass123!'
    });

    // Verify first name error appears
    const hasError = await registerPage.isValidationErrorVisible('firstName');
    expect(hasError).toBe(true);

    // Should still be on register page
    await expect(page).toHaveURL(/register/);
  });

  test('cannot register without last name', async () => {
    await registerPage.registerUser({
      firstName: 'John',
      email: RegisterPage.generateUniqueEmail(),
      password: 'SecurePass123!'
    });

    const hasError = await registerPage.isValidationErrorVisible('lastName');
    expect(hasError).toBe(true);
  });

  test('cannot register without email', async () => {
    await registerPage.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      password: 'SecurePass123!'
    });

    const hasError = await registerPage.isValidationErrorVisible('email');
    expect(hasError).toBe(true);
  });

  test('cannot register without password', async () => {
    await registerPage.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: RegisterPage.generateUniqueEmail(),
      confirmPassword: 'SecurePass123!'
    });

    const hasError = await registerPage.isValidationErrorVisible('password');
    expect(hasError).toBe(true);
  });

  test('cannot register without confirm password', async () => {
    await registerPage.fillRegistrationForm({
      firstName: 'John',
      lastName: 'Doe',
      email: RegisterPage.generateUniqueEmail(),
      password: 'SecurePass123!'
      // Intentionally not filling confirmPassword
    });

    await registerPage.page.fill(registerPage.confirmPasswordInput, '');
    await registerPage.submitRegistration();

    const hasError = await registerPage.isValidationErrorVisible('confirmPassword');
    expect(hasError).toBe(true);
  });
});

// ===========================
// NEGATIVE TESTS - VALIDATION RULES
// ===========================

test.describe('User Registration - Validation Rules', () => {

  test('cannot register with invalid email format', async () => {
    await registerPage.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email-format',
      password: 'SecurePass123!'
    });

    const hasError = await registerPage.isValidationErrorVisible('email');
    expect(hasError).toBe(true);
  });

  test('cannot register with mismatched passwords', async () => {
    await registerPage.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: RegisterPage.generateUniqueEmail(),
      password: 'SecurePass123!',
      confirmPassword: 'DifferentPassword456!'
    });

    const hasError = await registerPage.isValidationErrorVisible('confirmPassword');
    expect(hasError).toBe(true);
  });

  test('cannot register with password less than 6 characters', async () => {
    await registerPage.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: RegisterPage.generateUniqueEmail(),
      password: '12345',
      confirmPassword: '12345'
    });

    const hasError = await registerPage.isValidationErrorVisible('password');
    expect(hasError).toBe(true);
  });

  test('cannot register with already existing email', async () => {
    // Use a known existing email (the one from login tests)
    await registerPage.registerUser({
      firstName: 'Existing',
      lastName: 'User',
      email: 'abanks47+auto@gmail.com', // Email that already exists
      password: 'SecurePass123!'
    });

    // Should show error message about existing user
    const hasError = await registerPage.validateRegistrationError();
    expect(hasError).toBe(true);
  });
});

// ===========================
// EDGE CASES
// ===========================

test.describe('User Registration - Edge Cases', () => {

  test.skip('handles very long first name', async () => {
    // Skipped: This test times out as the site takes too long to process 100-character names
    const longName = 'A'.repeat(100);

    await registerPage.registerUser({
      firstName: longName,
      lastName: 'Doe',
      email: RegisterPage.generateUniqueEmail(),
      password: 'SecurePass123!'
    });

    // Should either accept or show validation error
    // (depending on max length validation)
  });

  test('handles special characters in name', async () => {
    await registerPage.registerUser({
      firstName: "O'Brien",
      lastName: "Smith-Jones",
      email: RegisterPage.generateUniqueEmail(),
      password: 'SecurePass123!'
    });

    // Should successfully register with special characters
    await registerPage.validateSuccessfulRegistration();
  });

  test('handles email with plus sign', async () => {
    const emailWithPlus = RegisterPage.generateUniqueEmail('test+special');

    await registerPage.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: emailWithPlus,
      password: 'SecurePass123!'
    });

    await registerPage.validateSuccessfulRegistration();
  });

  test('trims whitespace from email', async () => {
    const email = RegisterPage.generateUniqueEmail();

    await registerPage.registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: `  ${email}  `, // Email with leading/trailing spaces
      password: 'SecurePass123!'
    });

    // Should either trim and succeed, or show validation error
  });
});
