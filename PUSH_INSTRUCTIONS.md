# Push to GitHub & deploy the demo

I can't push directly from this environment, but everything is ready on your side.

## 1. Download the project

Use the **Download** option in the top bar (or the download card below this message) to grab the whole project as a zip.

## 2. Push to your repo

From your terminal, in the unzipped folder:

```bash
git init
git branch -M main
git remote add origin https://github.com/pavanchow/Codebase-Cartographer.git
git add .
git commit -m "Cartographer design system + live demo"
git push -u origin main --force
```

> `--force` is here because the repo may already have a history; drop it if the repo is empty.

## 3. Enable GitHub Pages

1. Go to **Settings → Pages** on `pavanchow/Codebase-Cartographer`.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. That's it — the next push (or the one you just made) will trigger `.github/workflows/deploy.yml` and publish the site.

## 4. Your live demo URL

After the action finishes (~1 minute), the demo lives at:

```
https://pavanchow.github.io/Codebase-Cartographer/
```

The root redirects into `ui_kits/cartographer-app/index.html` — the interactive Map / Inspect / Docs prototype.

## What the workflow does

On every push to `main`:

1. Checks out the repo.
2. Copies `assets/`, `preview/`, `ui_kits/`, `colors_and_type.css`, `README.md` into `_site/`.
3. Writes a tiny redirect `_site/index.html` that sends visitors straight to the app demo.
4. Uploads the folder as a Pages artifact and deploys.

No build step needed — the UI kit is a single self-contained HTML file that runs straight from static hosting.
