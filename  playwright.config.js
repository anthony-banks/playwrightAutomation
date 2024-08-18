// playwright.config.js
module.exports = {
  testDir: 'test', // Directory where your test files are located
  timeout: 30000, // Default timeout for each test
  use: {
    headless: false, // Run tests in headless mode
    viewport: { width: 1920, height: 1080 }, // Set viewport size to average desktop resolution
  },
  reporter: 'list', // Use 'list' reporter to display test results
};