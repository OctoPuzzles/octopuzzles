import { expect, test as base } from '@playwright/test';

const test = base.extend({
	page: async ({ page }, use) => {
		await page.goto('/sudoku/2', { waitUntil: 'networkidle' });
		await use(page);
	}
});

test.describe('Scanner', () => {
	test('Adds a number in the first step', async ({ page }) => {
		const initialNumberOfClues = await page.locator('id=numbers').locator('text').count();

		await page.getByRole('button', { name: 'Scanner' }).click();

		await page.getByRole('button', { name: 'Step' }).click();

		const amountOfNumbersNow = await page.locator('id=numbers').locator('text').count();

		expect(amountOfNumbersNow).toBeGreaterThan(initialNumberOfClues);
	});

	test('Fills out the sudoku when specifying to scan instantly', async ({ page }) => {
		await page.getByRole('button', { name: 'Scanner' }).click();

		await page.getByRole('button', { name: 'Instant' }).click();

		await page.getByRole('button', { name: 'Scan', exact: true }).click();

		await page.waitForTimeout(2000);

		const amountOfNumbers = await page.locator('id=numbers').locator('text').count();

		expect(amountOfNumbers).toBe(36);
	});
});
