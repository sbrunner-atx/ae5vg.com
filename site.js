/* AE5VG.com — navigation, email assembly, live release data, TOC highlight */
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.site");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* email assembly: the address never appears whole in the HTML source */
  document.querySelectorAll(".email-here").forEach(function (el) {
    var u = "stefan", d = ["ae5vg", "com"].join(".");
    el.textContent = u + "\u0040" + d;
  });

  /* mode-id waterfall images: load one at a time; on failure keep only the attribution link */
  function wfFallback(img) {
    img.remove();
  }
  var wfQueue = Array.prototype.slice.call(document.querySelectorAll(".wf img[data-src]"));
  function wfNext() {
    if (!wfQueue.length) return;
    var img = wfQueue.shift(), done = false;
    function finish(failed) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (failed) wfFallback(img);
      setTimeout(wfNext, 50);
    }
    var timer = setTimeout(function () { finish(true); }, 20000);
    img.addEventListener("load", function () { finish(false); });
    img.addEventListener("error", function () { finish(true); });
    img.loading = "eager";
    img.src = img.getAttribute("data-src");
  }
  wfNext();

  /* copy button on every code block */
  document.querySelectorAll("pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "copy";
    btn.addEventListener("click", function () {
      var code = pre.querySelector("code");
      navigator.clipboard.writeText((code || pre).textContent).then(function () {
        btn.textContent = "copied";
        setTimeout(function () { btn.textContent = "copy"; }, 1500);
      });
    });
    pre.appendChild(btn);
  });

  /* sidebar table of contents: highlight the current section */
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          if (current) current.classList.remove("current");
          current = map[e.target.id];
          current.classList.add("current");
        }
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---- live release data ---- */
  var GH = "https://api.github.com/repos/sbrunner-atx/";
  var HOUR = 3600000;
  function cached(key, url) {
    var hit = null;
    try { hit = JSON.parse(localStorage.getItem(key)); } catch (e) {}
    if (hit && Date.now() - hit.t < HOUR) return Promise.resolve(hit.d);
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (d) {
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
      return d;
    }).catch(function (e) {
      if (hit) { /* stale cache beats nothing; say how old it is */
        var d = hit.d;
        try { Object.defineProperty(d, "_age", { value: Date.now() - hit.t, enumerable: false }); } catch (x) {}
        return d;
      }
      throw e;
    });
  }
  function release(repo) { return cached("gh:" + repo, GH + repo + "/releases/latest"); }
  function pypi(pkg) { return cached("py:" + pkg, "https://pypi.org/pypi/" + pkg + "/json"); }
  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  function ageNote(r) {
    if (!r || !r._age) return "";
    var h = Math.round(r._age / 3600000);
    return "GitHub did not answer; these rows are from " + (h < 1 ? "under an hour" : h + (h === 1 ? " hour" : " hours")) + " ago.";
  }
  function fmtSize(bytes) {
    if (bytes > 1048576) return (bytes / 1048576).toFixed(1) + " MB";
    return Math.round(bytes / 1024) + " KB";
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function platform(name) {
    var n = name.toLowerCase();
    if (/\.mcpb$/.test(n)) return "Claude Desktop";
    if (/\.pkg$/.test(n) || /-macos$|mac|darwin|osx/.test(n)) return "macOS";
    if (/\.exe$|\.msi$|win/.test(n)) return "Windows";
    if (/-linux$|linux|\.deb$|\.rpm$|appimage/.test(n)) return "Linux";
    return "Other files";
  }
  /* minimal Markdown renderer for release bodies */
  function md(src) {
    var lines = esc(src).split(/\r?\n/), out = [], inList = false, inCode = false;
    lines.forEach(function (ln) {
      if (/^```/.test(ln)) { out.push(inCode ? "</code></pre>" : "<pre><code>"); inCode = !inCode; return; }
      if (inCode) { out.push(ln); return; }
      var m;
      if ((m = ln.match(/^(#{1,4})\s+(.*)/))) { if (inList) { out.push("</ul>"); inList = false; } out.push("<h4>" + m[2] + "</h4>"); return; }
      if ((m = ln.match(/^\s*[-*]\s+(.*)/))) { if (!inList) { out.push("<ul>"); inList = true; } out.push("<li>" + inline(m[1]) + "</li>"); return; }
      if (inList) { out.push("</ul>"); inList = false; }
      if (ln.trim() === "") return;
      out.push("<p>" + inline(ln) + "</p>");
    });
    if (inList) out.push("</ul>");
    if (inCode) out.push("</code></pre>");
    return out.join("\n");
    function inline(s) {
      return s
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
    }
  }

  /* status strip on product pages: <div data-release="repo"> with .fill-version / .fill-released */
  document.querySelectorAll("[data-release]").forEach(function (el) {
    var repo = el.getAttribute("data-release");
    release(repo).then(function (r) {
      el.querySelectorAll(".fill-version").forEach(function (v) { v.textContent = r.tag_name; });
      el.querySelectorAll(".fill-released").forEach(function (v) { v.textContent = fmtDate(r.published_at); });
    }).catch(function () {
      el.querySelectorAll(".fill-version, .fill-released").forEach(function (v) {
        if (v.textContent === "\u2026") v.textContent = "see GitHub";
      });
    });
  });

  /* PyPI version fills: <span data-pypi-version="pkg"> */
  document.querySelectorAll("[data-pypi-version]").forEach(function (el) {
    pypi(el.getAttribute("data-pypi-version")).then(function (r) {
      el.textContent = r.info.version;
    }).catch(function () {});
  });

  /* Downloads page: <tbody data-assets="repo" data-pkg="pkg"> and <details data-relnotes="repo"> */
  document.querySelectorAll("[data-assets]").forEach(function (tbody) {
    var repo = tbody.getAttribute("data-assets");
    var pkg = tbody.getAttribute("data-pkg") || repo;
    release(repo).then(function (r) {
      var rows = "";
      (r.assets || []).forEach(function (a) {
        rows += "<tr><td><a download href=\"" + esc(a.browser_download_url) + "\">" + esc(a.name) + "</a></td>" +
          "<td>" + platform(a.name) + "</td><td>" + fmtSize(a.size) + "</td><td>" + esc(r.tag_name) + "</td></tr>";
      });
      /* platforms this release does not cover: a .mcpb bundle covers all three */
      var have = {};
      (r.assets || []).forEach(function (a) { have[platform(a.name)] = true; });
      var missing = have["Claude Desktop"] ? [] : ["macOS", "Windows", "Linux"].filter(function (p) { return !have[p]; });
      if (!rows) {
        rows = "<tr><td colspan=\"4\">This release has no packaged files; install from PyPI: <code>uvx " + esc(pkg) + "</code></td></tr>";
      } else if (missing.length) {
        rows += "<tr><td colspan=\"4\">This release has no bundle for " + missing.join(" or ") + "; install from PyPI: <code>uvx " + esc(pkg) + "</code></td></tr>";
      }
      var note = ageNote(r);
      if (note) rows += "<tr><td colspan=\"4\" class=\"meta\">" + note + "</td></tr>";
      tbody.innerHTML = rows;
    }).catch(function () {
      tbody.innerHTML = "<tr><td colspan=\"4\"><a href=\"https://github.com/sbrunner-atx/" + repo + "/releases\">Releases on GitHub</a></td></tr>";
    });
  });
  document.querySelectorAll("details[data-relnotes]").forEach(function (det) {
    var repo = det.getAttribute("data-relnotes");
    release(repo).then(function (r) {
      var body = det.querySelector(".body");
      var head = "<p class=\"meta\">" + esc(r.tag_name) + " \u00b7 " + fmtDate(r.published_at) +
        " \u00b7 <a href=\"" + esc(r.html_url) + "\">release page</a></p>";
      body.innerHTML = head + (r.body ? md(r.body) : "");
    }).catch(function () {
      det.querySelector(".body").innerHTML =
        "<p class=\"meta\"><a href=\"https://github.com/sbrunner-atx/" + repo + "/releases\">Releases on GitHub</a></p>";
    });
  });
})();
