# Changelog

Changes to the `macbetter` package. The docs site and examples change more often and aren't listed here.

## 0.1.0-beta.3

- **Per-component stylesheets.** `macbetter/styles/*` exports every file of the stylesheet, so you can import the foundation and only the components you use. `macbetter/styles/components/dependencies.json` lists the components that also need another component's stylesheet. The installation page has the layer order.
- **`MacbetterScript` in client-rendered apps.** It now sets `data-platform` when it mounts, for apps like Vite's where the browser doesn't run a script React inserts. `platformScript()` returns the same script as a string for `index.html`.
- **`SidebarItem`** takes `render`, for a router's link.
- **`ListRowContent`** is a new part that spans the whole row, for a text field or a small form.

## 0.1.0-beta.2

- **AI and chat.** Thirteen new components: `chat`, `message`, `prompt-input`, `suggestion`, `model-picker`, `response`, `reasoning`, `tool-call`, `plan`, `confirmation`, `sources`, `artifact-card` and `generated-image`.
- **Core.** Six new components: `inspector`, `description-list`, `code-block`, `attachment`, `content-unavailable` and `shimmer`.
- **Compiled build.** The package ships JavaScript and type declarations, one file per component. `transpilePackages` is no longer needed in Next.js.
- **Table.** `TableRowProps` is exported. The `table` primitive is no longer exported.
- **Navigation bar.** A long title truncates before the bar's buttons.
- **Device frame.** A navigation bar's material follows the screen's corners.
- **Window.** The body is placed correctly when a sidebar and an edge inspector are both open.

## 0.1.0-beta.1

- First release: 74 components for macOS, iPadOS and iOS, four themes, and the theme helpers.
