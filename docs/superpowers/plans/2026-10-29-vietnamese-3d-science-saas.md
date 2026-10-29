# VietLab 3D — Vietnamese 3D Interactive Science SaaS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Localize 100% of the 54 interactive 3D science courses (`courses/*.html` and `catalog.json`) into standard Vietnamese (aligned with Chương trình GDPT 2018) and build a complete, professional SaaS static portal (`index.html`, `/c/<slug>/index.html`, `/guide/index.html`, `/how/index.html`, `/about/index.html`, `assets/site.css`, `assets/site.js`, `assets/hero.js`) matching and exceeding `https://lab.tongjiang.app/`.

**Architecture:** Pre-rendered static multi-page SaaS portal generated via a Node.js build script (`scripts/build-portal.mjs`) from localized metadata (`catalog.json`, course step tracks, and GDPT 2018 curriculum tree), combined with an automated 2-layer course localization compiler (`scripts/localize-shell.mjs` + `scripts/apply-course-translations.mjs`) that updates the shared 3D HUD/section shell and course-specific definitions in-place across all 54 standalone `courses/*.html` files.

**Tech Stack:** HTML5, CSS3 (Semantic Design Tokens, 8pt Grid, Anti-Slop UI), Vanilla ES Modules (`site.js`, `hero.js` with Three.js r183), Node.js build & verification scripts (zero external npm dependencies).

**Spec:** `docs/superpowers/specs/2026-10-29-vietnamese-3d-science-saas-design.md`

## Global Constraints

- **100% Vietnamese Localization:** Zero CJK (`[\u4e00-\u9fff]`) characters may remain in `catalog.json`, portal HTML/JS/CSS files, or user-facing strings in any of the 54 `courses/*.html` files.
- **Curriculum Alignment:** All textbook references and chapter filters must follow MOET Vietnam's **Chương trình GDPT 2018** (Lớp 10, Lớp 11, Lớp 12) across Vật lý, Hóa học, Sinh học, and Địa lý.
- **Simulation Integrity:** Never rename state keys (`S.<key>`), slider/switch keys, unit indices, layer keys, or mathematical formulas inside `evaluate`/`tick`. Every `courses/<slug>.html` script must pass JavaScript syntax validation (`new vm.Script`).
- **Anti-Slop SaaS UI:** Light editorial surfaces (`#F8FAFC` / `#FFFFFF`), 1px `#E2E8F0` borders, dark instrument stage (`#090D16`), `'Be Vietnam Pro'` / `'Inter'` + `'JetBrains Mono'` (`tabular-nums`), semantic subject accents (`phys`, `chem`, `bio`, `geo`).
- **Disk Constraint:** All files and build artifacts must be written inside `D:\tongjiang-lab` (accessible via `C:\Users\HOME\tongjiang-lab`).

## Review Focus

- **Unicode Escape CJK Strings in `courses/*.html`:** Many Chinese strings inside `<script type="module">` are encoded as `\uXXXX` escapes rather than literal UTF-8 characters. Verification must decode string literals or scan for both raw CJK and `\u4e00`–`\u9fff` escape sequences in user-facing objects.
- **Vietnamese Diacritic Search & Filtering:** Searching in `#q` on the homepage must match both accented Vietnamese queries (e.g. `"quang điện"`, `"amoniac"`) and unaccented queries (`"quang dien"`).
- **Live Interactive 3D Preview on `/c/<slug>/`:** Clicking "Chạy mô phỏng trực tiếp" on a course detail page must mount `<iframe src="/courses/<slug>.html" allow="fullscreen">` cleanly inside the 16:9 preview frame without breaking layout.
- **HUD Label Wrapping in 3D Courses:** Vietnamese labels are longer than Chinese; CSS in `Lp` and `r0` must use Vietnamese-capable font stacks and prevent clipping in `.chip`, `.lab`, `.slh .lb`, and `.sw .nm`.
- **Relative & Root Path Compatibility:** Links and assets must work when served from a local static HTTP server at root (`http://localhost:8080/`).

---

### Task 1: Shared 3D Engine Shell Localization & Extraction Tooling

