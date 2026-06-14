# Playwright E2E Test Automation Framework

![Playwright Tests](https://github.com/anthony-banks/playwrightAutomation/workflows/Playwright%20Tests/badge.svg)

An end-to-end test automation framework for the [Tricentis Demo Web Shop](https://demowebshop.tricentis.com), built with Playwright and JavaScript using the Page Object Model design pattern.

## About This Project

This project tests a real e-commerce application using a maintainable framework architecture based on the Page Object Model.

### Application Under Test

**Tricentis Demo Web Shop** — a demo e-commerce application that includes:
- User authentication
- Product catalog and search
- Shopping cart functionality
- Multiple navigation paths and information pages

### Test Coverage

The suite contains 58 tests across the following user flows:

- **User Registration** (`registerTests.spec.js`) — 16 tests
  - Registration with valid data (multiple scenarios)
  - Required field validation (first name, last name, email, password, confirm password)
  - Email format validation
  - Password length validation (minimum 6 characters)
  - Password confirmation matching
  - Duplicate email detection
  - Edge cases (long names, special characters, email formats, whitespace trimming)

- **Authentication** (`authTests.spec.js`) — 2 tests
  - Login with valid credentials
  - Logout

- **Shopping Cart** (`cartTests.spec.js`, `cartCrudTests.spec.js`) — 26 tests
  - Adding products to the cart and cart page validation (`cartTests.spec.js`)
  - Full CRUD operations (`cartCrudTests.spec.js`):
    - Create: adding single and multiple items, cart persistence
    - Read: viewing cart items, reading product names and quantities
    - Update: modifying quantities (manual entry, increment, decrement)
    - Delete: removing items, clearing the cart
    - Mixed workflows and edge case validation

- **Product Search** (`searchTests.spec.js`) — 1 test
  - Basic product search and results validation

- **Homepage** (`homeTests.spec.js`) — 1 test
  - Homepage load and key element validation

- **Footer Navigation** (`csNavTests.spec.js`, `infoNavTests.spec.js`) — 12 tests
  - Customer service links: Search, News, Blog, Recently Viewed, Compare, New Products
  - Information links: Shipping & Returns, Sitemap, Privacy Policy, Conditions of Use, About Us, Contact Us

## Tech Stack

- **Playwright** — end-to-end testing framework
- **JavaScript (Node.js)** — runtime environment
- **Page Object Model** — design pattern for maintainability
- **GitHub Actions** — continuous integration

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI pipeline configuration
├── locators/
│   └── locators.js             # Centralized element selectors
├── pages/
│   ├── AuthPage.js             # Authentication page object
│   ├── CartPage.js             # Shopping cart page object
│   ├── HomePage.js             # Homepage page object
│   ├── RegisterPage.js         # User registration page object
│   └── SearchPage.js           # Search page object
├── test/
│   ├── authTests.spec.js       # Authentication tests
│   ├── cartTests.spec.js       # Cart functionality tests
│   ├── cartCrudTests.spec.js   # Cart CRUD operations
│   ├── csNavTests.spec.js      # Customer service navigation tests
│   ├── homeTests.spec.js       # Homepage tests
│   ├── infoNavTests.spec.js    # Information links tests
│   ├── registerTests.spec.js   # User registration tests
│   └── searchTests.spec.js     # Search functionality tests
├── globalFunctions.js          # Reusable utility functions
├── hooks.js                    # Test lifecycle hooks
└── playwright.config.js        # Playwright configuration
```

### Why Page Object Model?

The Page Object Model (POM) design pattern was chosen for the following reasons:

1. **Maintainability** — UI changes only require updates in page objects, not in every test
2. **Reusability** — common page interactions are defined once and used across multiple tests
3. **Readability** — tests read like user stories rather than technical implementation details
4. **Separation of concerns** — test logic is separated from page structure and element selectors
5. **Reduced duplication** — shared functionality lives in page objects and global functions

Supporting pieces:
- **Global Functions** (`globalFunctions.js`) — common operations such as clicking and element validation
- **Hooks** (`hooks.js`) — shared test setup and teardown across suites
- **Centralized Configuration** — a single source of truth for test settings

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

### Run all tests
```bash
npx playwright test
```

### Run a single test file
```bash
npx playwright test test/authTests.spec.js
```

### Run in headed mode (watch tests execute)
```bash
npx playwright test --headed
```

### Run in UI mode (interactive)
```bash
npx playwright test --ui
```

### Run with debug mode
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
- Error messages

Reports are generated in the `playwright-report/` directory.

## Continuous Integration

GitHub Actions runs the suite on every push and pull request to the default branch. The workflow:

1. Sets up Node.js LTS
2. Installs dependencies
3. Runs the test suite in the official Playwright container (browsers and system dependencies pre-installed)
4. Uploads the HTML report as an artifact (retained for 30 days)

The workflow configuration is in `.github/workflows/playwright.yml`.

## Configuration

Key options in `playwright.config.js`:

- **Base URL**: `https://demowebshop.tricentis.com`
- **Retries**: 2 on CI, 0 locally
- **Timeout**: 30 seconds per test
- **Reporters**: HTML and List
- **Trace**: captured on first retry
- **Screenshots**: captured on failure
- **Video**: retained on failure

## Author

**Anthony Banks**

---

This framework was built as a portfolio project to demonstrate test automation, design patterns, and CI practices.
