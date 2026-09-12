# Claude Design brief: ae5vg.com

Build a multi-page website for an amateur radio hobbyist who writes open-source software that lets an AI assistant operate a ham station. Twelve pages, one shared design system, no build tooling beyond static HTML, CSS and a little client-side JavaScript. The site is served by GitHub Pages from the repository `sbrunner-atx/ae5vg.com`; a `CNAME` file already holds the domain.

## Who this is for

Radio amateurs, most of them 50 and older, who run fldigi, WSJT-X or N3FJP and are curious whether an AI assistant can help them operate. They distrust hype, read carefully, and respect people who say what does not work yet. Write for them: plain sentences, specifics over adjectives, no marketing voice, never the word "revolutionary". A second audience is developers who want the connectors; give them commands and links, not prose.

## Brand and design system

Plain, print-friendly, the look of a well-kept open-source manual. Think GitHub's documentation, not a poster. No dark pages anywhere: the site and the PDF must print on a home printer without solid fills.

- Colours: paper `#ffffff` (every page background), text `#1f2328`, secondary text `#57606a`, accent blue `#0969da` (rules, buttons, the callsign badge, list markers), link and label blue `#0550ae`, panel grey `#f6f8fa` (code, cards, transcript blocks), border `#d0d7de`, callout blue `#ddf4ff` with a `#0969da` left bar, warning `#fff8c5` with a `#9a6700` left bar for anything that can key a transmitter, success green `#1a7f37` for received lines and passed checks, danger red `#cf222e` used only for a failed check.
- Type: a condensed bold sans for headings in sentence case, never uppercase (Barlow Condensed or DejaVu Sans Condensed); a humanist sans for body (Source Sans 3 or DejaVu Sans); a monospaced face for labels, callsigns, commands and version strings (JetBrains Mono or DejaVu Sans Mono). Small uppercase mono labels with 2 px letter-spacing remain the one signature: "SKILL 03 · SHIPS WITH FLDIGI-MCP".
- Motifs: a short blue rule under every heading; a blue callsign badge "AE5VG" with white text as the site mark; a thin blue Morse dit-dah strip as a divider; callout boxes with a left bar, a mono uppercase caption, and one paragraph.
- Layout: light header bar on a grey panel with a bottom border, white hero with the blue rule, white body. Generous whitespace, 17 px body text, content width about 1040 px. Tables with a thin rule under the header, no zebra stripes. Cards are grey panels with a border and a blue left edge.
- Responsive down to 360 px. No animation beyond hover states. No stock photos; one real screenshot per software page (placeholders are fine; note where they go). A print stylesheet that hides the navigation and keeps everything else as is.

## Site map and navigation

Top bar on every page: AE5VG badge left, links right: Software (dropdown or landing: fldigi-mcp, wsjtx-mcp, n3fjp-mcp), Connect, Downloads, Reference (dropdown: Watering holes, Mode ID), The Model, Log, About. Station is linked from About and from the footer. Footer: "AE5VG · Austin, TX", licence note ("Site text CC BY 4.0; software under the licence named in each repository"), "GL es 73 de AE5VG sk".

### 1. Home (`index.html`)

Hero headline: "An AI assistant that can work the bands with you." One paragraph: three small connectors put fldigi, WSJT-X and N3FJP under the control of an assistant such as Claude through the Model Context Protocol; a Field Guide writes down how to operate that way without embarrassing yourself on the air; a small language model, still in the making, is learning to read a contest exchange through noise the way an experienced operator does. Two buttons: "See the software", "GitHub".

Below the hero: three cards linking to the software pages, one card to Connect, one to Downloads, one to The Model. Then a callout "Receive-only by default": without a callsign in the settings, none of the connectors can key a transmitter. Then a short "From Field Day 2026" block with this real BPSK31 exchange as decoded, garble included, callsigns anonymised:

