function normVN(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

const stageEl = document.getElementById("stage");
if (stageEl) {
  const bIn = document.getElementById("hb");
  const vIn = document.getElementById("hv");
  const bVal = document.getElementById("hb-val");
  const vVal = document.getElementById("hv-val");
  const rOut = document.getElementById("h-read");
  const qBtns = document.querySelectorAll("[data-hq]");

  import("./hero.js")
    .then((m) => {
      const api = m.mountHero(stageEl, {
        B: 1,
        v: 1,
        q: 1,
        onReadout(a) {
          if (bVal) bVal.textContent = a.B.toFixed(2) + " T";
          if (vVal) vVal.textContent = a.v.toFixed(2) + " v₀";
          if (rOut) {
            rOut.textContent =
              "r = " +
              a.r.toFixed(2) +
              " m · T = " +
              a.T.toFixed(2) +
              " ns" +
              (a.out ? " · Vượt ngoài bàn" : "");
          }
        },
      });
      bIn?.addEventListener("input", () => api.setB(parseFloat(bIn.value)));
      vIn?.addEventListener("input", () => api.setV(parseFloat(vIn.value)));
      qBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
          qBtns.forEach((x) => x.classList.remove("on"));
          btn.classList.add("on");
          api.setQ(parseInt(btn.dataset.hq, 10));
        })
      );
    })
    .catch(() => {});
}

const libEl = document.getElementById("lib");
if (libEl) {
  const cards = Array.from(libEl.querySelectorAll(".cc"));
  const pills = Array.from(document.querySelectorAll("#fs [data-s]"));
  const qIn = document.getElementById("q");
  const secBar = document.getElementById("fb");
  const bookSel = document.getElementById("sb");
  const chSel = document.getElementById("sc");
  const countEl = document.getElementById("fcount");
  const emptyEl = document.getElementById("empty");
  const metaJson = document.getElementById("books");
  const books = metaJson ? JSON.parse(metaJson.textContent) : {};

  // Precompute normalized search text for instant Vietnamese diacritic-insensitive matching
  cards.forEach((c) => {
    c.dataset.tnorm = normVN(c.dataset.t || "");
  });

  const state = { s: "all", b: "", c: "", q: "" };

  function fillBooks() {
    if (!secBar || !bookSel || !chSel) return;
    const list = state.s === "all" ? [] : books[state.s] || [];
    if (!list.length) {
      secBar.hidden = true;
      return;
    }
    secBar.hidden = false;
    bookSel.innerHTML =
      '<option value="">Mọi khối lớp / học phần</option>' +
      list.map((b) => `<option value="${b.k}">${b.name}</option>`).join("");
    bookSel.value = state.b;
    fillChapters();
  }

  function fillChapters() {
    if (!chSel) return;
    const list = state.s === "all" ? [] : books[state.s] || [];
    const found = list.find((b) => b.k === state.b);
    const chs = found
      ? found.ch
      : list.flatMap((b) => b.ch).filter((v, i, a) => a.findIndex((x) => x.k === v.k) === i);
    chSel.innerHTML =
      '<option value="">Mọi chương / chuyên đề</option>' +
      chs.map((c) => `<option value="${c.k}">${c.name}</option>`).join("");
    chSel.value = state.c;
  }

  function apply() {
    const qRaw = state.q.trim().toLowerCase();
    const qNorm = normVN(qRaw);
    let shown = 0;

    for (const c of cards) {
      const bTokens = (c.dataset.b || "").split("|");
      const cTokens = (c.dataset.c || "").split("|");
      const okS = state.s === "all" || c.dataset.s === state.s;
      const okB = !state.b || bTokens.includes(state.b);
      const okC = !state.c || cTokens.includes(state.c);
      const okQ =
        !qNorm ||
        (c.dataset.t || "").includes(qRaw) ||
        (c.dataset.tnorm || "").includes(qNorm);
      const v = okS && okB && okC && okQ;
      c.hidden = !v;
      if (v) shown++;
    }
    if (countEl) countEl.textContent = String(shown);
    if (emptyEl) emptyEl.hidden = shown > 0;
  }

  function setSubject(s, scroll) {
    state.s = s;
    state.b = "";
    state.c = "";
    pills.forEach((p) => p.classList.toggle("on", p.dataset.s === s));
    fillBooks();
    apply();
    if (scroll) {
      document.getElementById("courses")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  pills.forEach((p) => p.addEventListener("click", () => setSubject(p.dataset.s, false)));
  document.querySelectorAll("[data-jump-s]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      setSubject(el.dataset.jumpS, true);
    });
  });

  bookSel?.addEventListener("change", () => {
    state.b = bookSel.value;
    state.c = "";
    fillChapters();
    apply();
  });
  chSel?.addEventListener("change", () => {
    state.c = chSel.value;
    apply();
  });
  qIn?.addEventListener("input", () => {
    state.q = qIn.value;
    apply();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== qIn && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      qIn?.focus();
    }
  });

  const urlS = new URLSearchParams(location.search).get("s");
  if (urlS && ["phys", "chem", "bio", "geo"].includes(urlS)) {
    setSubject(urlS, false);
  }
}

// Live interactive 3D preview toggle on course detail pages
const pvStage = document.getElementById("pv-stage");
if (pvStage) {
  const courseSrc = pvStage.dataset.src;
  const coverHTML = pvStage.innerHTML;
  const modeBtns = document.querySelectorAll("[data-pv-mode]");

  function setPreviewMode(mode) {
    modeBtns.forEach((b) => b.classList.toggle("on", b.dataset.pvMode === mode));
    if (mode === "live" && courseSrc) {
      pvStage.innerHTML = `<iframe class="pv-iframe" src="${courseSrc}" title="Mô phỏng 3D tương tác trực tiếp" loading="lazy" allowfullscreen></iframe>`;
    } else {
      pvStage.innerHTML = coverHTML;
      const inlineBtn = pvStage.querySelector("[data-pv-start]");
      inlineBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        setPreviewMode("live");
      });
    }
  }

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => setPreviewMode(btn.dataset.pvMode));
  });

  const initBtn = pvStage.querySelector("[data-pv-start]");
  initBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    setPreviewMode("live");
  });
}

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const t = btn.getAttribute("data-copy") || "";
    navigator.clipboard?.writeText(t).then(() => {
      const old = btn.textContent;
      btn.textContent = "Đã sao chép";
      setTimeout(() => {
        btn.textContent = old;
      }, 1500);
    });
  });
});
