use leptos::*;
use leptos_meta::*;
use leptos_router::*;
use sudoku::{Dimensions, Sudoku};
use sudoku_display::SudokuDisplay;
use ui::Button;

pub mod error_template;

#[component]
pub fn App() -> impl IntoView {
    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    view! {
        // injects a stylesheet into the document <head>
        // id=leptos means cargo-leptos will hot-reload this stylesheet
        <Stylesheet id="leptos" href="/pkg/start-axum-workspace.css"/>

        // sets the document title
        <Title text="Welcome to Leptos"/>

        // content for this welcome page
        <Router>
            <main>
                <Routes>
                    <Route path="" view=HomePage />
                </Routes>
            </main>
        </Router>
    }
}

/// Renders the home page of your application.
#[component]
fn HomePage() -> impl IntoView {
    let sudokus = vec![Sudoku {
        title: "Sudoku".to_string(),
        description: "".to_string(),
        dimensions: Dimensions {
            rows: 9,
            columns: 9,
        },
    }];
    // Creates a reactive value to update the button
    let (count, set_count) = create_signal(0);
    let on_click = move |_| set_count.update(|count| *count += 1);

    view! {
        <h1>"Welcome to Octopuzzles!"</h1>
        <Button on_click=on_click>"Click Me: " {count}</Button>
        {sudokus.into_iter()
            .map(|sudoku| view! { <SudokuDisplay sudoku=sudoku />})
            .collect::<Vec<_>>()}
    }
}