```
TX  CQ FD CQ FD de K6ABC K6ABC pse k
RX  K6ABC de W7XYZ 1D AZ; 1D AZ  PSE K
    caller sent callsign and full exchange up front; no need to ask
TX  W7XYZ de K6ABC K6ABC · Pse copy 2A 2A STX STX · de K6ABC BK
RX  K6ABC QSL TU 73 de W7XYZ · GL es 73 · sk
TX  QSL 1D AZ TU W7XYZ de K6ABC GL FD sk sk
    logged while the TU was still transmitting
```

### 2. fldigi-mcp (`fldigi-mcp.html`)

Facts: MCP server for fldigi, the digital-modem program by Dave Freese W1HKJ. Speaks fldigi's built-in XML-RPC interface and exposes all 174 methods of fldigi 4.2.13 as grouped tools: status, diagnostics, application, modem, frequency, controls, transmit, rig, log, text, spot, wefax, navtex, flmsg, io, legacy, band_guidance, signal_hunt, tune_to, browser, fldigi_call. Version 0.3.0. Licence GPL-3.0-or-later, the same as fldigi, chosen so code can flow both ways. Supported fldigi release 4.2.13. Ships as a Claude Desktop bundle (`.mcpb`) and on PyPI.

Sections: what it does (one screen), the transmit gate (the operator callsign is the single gate; blank keeps the station receive-only), signal hunting (taps the receiver audio, names each signal's mode from its shape the way an operator reads the waterfall, ranks the station that sits still and calls CQ, tunes to it; modes named: RTTY with shift, CW, BPSK31/63/125, Olivia with tones and bandwidth, MFSK16, DominoEX, MT63), the Signal Browser (fldigi's left-hand panel decodes up to 30 PSK, RTTY or CW stations at once; a four-file patch, offered to the fldigi maintainer on 11 September 2026 and shipped with fldigi-mcp, puts it on the API; show a warning-style callout "Proposed, not yet in fldigi" and say the tool answers with a hint on an unpatched fldigi), the skills that ship with it (fldigi-operating, signal-hunting), documentation links (Operating Field Guide PDF, fldigi XML-RPC reference `docs/fldigi-api.md`, machine-readable `docs/fldigi-api-spec.md`, INSTALL, TEST-PLAN), links: `https://github.com/sbrunner-atx/fldigi-mcp`, `https://pypi.org/project/fldigi-mcp/`.

Include an "Example session" block, a short transcript in the site's mono style: operator asks "find me someone calling CQ on 20 metres PSK31", assistant hunts, tunes, reads twenty seconds, reports the callsign, asks before transmitting.

### 3. wsjtx-mcp (`wsjtx-mcp.html`)

Facts: MCP server for WSJT-X over its UDP message protocol. Modes: FT8, FT4, JT65, MSK144, Q65, WSPR. Version 0.1.3, MIT. Tools: status, diagnostics, decodes (read, drain, clear, replay), log (buffered completed QSOs, feed to N3FJP), reply (answer a CQ or QRZ decode; auto-sequences when WSJT-X Auto Seq is on), free_text, transmit (halt only; UDP cannot enable transmit), configure (mode, sub-mode, Rx DF, T/R period, DX call and grid; no dial frequency by design), clear, highlight, location, switch_config, wsjtx_call escape hatch. Settings: WSJTX_HOST, WSJTX_PORT 2237, WSJTX_CALLSIGN (the transmit gate), WSJTX_MULTICAST, WSJTX_INSTANCE. Links: `https://github.com/sbrunner-atx/wsjtx-mcp`, `https://pypi.org/project/wsjtx-mcp/`. Describe it as the weak-signal leg of the operate-then-log trio.

### 4. n3fjp-mcp (`n3fjp-mcp.html`)