**Files:**
- Create: `scripts/extract-courses.mjs`
- Create: `scripts/localize-shell.mjs`
- Test: `scripts/test-shell.mjs`

**Interfaces:**
- Produces: `data/courses-extracted.json` (array of 54 course metadata + tail string dictionaries) and `scripts/localize-shell.mjs` exporting `localizeSharedShell(htmlString) -> string`.

- [ ] **Step 1: Write `scripts/test-shell.mjs` to verify shared shell localization**
- [ ] **Step 2: Implement `scripts/localize-shell.mjs` translating `Ip`, `Lp`, `s0`, `o0`, `l0`, `p_` and updating font stacks**
- [ ] **Step 3: Implement `scripts/extract-courses.mjs` to extract all translatable strings from the 54 course tails**
- [ ] **Step 4: Run `node D:/tongjiang-lab/scripts/test-shell.mjs` and `node D:/tongjiang-lab/scripts/extract-courses.mjs`**

---

### Task 2: Complete Vietnamese Localization of `catalog.json` & All 54 `courses/*.html`

**Files:**
- Modify: `catalog.json`
- Modify: `courses/*.html` (all 54 files)
- Create: `scripts/apply-course-translations.mjs`
- Create: `data/translations/*.json` (batched by subject: `phys.json`, `chem1.json`, `chem2.json`, `bio.json`, `geo.json`)

**Interfaces:**
- Consumes: `data/courses-extracted.json`, `localizeSharedShell(htmlString)`
- Produces: Fully localized `catalog.json` and 54 `courses/*.html` files with zero CJK characters and 100% valid JS syntax.

- [ ] **Step 1: Extract string tables per subject batch (`phys`, `chem1`, `chem2`, `bio`, `geo`)**
- [ ] **Step 2: Translate all course string tables and `catalog.json` into standard Vietnamese (GDPT 2018)**
- [ ] **Step 3: Apply shared shell localization + course string translations to all 54 `courses/*.html` files via `scripts/apply-course-translations.mjs`**
- [ ] **Step 4: Verify JS syntax and zero CJK residue across all 54 `courses/*.html` files**

---

### Task 3: Precision Scientific SaaS Portal (`index.html`, `/c/<slug>/`, `/guide/`, `/how/`, `/about/`, `assets/`)

**Files:**
- Create: `assets/hero.js`
- Create: `assets/site.css`
- Create: `assets/site.js`
- Create: `scripts/build-portal.mjs`
- Create: `index.html`, `guide/index.html`, `how/index.html`, `about/index.html`, `c/<slug>/index.html` (54 course detail pages)
- Modify: `README.md`

**Interfaces:**
- Consumes: Localized `catalog.json` and step metadata from localized `courses/*.html`
- Produces: Complete static website ready to serve at `/`

- [ ] **Step 1: Copy `_ref_hero.js` to `assets/hero.js` and build `assets/site.css` (SaaS design system, responsive layout, live iframe stage styles) & `assets/site.js` (accent-insensitive search, subject/grade/chapter filter, live 3D preview toggle, copy/share)**
- [ ] **Step 2: Implement `scripts/build-portal.mjs` to generate `index.html`, all 54 `c/<slug>/index.html` pages, `guide/index.html`, `how/index.html`, `about/index.html`, and `README.md`**
- [ ] **Step 3: Run `node D:/tongjiang-lab/scripts/build-portal.mjs` and verify generated pages**

---

### Task 4: End-to-End QA Audit & Verification (`scripts/verify-all.mjs`)

**Files:**
- Create: `scripts/verify-all.mjs`

- [ ] **Step 1: Implement `scripts/verify-all.mjs` checking: (a) 0 CJK characters in `catalog.json`, portal HTMLs, and course UI strings; (b) `vm.Script` syntax check on all 54 `courses/*.html` scripts; (c) all 54 `/c/<slug>/index.html` and `covers/<slug>.webp` exist**
- [ ] **Step 2: Remove temporary `_ref_*` files from `D:\tongjiang-lab` and run `node D:/tongjiang-lab/scripts/verify-all.mjs`**
