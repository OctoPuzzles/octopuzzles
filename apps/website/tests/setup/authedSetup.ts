import { chromium } from '@playwright/test';

async function authedSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByPlaceholder('username or email').fill('dev@octopuzzles.com');
  await page.getByPlaceholder('password').fill('dev');

  await page.getByRole('dialog').getByRole('button', { name: 'Log In' }).click();
  // Save signed-in state to 'storageState.json'.
  await page.context().storageState({ path: './tests/setup/storageState.json' });
  await browser.close();
}

export default authedSetup;