Facts: MCP server for logging to N3FJP's Amateur Contact Log and the hundred-plus N3FJP contest loggers over their shared TCP control API, written against the protocol with the standard library only. Version 0.3.1, MIT. Tools: status, query, fields, search (recent, search, dupecheck with no side effects, entity status), log (log_qso: set call, CALLTAB, exchange, ENTER; set, set_many), bandmode, notifications (push events), database (raw SQL, checklog, open log), n3fjp_call escape hatch. The contest-operating skill ships with it: the QSO state machine from CQ to logged contact, the special-case playbook, verified logging. Links: `https://github.com/sbrunner-atx/n3fjp-mcp`, `https://pypi.org/project/n3fjp-mcp/`. Note that N3FJP is Windows software; the page should say the connector commonly runs on a Mac and reaches the Windows machine through mcp-host-bridge.

### 5. Connect (`connect.html`)

How the pieces fit. A diagram (SVG, in the brand colours): Claude Desktop on the left, the three MCP servers in the middle, fldigi / WSJT-X / N3FJP on the right, the radio at the far right. Two variants: everything on one computer; and the shack split, with the assistant on a Mac and N3FJP or fldigi on a Windows PC, joined by mcp-host-bridge (a loopback-to-remote TCP/UDP relay, MIT, `https://github.com/sbrunner-atx/mcp-host-bridge`; example commands: `mcp-host-bridge install n3fjp --to 192.168.1.50`, `mcp-host-bridge install fldigi --to 192.168.1.50`, `mcp-host-bridge install wsjtx --to 192.168.1.111`).

Steps, numbered, for Claude Desktop: download the `.mcpb` from the release page, double-click, enter the callsign (or leave blank for receive-only), set the audio input device for signal hunting, try "what is fldigi doing right now". A second short path for Claude Code and other MCP clients: `uvx fldigi-mcp` with environment variables FLDIGI_HOST, FLDIGI_PORT 7362, FLDIGI_CALLSIGN, FLDIGI_AUDIO_DEVICE. A warning callout on transmitting: the software can key the radio once a callsign is set; the operator remains the control operator under Part 97; the Field Guide is the operating discipline.

### 6. Downloads and manuals (`downloads.html`)

One page that never goes stale. For each of fldigi-mcp, wsjtx-mcp, n3fjp-mcp and mcp-host-bridge, a row showing: latest release tag, release date, the release notes (rendered from Markdown), and the assets (the `.mcpb` bundle for fldigi-mcp) as download buttons. Populate this at page load with client-side JavaScript from the GitHub REST API, unauthenticated:

```
GET https://api.github.com/repos/sbrunner-atx/<repo>/releases/latest
```

Fields: `tag_name`, `published_at`, `html_url`, `body`, `assets[].name`, `assets[].browser_download_url`, `assets[].size`. GitHub allows cross-origin reads of this endpoint, with a limit of 60 requests per hour per visitor, which is enough for a personal site; cache the response in `localStorage` for one hour and fall back to a static "see the release page" link with the repository URL if the fetch fails or is rate-limited. Also show the PyPI version from `https://pypi.org/pypi/<package>/json` (`info.version`), same caching rule. Never hard-code a version number on this page.

Manuals, always the current copy from the `main` branch so no link needs updating:

- Operating Field Guide (PDF): `https://github.com/sbrunner-atx/fldigi-mcp/raw/main/docs/fldigi-mcp%20Operating%20Field%20Guide.pdf`
- fldigi XML-RPC API reference (PDF): `https://github.com/sbrunner-atx/fldigi-mcp/raw/main/docs/fldigi-api.pdf`; Markdown: `https://github.com/sbrunner-atx/fldigi-mcp/blob/main/docs/fldigi-api.md`; machine-readable catalog: `docs/fldigi-api-spec.md`
- INSTALL and TEST-PLAN for each connector, linked to `blob/main/docs/...` in the respective repository
- Each repository's README and CHANGELOG

Include a short paragraph explaining that the XML-RPC reference documents fldigi itself, not the connector, and is offered to the fldigi community.

