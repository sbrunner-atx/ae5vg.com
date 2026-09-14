# Paste into Claude Design: add the Live and Decoded pages

Add two pages to the ae5vg.com site, following the brief already loaded (sections 13 and 14): **Live** (`live.html`) and **Decoded** (`decoded.html`). Both read a public GitHub gist the rig rewrites every two minutes; the fetch logic, field names and fallbacks in the reference implementations below must be kept exactly, only the presentation changes to match the site's design system (white paper, documentation blue, grey panels, sentence-case headings). Add both to the navigation after Downloads.

Keep, verbatim: the gist id, the API-then-raw fallback on Live, the raw URL on Decoded, the 60-second refresh on Live, the day tabs and filters on Decoded, the provenance paragraph on Decoded, and the "no decoded text leaves the rig" sentence on Live.

## Reference implementation: live.html

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Live · AE5VG</title>
<meta name="description" content="What the AE5VG capture rig is listening to right now, how far the decoder is behind, and what the last 24 hours produced. Derived statistics only, updated every two minutes.">
<link rel="stylesheet" href="style.css">
<style>
.kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:18px 0 26px}
.kv .k{font-family:"DejaVu Sans Mono",Menlo,monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.kv .v{font-size:28px;font-weight:bold;color:var(--ink);line-height:1.2}
.kv .s{font-size:14px;color:var(--muted)}
.bar{height:10px;background:var(--panel);border:1px solid var(--line);border-radius:5px;overflow:hidden;margin:8px 0 4px}
.bar i{display:block;height:100%;background:var(--amber)}
.state{display:inline-block;padding:3px 10px;border-radius:4px;font-family:"DejaVu Sans Mono",Menlo,monospace;font-size:13px;letter-spacing:1px}
.state.listening{background:#dafbe1;color:#1a7f37}.state.stopped{background:#ffebe9;color:#cf222e}.state.starting{background:#fff8c5;color:#9a6700}
.small{font-size:14px;color:var(--muted)}
td.num{text-align:right;font-family:"DejaVu Sans Mono",Menlo,monospace}
</style>
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="badge" href="index.html">AE5VG</a>
    <nav><a href="index.html#software">Software</a><a href="index.html#guide">Field Guide</a><a href="live.html">Live</a><a href="decoded.html">Decoded</a><a href="index.html#model">The model</a><a href="index.html#about">About</a></nav>
  </div>
</header>

<div class="hero">
  <div class="wrap">
    <div class="eyebrow">Capture rig · live</div>
    <h1>What the rig is listening to right now</h1>
    <div class="rule"></div>
    <p>One KiwiSDR channel at a time, rotating the digital watering holes, decoded through fldigi one segment behind real time, paired into training data for the model. This page reads a status file the rig publishes every two minutes: frequencies, receivers, counts and gaps. No decoded text leaves the rig.</p>
    <p id="stamp" class="small">Loading…</p>
  </div>
</div>

<section id="now">
  <div class="wrap">
    <h2>Now</h2>
    <div class="h2rule"></div>
    <div id="now-body"><p class="small">Waiting for the status file…</p></div>
  </div>
</section>

<section id="day">
  <div class="wrap">
    <h2>Last 24 hours</h2>
    <div class="h2rule"></div>
    <div id="day-body"></div>
    <p class="small">Counts first. Pairs are lines of the same station received more than once, aligned against the best copy; they are the model's training data. No accuracy figure is published anywhere on this site.</p>
  </div>
</section>

<section id="recent">
  <div class="wrap">
    <h2>Recent segments</h2>
    <div class="h2rule"></div>
    <div id="recent-body"></div>
  </div>
</section>

<section id="health">
  <div class="wrap">
    <h2>Health</h2>
    <div class="h2rule"></div>
    <div id="health-body"></div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="mono">AE5VG · Austin, TX</div>
    <p>Status source: a public GitHub gist the rig rewrites every two minutes. If this page shows "stopped", the loop is down and I probably know already.</p>
  </div>
</footer>

<script>
const GIST = "0f7aaf406781706fee444a9ad8e94103";
const API = `https://api.github.com/gists/${GIST}`;
const RAW = `https://gist.githubusercontent.com/sbrunner-atx/${GIST}/raw/status.json`;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ago = iso => { const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000); return s < 90 ? `${Math.round(s)} s ago` : s < 5400 ? `${Math.round(s/60)} min ago` : `${(s/3600).toFixed(1)} h ago`; };
const kv = (k, v, s) => `<div><div class="k">${k}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ""}</div>`;

function render(st) {
  $("stamp").textContent = `Status generated ${st.generated_utc} (${ago(st.generated_utc)}), rig commit ${st.rig_commit || "?"}.`;
  const c = st.current || {};
  const d = st.decoder || {};
  let now = `<p><span class="state ${esc(st.state)}">${esc(st.state)}</span></p>`;
  if (st.state === "listening" && c.band) {
    const mm = String(Math.floor((c.segment_into_s||0)/60)).padStart(2,"0"), ss = String((c.segment_into_s||0)%60).padStart(2,"0");
    now += `<div class="kv">
      ${kv("Frequency", `${c.mhz.toFixed(4)} MHz`, `${esc(c.band)} · ${esc(c.mode)}`)}
      ${kv("Receiver", esc(c.receiver), `stream open since ${c.started_utc.slice(11,16)}Z`)}
      ${kv("Segment", `${mm}:${ss} / ${Math.round(c.segment_s/60)}:00`, `${c.segments_closed} closed in this stream`)}
      ${kv("Decoder", `${d.lag_minutes ?? 0} min behind`, `${d.segments_pending ?? 0} segment(s) pending${d.backlog_flag ? ", backlog" : ""}`)}
    </div>
    <div class="bar"><i style="width:${Math.round((c.segment_progress||0)*100)}%"></i></div>
    <p class="small">Segments cut on the clock every ${Math.round(c.segment_s/60)} minutes; each is decoded as soon as it closes.</p>`;
  } else if (st.state === "stopped") {
    now += `<p>The passive loop is not running. Last stream: ${c.label ? esc(c.label) : "unknown"}.</p>`;
  }
  if (st.stays && st.stays.length) {
    now += `<p class="small">Recent stays: ${st.stays.slice(-3).map(s => esc(s.utc.slice(11,16)) + "Z " + esc(s.why.replace(/^staying on /, ""))).join(" · ")}</p>`;
  }
  $("now-body").innerHTML = now;
  const l = st.last_24h || {};
  $("day-body").innerHTML = `<div class="kv">
    ${kv("Listening", `${l.listening_hours ?? 0} h`, `${l.streams_decoded ?? 0} streams decoded`)}
    ${kv("Lines", l.lines ?? 0, `${l.lines_with_callsign ?? 0} with a callsign`)}
    ${kv("Stations", l.distinct_stations ?? 0, `${l.repeated_clusters ?? 0} repeated clusters`)}
    ${kv("Pairs", l.pairs ?? 0, `${l.pairs_exact ?? 0} exact`)}
    ${kv("Quiet segments skipped", d.quiet_segments_skipped_24h ?? 0, "nothing above the floor; every 4th still decoded")}
  </div>
  <p class="small">Pairs by kind: ${Object.keys(l.pairs_by_kind||{}).length ? esc(Object.entries(l.pairs_by_kind).map(([k,v])=>`${k} ${v}`).join(", ")) : "none yet"} · by mode: ${Object.keys(l.pairs_by_mode||{}).length ? esc(JSON.stringify(l.pairs_by_mode)) : "none yet"} · by band: ${Object.keys(l.pairs_by_band||{}).length ? esc(JSON.stringify(l.pairs_by_band)) : "none yet"}</p>
  <p class="small">"repeat" is the station sending the same thing again; "browser-neighbour" is two Signal Browser channels copying one transmission, a second demodulator's copy rather than a repeat. Both are counted, never mixed.</p>`;
  const rs = st.recent_segments || [];
  $("recent-body").innerHTML = rs.length ? `<div style="overflow-x:auto"><table><tr><th>Decoded</th><th>Band</th><th>Mode</th><th>Receiver</th><th>Lines</th><th>Stations</th><th>Pairs</th></tr>
    ${rs.map(r => `<tr><td>${esc(r.utc.slice(5,16))}Z</td><td>${esc(r.band)}</td><td>${esc(r.mode)}</td><td>${esc(r.receiver)}</td><td class="num">${r.lines}</td><td class="num">${r.stations}</td><td class="num">${r.pairs}</td></tr>`).join("")}</table></div>` : "<p class='small'>No segments decoded yet.</p>";
  const g = st.gaps_24h || {};
  const w = st.w1aw_recent || [];
  $("health-body").innerHTML = `<div class="kv">
    ${kv("Gaps, 24 h", Object.values(g).reduce((a,b)=>a+b,0), esc(Object.entries(g).map(([k,v])=>`${k} ${v}`).join(", ") || "none"))}
    ${kv("Restarts, 24 h", st.restarts_24h ?? 0, st.loop_up_since_utc ? `loop up since ${st.loop_up_since_utc.slice(0,16)}Z` : "")}
    ${kv("Disk", `${st.disk_free_gb ?? "?"} GB free`, `recordings on disk ${st.runs_gb ?? "?"} GB`)}
    ${kv("Processes", Object.entries(st.processes||{}).map(([k,v])=>`${k.replace(".py","")} ${v}`).join(", ") || "none", "")}
  </div>
  ${w.length ? `<p class="small">W1AW slots: ${w.map(x => `${esc(x.run)}: ${x.pairs} pairs, ${x.wav_files} files${x.stall_relaunches ? `, ${x.stall_relaunches} stalls` : ""}`).join(" · ")}</p>` : ""}`;
}

async function load() {
  try {
    let st = null;
    try {
      const r = await fetch(API, {headers: {"Accept": "application/vnd.github+json"}});
      if (r.ok) { const g = await r.json(); st = JSON.parse(g.files["status.json"].content); }
    } catch (e) {}
    if (!st) { const r = await fetch(RAW + "?t=" + Date.now()); st = await r.json(); }
    render(st);
  } catch (e) {
    $("stamp").textContent = "Could not load the status file. The gist may be rate-limited for this network; try again in a minute.";
  }
}
load(); setInterval(load, 60000);
</script>
</body>
</html>

```

## Reference implementation: decoded.html

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Decoded · AE5VG</title>
<meta name="description" content="What the AE5VG capture rig decoded from the public amateur bands over the last three days, segment by segment, garble included. Own recordings via public KiwiSDR receivers.">
<link rel="stylesheet" href="style.css">
<style>
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}
.tabs button,.filters select,.filters input{font-family:"DejaVu Sans Mono",Menlo,monospace;font-size:13px;padding:7px 12px;border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:4px}
.tabs button.on{background:var(--amber);color:#fff;border-color:var(--amber)}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 18px;align-items:center}
.seg{border:1px solid var(--line);border-left:6px solid var(--amber);background:#fff;margin:0 0 14px;padding:12px 16px}
.seg .h{display:flex;flex-wrap:wrap;gap:14px;align-items:baseline;font-family:"DejaVu Sans Mono",Menlo,monospace;font-size:13px;color:var(--muted);margin-bottom:8px}
.seg .h b{color:var(--ink);font-size:15px}
.seg.skipped{border-left-color:var(--line);color:var(--muted)}
.ln{font-family:"DejaVu Sans Mono",Menlo,monospace;font-size:13px;line-height:1.55;white-space:pre-wrap;word-break:break-word;padding:2px 0;border-bottom:1px dotted var(--line)}
.ln .src{color:var(--muted);font-size:11px;margin-right:8px}
.ln .call{background:#ddf4ff;color:#0550ae;padding:0 3px;border-radius:3px}
.count{font-size:14px;color:var(--muted);margin:0 0 14px}
.small{font-size:14px;color:var(--muted)}
</style>
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="badge" href="index.html">AE5VG</a>
    <nav><a href="index.html#software">Software</a><a href="index.html#guide">Field Guide</a><a href="live.html">Live</a><a href="decoded.html">Decoded</a><a href="index.html#model">The model</a><a href="index.html#about">About</a></nav>
  </div>
</header>

<div class="hero">
  <div class="wrap">
    <div class="eyebrow">Capture rig · decoded text</div>
    <h1>What came off the air, the last three days</h1>
    <div class="rule"></div>
    <p>Every usable line the rig decoded, segment by segment, garble included and nothing edited. These are our own recordings of the public amateur bands through public KiwiSDR receivers; amateur transmissions carry no expectation of privacy. Lines shown are the ones the pairing considers usable (mostly printable, or carrying a callsign); pure noise is left out. Text longer than 240 characters is cut, which only ever happens to a browser channel full of garble.</p>
    <p id="stamp" class="small">Loading…</p>
  </div>
</div>

<section>
  <div class="wrap">
    <div class="tabs" id="tabs"></div>
    <div class="filters">
      <select id="band"><option value="">all bands</option></select>
      <select id="mode"><option value="">all modes</option></select>
      <input id="q" placeholder="callsign or text" size="22">
      <label class="small"><input type="checkbox" id="callsonly"> callsign lines only</label>
    </div>
    <p class="count" id="count"></p>
    <div id="list"></div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="mono">AE5VG · Austin, TX</div>
    <p>Source: the rig's status gist, day files <span class="mono">decoded-YYYYMMDD.json</span>, rewritten every two minutes. Republished through a cache, so a line can be up to five minutes behind the Live page.</p>
  </div>
</footer>

<script>
const GIST = "0f7aaf406781706fee444a9ad8e94103";
const RAW = d => `https://gist.githubusercontent.com/sbrunner-atx/${GIST}/raw/decoded-${d}.json`;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const days = [0,1,2].map(k => { const t = new Date(Date.now() - k*86400000); return t.toISOString().slice(0,10).replace(/-/g,""); });
const cache = {};
let cur = days[0];

function mark(text, calls) {
  let h = esc(text);
  for (const c of (calls||[])) h = h.split(esc(c)).join(`<span class="call">${esc(c)}</span>`);
  return h;
}
function render() {
  const doc = cache[cur];
  if (!doc) { $("list").innerHTML = "<p class='small'>Loading…</p>"; return; }
  const band = $("band").value, mode = $("mode").value, q = $("q").value.trim().toUpperCase(), co = $("callsonly").checked;
  let segs = doc.segments.slice().reverse();
  if (band) segs = segs.filter(s => s.band === band);
  if (mode) segs = segs.filter(s => s.mode === mode);
  let nl = 0, ns = 0;
  const html = segs.map(s => {
    let lines = s.lines || [];
    if (co) lines = lines.filter(l => l.calls && l.calls.length);
    if (q) lines = lines.filter(l => l.text.toUpperCase().includes(q));
    if ((q || co) && !lines.length) return "";
    ns++; nl += lines.length;
    const t = `${s.segment_utc.slice(9,11)}:${s.segment_utc.slice(11,13)}Z`;
    if (s.skipped) return `<div class="seg skipped"><div class="h"><b>${t}</b><span>${esc(s.band)} ${esc(s.mode)}</span><span>${esc(s.receiver)}</span><span>skipped: nothing above the floor</span></div></div>`;
    const y = (s.stations !== undefined) ? `<span>${s.stations} station(s), ${s.pairs} pair(s)</span>` : "";
    return `<div class="seg"><div class="h"><b>${t}</b><span>${esc(s.band)} ${esc(s.mode)}</span><span>${esc(s.receiver)}</span><span>modem ${esc(s.modem)}</span>${y}<span>${lines.length} line(s)</span></div>
      ${lines.map(l => `<div class="ln"><span class="src">${esc(l.src)}${l.q !== null && l.q !== undefined ? " q" + Math.round(l.q) : ""}</span>${mark(l.text, l.calls)}</div>`).join("")}</div>`;
  }).join("");
  $("list").innerHTML = html || "<p class='small'>Nothing matches.</p>";
  $("count").textContent = `${ns} segment(s), ${nl} line(s)` + (doc.trimmed ? ` · ${doc.trimmed}` : "");
  $("stamp").textContent = `Day file generated ${doc.generated_utc}.`;
}
function fillFilters() {
  const bands = new Set(), modes = new Set();
  for (const d of Object.values(cache)) for (const s of (d.segments||[])) { if (s.band) bands.add(s.band); if (s.mode) modes.add(s.mode); }
  const keep = (sel, vals) => { const v = sel.value; sel.innerHTML = `<option value="">${sel.id === "band" ? "all bands" : "all modes"}</option>` + [...vals].sort().map(x => `<option>${esc(x)}</option>`).join(""); sel.value = v; };
  keep($("band"), bands); keep($("mode"), modes);
}
async function load(d) {
  try { const r = await fetch(RAW(d) + "?t=" + Math.floor(Date.now()/120000)); cache[d] = r.ok ? await r.json() : {segments: [], generated_utc: "n/a", note: "no file for this day"}; }
  catch (e) { cache[d] = {segments: [], generated_utc: "n/a"}; }
  fillFilters(); if (d === cur) render();
}
$("tabs").innerHTML = days.map(d => `<button data-d="${d}" class="${d===cur?"on":""}">${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}${d===days[0]?" (today)":""}</button>`).join("");
$("tabs").addEventListener("click", e => { if (e.target.dataset.d) { cur = e.target.dataset.d; for (const b of $("tabs").children) b.classList.toggle("on", b.dataset.d === cur); render(); } });
for (const id of ["band","mode","q","callsonly"]) $(id).addEventListener("input", render);
days.forEach(load);
</script>
</body>
</html>

```
