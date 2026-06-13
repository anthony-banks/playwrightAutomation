const { clickElement, validateElementsPresence } = require('../globalFunctions');

class RegisterPage {
  constructor(page) {
    this.page = page;

    // Gender radio buttons
    this.genderMale = 'input#gender-male';
    this.genderFemale = 'input#gender-female';

    // Personal details fields
    this.firstNameInput = 'input#FirstName';
    this.lastNameInput = 'input#LastName';
    this.emailInput = 'input#Email';

    // Password fields
    this.passwordInput = 'input#Password';
    this.confirmPasswordInput = 'input#ConfirmPassword';

    // Buttons
    this.registerButton = 'input#register-button';

    // Validation messages
    this.firstNameError = 'span.field-validation-error[data-valmsg-for="FirstName"]';
    this.lastNameError = 'span.field-validation-error[data-valmsg-for="LastName"]';
    this.emailError = 'span.field-validation-error[data-valmsg-for="Email"]';
    this.passwordError = 'span.field-validation-error[data-valmsg-for="Password"]';
    this.confirmPasswordError = 'span.field-validation-error[data-valmsg-for="ConfirmPassword"]';

    // Success/Error messages
    this.registrationResult = 'div.result';
    this.errorMessage = 'div.message-error';
    this.successMessage = 'div.registration-result-page';
  }

  async validateRegisterPageLoads() {
    await validateElementsPresence(this.page, [
      this.genderMale,
      this.genderFemale,
      this.firstNameInput,
      this.lastNameInput,
      this.emailInput,
      this.passwordInput,
      this.confirmPasswordInput,
      this.registerButton
    ]);
  }

  async selectGender(gender) {
    if (gender.toLowerCase() === 'male') {
      await this.page.click(this.genderMale);
    } else if (gender.toLowerCase() === 'female') {
      await this.page.click(this.genderFemale);
    }
  }

  async fillRegistrationForm(userData) {
    // Select gender if provided
    if (userData.gender) {
      await this.selectGender(userData.gender);
    }

    // Fill personal details
    if (userData.firstName) {
      await this.page.fill(this.firstNameInput, userData.firstName);
    }

    if (userData.lastName) {
      await this.page.fill(this.lastNameInput, userData.lastName);
    }

    if (userData.email) {
      await this.page.fill(this.emailInput, userData.email);
    }

    // Fill password fields
    if (userData.password) {
      await this.page.fill(this.passwordInput, userData.password);
    }

    if (userData.confirmPassword !== undefined) {
      await this.page.fill(this.confirmPasswordInput, userData.confirmPassword);
    } else if (userData.password) {
      // Auto-fill confirm password if not explicitly provided
      await this.page.fill(this.confirmPasswordInput, userData.password);
    }
  }

  async submitRegistration() {
    await clickElement(this.page, this.registerButton);
  }

  async registerUser(userData) {
    await this.fillRegistrationForm(userData);
    await this.submitRegistration();
  }

  async getValidationError(field) {
    const errorSelectors = {
      firstName: this.firstNameError,
      lastName: this.lastNameError,
      email: this.emailError,
      password: this.passwordError,
      confirmPassword: this.confirmPasswordError
    };

    const selector = errorSelectors[field];
    if (!selector) {
      throw new Error(`Unknown field: ${field}`);
    }

    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 3000 });
      return await this.page.textContent(selector);
    } catch (error) {
      return null;
    }
  }

  async isValidationErrorVisible(field) {
    const error = await this.getValidationError(field);
    return error !== null;
  }

  async validateSuccessfulRegistration() {
    await validateElementsPresence(this.page, [this.successMessage], 10000);
  }

  async validateRegistrationError() {
    try {
      await this.page.waitForSelector(this.errorMessage, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSuccessMessage() {
    try {
      const message = await this.page.textContent(this.successMessage);
      return message;
    } catch {
      return null;
    }
  }

  // Helper to generate unique email for testing
  static generateUniqueEmail(prefix = 'test') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}+${timestamp}${random}@example.com`;
  }
}

module.exports = { RegisterPage };
