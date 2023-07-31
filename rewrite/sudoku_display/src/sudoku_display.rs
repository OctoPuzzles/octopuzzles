use leptos::*;
use sudoku::Sudoku;

#[component]
pub fn SudokuDisplay(sudoku: Sudoku) -> impl IntoView {
    // TODO: Put this in a constant somewhere
    let cell_size = 64;
    view! {
        <svg viewBox="-2 -2 500 500" class="max-h-full max-w-full">
        <g id="cells" class="select-none pointer-events-none">
            <defs>
              <rect
                id="cell"
                x=0
                y=0
                width=cell_size
                height=cell_size
                stroke="black"
                fill="none"
                stroke-width="0.5"
                vector-effect="non-scaling-size"
              />
            </defs>
            {[0, 1, 2].into_iter().map(|row_index| {
                [0, 1, 2].into_iter().map(|column_index| view! {
                    <use_ href="#cell" x={cell_size * column_index} y={cell_size * row_index} />
                }).collect_view()
            }).collect_view()}
        </g>
        </svg>
    }
}
