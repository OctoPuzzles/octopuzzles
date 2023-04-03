<section class="mb-2">
  <h2 class="text-lg font-semibold">General controls</h2>

  <p>
    You can select cells by pressing on them. If you hold down your mouse and drag, you can select
    several.
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

<section class="mb-2">
  <h2 class="text-lg font-semibold">Numbers (z)</h2>
  <p>
    You input a number or a value, by selecting one or more cells and pressing a number from 0-9 or
    by pressing the numbers on the controller on the right. Press the backspace button to remove the
    value
  </p>
</section>

<section class="mb-2">
  <h2 class="text-lg font-semibold">Cornermarks (x)</h2>
  <p>
    You create cornermarks by selecting a cell and pressing the numbers you want to mark. You can
    use both the keyboard and the controls on the right. Press the backspace button to remove the
    cornermarks
  </p>
</section>

<section class="mb-2">
  <h2 class="text-lg font-semibold">Centermarks (c)</h2>
  <p>
    You create centermarks by selecting a cell and pressing the numbers you want to mark. You can
    use both the keyboard and the controls on the right. Press the backspace button to remove the
    centermarks
  </p>
</section>

<section class="mb-2">
  <h2 class="text-lg font-semibold">Colors (v)</h2>
  <p>
    You add colors like you add numbers. The numbers 0-9 match the colors on the right, if you want
    to use your keyboard instead. Press the backspace button to remove the color
  </p>
</section>

<section class="mb-2">
  <h2 class="text-lg font-semibold">Notes (b)</h2>
  <p>
    You can add notes as annotations to any cell to record information that cannot be communicated
    using the standard pencil mark tools. Cells with with notes will display a marker in the top
    right corner. Hovering over the marker will show the saved text. Press the backspace button to
    remove the note
  </p>
</section>

<section class="mb-2">
  <h2 class="text-lg font-semibold">Scanner</h2>
  <p>
    The scanning tool can be used to help solve the puzzle by checking whether any cells are
    restricted to a single digit due to the puzzle rules, or to quickly clean up pencil marks after
    placing a digit. With Auto-scanning enabled, the scanner will run immediately every time a digit
    is entered - editing pencil marks will not trigger a scan.
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
        <i>None</i>: No additional cells are highlighted when the selected cells in the grid are
        changed.<br />
        <i>Seen</i>: Highlight any cells which are seen by the currently selected cell. If multiple
        cells are selected, only those cells seen by every cell in the selection are highlighted.<br
        />
        <i>Tuples</i>: Highlight any cells which form a Tuple with the currently selected cell.
      </p>
      <br />
    </li>
    <li>
      <h2 class="text-lg font-semibold"><i>Scanning Mode</i></h2>
      <p>
        <i>Basic</i>: The scanner will only use the basic rules of Sudoku when checking available
        digits.<br />
        <i>Advanced</i>: The scanner can use the puzzle clues when checking available digits.<br />
        <i>Extreme</i>: The scanner can use global negative constraints when checking available
        digits.
      </p>
      <br />
    </li>
    <li>
      <h2 class="text-lg font-semibold"><i>Options</i></h2>
      <p>
        Depending on the scanning mode and the puzzle constraints, you can choose which types of
        clues can be used by the scanning algorithm.
      </p>
      <br />
    </li>
    <li>
      <h2 class="text-lg font-semibold"><i>Scanning Speed</i></h2>
      <p>Control how fast the scanner runs.</p>
    </li>
  </ul>
</section>

<section class="mb-2">
  <h2 class="text-lg font-semibold">Walkthrough</h2>
  <p>
    The walkthrough is accessed by clicking the icon with the walking person below the controller.
    When playing a game, you can follow along in the modal, or you can press the button in the top
    right corner to open the walkthrough in a new tab. If you are creating your own puzzle the same
    modal can be used to create a walkthrough.
  </p>

  <p>
    If you don't want to open the modal everytime you want to add a step, you can use the "w"
    shortcut, which will add the step for you. To add a description you still have to open the
    modal, though.
  </p>
</section>
