import { expect, test as base } from '@playwright/test';

const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/sudoku/editor', { waitUntil: 'networkidle' });
    await use(page);
  }
});

test.describe('Givens', () => {
  test('Givens inputs in the sudoku editor', async ({ page }) => {
    await page.getByRole('button', { name: 'Givens' }).click();

    // Click row 0 cell 0
    await page.locator('id=interface').locator('rect').first().click();
    // Input digit 5
    await page.keyboard.press('Digit5');
    expect(
      await page.locator('id=numbers').locator('text').first().textContent(),
      'R0C0 Should have a 5 in it'
    ).toBe('5');

    await page.getByRole('button', { name: 'Undo' }).click();
    expect(
      await page.locator('id=numbers').locator('text').count(),
      'R0C0 Should no longer have a 5 in it'
    ).toBe(0);

    await page.getByRole('button', { name: 'Redo' }).click();
    expect(
      await page.locator('id=numbers').locator('text').first().textContent(),
      'R0C0 Should have a 5 in it again'
    ).toBe('5');
  });

  test('The numpad works', async ({ page }) => {
    await page.getByRole('button', { name: 'Givens' }).click();

    // Click row 0 cell 0
    await page.locator('id=interface').locator('rect').first().click();
    // Input digit 9
    await page.getByRole('button', { name: '9' }).click();
    expect(
      await page.locator('id=numbers').locator('text').first().textContent(),
      'R0C0 Should have a 9 in it'
    ).toBe('9');

    await page.getByTestId('givens-delete-button').click();
    expect(await page.locator('#numbers > *').count(), 'R0C0 Should no longer have a 9 in it').toBe(
      0
    );
  });
});

test.describe('cell clues', () => {
  test('Can only make a cell clue when one cell is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Cell clues' }).click();

    await page
      .locator('id=interface')
      .locator('rect')
      .first()
      .dragTo(page.locator('id=interface').locator('rect').nth(1));
    expect(
      page.getByRole('button', { name: 'New Cell clue from selection' }),
      'The button to add a new cell clue is disabled if more than 1 element is selected'
    ).toBeDisabled();

    await page.keyboard.press('Enter');
    expect(
      await page.locator('#cellclues > *').count(),
      'No cell clues should be created when pressing enter'
    ).toBe(0);
  });
});
