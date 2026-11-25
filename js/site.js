(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lang = store.get("dp-lang") === "en" ? "en" : "th";
  const t = k => (I18N[lang] && I18N[lang][k]) ?? I18N.th[k] ?? "";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Guests, newest first, each with its visit number for that person
  const guests = (window.GUESTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  (() => {
    const byPerson = {};
    guests.slice().reverse().forEach(g => { const k = g.name_en || g.id; byPerson[k] = (byPerson[k] || 0) + 1; g.visitNo = byPerson[k]; });
    guests.forEach(g => { g.visits = byPerson[g.name_en || g.id]; });
  })();
  const people = () => [...new Set(guests.map(g => g.name_en || g.id))];

  const MONTHS = {
    th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  const year = y => lang === "th" ? String(+y + 543) : String(y);
  const month = d => { const [y, m] = d.split("-").map(Number); return `${MONTHS[lang][m - 1]} ${year(y)}`; };
  const baht = n => n.toLocaleString("en-US");
  const name = g => (lang === "th" ? g.name_th : g.name_en) || g.name_en || t("guest");
  const visitLine = g => g.visits > 1 ? ` · ${t("visitNo").replace("{k}", g.visitNo)}` : "";

  // ---------- Guest book: a book whose photos drop onto the pages ----------
  function guestCard(g, tag = "li") {
    return `<${tag} class="tl-card"><button type="button" data-guest="${esc(g.id)}">
      <span class="ph${g.shape === "wide" ? " wide" : ""}"><img src="${esc(g.photo)}" alt="${esc(name(g))}" loading="lazy" style="object-position:${esc(g.focus || "50% 50%")}"></span>
      <b>${esc(name(g))}</b><span class="d">${month(g.date)}${visitLine(g)}</span></button></${tag}>`;
  }
  // Pages: a title page, then two photos per page, each year starting a new page
  function bookPages() {
    const pages = [{ type: "title" }];
    const years = [...new Set(guests.map(g => g.date.slice(0, 4)))];
    years.forEach(y => {
      const list = guests.filter(g => g.date.startsWith(y));
      for (let i = 0; i < list.length; i += 2) pages.push({ type: "photos", year: y, list: list.slice(i, i + 2) });
    });
    pages.push({ type: "more" });
    if (!single() && pages.length % 2) pages.push({ type: "more", quiet: true });
    return pages;
  }
  const TILT = [-4, 3, -2, 5, -3, 2];
  function pageHTML(pg, n, withSnaps = true) {
    if (!pg) return "";
    if (pg.type === "title") {
      const first = guests[guests.length - 1], last = guests[0];
      return `<div class="pg-title"><img src="assets/logo-mark.svg" alt="" width="84" height="84">
        <h3>${esc(t("guests.h"))}</h3><p class="hand">${esc(t("bk.sub"))}</p>
        <p class="hand sm">${esc(t("bk.count").replace("{n}", people().length).replace("{from}", year(first.date.slice(0, 4))).replace("{to}", year(last.date.slice(0, 4))))}</p>
        <p class="pg-hint">${esc(t("bk.hint"))}</p></div><span class="pg-no">${n}</span>`;
    }
    if (pg.type === "blank") return `<span class="pg-no">${n}</span>`;
    if (pg.type === "more") return [0, 1].map(i => `<figure class="snap empty s${i}" style="--r:${TILT[(n * 2 + i) % TILT.length]}deg"><span class="ghost"><span class="tape${i ? " gold" : ""}"></span><i></i></span></figure>`).join("")
      + (pg.quiet ? "" : `<p class="pg-more hand">${esc(t("bk.more"))}</p>`) + `<span class="pg-no">${n}</span>`;
    const snaps = withSnaps ? pg.list.map((g, i) => {
      const r = TILT[(n * 2 + i) % TILT.length];
      return `<figure class="snap s${i}${g.shape === "wide" ? " wide" : ""}" style="--r:${r}deg;--d:${i * 160}ms">
        <button type="button" data-guest="${esc(g.id)}"><span class="tape${(n + i) % 2 ? " gold" : ""}"></span>
        <img src="${esc(g.photo)}" alt="${esc(name(g))}" style="object-position:${esc(g.focus || "50% 40%")}">
        <figcaption class="hand">${esc(name(g))}<small>${month(g.date)}${visitLine(g)}</small></figcaption></button></figure>`;
    }).join("") : "";
    return `<p class="pg-year hand">${year(pg.year)}</p>${snaps}<span class="pg-no">${n}</span>`;
  }
  const gbook = $("#gbook");
  let pages = [], spread = 0, turning = false, dropped = false;
  const single = () => innerWidth <= 760;
  const perView = () => single() ? 1 : 2;
  const views = () => Math.ceil(pages.length / perView());
  function drawBook(drop) {
    if (!gbook) return;
    const pv = perView(), i = spread * pv;
    gbook.classList.toggle("single", pv === 1);
    $("#pgL").innerHTML = pageHTML(pages[i], i + 1);
    $("#pgR").innerHTML = pv === 2 ? pageHTML(pages[i + 1], i + 2) : "";
    if (drop) $$(".snap", gbook).forEach(s => s.classList.add("drop"));
    const p = views() > 1 ? spread / (views() - 1) : 0;
    gbook.style.setProperty("--l", (2 + 9 * p).toFixed(1) + "px");
    gbook.style.setProperty("--r", (2 + 9 * (1 - p)).toFixed(1) + "px");
    $("#bkCount").textContent = `${spread + 1} / ${views()}`;
    $("#bkPrev").disabled = spread === 0;
    $("#bkNext").disabled = spread >= views() - 1;
  }
  function book3d() {
    if (!gbook) return;
    pages = bookPages();
    spread = Math.min(spread, views() - 1);
    drawBook(false);
    if (!dropped) $$(".snap", gbook).forEach(s => s.classList.add("wait"));
    const sum = $("#guestSummary");
    if (sum) sum.textContent = t("guests.sum").replace("{n}", people().length).replace("{from}", year(guests[guests.length - 1].date.slice(0, 4)));
  }
  function turn(dir) {
    if (!gbook || turning) return;
    const next = spread + dir;
    if (next < 0 || next >= views()) return;
    const pv = perView();
    if (reduce) { spread = next; drawBook(false); return; }
    turning = true;
    const ci = spread * pv, ni = next * pv;
    const P = i => pageHTML(pages[i], i + 1);
    const oldL = P(ci), oldR = pv === 2 ? P(ci + 1) : "";
    const newL = P(ni), newR = pv === 2 ? P(ni + 1) : "";
    const flip = document.createElement("div");
    flip.className = "flipper " + (pv === 1 ? "full" : dir > 0 ? "on-right" : "on-left");
    let front, back;
    if (pv === 1) { if (dir > 0) { front = oldL; back = ""; $("#pgL").innerHTML = newL; } else { front = newL; back = ""; } }
    else if (dir > 0) { front = oldR; back = newL; $("#pgR").innerHTML = newR; }
    else { front = oldL; back = newR; $("#pgL").innerHTML = newL; }
    flip.innerHTML = `<div class="face front page ${pv === 1 ? "left" : dir > 0 ? "right" : "left"}">${front}</div><div class="face back page ${pv === 1 ? "left" : dir > 0 ? "left" : "right"}">${back}</div>`;
    // on a phone, going back brings the previous page in from the left over the current one
    const swingIn = pv === 1 && dir < 0;
    if (swingIn) flip.classList.add("go-next", "no-t");
    gbook.appendChild(flip);
    if (swingIn) { flip.getBoundingClientRect(); flip.classList.remove("no-t"); }
    requestAnimationFrame(() => requestAnimationFrame(() => swingIn ? flip.classList.remove("go-next") : flip.classList.add(dir > 0 || pv === 1 ? "go-next" : "go-prev")));
    setTimeout(() => { spread = next; drawBook(false); flip.remove(); turning = false; }, 780);
  }
  if (gbook) {
    $("#bkPrev").addEventListener("click", () => turn(-1));
    $("#bkNext").addEventListener("click", () => turn(1));
    gbook.addEventListener("keydown", e => { if (e.key === "ArrowRight") { e.preventDefault(); turn(1); } if (e.key === "ArrowLeft") { e.preventDefault(); turn(-1); } });
    let sx = null, sy = null;
    gbook.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; });
    gbook.addEventListener("pointerup", e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) turn(dx < 0 ? 1 : -1);
    });
  }

  // Guest book page: years with big numerals
  let pickYear = "all";
  function book() {
    const box = $("#book"); if (!box) return;
    const years = [...new Set(guests.map(g => g.date.slice(0, 4)))];
    $("#years").innerHTML = [["all", t("guests.all")], ...years.map(y => [y, year(y)])]
      .map(([v, l]) => `<button data-year="${v}" aria-pressed="${v === pickYear}">${l}</button>`).join("");
    box.innerHTML = years.filter(y => pickYear === "all" || y === pickYear).map(y => `
      <section class="gb-year"><h2 class="gb-num">${year(y)}</h2>
        <ul class="gb-grid">${guests.filter(g => g.date.startsWith(y)).map(g => guestCard(g)).join("")}</ul>
      </section>`).join("");
  }

  // ---------- Lightbox ----------
  const lb = $("#lb");
  function openGuest(id) {
    const g = guests.find(x => x.id === id); if (!g || !lb) return;
    $("#lbImg").src = g.photo; $("#lbImg").alt = name(g);
    $("#lbName").textContent = name(g);
    $("#lbDate").textContent = month(g.date) + visitLine(g);
    const src = $("#lbSrc"); src.href = g.source || "#"; src.hidden = !g.source;
    lb.showModal ? lb.showModal() : lb.setAttribute("open", "");
  }
  if (lb) {
    $("#lbClose").addEventListener("click", () => lb.close());
    lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  }

  // ---------- Dr. Poppy ----------
  function doctor() {
    const row = $("#withRow");
    if (row) row.innerHTML = guests.filter(g => g.with_doctor).slice(0, 5).map((g, i) =>
      `<button type="button" data-guest="${esc(g.id)}" title="${esc(name(g))}" style="--r:${TILT[i % TILT.length]}deg"><img src="${esc(g.photo)}" alt="${esc(name(g))}" loading="lazy" style="object-position:${esc(g.focus || "50% 40%")}"><span class="hand">${esc(name(g))}</span></button>`).join("");
  }
  function countUp(el) {
    const end = parseFloat(el.dataset.count || "0"), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = end.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1300;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (end * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ---------- Prices ----------
  function priceItem(x) {
    const label = lang === "th" ? x.th : x.en;
    const detail = lang === "th" ? x.detail_th : x.detail_en;
    const unit = lang === "th" ? x.unit_th : x.unit_en;
    const was = x.was ? `<del>฿${baht(x.was)}</del>` : "";
    return `<li class="${x.was ? "star" : ""}"><span class="t">${esc(label)}</span>${detail ? `<span class="s">${esc(detail)}</span>` : ""}<span class="p">${was}฿${baht(x.price)}${unit ? `<small>${esc(unit)}</small>` : ""}</span></li>`;
  }

  // ---------- Machines showroom ----------
  let mcIndex = 0;
  function machines() {
    const tabs = $("#mcTabs"), stage = $("#mcStage"); if (!tabs || !stage) return;
    const M = window.MACHINES || [];
    tabs.innerHTML = M.map((m, i) => `<button role="tab" id="mt-${i}" aria-selected="${i === mcIndex}" tabindex="${i === mcIndex ? 0 : -1}" data-mc="${i}">
      <i>${String(i + 1).padStart(2, "0")}</i><b>${esc(m.name)}</b><span>${esc(lang === "th" ? m.use_th : m.use_en)}</span></button>`).join("");
    stage.setAttribute("aria-labelledby", "mt-" + mcIndex);
    const m = M[mcIndex]; if (!m) return;
    const all = [...(TREATMENTS.skin || [])];
    const tr = all.find(x => x.id === m.treatment);
    stage.innerHTML = `<div class="disc"><img src="${esc(m.photo)}" alt="${esc(m.name)}"></div>
      <div class="plate2">
        <h3>${esc(m.name)}</h3>
        <dl><dt>${t("mc.maker")}</dt><dd>${esc(m.maker)}</dd><dt>${t("mc.serial")}</dt><dd>${esc(m.serial)}</dd>
        ${tr ? `<dt>${t("mc.price")}</dt><dd>${esc(lang === "th" ? tr.th : tr.en)} ฿${baht(tr.price)}</dd>` : ""}</dl>
      </div>`;
  }
  function showMachine(i, byKey) {
    const n = (window.MACHINES || []).length; if (!n) return;
    i = (i + n) % n; if (i === mcIndex) return;
    const stage = $("#mcStage");
    if (reduce) { mcIndex = i; machines(); if (byKey) $("#mt-" + i).focus({ preventScroll: true }); return; }
    stage.classList.add("out");
    setTimeout(() => { mcIndex = i; machines(); stage.classList.remove("out"); if (byKey) $("#mt-" + i).focus({ preventScroll: true }); }, 220);
  }

  function hours() {
    const tbl = $("#hours"); if (!tbl) return;
    const to = lang === "th" ? "ถึง" : "to";
    const span = (a, b) => `${a} ${to} ${b}`;
    const open = { 2: span("10:00", "19:00"), 3: span("10:00", "19:00"), 4: span("10:00", "19:00"), 5: span("10:00", "19:00"), 6: span("09:00", "13:00") };
    const today = new Date().getDay();
    tbl.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<tr class="${open[d] ? "" : "closed"} ${d === today ? "today" : ""}"><td>${t("days")[d]}</td><td>${open[d] || t("closed")}</td></tr>`).join("");
  }

  // ---------- Hero ----------
  let slideTimer;
  function slides() {
    const gap = $("#slides"); if (!gap) return;
    $$(".slide", gap).forEach(s => s.remove());
    const list = guests.slice(0, 8);
    list.forEach((g, i) => {
      const d = document.createElement("div");
      d.className = "slide" + (i === 0 ? " on" : ""); d.dataset.i = i;
      const bg = document.createElement("div"); bg.className = "bg"; bg.style.backgroundImage = "url('" + g.photo + "')";
      const im = document.createElement("img"); im.className = "fg"; im.src = g.photo; im.alt = ""; if (i) im.loading = "lazy";
      d.append(bg, im); gap.prepend(d);
    });
    const cap = $("#gapCaption");
    let i = 0;
    const show = () => { $$(".slide", gap).forEach(s => s.classList.toggle("on", +s.dataset.i === i)); if (cap && list[i]) cap.innerHTML = `<strong>${esc(name(list[i]))}</strong>${month(list[i].date)}`; };
    show(); clearInterval(slideTimer);
    if (list.length > 1) slideTimer = setInterval(() => { i = (i + 1) % list.length; show(); }, 3200);
  }
  const hero = $(".hero");
  function heroFrame() {
    if (!hero || reduce) return;
    const w1 = $(".w1"), w2 = $(".w2"), gap = $("#gap"), panels = $(".panels"), cap = $("#gapCaption");
    const vh = innerHeight;
    const r = hero.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
    const e = 1 - Math.pow(1 - Math.min(1, p / 0.4), 3);
    const H = w1.offsetHeight;
    const topRoom = 82, botRoom = 16, gapPad = 12;
    const s = Math.min(1, Math.max(0.28, (vh * 0.11) / H));
    const scale = 1 - (1 - s) * e;
    w1.style.transform = `translateY(${(topRoom - w1.offsetTop) * e}px) scale(${scale})`;
    w2.style.transform = `translateY(${((vh - botRoom) - (w2.offsetTop + w2.offsetHeight)) * e}px) scale(${scale})`;
    const topIn = (vh / 2) + ((topRoom + H * s + gapPad) - vh / 2) * e;
    const botIn = (vh / 2) + ((botRoom + H * s + gapPad) - vh / 2) * e;
    gap.style.clipPath = `inset(${topIn}px 0 ${botIn}px 0 round 6px)`;
    const sl = $("#slides"); if (sl) { sl.style.top = topIn + "px"; sl.style.bottom = botIn + "px"; }
    if (cap) {
      if (innerWidth > 760) { cap.style.bottom = (botIn + 22) + "px"; cap.style.top = "auto"; }
      else { cap.style.top = (topIn + 14) + "px"; cap.style.bottom = "auto"; }
    }
    if (panels) {
      if (innerWidth > 760) { panels.style.top = ((topIn + vh - botIn) / 2) + "px"; panels.style.bottom = "auto"; }
      else { panels.style.top = "auto"; panels.style.bottom = (botIn + 14) + "px"; }
    }
    $$(".panel").forEach((el, k) => el.classList.toggle("in", p > 0.42 + k * 0.1));
    const sub = $(".hero-sub"); if (sub) sub.style.opacity = String(Math.max(0, 1 - p * 6));
  }

  // ---------- Render everything for the current language ----------
  function render() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    const lg = $("#latestGuest"); if (lg && guests[0]) lg.innerHTML = `${esc(name(guests[0]))}<small>${month(guests[0].date)}</small>`;
    const T = window.TREATMENTS || {};
    if ($("#skinList")) $("#skinList").innerHTML = (T.skin || []).map(priceItem).join("");
    if ($("#dentalList")) $("#dentalList").innerHTML = (T.dental || []).map(priceItem).join("");
    if ($("#brideList")) $("#brideList").innerHTML = (T.bridal || []).map(priceItem).join("");
    book3d(); doctor(); machines(); hours(); book(); slides();
    $$(".stats b").forEach(b => { if (b.dataset.done) b.textContent = (+b.dataset.count).toFixed(+(b.dataset.dec || 0)) + (b.dataset.suffix || ""); });
  }

  // ---------- Clicks and keys ----------
  document.addEventListener("click", e => {
    const g = e.target.closest("[data-guest]"); if (g) { openGuest(g.dataset.guest); return; }
    const y = e.target.closest("[data-year]"); if (y) { pickYear = y.dataset.year; book(); return; }
    const l = e.target.closest("[data-lang]"); if (l) { lang = l.dataset.lang; store.set("dp-lang", lang); render(); return; }
    const m = e.target.closest("[data-mc]"); if (m) { showMachine(+m.dataset.mc); return; }
  });
  const tabsEl = $("#mcTabs");
  if (tabsEl) tabsEl.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); showMachine(mcIndex + 1, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); showMachine(mcIndex - 1, true); }
  });

  // ---------- Menu sheet ----------
  const menuBtn = $(".menu-btn"), sheet = $("#sheet");
  function setMenu(open) {
    if (!sheet) return;
    menuBtn.setAttribute("aria-expanded", open);
    document.body.classList.toggle("menu-open", open);
    if (open) { sheet.hidden = false; requestAnimationFrame(() => sheet.classList.add("open")); }
    else { sheet.classList.remove("open"); setTimeout(() => { if (!sheet.classList.contains("open")) sheet.hidden = true; }, reduce ? 0 : 760); }
  }
  if (menuBtn) menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  $$(".sheet a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false); });

  // ---------- Header: hide on scroll down, show on scroll up; active section ----------
  let lastY = scrollY;
  const top = $("#top");
  addEventListener("scroll", () => {
    const y = scrollY;
    if (top && !document.body.classList.contains("menu-open")) top.classList.toggle("hide", y > lastY && y > 120);
    lastY = y;
    requestAnimationFrame(heroFrame);
  }, { passive: true });
  let wasSingle = single();
  addEventListener("resize", () => { heroFrame(); if (single() !== wasSingle) { wasSingle = single(); spread = 0; book3d(); $$(".snap", gbook || document).forEach(s => s.classList.remove("wait")); } });

  if ("IntersectionObserver" in window) {
    const links = $$("#nav a, .sheet-nav a");
    const spy = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(s => spy.observe(s));

    const seen = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.classList.contains("book-wrap") && !dropped) { dropped = true; $$(".snap", gbook).forEach(s => { s.classList.remove("wait"); s.classList.add("drop"); }); }
      $$("[data-count]", en.target).forEach(b => { if (!b.dataset.done) { b.dataset.done = 1; countUp(b); } });
      seen.unobserve(en.target);
    }), { rootMargin: "0px 0px -12% 0px" });
    $$(".reveal").forEach(el => seen.observe(el));
  } else {
    dropped = true;
    $$(".reveal").forEach(el => el.classList.add("in"));
  }

  const pv = $("#navPv");
  if (pv) $$("#nav a[data-pv]").forEach(a => {
    const show = () => {
      pv.querySelector("img").src = a.dataset.pv;
      pv.classList.toggle("cream", a.dataset.pv.endsWith(".png"));
      pv.querySelector("span").textContent = a.textContent;
      const r = a.getBoundingClientRect();
      pv.style.left = (r.left + r.width / 2) + "px";
      pv.classList.add("on");
    };
    a.addEventListener("mouseenter", show); a.addEventListener("focus", show);
    a.addEventListener("mouseleave", () => pv.classList.remove("on")); a.addEventListener("blur", () => pv.classList.remove("on"));
  });

  render(); heroFrame();
})();
