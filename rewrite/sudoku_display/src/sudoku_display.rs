use leptos::*;
use sudoku::Sudoku;

#[component]
pub fn SudokuDisplay(
    cx: Scope,
    sudoku: Sudoku
) -> impl IntoView
{
    view! { cx,
        <div>
            "Title " {sudoku.title}
        </div>
    }
}