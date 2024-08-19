async function clickElement(page, selector) {
  try {
      await page.waitForSelector(selector, { state: 'visible' });
      await page.click(selector);
      console.log(`Successfully clicked on element with selector: ${selector}`);
  } catch (error) {
      console.error(`Failed to click on element with selector: ${selector}`, error);
  }
}

async function validateElementsPresence(page, selectors) {
  try {
      if (Array.isArray(selectors)) {
          for (let selector of selectors) {
              await page.waitForSelector(selector, { state: 'visible' });
              console.log(`Element with selector: ${selector} is visible`);
          }
      } else {
          await page.waitForSelector(selectors, { state: 'visible' });
          console.log(`Element with selector: ${selectors} is visible`);
      }
  } catch (error) {
      console.error(`One or more elements are not visible: ${selectors}`, error);
  }
}

module.exports = { clickElement, validateElementsPresence };