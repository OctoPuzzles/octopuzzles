import { expect, test as base } from '@playwright/test';

const editorTest = base.extend({
	page: async ({ page }, use) => {
		await page.goto('/sudoku/editor', { waitUntil: 'networkidle' });
		await use(page);
	}
});

editorTest.describe('Editor', () => {
	editorTest('Givens', async ({ page }) => {
		await page.locator('#interface > rect:nth-child(2)').click();
		await page.getByRole('button', { name: '1' }).click();
		await page.locator('rect:nth-child(21)').first().click();
		await page
			.locator('rect:nth-child(33)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.keyboard.press('Digit2');

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	editorTest('Cell clues', async ({ page }) => {
		await page.getByTestId('Cell clues').click();
		await page.locator('#interface > rect:nth-child(31)').first().click();
		await page.getByRole('button', { name: 'Black' }).click();
		await page
			.getByRole('option', { name: 'Red' })
			.locator('div')
			.filter({ hasText: 'Red' })
			.click();
		await page.getByPlaceholder('Text').click();
		await page.getByPlaceholder('Text').fill('t');
		await page.getByRole('button', { name: 'Top Left' }).click();
		await page.locator('#listbox-4-option-1').click();
		await page.locator('#listbox-5').nth(1).click();
		await page.getByRole('option', { name: 'M' }).click();
		await page.getByRole('button', { name: 'New Cell clue from selection' }).click();
		await page.locator('rect:nth-child(43)').first().click();
		await page
			.getByRole('listbox')
			.filter({ hasText: 'Custom' })
			.getByRole('button', { name: 'Custom' })
			.click();
		await page.getByRole('option', { name: 'Maximum' }).click();
		await page.getByRole('button', { name: 'New Cell clue from selection' }).click();
		await page.locator('rect:nth-child(59)').first().click();
		await page
			.getByRole('listbox')
			.filter({ hasText: 'Maximum' })
			.getByRole('button', { name: 'Maximum' })
			.click();
		await page.getByRole('option', { name: 'Minimum' }).click();
		await page.getByRole('button', { name: 'New Cell clue from selection' }).click();
		await page
			.getByRole('listbox')
			.filter({ hasText: 'Minimum' })
			.getByRole('button', { name: 'Minimum' })
			.click();
		await page.getByRole('option', { name: 'Custom' }).click();
		await page
			.getByRole('listbox')
			.filter({ hasText: 'Custom' })
			.getByRole('button', { name: 'Custom' })
			.click();
		await page.getByText('Minimum').click();
		await page.locator('rect:nth-child(56)').first().click();
		await page.getByRole('button', { name: 'None' }).click();
		await page.getByText('Chevron (Inverted)').click();
		await page.getByRole('button', { name: 'New Cell clue from selection' }).click();
		await page
			.getByRole('listbox')
			.filter({ hasText: 'Minimum' })
			.getByRole('button', { name: 'Minimum' })
			.click();
		await page.getByRole('option', { name: 'Custom' }).getByText('Custom').click();
		await page.getByRole('button', { name: 'None' }).click();
		await page.getByText('Chevron (Inverted)').click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	editorTest('Border clues', async ({ page }) => {
		await page.getByTestId('Border clues').click();
		await page.locator('rect:nth-child(22)').first().click();
		await page.locator('rect:nth-child(11)').first().click();
		await page
			.locator('rect:nth-child(12)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByRole('button', { name: 'New Border clue from selection' }).click();
		await page.getByRole('button', { name: 'None' }).click();
		await page.getByRole('option', { name: 'Red' }).getByText('Red').click();
		await page.locator('rect:nth-child(22)').first().click();
		await page
			.locator('rect:nth-child(32)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.getByRole('listbox')
			.filter({ hasText: 'Red' })
			.getByRole('button', { name: 'Red' })
			.click();
		await page
			.getByRole('option', { name: 'Blue' })
			.locator('div')
			.filter({ hasText: 'Blue' })
			.click();
		await page.getByRole('button', { name: 'Custom' }).click();
		await page.getByRole('option', { name: 'XV (X)' }).click();
		await page.getByRole('button', { name: 'New Border clue from selection' }).click();
		await page.locator('rect:nth-child(42)').first().click();
		await page
			.locator('rect:nth-child(50)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByRole('button', { name: 'XV (X)' }).click();
		await page.getByRole('option', { name: 'Quadruple' }).click();
		await page.getByRole('group').locator('rect').nth(1).click();
		await page.getByPlaceholder('Text').click();
		await page.getByPlaceholder('Text').fill('t');
		await page.getByRole('button', { name: 'New Border clue from selection' }).click();
		await page.getByRole('slider').click();
		await page.locator('rect:nth-child(24)').first().click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	editorTest('paths', async ({ page }) => {
		await page.getByTestId('Paths').click();
		await page.locator('rect:nth-child(21)').first().click();
		await page
			.locator('rect:nth-child(24)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(31)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(41)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByRole('button', { name: 'New path from selection' }).click();
		await page.locator('rect:nth-child(51)').first().click();
		await page
			.locator('rect:nth-child(26)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByText('Color').click();
		await page.getByRole('button', { name: 'Black' }).click();
		await page
			.getByRole('option', { name: 'Red' })
			.locator('div')
			.filter({ hasText: 'Red' })
			.click();
		await page.getByRole('group').locator('rect').nth(1).click();
		await page.getByRole('button', { name: 'New path from selection' }).click();
		await page.getByRole('group').locator('rect').first().click();
		await page.locator('rect:nth-child(62)').first().click();
		await page
			.locator('rect:nth-child(13)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.getByRole('listbox')
			.filter({ hasText: 'Red' })
			.getByRole('button', { name: 'Red' })
			.click();
		await page
			.getByRole('option', { name: 'Blue' })
			.locator('div')
			.filter({ hasText: 'Blue' })
			.click();
		await page.getByLabel('Hollow').check();
		await page.getByLabel('Arrow').check();
		await page.getByRole('button', { name: 'New path from selection' }).click();
		await page.getByRole('button', { name: 'Custom' }).click();
		await page.locator('rect:nth-child(59)').first().click();
		await page.getByRole('button', { name: 'Custom' }).click();
		await page.getByText('Thermometer').click();
		await page
			.locator('rect:nth-child(55)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByRole('button', { name: 'New path from selection' }).click();
		await page.locator('rect:nth-child(38)').first().click();
		await page.locator('rect:nth-child(19)').first().click();
		await page.locator('#interface > rect:nth-child(3)').click({
			modifiers: ['Meta']
		});
		await page.getByRole('button', { name: 'Thermometer' }).click();
		await page.getByText('German Whispers').click();
		await page.getByRole('button', { name: 'New path from selection' }).click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	editorTest('killercages', async ({ page }) => {
		await page.getByTestId('Cages').click();
		await page.locator('rect:nth-child(32)').first().click();
		await page
			.locator('rect:nth-child(23)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(14)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(12)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(13)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(22)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByRole('button', { name: 'New Cage From Selection' }).click();
		await page.getByRole('button', { name: 'Black' }).click();
		await page.getByRole('option', { name: 'Red' }).click();
		await page.locator('rect:nth-child(51)').first().click();
		await page
			.locator('rect:nth-child(43)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(52)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(35)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.getByRole('listbox')
			.filter({ hasText: 'Red' })
			.getByRole('button', { name: 'Red' })
			.click();
		await page.getByRole('option', { name: 'Green' }).click();
		await page.getByRole('button', { name: 'New Cage From Selection' }).click();
		await page.getByPlaceholder('Text').click();
		await page.getByPlaceholder('Text').fill('1');
		await page.getByText('Type Killer Color Green Text Unique Digits').click();
		await page.locator('rect:nth-child(25)').first().click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	editorTest('regions', async ({ page }) => {
		await page.getByTestId('Regions').click();
		await page.getByRole('button', { name: 'Region 1: (9-cells)' }).click();
		await page
			.locator('rect:nth-child(21)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByRole('button', { name: 'Region 4: (9-cells)' }).click();
		await page
			.locator('rect:nth-child(40)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(41)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByRole('button', { name: 'None' }).click();
		await page
			.getByRole('option', { name: 'Red' })
			.locator('div')
			.filter({ hasText: 'Red' })
			.click();
		await page.getByRole('button', { name: 'Region 5: (7-cells)' }).click();
		await page.getByRole('button', { name: 'Normal' }).click();
		await page.getByRole('option', { name: 'Magic Square' }).click();
		await page.getByText('Type Magic Square Color Gray Borders Unique Digits').click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	editorTest('dimensions', async ({ page }) => {
		await page.getByTestId('Dimensions').click();
		await page.locator('input').first().fill('7');
		await page.locator('div:nth-child(2) > .border').click();
		await page.locator('div:nth-child(2) > .border').fill('9');
		await page.locator('div:nth-child(3) > .border').first().click();
		await page.locator('div:nth-child(3) > .border').first().fill('1');
		await page.locator('div:nth-child(6) > .border').click();
		await page.locator('div:nth-child(6) > .border').fill('3');
		await page.getByRole('button', { name: 'Update' }).click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	editorTest('cells', async ({ page }) => {
		await page.getByTestId('Cells').click();
		await page
			.locator('rect:nth-child(31)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(32)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(33)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(42)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(41)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(40)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(49)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page
			.locator('rect:nth-child(50)')
			.first()
			.click({
				modifiers: ['Meta']
			});
		await page.getByRole('button', { name: 'Remove selected cells' }).click();
		await page.locator('rect:nth-child(41)').first().click();
		await page.getByRole('button', { name: 'Add selected cells' }).click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	editorTest('colors', async ({ page }) => {
		await page.getByTestId('Colors').click();
		await page.locator('.fill-current').first().click();
		await page.getByRole('button', { name: '9' }).click();
		await page.locator('rect:nth-child(22)').first().click();
		await page.getByRole('button', { name: '5' }).click();
		await page.locator('rect:nth-child(41)').first().click();
		await page.getByRole('button', { name: '6' }).click();
		await page.locator('rect:nth-child(58)').first().click();
		await page.getByRole('button', { name: '3' }).click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});
});

const gameTest = base.extend({
	page: async ({ page }, use) => {
		await page.goto('/sudoku/2', { waitUntil: 'networkidle' });
		await use(page);
	}
});

gameTest.describe('Game', () => {
	gameTest('numbers', async ({ page }) => {
		await page.locator('rect:nth-child(9)').first().click();
		await page.keyboard.press('Digit1');
		await page.locator('rect:nth-child(16)').first().click();
		await page.getByRole('button', { name: '2' }).click();
		await page.locator('rect:nth-child(15)').first().click();
		await page.getByRole('button', { name: '3' }).click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	gameTest('cornermarks', async ({ page }) => {
		await page.getByTestId('Corner marks').click();
		await page.locator('rect:nth-child(2)').first().click();
		await page.keyboard.press('Digit1');
		await page.keyboard.press('Digit4');

		await page.locator('rect:nth-child(15)').first().click();
		await page.getByRole('button', { name: '6' }).click();
		await page.getByRole('button', { name: '1' }).click();
		await page.getByRole('button', { name: '8' }).click();
		await page.getByRole('button', { name: '3' }).click();
		await page.getByRole('button', { name: '0' }).click();
		await page.getByRole('button', { name: '3' }).click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	gameTest('centermarks', async ({ page }) => {
		await page.getByTestId('Center marks').click();
		await page.locator('#interface > rect:nth-child(8)').click();
		await page.getByRole('button', { name: '1' }).click();
		await page.getByRole('button', { name: '2' }).click();
		await page.locator('rect:nth-child(16)').first().click();
		await page.getByRole('button', { name: '9' }).click();
		await page.getByRole('button', { name: '4' }).click();
		await page.getByRole('button', { name: '8' }).click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	gameTest('colors', async ({ page }) => {
		await page.getByTestId('Colors').click();
		await page.locator('rect:nth-child(2)').first().click();
		await page.getByRole('button', { name: '1' }).click();
		await page.locator('#interface > rect:nth-child(3)').click();
		await page.locator('.w-full > .grid').click();
		await page.getByRole('button', { name: '1' }).click();
		await page.getByRole('button', { name: '2' }).click();
		await page.locator('#interface > rect:nth-child(4)').click();
		await page.getByRole('button', { name: '3' }).click();
		await page.getByRole('button', { name: '4' }).click();
		await page.getByRole('button', { name: '5' }).click();
		await page.locator('#interface > rect:nth-child(5)').click();
		await page.getByRole('button', { name: '6' }).click();
		await page.getByRole('button', { name: '7' }).click();
		await page.getByRole('button', { name: '8' }).click();
		await page.getByRole('button', { name: '9' }).click();
		await page.locator('#interface > rect:nth-child(7)').click();
		await page.getByRole('button', { name: '9' }).click();
		await page.getByRole('button', { name: '5' }).click();
		await page.getByRole('button', { name: '7' }).click();
		await page.getByRole('button', { name: '1' }).click();
		await page.getByRole('button', { name: '3' }).click();
		await page.locator('#interface > rect:nth-child(8)').click();
		await page.getByRole('button', { name: '6' }).click();
		await page.getByRole('button', { name: '5' }).click();
		await page.getByRole('button', { name: '4' }).click();
		await page.getByRole('button', { name: '2' }).click();
		await page.getByRole('button', { name: '8' }).click();
		await page.getByRole('button', { name: '9' }).click();
		await page.locator('rect:nth-child(9)').first().click();
		await page.getByRole('button', { name: '2' }).click();
		await page.getByRole('button', { name: '6' }).click();
		await page.getByRole('button', { name: '3' }).click();
		await page.getByRole('button', { name: '5' }).click();
		await page.getByRole('button', { name: '8' }).click();
		await page.getByRole('button', { name: '7' }).click();
		await page.getByRole('button', { name: '4' }).click();
		await page.locator('rect:nth-child(11)').first().click();
		await page.getByRole('button', { name: '4' }).click();
		await page.getByRole('button', { name: '5' }).click();
		await page.getByRole('button', { name: '6' }).click();
		await page.getByRole('button', { name: '9' }).click();
		await page.getByRole('button', { name: '8' }).click();
		await page.getByRole('button', { name: '7' }).click();
		await page.getByRole('button', { name: '1' }).click();
		await page.getByRole('button', { name: '3' }).click();
		await page.locator('rect:nth-child(12)').first().click();
		await page.getByRole('button', { name: '1' }).click();
		await page.getByRole('button', { name: '2' }).click();
		await page.getByRole('button', { name: '3' }).click();
		await page.getByRole('button', { name: '5' }).click();
		await page.getByRole('button', { name: '4' }).click();
		await page.getByRole('button', { name: '6' }).click();
		await page.getByRole('button', { name: '9' }).click();
		await page.getByRole('button', { name: '8' }).click();
		await page.getByRole('button', { name: '7' }).click();

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});

	gameTest('notes', async ({ page }) => {
		await page.getByTestId('Notes').click();
		await page.locator('rect:nth-child(9)').first().click();
		await page.getByPlaceholder('note').fill('12');
		await page.locator('rect:nth-child(18)').first().click();
		await page.getByPlaceholder('note').fill('hi there');

		await expect(page.getByTestId('display')).toHaveScreenshot();
	});
});
