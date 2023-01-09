import { expect, test as base } from '@playwright/test';

const test = base.extend({
	page: async ({ page }, use) => {
		await page.goto('/sudoku/editor', { waitUntil: 'networkidle' });
		await use(page);
	}
});

test.describe('Editor', () => {
	test('Givens inputs in the sudoku editor', async ({ page }) => {
		await page.getByRole('button', { name: 'Givens' }).click();

		// Click row 0 cell 0
		await page.locator('id=interface').locator('rect').first().click();
		// Input digit 5
		await page.keyboard.press('Digit5');
		expect(
			await page.locator('id=numbers').locator('text').first().textContent(),
			'R0C0 Should have a 5 in the corner'
		).toBe('5');
	});
});
