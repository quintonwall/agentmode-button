# Postman Button

An embeddable widget for adding Postman buttons to any webpage. Launch **Agent Mode** with a pre-filled prompt or **fork a public collection** — with zero backend required.

![Agent Mode Badge](assets/agent-mode-badge.svg) ![Fork Badge](assets/fork-collection-badge.svg)

## Quick Start

Add the script tag once per page, then drop in as many button `<div>`s as you need.

```html
<!-- Load the widget (once per page) -->
<script src="https://your-cdn.com/postman-button.js" defer></script>
```

### Agent Mode Button

Opens Postman with a pre-filled prompt in Agent Mode:

```html
<div class="postman-button"
     data-postman-action="agent/prompt"
     data-postman-agent-prompt="Build a REST API for a todo app with CRUD endpoints"
     data-postman-utm-medium="agent-mode-button"
     data-postman-utm-campaign="my-tutorial">
</div>
```

### Fork Collection Button

Forks a public collection into the user's workspace:

```html
<div class="postman-button"
     data-postman-action="collection/fork"
     data-postman-collection-id="12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a"
     data-postman-utm-medium="agent-mode-button"
     data-postman-utm-campaign="api-docs">
</div>
```

## Configuration Reference

| Attribute | Required | Default | Description |
|---|---|---|---|
| `data-postman-action` | Yes | — | `"agent/prompt"` or `"collection/fork"` |
| `data-postman-agent-prompt` | Yes (agent) | — | Plain text prompt (auto Base64-encoded by the widget) |
| `data-postman-auto-send` | No | `"false"` | Auto-send the prompt when Postman opens |
| `data-postman-collection-id` | Yes (fork) | — | Public collection UID to fork |
| `data-postman-utm-medium` | Yes | — | UTM medium for analytics (e.g. `"agent-mode-button"`) |
| `data-postman-utm-campaign` | No | `"postman-button"` | UTM campaign name for analytics |
| `data-postman-utm-content` | No | Auto (page path) | Set to `"false"` to disable page path tracking |
| `data-postman-button-label` | No | Auto | Override the default button label |
| `data-postman-button-theme` | No | `"dark"` | `"dark"` (orange bg) or `"light"` (white bg) |

## UTM Analytics

Every button click includes UTM parameters in the destination URL so you can track traffic in Google Analytics (or any UTM-aware analytics tool):

| UTM Parameter | Value | Source |
|---|---|---|
| `utm_source` | Embedding page hostname (e.g., `myblog.com`) | Auto-detected |
| `utm_medium` | Your value via `data-postman-utm-medium` | Required |
| `utm_campaign` | Your value via `data-postman-utm-campaign` | Configurable (default: `postman-button`) |
| `utm_content` | Page path (e.g., `/blog/api-tutorial`) | Auto-detected (opt out with `data-postman-utm-content="false"`) |

**Example generated URL:**
```
https://go.postman.co/redirect/workspace?agentPrompt=QnVpbGQg...&sideView=agentMode&autoSend=false
  &utm_source=myblog.com&utm_medium=agent-mode-button&utm_campaign=api-tutorial
  &utm_content=/blog/api-tutorial
```

To view traffic from embedded buttons, filter your Google Analytics by your `utm_medium` value.

## Theming

**Dark theme** (default) — orange background, white text:
```html
<div class="postman-button"
     data-postman-action="agent/prompt"
     data-postman-agent-prompt="Your prompt here"
     data-postman-utm-medium="agent-mode-button">
</div>
```

**Light theme** — white background, orange text and border:
```html
<div class="postman-button"
     data-postman-action="agent/prompt"
     data-postman-agent-prompt="Your prompt here"
     data-postman-utm-medium="agent-mode-button"
     data-postman-button-theme="light">
</div>
```

## Multiple Buttons

Place as many buttons as you want on a single page. Each reads its own `data-*` attributes independently:

```html
<div class="postman-button"
     data-postman-action="agent/prompt"
     data-postman-agent-prompt="Explore the GitHub API"
     data-postman-utm-medium="agent-mode-button">
</div>

<div class="postman-button"
     data-postman-action="collection/fork"
     data-postman-collection-id="12345-abcde"
     data-postman-utm-medium="agent-mode-button">
</div>
```

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000/demo/
```

## Building

```bash
npm run build
# Output: dist/postman-button.js (~4KB minified)
```

## Self-Hosting

1. Run `npm run build`
2. Copy `dist/postman-button.js` to your CDN or static file server
3. Update the `<script src="...">` in your embed code to point to your hosted URL

## How It Works

1. The script scans the page for elements with `class="postman-button"`
2. For each element, it reads the `data-postman-*` attributes
3. It builds a destination URL (Postman Agent Mode deep-link or fork URL) with UTM parameters
4. It renders an inline SVG badge inside an `<a>` tag pointing to that URL
5. Clicking opens Postman in a new tab with the prompt pre-filled or fork flow initiated

The widget is a single vanilla JavaScript IIFE with zero dependencies. It guards against double-initialization if the script is accidentally included twice.

## License

MIT