### 7. The Model (`model.html`)

Title: "A small language model for digital-mode QSOs". The problem: a contest exchange rarely arrives clean; it comes through band noise, fading, and another station transmitting over the top; an experienced operator still reads it because the vocabulary is closed. The goal: show FT8-style reliability of exchange on any keyboard digital mode, with a model small enough to run beside fldigi.

Three principles, each a card: (1) Reference layer, looked up and never learned: all 85 ARRL and RAC sections plus the Field Day pseudo-section DX, classes, callsign structure, the exchange grammar; the model cannot invent a section that does not exist. (2) Real copy, not synthetic: training pairs are real received text against what was actually sent, from W1AW bulletins with their published text, DWD weather RTTY, and repeated CQ loops recorded from public KiwiSDR receivers where the best copy stands in for the truth; every recording is our own, of the public airwaves, and marked as such; material contributed by other hams is tracked with their permission. (3) Honest numbers: the evaluation harness runs against a held-out set of real QSOs that does not yet exist in sufficient size; until it does, no accuracy percentage is published, synthetic or otherwise, because a synthetic score presented as accuracy would be exactly what the project exists to be better than.

Status callout dated September 2026: the deterministic half is built (reference layer, an edit-distance resolver with no model in the path, the harness); a capture rig runs unattended collecting pairs; the model is not trained yet; the code is not public until there is a number to stand behind. A "How to help" paragraph: hams who enable text capture in fldigi during a contest and keep their log have exactly the pairs this needs; an email link or GitHub issue link for offers. No download, no demo, no claims.

### 8. About (`about.html`)

Stefan Brunner, AE5VG, Amateur Extra, Austin, Texas. Write the bio in first person, four short paragraphs, factual, no adjectives about himself:

- Business school: MBA from LMU Munich, 2001. Started in investment research and banking in London and Munich in the 1990s.
- In between, an engineer's career: global architect and principal architect at Juniper Networks for a decade (first national VoIP backbone at AT&T, the original Apple Store network, 7-Eleven's 6,000 branches, Nike's global stores), co-author of the JNCIE-SEC certification and one of its first five holders, O'Reilly author (ScreenOS Cookbook), then product management: director of product at SonicWall owning the SMB firewall line, most of the company's revenue.
- Now: venture partner at BVV Advisors, angel investor with CTAN, and AI transformation advisory through Westlake Professionals; guest lectures on AI at UT Austin, St. Edward's and Austin Community College. Dual US and German citizen; German native, English bilingual.
- Radio: licensed Amateur Extra as AE5VG; digital modes on HF; this software began at Field Day 2026 with an assistant at the keyboard and a list of what it did well and where it needed rules. Not affiliated with fldigi, WSJT-X, N3FJP, ARRL or any employer.

Do not mention academic honours, do not mention any non-profit work, and do not include a photo placeholder unless there is a slot for one that can stay empty. Links: GitHub `https://github.com/sbrunner-atx`, LinkedIn (leave a slot), QRZ page for AE5VG (leave a slot).

### 9. Watering holes (`watering-holes.html`)

A reference table of the internationally coordinated digital calling frequencies, the same data fldigi-mcp's band guidance uses (`src/fldigi_mcp/data/band_plans.yaml`, updated June 2026). Rows are bands, columns are modes, cells in MHz. Make it printable and readable on a phone (sticky first column, horizontal scroll). Data:

