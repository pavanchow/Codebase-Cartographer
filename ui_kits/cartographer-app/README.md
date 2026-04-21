# Cartographer — App UI Kit

High-fidelity recreation of the Cartographer desktop web app. Three modes:

- **Map** (`GraphCanvas.jsx`) — the signature 2-D graph. Click a node to select; the selection highlights blast radius (direct + depth-2 transitive neighbors) in `--brand-600`.
- **Inspect** (`ModulesTable.jsx`) — sortable table of all modules with owners, caller/callee counts, status, and last-touched. Click a row to select; selection syncs back to Map and Inspect panel.
- **Docs** (`DocsView.jsx`) — auto-generated architecture documentation. Left nav + 720-px reading column + inline diagrams and code blocks.

Persistent chrome:
- `TopBar.jsx` — brand, repo badge, mode switcher, command search (⌘K), avatar.
- `NavRail.jsx` — 56-px icon-only rail; active state uses `--brand-50` fill + 3-px left accent.
- `InspectPanel.jsx` — 360-px right panel; shows metrics, owners, recent commits, callees for the selected node.
- Status bar — 28-px mono footer with index freshness, counts, and branch/commit.

Run it: open `index.html` — every screen works without a backend.

## Stack / conventions
- Vanilla React 18 + Babel standalone (prototype-grade; not production build).
- Lucide icons via CDN.
- All tokens come from the root `colors_and_type.css`.
- Components export themselves to `window.*` so Babel files share scope.

## Not included (would need repo/Figma)
- Real route handling, auth, and settings screens — flagged as out-of-scope for a visual kit.
- Sign-in, CLI viewer, admin/team management — omitted rather than invented. Add if the real product has them.
