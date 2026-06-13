# How to Run Tests

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Install Playwright browsers** (first time only):
   ```bash
   npx playwright install chromium
   ```

3. **Run all tests**:
   ```bash
   npx playwright test
   ```

## Other Options

- **Run in headed mode** (see browser):
  ```bash
  npx playwright test --headed
  ```

- **Run specific test file**:
  ```bash
  npx playwright test test/authTests.spec.js
  ```

- **Run in UI mode** (interactive):
  ```bash
  npx playwright test --ui
  ```

- **View test report**:
  ```bash
  npx playwright show-report
  ```

## Expected Output

You should see all 17 tests pass:
- ✓ 2 authentication tests
- ✓ 1 cart test
- ✓ 1 search test
- ✓ 1 homepage test
- ✓ 12 footer navigation tests

Total runtime: ~30 seconds