| Band | FT8 | FT4 | JT65 | JT9 | WSPR | PSK31 | RTTY | Olivia | MT63 | JS8Call |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 160 m | 1.840 | | 1.838 | 1.839 | 1.8366 | 1.838 | 1.838 | 1.838 | 1.807 | 1.842 |
| 80 m | 3.573 | 3.575 | 3.570 | 3.572 | 3.5686 | 3.580 | 3.590 | 3.583 | 3.585 | 3.578 |
| 40 m | 7.074 | 7.0475 | 7.076 | 7.078 | 7.0386 | 7.070 | 7.043 | 7.072 | 7.035 | 7.078 |
| 30 m | 10.136 | 10.140 | 10.138 | 10.140 | 10.1387 | 10.142 | 10.143 | 10.141 | 10.137 | 10.130 |
| 20 m | 14.074 | 14.080 | 14.076 | 14.078 | 14.0956 | 14.070 | 14.080 | 14.077 | 14.109 | 14.078 |
| 17 m | 18.100 | 18.104 | 18.102 | 18.104 | 18.1046 | 18.097 | 18.105 | 18.103 | 18.100 | 18.104 |
| 15 m | 21.074 | 21.140 | 21.076 | 21.078 | 21.0946 | 21.080 | 21.080 | 21.086 | 21.070 | 21.078 |
| 12 m | 24.915 | 24.919 | 24.917 | 24.919 | 24.9246 | 24.920 | 24.925 | 24.921 | 24.920 | 24.922 |
| 10 m | 28.074 | 28.180 | 28.076 | 28.078 | 28.1246 | 28.120 | 28.080 | 28.076 | 28.130 | 28.078 |
| 6 m | 50.313 | | | | 50.293 | | | | | |
| 2 m | 144.174 | | | | 144.489 | | | | | |

Notes under the table, each one sentence: these are voluntary IARU band plans and widely used conventions, not regulations, and they differ by region, so verify against national rules; the weak-signal modes are globally harmonised; on 20 m the traditional RTTY hole at 14.080 now sits under FT4 and real RTTY activity is found about 3 kHz higher; keyboard-mode traffic clusters within a few kHz above the PSK31 hole and about 10 kHz up for RTTY and the other data modes. Cite the sources named in the YAML: IARU Region 1 HF band plan (2020), ARRL Considerate Operator's Frequency Guide, IARU Region 3 band plan (2019). Offer "Corrections welcome" with a link to the fldigi-mcp issues page.

### 10. Mode identification (`mode-id.html`)

A cheat sheet for reading the waterfall, from the signature table fldigi-mcp's signal hunt uses (`mode_signatures.json`, checked against the Signal Identification Wiki and the fldigi manual, September 2026). One row per mode: what it looks like, width, tone structure, the fldigi modem name, and where the carrier goes. Data:

| Mode | Looks like | Width / tones | fldigi modem | Cursor goes |
| --- | --- | --- | --- | --- |
| RTTY | two narrow lines a fixed shift apart | shifts 85, 170 (amateur default at 45.45 Bd), 200, 450, 850 Hz; each line about 45 Hz | RTTY | midpoint of the two lines |
| CW | one line keyed on and off | 1 to 12 Hz | CW | the line |
| BPSK31 | one steady line | 20 to 45 Hz | BPSK31 | line centre |
| BPSK63 / BPSK125 | one steady line, wider | 50 to 80 Hz / 100 to 150 Hz | BPSK63, BPSK125 | line centre |
| Olivia | a grid of hopping dots | 2 to 64 tones in 125 to 2000 Hz; spacing = bandwidth / tones; 8/250 is the usual calling submode | OLIVIA-8/250 etc. | centre of the block |
| Contestia | same grid as Olivia | same as Olivia at twice the symbol rate | CONTESTIA | centre; only RSID or symbol rate separates it from Olivia |
| MFSK16 | hopping dots | 16 tones at 15.625 Hz, about 316 Hz wide | MFSK16 | centre of the block |
| MFSK8 | hopping dots | 32 tones at 7.8 Hz, same width at half the speed | MFSK8 | centre |
| DominoEX | hopping dots | 18 tones; DominoEX 4/5/8/11/16/22 are 173/224/346/262/355/524 Hz wide | DOMEX11 etc. | centre |
| THOR | same grid as DominoEX | same six widths, with forward error correction | THOR11 etc. | centre; RSID decides |
| THROB | slow hopping dots | 9 tones at 8 or 16 Hz, 72 or 144 Hz wide | THROB | centre |
| MT63 | a flat continuous block | 64 carriers in 500, 1000 or 2000 Hz; tolerates 120 Hz mistuning | MT63-500 etc. | lower edge plus half the width |

