import type { Dimensions, Position } from '$models/Sudoku';
import type { Page } from '@playwright/test';

type ClickCellParams = {
	page: Page;
	position: Position;
	dimensions?: Dimensions;
};

/**
 * Click a cell in the sudoku
 */
export async function clickCell({
	page,
	position,
	dimensions = { rows: 9, columns: 9 }
}: ClickCellParams) {
	const sudokuInterface = page.locator('id=interface');
	await sudokuInterface
		.locator('rect')
		.nth(position.row * dimensions.columns + position.column)
		.click();
}
