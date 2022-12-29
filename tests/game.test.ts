import { expect, test as base } from '@playwright/test';

const test = base.extend({
	page: async ({ page }, use) => {
		await page.goto('/sudoku/2', { waitUntil: 'networkidle' });
		await use(page);
	}
});

test.describe('6x6 sudoku', () => {
	test('Shortcuts for selecting control works', async ({ page }) => {
		// Shortcut for corner marks work
		await page.keyboard.press('KeyX');
		expect(await page.getByRole('button', { name: 'Corner marks' }).getAttribute('class')).toMatch(
			/ring-blue-500/
		);

		// Shortcut for numbers work
		await page.keyboard.press('KeyZ');
		expect(await page.getByRole('button', { name: 'Numbers' }).getAttribute('class')).toMatch(
			/ring-blue-500/
		);

		// Shortcut for center marks work
		await page.keyboard.press('KeyC');
		expect(await page.getByRole('button', { name: 'Center marks' }).getAttribute('class')).toMatch(
			/ring-blue-500/
		);

		// Shortcut for colors work
		await page.keyboard.press('KeyV');
		expect(await page.getByRole('button', { name: 'Colors' }).getAttribute('class')).toMatch(
			/ring-blue-500/
		);

		// Shortcut for notes work
		await page.keyboard.press('KeyB');
		expect(await page.getByRole('button', { name: 'Notes' }).getAttribute('class')).toMatch(
			/ring-blue-500/
		);
	});

	test('Number inputs in the sudoku game, and wrong cell highlights', async ({ page }) => {
		// Click row 3 cell 3
		await page.locator('id=interface').locator('rect').nth(14).click();
		// Input digit 5 to see if it shows a wrong cell
		await page.keyboard.press('Digit5');
		// Check that there is a 5 in the cell
		expect(
			await page.locator('id=numbers').locator('text').nth(5).textContent(),
			'R3C3 Should have a 5 in the cell'
		).toBe('5');
		// Check that it shows a red background
		expect(
			await page.locator('id=highlights').locator('rect').first().getAttribute('class'),
			'R3C3 should have a red background, as the digit in its cell is wrong'
		).toMatch(/text-red-200/);

		// Next, press 3 on the controller, and see that the highlight has been removed
		await page.getByRole('button', { name: '3' }).click();
		// Check that there is a 3 in the cell
		expect(
			await page.locator('id=numbers').locator('text').nth(5).textContent(),
			'R3C3 Should have a 3 in the cell'
		).toBe('3');
		// Check that it does not show a red background
		expect(
			await page.locator('id=highlights').locator('rect').first().getAttribute('class'),
			'R3C3 should no longer have a red background, as the right digit has now been entered.'
		).not.toMatch(/text-red-200/);
	});

	test('Cornermark inputs in the sudoku game', async ({ page }) => {
		await page.getByRole('button', { name: 'Corner marks' }).click();

		// Click row 3 cell 3
		await page.locator('id=interface').locator('rect').nth(14).click();
		// Input digit 5
		await page.keyboard.press('Digit5');
		// Check that there is a 5 in the corner of that cell
		expect(
			await page.locator('id=cornermarks').locator('text').first().textContent(),
			'R3C3 Should have a 5 in the corner'
		).toBe('5');
	});

	test('Centermark inputs in the sudoku game', async ({ page }) => {
		await page.getByRole('button', { name: 'Center marks' }).click();

		// Click row 3 cell 3
		await page.locator('id=interface').locator('rect').nth(14).click();
		// Input digit 5
		await page.keyboard.press('Digit5');
		expect(
			await page.locator('id=centermarks').locator('text').first().textContent(),
			'R3C3 Should have a 5 in the center'
		).toBe('5');
	});

	test('Color inputs in the sudoku game', async ({ page }) => {
		await page.getByRole('button', { name: 'Colors' }).click();

		// Click row 3 cell 3
		await page.locator('id=interface').locator('rect').nth(14).click();
		// Input digit 5
		await page.keyboard.press('Digit5');
		expect(
			await page.locator('id=colors').locator('path').first().getAttribute('class'),
			'R3C3 Should have a yellow background'
		).toMatch(/text-yellow/);
	});

	test('Notes inputs in the sudoku game', async ({ page }) => {
		await page.locator('id=interface').locator('rect').nth(14).click();

		await page.getByRole('button', { name: 'Notes' }).click();

		// Input digit 5
		await page.keyboard.press('Digit5');
		expect(
			page.locator('id=notes').locator('polygon').first(),
			'R3C3 Should have a note saying "5"'
		).toBeDefined();
	});
});