Under the table: a short paragraph on how the hunt tells CW from PSK31 (the same 30 Hz line, but CW has keying gaps of 40 ms or more), and how hopping modes are recognised (energy sits at discrete tone positions from one 30 ms frame to the next, which is what the waterfall's dots are). A callout stating the two pairs that cannot be separated by the spectrum alone (Contestia and Olivia, THOR and DominoEX) and that the station's RSID burst settles it. Leave a slot per row for a small waterfall image and one line of decoded text from an off-air recording; these will be added later from the author's own recordings.

### 11. Station (`station.html`)

The shack as it is, in the first person, with the honesty hams expect. Structure as a short table plus one paragraph: HF transceiver, sound interface, the computers (a Mac running the assistant and fldigi, a Windows machine for N3FJP), the software stack, and the antenna. The antenna line must say that no antenna is up at the moment and that receiving is done through public KiwiSDR receivers and the capture rig described on The Model page. Leave clearly marked placeholders for the rig model, interface model and a photo; the author fills those in. No "On the air" schedule and no QSL policy on this site until the antenna is back.

### 12. Log (`log/index.html` plus one page per entry)

Dated notes, newest first, not a blog with categories and comments. Each entry is a plain page with a date, a title and a few paragraphs; the index lists them. Seed it with three entries the author will write: "Field Day 2026 with an assistant at the keyboard", "Putting fldigi's Signal Browser on the API" (11 September 2026), and "What real off-air pairs look like" (the first W1AW and DWD pairs from the capture rig). Provide an RSS feed `log/feed.xml` generated by hand from the same entries, and link it in the page head and footer so readers can follow without visiting.

## Contact rules

No plain `mailto:` link anywhere on the site. Three contact routes, presented in this order on the About page and in the footer:

1. GitHub Issues on the relevant repository for anything about the software.
2. The author's QRZ page for radio matters (leave the URL slot; QRZ messaging needs a login, which keeps bots out).
3. One dedicated address on the domain, `stefan@ae5vg.com`, shown as text assembled by a line of JavaScript at page load (for example from two string parts), never present in the HTML source as a complete address, with no `href`. If JavaScript is off, show "stefan at this domain".

No contact form, no newsletter box, no social media widgets.

## Content rules

- Counts before adjectives. "174 methods", "30 channels", "four-file patch", never "powerful" or "seamless".
- Every claim on the software pages must be true of the released version named on that page. Where something is proposed or experimental (Signal Browser patch, band guidance, the model), say so in a visible callout, not a footnote.
- Nothing on the site may state or imply an accuracy figure for the model.
- Licences shown per project: fldigi-mcp GPL-3.0-or-later; wsjtx-mcp, n3fjp-mcp, mcp-host-bridge MIT.
- Use "assistant" or "Claude", not "AI" as a noun on its own; the audience reads "AI" as hype.
- Sentences under 25 words where possible. British or American spelling, but one of them throughout (American, since the author is in Texas).

## Technical rules

- Static HTML, one shared `style.css`, one `site.js` for the Downloads page fetch, the email assembly and the navigation. No frameworks, no build step, no analytics.
- Semantic HTML with a skip link, proper heading order, alt text on the diagram, colour contrast at least 4.5:1 for body text (cream on ink and text on paper both pass).
- Each page sets `<title>` as "Page name · AE5VG" and a one-sentence `<meta name="description">`.
- Relative links between pages so the site works from any path. External links open in the same tab except downloads.
- Keep the `CNAME` file. Repository: `https://github.com/sbrunner-atx/ae5vg.com`.
