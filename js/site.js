(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  let lang = store.get("dp-lang") === "en" ? "en" : "th";
  const t = k => (I18N[lang] && I18N[lang][k]) ?? I18N.th[k] ?? "";
  const guests = (window.GUESTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));

  const MONTHS = {
    th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  const month = d => { const [y, m] = d.split("-").map(Number); return lang === "th" ? `${MONTHS.th[m - 1]} ${y + 543}` : `${MONTHS.en[m - 1]} ${y}`; };
  const baht = n => n.toLocaleString("en-US");
  const name = g => (lang === "th" ? g.name_th : g.name_en) || g.name_en || t("guest");
  const spark = '<svg class="spark" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4z"/></svg>';

  function guestCard(g) {
    return `<article class="card">${spark}<img src="${g.photo}" alt="${name(g)}" width="400" height="500" loading="lazy" style="object-position:${g.focus || "50% 50%"}"><div class="n">${name(g)}</div><div class="d">${month(g.date)}</div></article>`;
  }

  function priceItem(x) {
    const label = lang === "th" ? x.th : x.en;
    const detail = lang === "th" ? x.detail_th : x.detail_en;
    const unit = lang === "th" ? x.unit_th : x.unit_en;
    const was = x.was ? `<del>฿${baht(x.was)}</del>` : "";
    return `<li class="${x.was ? "star" : ""}"><span class="t">${label}</span>${detail ? `<span class="s">${detail}</span>` : ""}<span class="p">${was}฿${baht(x.price)}${unit ? `<small>${unit}</small>` : ""}</span></li>`;
  }

  function machines() {
    const box = $("#machineList"); if (!box) return;
    box.innerHTML = (window.MACHINES || []).map(m => `
      <article class="mcard">
        ${m.photo ? `<img src="${m.photo}" alt="${m.name}" loading="lazy">` : `<div class="mname" aria-hidden="true">${m.name}</div>`}
        <h3>${m.name}</h3>
        <p class="muse">${lang === "th" ? m.use_th : m.use_en}</p>
        <dl class="plate"><dt>${t("mc.maker")}</dt><dd>${m.maker}</dd><dt>${t("mc.serial")}</dt><dd>${m.serial}</dd></dl>
      </article>`).join("");
  }

  function hours() {
    const tbl = $("#hours"); if (!tbl) return;
    const to = lang === "th" ? "ถึง" : "to";
    const span = (a, b) => `${a} ${to} ${b}`;
    const open = { 2: span("10:00", "19:00"), 3: span("10:00", "19:00"), 4: span("10:00", "19:00"), 5: span("10:00", "19:00"), 6: span("09:00", "13:00") };
    const today = new Date().getDay();
    tbl.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<tr class="${open[d] ? "" : "closed"} ${d === today ? "today" : ""}"><td>${t("days")[d]}</td><td>${open[d] || t("closed")}</td></tr>`).join("");
  }

  function render() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    const strip = $("#guestStrip"); if (strip) strip.innerHTML = guests.slice(0, 10).map(guestCard).join("");
    const count = $("#guestCount"); if (count) count.textContent = guests.length;
    const T = window.TREATMENTS || {};
    if ($("#skinList")) $("#skinList").innerHTML = (T.skin || []).map(priceItem).join("");
    if ($("#dentalList")) $("#dentalList").innerHTML = (T.dental || []).map(priceItem).join("");
    if ($("#brideList")) $("#brideList").innerHTML = (T.bridal || []).map(priceItem).join("");
    machines(); hours(); book(); slides();
  }

  // Guest book page
  let year = "all";
  function book() {
    const box = $("#book"); if (!box) return;
    const years = [...new Set(guests.map(g => g.date.slice(0, 4)))];
    $("#years").innerHTML = [["all", t("guests.all")], ...years.map(y => [y, lang === "th" ? String(+y + 543) : y])]
      .map(([v, l]) => `<button data-year="${v}" aria-pressed="${v === year}">${l}</button>`).join("");
    box.innerHTML = guests.filter(g => year === "all" || g.date.startsWith(year)).map(guestCard).join("");
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-year]"); if (b) { year = b.dataset.year; book(); }
    const l = e.target.closest("[data-lang]"); if (l) { lang = l.dataset.lang; store.set("dp-lang", lang); render(); }
  });

  // Hero gap slideshow from the guest book
  let slideTimer;
  function slides() {
    const gap = $("#gap"); if (!gap) return;
    $$(".slide", gap).forEach(s => s.remove());
    const list = [...guests.filter(g => g.name_en), ...guests.filter(g => !g.name_en)].slice(0, 8);
    list.forEach((g, i) => {
      const d = document.createElement("div");
      d.className = "slide" + (i === 0 ? " on" : ""); d.dataset.i = i;
      const im = document.createElement("img"); im.src = g.photo; im.alt = ""; if (i) im.loading = "lazy";
      d.appendChild(im); gap.prepend(d);
    });
    const cap = $("#gapCaption");
    let i = 0;
    const show = () => { $$(".slide", gap).forEach(s => s.classList.toggle("on", +s.dataset.i === i)); if (cap && list[i]) cap.innerHTML = `<strong>${name(list[i])}</strong>${month(list[i].date)}`; };
    show(); clearInterval(slideTimer);
    if (list.length > 1) slideTimer = setInterval(() => { i = (i + 1) % list.length; show(); }, 3200);
  }

  // Split-word hero driven by scroll
  const hero = $(".hero");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function heroFrame() {
    if (!hero || reduce) return;
    const r = hero.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    const open = Math.min(1, p / 0.45);
    const ease = 1 - Math.pow(1 - open, 3);
    const shift = ease * innerHeight * 0.38;
    $(".w1").style.transform = `translateY(${-shift}px)`;
    $(".w2").style.transform = `translateY(${shift}px)`;
    const inset = 50 - ease * 34;
    $("#gap").style.clipPath = `inset(${inset}% 0 ${inset}% 0)`;
    $$(".panel").forEach((el, k) => el.classList.toggle("in", p > 0.4 + k * 0.12));
    const sub = $(".hero-sub"); if (sub) sub.style.opacity = String(Math.max(0, 1 - p * 6));
  }

  // Header hides on scroll down and returns on scroll up
  let lastY = scrollY;
  const top = $("#top");
  addEventListener("scroll", () => {
    const y = scrollY;
    if (top) top.classList.toggle("hide", y > lastY && y > 120);
    lastY = y;
    requestAnimationFrame(heroFrame);
  }, { passive: true });
  addEventListener("resize", heroFrame);

  const menu = $(".menu-btn");
  if (menu) menu.addEventListener("click", () => { const nav = $("#nav"); const o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", o); });
  $$("#nav a").forEach(a => a.addEventListener("click", () => { $("#nav").classList.remove("open"); menu && menu.setAttribute("aria-expanded", false); }));

  render(); heroFrame();
})();
