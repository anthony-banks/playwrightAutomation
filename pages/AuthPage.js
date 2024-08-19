const { clickElement, validateElementsPresence } = require('../globalFunctions');

class AuthPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
    this.emailInput = this.page.locator('input#Email');
    this.passwordInput = this.page.locator('input#Password');
    this.loginButton = this.page.locator('input[value="Log in"]');
    this.loginError = this.page.locator('text=Login was unsuccessful. Please correct the errors and try again.');
  }

  async validateAuthPageLoads() {
    await this.expect(this.emailInput).toBeVisible();
    await this.expect(this.passwordInput).toBeVisible();
    await this.expect(this.loginButton).toBeVisible();
  }

  async inputCredentials(email, password) {
    // Input text into the email field
    await this.emailInput.fill(email);
    // Input text into the password field
    await this.passwordInput.fill(password);
    // Click the login button
    await this.loginButton.click();
  }

  async loginErrorPopulates() {
    await this.expect(this.loginError).toBeVisible();
  }
}

module.exports = { AuthPage };