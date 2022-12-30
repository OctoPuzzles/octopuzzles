<script lang="ts">
	import { closeModal } from '$stores/modalStore';
	import type { Mode } from '$types';
	import Button from '$ui/Button.svelte';

	export let isOpen: boolean;
	export let mode: Mode;
</script>

{#if isOpen}
	<div role="dialog" class="bg-white shadow rounded-md p-6 flex flex-col">
		<section class="mb-2">
			<h2 class="text-lg font-semibold">General controls</h2>

			<p>
				You can select cells by pressing on them. If you hold down your mouse and drag, you can
				select several.
			</p>

			<p>
				You can also press ctrl (or cmd on mac) and press on cells, which will then add them to your
				selection.
			</p>

			<p>You can also use your mouse arrows to move around the grid.</p>

			<p>You can use the following shortcuts:</p>
			<ul>
				<li>z for numbers</li>
				<li>x for cornermarks</li>
				<li>c for centermarks</li>
				<li>v for colors</li>
				<li>b for notes</li>
			</ul>
		</section>

		{#if mode === 'game'}
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Numbers (z)</h2>
				<p>
					You input a number or a value, by selecting one or more cells and pressing a number from
					0-9 or by pressing the numbers on the controller on the right. Press the backspace button
					to remove the value
				</p>
			</section>

			<section class="mb-2">
				<h2 class="text-lg font-semibold">Cornermarks (x)</h2>
				<p>
					You create cornermarks by selecting a cell and pressing the numbers you want to mark. You
					can use both the keyboard and the controls on the right. Press the backspace button to
					remove the cornermarks
				</p>
			</section>

			<section class="mb-2">
				<h2 class="text-lg font-semibold">Centermarks (c)</h2>
				<p>
					You create centermarks by selecting a cell and pressing the numbers you want to mark. You
					can use both the keyboard and the controls on the right. Press the backspace button to
					remove the centermarks
				</p>
			</section>

			<section class="mb-2">
				<h2 class="text-lg font-semibold">Colors (v)</h2>
				<p>
					You add colors like you add numbers. The numbers 0-9 match the colors on the right, if you
					want to use your keyboard instead. Press the backspace button to remove the color
				</p>
			</section>

			<section class="mb-2">
				<h2 class="text-lg font-semibold">Notes (b)</h2>
				<p>
					You can add notes as annotations to any cell to record information that cannot be
					communicated using the standard pencil mark tools. Cells with with notes will display a
					marker in the top right corner. Hovering over the marker will show the saved text. Press
					the backspace button to remove the note
				</p>
			</section>

			<section class="mb-2">
				<h2 class="text-lg font-semibold">Scanner</h2>
				<p>
					The scanning tool can be used to help solve the puzzle by checking whether any cells are
					restricted to a single digit due to the puzzle rules, or to quickly clean up pencil marks
					after placing a digit. With Auto-scanning enabled, the scanner will run immediately every
					time a digit is entered - editing pencil marks will not trigger a scan.
				</p>
				<br />
				<p>
					Press (s) to start or stop the scanner.<br />
					Press (a) to make a single step.<br />
					Press (h) to toggle highlighting on or off.<br />
					Press (t) to toggle Tuple highlighting on or off
				</p>
				<br />
				<ul>
					<li>
						<h2 class="text-lg font-semibold"><i>Highlighting Mode</i></h2>
						<p>
							<i>None</i>: No additional cells are highlighted when the selected cells in the grid
							are changed.<br />
							<i>Seen</i>: Highlight any cells which are seen by the currently selected cell. If
							multiple cells are selected, only those cells seen by every cell in the selection are
							highlighted.<br />
							<i>Tuples</i>: Highlight any cells which form a Tuple with the currently selected
							cell.
						</p>
						<br />
					</li>
					<li>
						<h2 class="text-lg font-semibold"><i>Scanning Mode</i></h2>
						<p>
							<i>Basic</i>: The scanner will only use the basic rules of Sudoku when checking
							available digits.<br />
							<i>Advanced</i>: The scanner can use the puzzle clues when checking available digits.<br
							/>
							<i>Extreme</i>: The scanner can use global negative constraints when checking
							available digits.
						</p>
						<br />
					</li>
					<li>
						<h2 class="text-lg font-semibold"><i>Options</i></h2>
						<p>
							Depending on the scanning mode and the puzzle constraints, you can choose which types
							of clues can be used by the scanning algorithm.
						</p>
						<br />
					</li>
					<li>
						<h2 class="text-lg font-semibold"><i>Scanning Speed</i></h2>
						<p>Control how fast the scanner runs.</p>
					</li>
				</ul>
			</section>
		{/if}

		{#if mode === 'editor'}
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Givens</h2>
				<p>
					You input a given, by selecting one or more cells and pressing a number from 0-9 or by
					pressing the numbers on the controller on the right. Press the backspace button to remove
					the value
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Cages</h2>
				<p>
					To add a killercage, select the fields you want to use for the killercage, and then either
					press Enter or press the button on the right to add a killercage from your selection.
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Colors</h2>
				<p>
					You add colors like you add numbers. The numbers 0-9 match the colors on the right, if you
					want to use your keyboard instead. Press the backspace button to remove the color
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Paths</h2>
				<p>
					Paths are things like thermometers, arrow clues, circles, squares, and so on. You add them
					by selecting the color, thickness, shape and fill, and whether you want an arrow. Then you
					select the cells you want, and press enter or on the button to add a path from your
					selection. You cannot put an arrow if the path is too wide, or if it is a single cell.
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Borderclues</h2>
				<p>
					Borderclues are made by selecting two cells. The borderclue will lie on the border between
					the two cells. The two cells should lie next to each other, even diagonally. You can add
					text to the borderclues in the input on the right.
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Cellclues</h2>
				<p>
					Cellclues are made by selecting a single cells. Use this for adding text, or symbols to
					the cell
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Dimensions</h2>
				<p>
					The dimensions dictate how many rows and columns your sudoku has. When you update them,
					all other clues are removed.
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Cells</h2>
				<p>
					Cells dictate which cells can be selected by the player. This might be usefull if the
					outer cells are only for clues and similar. When a cell is removed, its borders are
					removed as well
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Regions</h2>
				<p>
					Regions define the extra thick borders you see around the grid. You select the cells you
					want to change the borders on, and press the buttons on the right to change them.
				</p>
			</section>
			<section class="mb-2">
				<h2 class="text-lg font-semibold">Logic</h2>
				<p>
					Set the global constraints on the puzzle. This will be used by the auto-scanner or when
					exporting the puzzle
				</p>
			</section>
		{/if}

		<div class="flex gap-2">
			<Button class="w-full" variant="primary" on:click={closeModal}>Okay</Button>
		</div>
	</div>
{/if}
