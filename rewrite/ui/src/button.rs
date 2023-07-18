use leptos::{*, ev::MouseEvent};

#[component]
pub fn Button<F>(
    cx: Scope,
    on_click: F,
    children: Children,
) -> impl IntoView
where
    F: Fn(MouseEvent) + 'static,
{
    view! { cx,
        <button on:click=on_click class="rounded bg-red-500 h-10 px-2">
            "Hi" {children(cx)}
        </button>
    }
}