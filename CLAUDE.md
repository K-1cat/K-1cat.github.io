# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A pure-static GitHub Pages site for **VAI (VTuber Academy Institute)** — a fictional school that is also an ARG (alternate reality game). The ARG is embedded invisibly into the site's design: suspicious course listings, mysterious faculty, gated stream pages, and email clues inside the student dashboard. Players discover the narrative by exploring the site as a normal visitor.

## Development

No build step, no package manager, no framework. Edit HTML files directly and push to GitHub Pages to deploy. Preview locally by opening any `index.html` in a browser or running a local server:

```
npx serve .
# or
python -m http.server
```

## Architecture

### Shared layout — `layout.js`

All pages load `/layout.js` as their last `<script>`. It injects the topbar, navbar, and footer at runtime into three required placeholder divs. Every page must include:

```html
<div id="vai-topbar"></div>
<div id="main-content">
  <div id="vai-navbar"></div>
  <!-- page content here -->
</div>
<div id="vai-footer"></div>
<script src="/layout.js"></script>
```

The active navbar link is set by the `data-page` attribute on `<body>`. Valid values: `home`, `programs`, `students`, `alumni`, `events`. Pages that should not show the navbar (e.g. login) omit `<div id="vai-navbar"></div>`.

All global CSS is injected by `layout.js` via a `<style>` tag. Page-specific styles live in a `<style>` block inside each page's `<head>`.

### CSS conventions

No external CSS files. All styles are inline `<style>` blocks. Consistent palette:

- Primary: `#4a5bdc` — Secondary: `#7a84ff`
- Card bg: `#f9f9ff` — Card border: `#e0e4f8`
- Error/warning red: `#c0392b` / `#c00`

### ARG state machine

All ARG state lives in `localStorage`:

| Key | Values | Meaning |
|-----|--------|---------|
| `vai_user` | student name string | Display name when logged in |
| `vai_role` | `"student"` \| null | Controls auth-gated content |
| `vai_site_down` | `"true"` \| null | Triggers maintenance overlay (hides site, shows access-restricted message) |

Helper functions exposed on `window` by `layout.js`:
- `resetVAI()` — clears all state and reloads
- `setVAIDown()` — activates maintenance overlay
- `loginVAI(name)` — simulates student login

Login credentials (hardcoded in `/login/index.html`): `at4607` / `Tono0128`

### ARG-significant elements — do not accidentally make mundane

These elements carry narrative weight and should not be normalized or "fixed":

- **VAI-399** — the mysterious course. Styled in red in grades table, marked "処理中", no records kept.
- **黒田 進 `kuroda@vai.ac`** — the suspicious faculty member. His dashboard email directs the student to the basement.
- **音無 零 `otonashi@vai.ac`** — online-only, never seen in person.
- **`VAULT転送中`** — Redvil's dashboard status. Intentionally ominous.
- **Stream auth codes** — `3990214` (Redvil), `2141572` (85Yen).
- **`hint_mail_sent`** localStorage key — set by the support form submit as an ARG hook.

When adding content to pages that already have ARG-significant entries (dashboard mail, grades, faculty cards), keep new additions clearly mundane so players do not chase false leads.

### Adding a new page

1. Copy the HTML skeleton from any existing simple page (e.g. `/alumni/index.html`).
2. Set `<body data-page="...">` to the appropriate value.
3. Add the three layout placeholders and `<script src="/layout.js"></script>`.
4. Add a `PAGES` entry in `/search/index.html` so it appears in search results.
