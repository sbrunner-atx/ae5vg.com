# ae5vg.com

The site for AE5VG's open-source ham-radio connectors (fldigi-mcp, wsjtx-mcp, n3fjp-mcp, serial-console-mcp, mcp-host-bridge), their guides, and the capture rig dashboard for the Ham Radio Model. Plain HTML, one `style.css`, one `site.js`. No build step, no framework, no analytics.

## Layout

```
index.html              Home
products/               one page per connector, the model page, and dashboard.html
downloads.html          release assets and notes, fetched live
getting-started.html
user-guide/             the Operating Field Guide, the serial-console Field Guide, the wsjtx-mcp guide
development.html
references/             watering holes, mode identification
about.html
style.css               the component library
site.js                 navigation, release and PyPI fetches, table of contents, email assembly
CNAME                   custom domain
```

## Preview

From the repository root:

    python3 -m http.server 8791

then open http://localhost:8791/. `.claude/launch.json` starts the same server.

## How it stays current

Nothing is generated at build time and no version, date, size or download link is typed into the HTML.

- Release data comes from `https://api.github.com/repos/sbrunner-atx/<repo>/releases/latest` in the visitor's browser, cached in `localStorage` for one hour. Download links are the assets' `browser_download_url`. If GitHub does not answer, the last cached rows are shown with their age, or a link to the repository's releases.
- PyPI versions come from `https://pypi.org/pypi/<package>/json`.
- Manuals link to the current file on each repository's `main` branch (`/raw/main/docs/...`).
- The dashboard (`products/dashboard.html`) reads gist `0f7aaf406781706fee444a9ad8e94103`: `status.json` every 60 seconds through the GitHub API, falling back to the raw URL, and `decoded-YYYYMMDD.json` for the last three UTC days from the raw URL.

A new release in any connector repository shows up here without a change to this repository.

## Publishing

GitHub Pages serves the `main` branch from the repository root. A push to `main` redeploys in about a minute. `CNAME` holds `ae5vg.com`; the apex needs A records to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, and `www` a CNAME to `sbrunner-atx.github.io`.

## Writing rules

No contractions, no em-dashes, American spelling. Anything proposed, experimental or unverified carries a callout saying so. Anything that can key a transmitter or touch a log database sits in a yellow callout. No accuracy figure for the model, stated or implied.

Site text is CC BY 4.0; software is under the license named in each repository.
