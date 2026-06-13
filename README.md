# Playwright E2E Test Automation Framework

![Playwright Tests](https://github.com/anthony-banks/playwrightAutomation/workflows/Playwright%20Tests/badge.svg)

A comprehensive end-to-end test automation framework for the [Tricentis Demo Web Shop](https://demowebshop.tricentis.com), built with Playwright and JavaScript using the Page Object Model design pattern.

## About This Project

This project demonstrates modern test automation best practices by testing a real e-commerce application with a maintainable, scalable framework architecture.

### Application Under Test

**Tricentis Demo Web Shop** - A feature-rich demo e-commerce application that includes:
- User authentication
- Product catalog and search
- Shopping cart functionality
- Multiple navigation paths and information pages

### Test Coverage

The test suite covers the following user flows:

- **User Registration** (`registerTests.spec.js`) - **NEW!**
  - Successful registration with valid data (multiple scenarios)
  - Required field validation (first name, last name, email, password)
  - Email format validation
  - Password strength validation (minimum 6 characters)
  - Password confirmation matching
  - Duplicate email detection
  - Edge cases (special characters, email formats)
  - **15 comprehensive test cases**

- **Authentication** (`authTests.spec.js`)
  - User login with valid credentials
  - User logout
  - Login validation with invalid credentials

- **Shopping Cart** (`cartTests.spec.js`)
  - Adding products to cart
  - Cart page validation

- **Product Search** (`searchTests.spec.js`)
  - Basic product search functionality
  - Search results validation

- **Homepage** (`homeTests.spec.js`)
  - Homepage load validation
  - Key elements presence verification

- **Footer Navigation** (`csNavTests.spec.js`, `infoNavTests.spec.js`)
  - Customer service links (Search, News, Blog, Recently Viewed, Compare, New Products)
  - Information links (Shipping & Returns, Sitemap, Privacy Policy, Conditions of Use, About Us, Contact Us)

## Tech Stack

- **Playwright** - Modern end-to-end testing framework
- **JavaScript (Node.js)** - Runtime environment
- **Page Object Model** - Design pattern for maintainability
- **GitHub Actions** - Continuous Integration

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI/CD pipeline configuration
├── locators/
│   └── locators.js             # Centralized element selectors
├── pages/
│   ├── AuthPage.js             # Authentication page object
│   ├── CartPage.js             # Shopping cart page object
│   ├── HomePage.js             # Homepage page object
│   ├── RegisterPage.js         # User registration page object (NEW!)
│   └── SearchPage.js           # Search page object
├── test/
│   ├── authTests.spec.js       # Authentication test suite
│   ├── cartTests.spec.js       # Cart functionality tests
│   ├── csNavTests.spec.js      # Customer service navigation tests
│   ├── homeTests.spec.js       # Homepage tests
│   ├── infoNavTests.spec.js    # Information links tests
│   ├── registerTests.spec.js   # User registration tests (NEW! - 15 tests)
│   └── searchTests.spec.js     # Search functionality tests
├── globalFunctions.js          # Reusable utility functions
├── hooks.js                    # Test lifecycle hooks
└── playwright.config.js        # Playwright configuration
```

### Why Page Object Model?

The **Page Object Model (POM)** design pattern was chosen for several key reasons:

1. **Maintainability** - UI changes only require updates in page objects, not in every test
2. **Reusability** - Common page interactions are defined once and used across multiple tests
3. **Readability** - Tests read like user stories rather than technical implementation details
4. **Separation of Concerns** - Test logic is separated from page structure and element selectors
5. **Reduced Code Duplication** - Shared functionality lives in page objects and global functions

The framework further enhances maintainability with:
- **Global Functions** (`globalFunctions.js`) - Common operations like clicking and element validation
- **Hooks** (`hooks.js`) - Standardized test setup and teardown across test suites
- **Centralized Configuration** - Single source of truth for test settings

## Installation

### Prerequisites
- Node.js (LTS version recommended)
- npm

### Setup

1. Clone the repository
```bash
git clone https://github.com/anthony-banks/playwrightAutomation.git
cd playwrightAutomation
```

2. Install dependencies
```bash
npm install
```

3. Install Playwright browsers
```bash
npx playwright install
```

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run a Single Test File
```bash
npx playwright test test/authTests.spec.js
```

### Run in Headed Mode (Watch Tests Execute)
```bash
npx playwright test --headed
```

### Run in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run with Debug Mode
```bash
npx playwright test --debug
```

## Test Reports

After running tests, Playwright generates an HTML report:

```bash
npx playwright show-report
```

The report includes:
- Test execution summary
- Pass/fail status for each test
- Screenshots and videos (on failure)
- Execution traces (on retry)
- Detailed error messages

Reports are generated in the `playwright-report/` directory.

## Continuous Integration

This project uses GitHub Actions to automatically run tests on every push and pull request to the main branch. The workflow:

1. Sets up Node.js LTS
2. Installs dependencies
3. Installs Playwright browsers with system dependencies
4. Runs the full test suite
5. Uploads the HTML report as an artifact (available for 30 days)

View the workflow configuration in `.github/workflows/playwright.yml`.

## Configuration

Key configuration options in `playwright.config.js`:

- **Base URL**: `https://demowebshop.tricentis.com`
- **Retries**: 2 on CI, 0 locally
- **Timeout**: 30 seconds per test
- **Reporters**: HTML and List
- **Trace**: Captured on first retry
- **Screenshots**: Captured on failure
- **Video**: Retained on failure

## Author

**Anthony Banks**

---

**Note**: This framework was built as a portfolio project to demonstrate proficiency in test automation, design patterns, and modern CI/CD practices.
