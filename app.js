(() => {
  "use strict";

  /* =======================================================
     EDIT ME: everything personal lives here
     ======================================================= */
  const CONFIG = {
    name: "Ekaum",
    ticker: "EKM",
    est: "2026",
    email: "hello@example.com", // TODO: your real email
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" }, // TODO
      { label: "GitHub", url: "https://github.com/" },         // TODO
      { label: "LetsAppeal", url: "https://letsappeal.com" }
    ],
    projects: [
      {
        name: "LetsAppeal",
        role: "Founder",
        status: "Building",
        url: "https://letsappeal.com",
        summary: "Plain-language help for people whose health insurance claims get denied: what the denial means, what your rights are, and how to write an appeal that gets read.",
        details: [
          "Bootstrapped consumer-education startup",
          "Focused on the first 90 days: content, distribution, and proof people use it",
          "Stress-tested with a multi-expert review before committing further"
        ],
        trend: [3, 4, 4, 6, 5, 7, 8, 8, 10, 12]
      },
      {
        name: "The Tank DFW",
        role: "Organizer",
        status: "Recruiting sponsors",
        url: "",
        summary: "A Shark Tank-style pitch competition for students across Dallas–Fort Worth. Real judges, real feedback, real stage.",
        details: [
          "Sponsor and judge prospectus: pitch deck and one-pager",
          "Custom visual identity built to avoid template looks",
          "Looking for judges and sponsors now"
        ],
        trend: [2, 2, 3, 5, 4, 6, 7, 9, 9, 11]
      },
      {
        name: "Puzzle log",
        role: "Solver",
        status: "Monthly",
        url: "",
        summary: "Working through Jane Street-style monthly puzzles. Some solved cleanly, some solved at 2 a.m., some still open.",
        details: ["Probability, combinatorics and logic grids", "Try a few in the puzzle desk below"],
        trend: [5, 7, 4, 8, 6, 9, 5, 10, 8, 11]
      },
      {
        name: "Market notes",
        role: "Analyst",
        status: "Ongoing",
        url: "",
        summary: "A long-running habit of following markets, writing up theses, and checking them against what actually happened.",
        details: ["Finance competitions and programs", "Theses are written down before, graded after"],
        trend: [6, 5, 7, 6, 8, 7, 9, 8, 10, 11]
      }
    ],
    tape: [
      { sym: "LTSA", text: "LetsAppeal", move: "building", dir: "up" },
      { sym: "TANK", text: "The Tank DFW", move: "sponsor season", dir: "up" },
      { sym: "PZL", text: "Puzzles", move: "this month's still open", dir: "flat" },
      { sym: "MKT", text: "Markets", move: "watching daily", dir: "up" },
      { sym: "CODE", text: "Side projects", move: "shipping", dir: "up" },
      { sym: "DFW", text: "Location", move: "Dallas–Fort Worth", dir: "flat" }
    ],
    puzzles: [
      {
        q: "You flip a fair coin until you get two heads in a row. On average, how many flips does that take?",
        answer: 6,
        hint: "Let E be the expected flips from scratch. After a tail you restart; after one head you either finish or restart. Set up an equation in E.",
        explain: "E = ½(E+1) + ¼(E+2) + ¼·2, which solves to 6."
      },
      {
        q: "You roll three fair dice. What's the probability their sum is exactly 10?",
        answer: 1 / 8,
        hint: "There are 216 outcomes. Count the ordered triples from 1 to 6 that add to 10.",
        explain: "27 of the 216 outcomes sum to 10, so 27/216 = 1/8."
      },
      {
        q: "A stick is broken at two points chosen uniformly at random. What's the probability the three pieces can form a triangle?",
        answer: 1 / 4,
        hint: "A triangle works only if no piece is longer than half the stick. Picture the two break points as a point in a unit square.",
        explain: "The region where every piece is under half fills a quarter of the square: 1/4."
      }
    ]
  };

  /* =======================================================
     Helpers
     ======================================================= */
  const $ = (s, r = document) => r.querySelector(s);
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) if (c) node.append(c);
    return node;
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* =======================================================
     Guilloché rosette (drawn once on load)
     ======================================================= */
  function buildGuilloche() {
    const svg = $("#guilloche");
    const NS = "http://www.w3.org/2000/svg";
    const bands = [
      { base: 250, amp: 22, lobes: 26, copies: 14 },
      { base: 175, amp: 32, lobes: 14, copies: 16 },
      { base: 95, amp: 28, lobes: 9, copies: 12 }
    ];
    const steps = 900;
    bands.forEach((b, bi) => {
      for (let j = 0; j < b.copies; j++) {
        const phase = (j / b.copies) * (Math.PI * 2 / b.lobes);
        let d = "";
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2;
          const r = b.base + b.amp * Math.cos(b.lobes * t + phase * b.lobes) + 6 * Math.sin(3 * t + j);
          const x = r * Math.cos(t);
          const y = r * Math.sin(t);
          d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
        }
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", d + "Z");
        p.setAttribute("pathLength", "1");
        p.style.animationDelay = (bi * 0.35 + j * 0.04).toFixed(2) + "s";
        svg.append(p);
      }
    });
  }

  /* =======================================================
     Ticker + sparkline
     ======================================================= */
  const market = { price: 100, open: 100, hist: [], halted: false };

  function gauss() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function seedMarket() {
    let p = 96 + Math.random() * 4;
    for (let i = 0; i < 60; i++) {
      p *= 1 + gauss() * 0.006 + 0.0008;
      market.hist.push(p);
    }
    market.open = market.hist[0];
    market.price = market.hist[market.hist.length - 1];
  }

  function renderQuote() {
    const change = (market.price / market.open - 1) * 100;
    $("#px").textContent = market.price.toFixed(2);
    const chg = $("#chg");
    chg.textContent = (change >= 0 ? "▲ +" : "▼ ") + change.toFixed(2) + "%";
    chg.className = "chg " + (change >= 0 ? "up" : "down");
    drawSpark();
  }

  function drawSpark() {
    const c = $("#spark");
    if (!c || !market.hist.length) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const data = market.hist;
    const min = Math.min(...data), max = Math.max(...data);
    const pad = 4;
    const x = (i) => (i / (data.length - 1)) * (w - pad * 2) + pad;
    const y = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);

    const ink = cssVar("--ink");
    const line = cssVar("--line");

    // opening price reference
    ctx.strokeStyle = line;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(pad, y(market.open));
    ctx.lineTo(w - pad, y(market.open));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    data.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
    ctx.stroke();

    const lx = x(data.length - 1), ly = y(data[data.length - 1]);
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.arc(lx, ly, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick() {
    if (document.hidden || market.halted) return;
    market.price = Math.max(1, market.price * (1 + gauss() * 0.006 + 0.0006));
    market.hist.push(market.price);
    if (market.hist.length > 80) market.hist.shift();
    renderQuote();
  }

  // Easter egg: type "moon" anywhere
  let keyBuffer = "";
  function easterEgg(e) {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.key.length !== 1) return;
    keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-4);
    if (keyBuffer === "moon" && !market.halted) {
      market.price *= 1.5;
      market.hist.push(market.price);
      renderQuote();
      market.halted = true;
      toast("Circuit breaker tripped. Trading halted for 10 seconds.");
      setTimeout(() => { market.halted = false; }, 10000);
    }
  }

  /* =======================================================
     Tape
     ======================================================= */
  function buildTape() {
    const track = $("#tape");
    const makeItems = (hidden) =>
      CONFIG.tape.map((t) => {
        const item = el("span", { class: "tape-item" }, [
          el("b", { text: t.sym }),
          el("span", { class: t.dir, text: `${t.text}, ${t.move}` })
        ]);
        if (hidden) item.setAttribute("aria-hidden", "true");
        return item;
      });
    track.append(...makeItems(false));
    if (!reduceMotion) track.append(...makeItems(true)); // duplicate for seamless loop
  }

  /* =======================================================
     Holdings (projects)
     ======================================================= */
  function sparkSVG(values) {
    const w = 120, h = 32, pad = 3;
    const min = Math.min(...values), max = Math.max(...values);
    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    return `<svg class="h-spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${pts}"/></svg>`;
  }

  function buildHoldings() {
    const list = $("#holdingsList");
    CONFIG.projects.forEach((p, i) => {
      const panelId = "holding-panel-" + i;
      const wrap = el("div", { class: "holding", role: "listitem" });

      const row = el("button", {
        class: "holding-row",
        type: "button",
        "aria-expanded": "false",
        "aria-controls": panelId
      });
      row.innerHTML = `
        <span class="h-name"></span>
        <span class="h-meta h-role"></span>
        <span class="h-meta h-status"></span>
        ${sparkSVG(p.trend)}
        <span class="h-toggle" aria-hidden="true"></span>`;
      row.querySelector(".h-name").textContent = p.name;
      row.querySelector(".h-role").textContent = p.role;
      row.querySelector(".h-status").textContent = p.status;

      const body = el("div", { class: "holding-body" }, [
        el("p", { text: p.summary }),
        el("div", {}, [
          el("ul", {}, p.details.map((d) => el("li", { text: d }))),
          p.url ? el("p", {}, [el("a", { href: p.url, target: "_blank", rel: "noopener", text: "Visit " + p.name })]) : null
        ])
      ]);
      const panel = el("div", { class: "holding-panel", id: panelId }, [el("div", {}, [body])]);
      panel.inert = true;

      row.addEventListener("click", () => {
        const open = wrap.hasAttribute("data-open");
        wrap.toggleAttribute("data-open", !open);
        row.setAttribute("aria-expanded", String(!open));
        panel.inert = open;
      });

      wrap.append(row, panel);
      list.append(wrap);
    });
  }

  /* =======================================================
     Puzzle desk
     ======================================================= */
  const puzzleState = { index: 0, solved: new Set() };

  function parseAnswer(raw) {
    const s = raw.trim().replace(/\s+/g, "").replace(",", ".");
    if (!s) return NaN;
    if (s.endsWith("%")) return parseFloat(s) / 100;
    if (s.includes("/")) {
      const [a, b] = s.split("/").map(Number);
      return b ? a / b : NaN;
    }
    return Number(s);
  }

  function showPuzzle() {
    const p = CONFIG.puzzles[puzzleState.index];
    $("#puzzleCount").textContent = `Puzzle ${puzzleState.index + 1} of ${CONFIG.puzzles.length}`;
    $("#puzzleText").textContent = p.q;
    const hint = $("#puzzleHint");
    hint.hidden = true;
    hint.textContent = p.hint;
    $("#hintBtn").textContent = "Show a hint";
    $("#puzzleInput").value = "";
    const fb = $("#puzzleFeedback");
    fb.textContent = puzzleState.solved.has(puzzleState.index) ? "Already solved. " + p.explain : "";
    fb.className = "puzzle-feedback";
  }

  function updateScore() {
    $("#puzzleScore").textContent = `Solved ${puzzleState.solved.size} of ${CONFIG.puzzles.length}`;
  }

  function checkAnswer(e) {
    e.preventDefault();
    const p = CONFIG.puzzles[puzzleState.index];
    const input = $("#puzzleInput");
    const fb = $("#puzzleFeedback");
    const val = parseAnswer(input.value);

    if (Number.isNaN(val)) {
      fb.textContent = "Enter a number, like 6, 0.25, 1/4 or 25%.";
      fb.className = "puzzle-feedback wrong";
      input.focus();
      return;
    }
    if (Math.abs(val - p.answer) < 1e-4) {
      puzzleState.solved.add(puzzleState.index);
      fb.textContent = "Correct. " + p.explain;
      fb.className = "puzzle-feedback";
      updateScore();
      if (puzzleState.solved.size === CONFIG.puzzles.length) toast("All puzzles solved. You should apply to Jane Street.");
    } else {
      fb.textContent = "Not quite. Try again, or open the hint.";
      fb.className = "puzzle-feedback wrong";
    }
  }

  function buildPuzzles() {
    $("#puzzleForm").addEventListener("submit", checkAnswer);
    $("#hintBtn").addEventListener("click", () => {
      const hint = $("#puzzleHint");
      hint.hidden = !hint.hidden;
      $("#hintBtn").textContent = hint.hidden ? "Show a hint" : "Hide the hint";
    });
    $("#nextBtn").addEventListener("click", () => {
      puzzleState.index = (puzzleState.index + 1) % CONFIG.puzzles.length;
      showPuzzle();
    });
    showPuzzle();
    updateScore();
  }

  /* =======================================================
     Theme
     ======================================================= */
  function setTheme(t) {
    root.dataset.theme = t;
    const btn = $("#themeToggle");
    btn.textContent = t === "night" ? "Day" : "Night";
    btn.setAttribute("aria-label", t === "night" ? "Switch to day mode" : "Switch to night mode");
    drawSpark();
  }
  const toggleTheme = () => setTheme(root.dataset.theme === "night" ? "day" : "night");

  /* =======================================================
     Contact
     ======================================================= */
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
    } catch {
      const ta = el("textarea", { style: "position:fixed;opacity:0" });
      ta.value = CONFIG.email;
      document.body.append(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast("Email copied");
  }

  function buildContact() {
    const link = $("#emailLink");
    link.href = "mailto:" + CONFIG.email;
    link.textContent = CONFIG.email;
    $("#copyEmail").addEventListener("click", copyEmail);
    $("#socialLinks").append(
      ...CONFIG.links.map((l) => el("li", {}, [el("a", { href: l.url, target: "_blank", rel: "noopener", text: l.label })]))
    );
  }

  /* =======================================================
     Command palette
     ======================================================= */
  const go = (sel) => document.querySelector(sel).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  const commands = [
    { label: "Go to top", hint: "Section", run: () => go("#top") },
    { label: "Go to work", hint: "Section", run: () => go("#holdings") },
    { label: "Go to puzzle desk", hint: "Section", run: () => { go("#puzzle"); setTimeout(() => $("#puzzleInput").focus({ preventScroll: true }), 400); } },
    { label: "Go to about", hint: "Section", run: () => go("#about") },
    { label: "Go to contact", hint: "Section", run: () => go("#contact") },
    { label: "Copy email", hint: "Action", run: copyEmail },
    { label: "Switch theme", hint: "Action", run: toggleTheme },
    { label: "Next puzzle", hint: "Action", run: () => { go("#puzzle"); $("#nextBtn").click(); } },
    ...CONFIG.projects.filter((p) => p.url).map((p) => ({
      label: "Open " + p.name, hint: "Link", run: () => window.open(p.url, "_blank", "noopener")
    }))
  ];

  const palette = { dialog: null, input: null, list: null, items: [], active: 0 };

  function renderPalette() {
    const q = palette.input.value.trim().toLowerCase();
    palette.items = commands.filter((c) => c.label.toLowerCase().includes(q));
    palette.active = Math.min(palette.active, Math.max(0, palette.items.length - 1));
    palette.list.innerHTML = "";

    if (!palette.items.length) {
      palette.list.append(el("li", { class: "empty", text: "No matches. Try “work” or “email”." }));
      palette.input.removeAttribute("aria-activedescendant");
      return;
    }
    palette.items.forEach((c, i) => {
      const li = el("li", { id: "cmd-" + i, role: "option", "aria-selected": String(i === palette.active) }, [
        el("span", { text: c.label }),
        el("span", { text: c.hint })
      ]);
      li.addEventListener("mousemove", () => { if (palette.active !== i) { palette.active = i; renderPalette(); } });
      li.addEventListener("click", () => runCommand(i));
      palette.list.append(li);
    });
    palette.input.setAttribute("aria-activedescendant", "cmd-" + palette.active);
    const activeEl = palette.list.children[palette.active];
    if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
  }

  function openPalette() {
    if (palette.dialog.open) return;
    palette.input.value = "";
    palette.active = 0;
    renderPalette();
    palette.dialog.showModal();
    palette.input.focus();
  }

  function runCommand(i) {
    const cmd = palette.items[i];
    if (!cmd) return;
    palette.dialog.close();
    cmd.run();
  }

  function buildPalette() {
    palette.dialog = $("#palette");
    palette.input = $("#paletteInput");
    palette.list = $("#paletteList");

    palette.input.addEventListener("input", () => { palette.active = 0; renderPalette(); });
    palette.input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); palette.active = (palette.active + 1) % (palette.items.length || 1); renderPalette(); }
      if (e.key === "ArrowUp") { e.preventDefault(); palette.active = (palette.active - 1 + palette.items.length) % (palette.items.length || 1); renderPalette(); }
      if (e.key === "Enter") { e.preventDefault(); runCommand(palette.active); }
    });
    palette.dialog.addEventListener("click", (e) => { if (e.target === palette.dialog) palette.dialog.close(); });
    $("#paletteOpen").addEventListener("click", openPalette);

    const label = isMac ? "⌘ K" : "Ctrl K";
    $("#kbdHint").textContent = label;
    $("#kbdHint2").textContent = label;
  }

  /* =======================================================
     Init
     ======================================================= */
  function init() {
    document.title = CONFIG.name;
    $("#heroName").textContent = CONFIG.name;
    $("#sym").textContent = CONFIG.ticker;
    $("#year").textContent = new Date().getFullYear();
    $("#certNo").textContent = String(Math.floor(Math.random() * 9000) + 1000);
    $("#sealText").textContent = `${CONFIG.name.toUpperCase()} ★ DALLAS–FORT WORTH ★ EST. ${CONFIG.est} ★`;

    buildGuilloche();
    seedMarket();
    buildTape();
    buildHoldings();
    buildPuzzles();
    buildContact();
    buildPalette();

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "night" : "day");
    $("#themeToggle").addEventListener("click", toggleTheme);

    renderQuote();
    setInterval(tick, 2200);
    window.addEventListener("resize", drawSpark);

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }
      if (e.key === "/" && !["input", "textarea"].includes((e.target.tagName || "").toLowerCase())) { e.preventDefault(); openPalette(); return; }
      easterEgg(e);
    });
  }

  init();
})();
