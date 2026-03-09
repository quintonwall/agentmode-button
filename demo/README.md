# Demo

Interactive demo page showing all Postman Button variants.

## Running Locally

From the project root:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000/demo/](http://localhost:3000/demo/).

## What's in the Demo

The page includes four examples:

1. **Agent Mode (dark theme)** — Default button that opens Postman Agent Mode with a pre-filled prompt
2. **Agent Mode (light theme, custom label)** — Shows `data-postman-button-theme="light"` and `data-postman-button-label` customization, with `auto-send` enabled
3. **Fork Collection** — Forks a public collection into the user's workspace
4. **Multiple Buttons** — Two buttons side by side on a single page

Each example shows the live rendered button and the embed code snippet to reproduce it.

## Modifying the Demo

Edit `index.html` directly. If you change the widget source in `src/`, rebuild with:

```bash
npm run build
```

Or use watch mode to rebuild automatically on save:

```bash
npm run build:watch
```

Then refresh the demo page in your browser.
