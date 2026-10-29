import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = 'D:/tongjiang-lab';
const SITE_URL = 'https://vietlab.9cloudmedia.com';
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8'));

const SUBJECT_NAMES = {
  phys: 'Vật lý THPT',
  chem: 'Hóa học THPT',
  bio: 'Sinh học THPT',
  geo: 'Địa lý THPT',
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cleanVietnamesePunctuation(jsText) {
  return jsText
    .replace(/「/g, '«')
    .replace(/」/g, '»')
    .replace(/『/g, '‹')
    .replace(/』/g, '›')
    .replace(/【/g, '[')
    .replace(/】/g, ']')
    .replace(/\s*——\s*/g, ' — ')
    .replace(/\s*\\u2014\\u2014\s*/g, ' — ')
    .replace(/～/g, '–')
    .replace(/、/g, ', ')
    .replace(/\\u3001/g, ', ')
    .replace(/\\uFF1A/g, ': ')
    .replace(/\\uFF08/g, ' (')
    .replace(/\\uFF09/g, ')')
    .replace(/：/g, ': ')
    .replace(/；/g, '; ')
    .replace(/([0-9A-Za-z\u00C0-\u1EF9→=])«/g, '$1 «')
    .replace(/»([0-9A-Za-z\u00C0-\u1EF9→=])/g, '» $1')
    .replace(/»→/g, '» → ')
    .replace(/③ Dòng khí làm nguội nhanh \(quench\)/g, '③ Làm nguội nhanh');
}

function upgradeCanvasAndLayoutInJs(jsText) {
  let out = cleanVietnamesePunctuation(jsText);

  // 1. Replace CJK font families in Canvas 2D contexts with Be Vietnam Pro
  out = out
    .replace(
      /"PingFang SC"\s*,\s*"Microsoft YaHei"\s*,\s*"Noto Sans CJK SC"\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    )
    .replace(
      /"PingFang SC"\s*,\s*"Heiti SC"\s*,\s*"Microsoft YaHei"\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    )
    .replace(
      /"PingFang SC"\s*,\s*"Hiragino Sans GB"\s*,\s*"SF Pro Display"\s*,\s*system-ui\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    )
    .replace(
      /"PingFang SC"\s*,\s*"Hiragino Sans GB"\s*,\s*"Microsoft YaHei"\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    )
    .replace(
      /"PingFang SC"\s*,\s*"Hiragino Sans GB"\s*,\s*system-ui\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    )
    .replace(
      /"PingFang SC"\s*,\s*"Helvetica Neue"\s*,\s*Arial\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    )
    .replace(
      /"PingFang SC"\s*,\s*"Microsoft YaHei"\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    )
    .replace(
      /"PingFang SC"\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    )
    .replace(
      /"SF Pro Display"\s*,\s*"DIN Alternate"\s*,\s*"Helvetica Neue"\s*,\s*system-ui\s*,\s*sans-serif/g,
      '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif'
    );

  // 2. Upgrade 3D nameplate generator Zp(i, t) with dynamic font sizing & maxWidth=448
  out = out.replace(
    /let ([a-zA-Z_$][\w$]*)=([a-zA-Z_$][\w$]*)\.length>(?:5\?54:64|22\?30:[^;]+);([a-zA-Z_$][\w$]*)\.font=`bold \$\{\1\}px [^`]+`,\3\.fillText\(\2,512\/2,176\/2-12(?:,448)?\),\3\.font='600 2[24]px [^']+',\3\.fillStyle="#4a5866",\3\.fillText\(([a-zA-Z_$][\w$]*),512\/2,134(?:,448)?\)/g,
    'let $1=$2.length>22?30:$2.length>16?36:$2.length>11?42:$2.length>6?48:56;$3.font=`bold ${$1}px "Be Vietnam Pro","Segoe UI",system-ui,sans-serif`,$3.fillText($2,512/2,176/2-12,448),$3.font=\'600 22px "Be Vietnam Pro","Segoe UI",system-ui,sans-serif\',$3.fillStyle="#4a5866",$3.fillText($4,512/2,134,448)'
  );

  // 3. Upgrade SVG schematic cross-section sheet margins (P=118,N=118 -> P=150,N=150) so Vietnamese labels fit inside viewBox
  out = out.replace(/let P=118,N=118,W=26,O=26/g, 'let P=150,N=150,W=26,O=26');

  return out;
}

export function extractCourseConfigFromJs(jsText) {
  const idx = jsText.indexOf('{meta:{slug:"');
  if (idx === -1) return null;
  let depth = 0;
  let inStr = false;
  let strCh = '';
  let endIdx = -1;
  for (let i = idx; i < jsText.length; i++) {
    const ch = jsText[i];
    if (inStr) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === strCh) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = true;
      strCh = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  if (endIdx === -1) return null;
  const objSrc = jsText.slice(idx, endIdx);
  const sandbox = new Proxy(
    {},
    {
      has: () => true,
      get: (_, k) => (k in globalThis ? globalThis[k] : () => {}),
    }
  );
  return vm.runInNewContext(`(${objSrc})`, sandbox);
}

const UI_OPT_CSS = `<style id="vietlab-ui-opt">
html:root {
  --font: "Be Vietnam Pro", "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  --num: "JetBrains Mono", "SF Mono", "Cascadia Mono", "Consolas", ui-monospace, monospace;
  --panelw-l: clamp(300px, 21vw, 376px);
  --panelw-r: clamp(292px, 20vw, 340px);
}
.vl-sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
  pointer-events: none !important;
}
html body #top { padding: 4px 10px; gap: 3px; }
html body #top .row1 { gap: 7px; }
html body #top .home { padding: 4px 7px; font-size: 11.5px; }
html body #top .brand { gap: 6px; flex: 0 1 auto; min-width: 0; }
html body #top .brand h1 {
  font-size: clamp(14px, 1.15vw, 17.5px);
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 26vw;
}
html body #top .brand .eq { font-size: 12px; padding: 2px 7px; max-width: 17vw; }
html body #top .mq { flex: 1 1 160px; min-width: 90px; gap: 5px; }
html body #top .mq .k { font-size: 11px; padding: 2px 7px; }
html body #top .mq b { font-size: 12.5px; min-width: 0; }
html body #top .spacer { flex: 0 0 2px; }
html body #top .hud { gap: 4px; }
html body #top .hud .btn { padding: 4px 7px; font-size: 11.5px; gap: 4px; }
html body #top .stat { padding: 4px 8px; font-size: 11.5px; }
html body #top .score { font-size: 11.5px; }
html body #top .chain5 .ct { font-size: 11px; margin-right: 4px; }
html body #top .chain5 .cd {
  flex: 1 1 0;
  padding: 2px 7px;
  gap: 4px;
  transition: flex .2s ease, box-shadow .2s ease;
}
html body #top .chain5 .cd.on { flex: 1.45 1 0; }
html body #top .chain5 .cd:hover { flex: 2.1 1 0; z-index: 4; }
html body #top .chain5 .cd b { font-size: 11.5px; }
html body #top .chain5 .cd span { font-size: 11px; }
html body #top .chain5 .ar { width: 18px; }
html body #top .chain5 .ar i { width: 14px; height: 14px; font-size: 10px; }
html body #steps { padding: 0 8px; }
html body #steps .sb { font-size: 11px; margin-right: 4px; }
html body #steps .chip { gap: 5px; }
html body #steps .chip .nm { font-size: 12px; letter-spacing: -0.01em; }
html body .phead { padding: 5px 8px; gap: 6px; }
html body .phead h2 { font-size: 12px; letter-spacing: 0; padding: 2px 7px; }
html body .phead .sub { font-size: 11px; }
html body .pane { overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; }
html body #left .cardhead .cq { font-size: 14.5px; line-height: 1.42; font-weight: 700; text-wrap: balance; }
html body #left .atxt { font-size: 12.5px; line-height: 1.48; }
html body #left .ctxt { font-size: 12.4px; line-height: 1.5; }
html body #left .pts li { font-size: 12px; line-height: 1.48; margin-bottom: 3px; }
html body #left .whybox span { font-size: 11.6px; line-height: 1.46; }
html body #left .crumb { gap: 3px; }
html body #left .crumb .ci { font-size: 11px; padding: 1px 5px; }
html body #right .kpi .lb { font-size: 11.5px; }
html body #right .kpi .vv { font-size: clamp(24px, 2.1vw, 30px); font-variant-numeric: tabular-nums; }
html body #right .kpi .cal { white-space: normal; line-height: 1.25; font-size: 11px; }
html body #right .subs { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; align-items: stretch; }
html body #right .sub { padding: 4px 6px 6px; display: flex; flex-direction: column; justify-content: space-between; }
html body #right .sub .lb {
  font-size: 10.5px;
  line-height: 1.2;
  padding-left: 5px;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4em;
}
html body #right .sub b { font-size: clamp(14.5px, 1.25vw, 17.5px); padding-left: 5px; margin: 2px 0; font-variant-numeric: tabular-nums; }
html body #right .sub .cal {
  font-size: 10px;
  line-height: 1.15;
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
html body #right .slh .lb {
  font-size: 11.5px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
html body #right .slh b { font-size: 17px; flex: 0 0 auto; }
html body #right .slx { flex-wrap: wrap; gap: 1px 6px; }
html body #right .slx .cal { font-size: 10.5px; line-height: 1.2; }
html body #right .sw { padding: 4px 7px; gap: 5px; }
html body #right .sw .nm { font-size: 11.5px; line-height: 1.25; min-width: 0; }
html body #right .sw .st { font-size: 11px; flex: 0 0 auto; }
html body #right .goal { padding: 3px 7px; font-size: 11.5px; min-height: 24px; }
html body .lab { padding: 2px 8px 2px 6px; gap: 5px; }
html body .lab .n { font-size: 11.5px; letter-spacing: -0.01em; }
html body .anno {
  max-width: min(240px, 28vw);
  white-space: normal;
  line-height: 1.25;
  font-size: 11.5px;
  border-radius: 12px;
  padding: 4px 8px 4px 5px;
  text-align: left;
}
html body #eqb { max-width: min(360px, 36vw); padding: 5px 9px 6px; }
html body #eqb .bk { font-size: 10px; letter-spacing: .05em; }
html body #eqb .beq { font-size: 13.5px; line-height: 1.26; }
html body #eqb .bcal { font-size: 11px; line-height: 1.25; }
html body #eqb .bt { font-size: 11px; padding: 1px 6px; }
html body #eqb.tight { max-width: min(300px, 32vw); padding: 4px 8px 5px; }
html body #eqb.tight .beq { font-size: 12.5px; line-height: 1.22; }
html body #secview .sechd { flex-wrap: wrap; row-gap: 4px; column-gap: 6px; }
html body #secview .sechd b { font-size: 12px; }
html body #secview .subchips { flex-wrap: wrap; max-width: 100%; }
html body #secview .sbtn { padding: 2px 8px; font-size: 11px; }
html body #secview .snote { font-size: 11px; flex: 1 1 180px; }
html body #secview .sec-togs { top: 6px; left: 8px; flex-wrap: wrap; max-width: calc(100% - 16px); }
html body .sec .sec-apartbar { top: auto; bottom: 8px; right: 8px; }
html body .sec[data-layout="wide"] { grid-template-columns: 1fr 330px; }
html body .sec[data-layout="wide"] .sec-k { width: 126px; flex: none; line-height: 1.2; }
@media (max-width: 1400px) {
  html:root {
    --panelw-l: clamp(276px, 20.5vw, 326px);
    --panelw-r: clamp(268px, 19.5vw, 308px);
  }
  html body #top .hud .btn kbd,
  html body #foot .foot2 .keys { display: none; }
  html body #top .chain5 .cd span { max-width: 130px; }
}
@media (max-width: 1120px) {
  html:root {
    --panelw-l: 256px;
    --panelw-r: 252px;
    --top-h: 44px;
    --steps-h: 38px;
    --foot-h: 44px;
  }
  html body #top .chain5 { display: none; }
  html body #steps .sb { display: none; }
}
@media (max-width: 780px) {
  html:root {
    --panelw-l: min(300px, calc(100vw - 44px));
    --panelw-r: min(290px, calc(100vw - 44px));
  }
  html body #top .brand .eq,
  html body #top .mq .k,
  html body #foot .foot2 { display: none; }
  html body #secview { left: 10px; right: 10px; }
}
</style>`;

const CANVAS_GUARD_JS = `<script id="vietlab-canvas-guard">
(function(){
  if (typeof CanvasRenderingContext2D !== "undefined") {
    var origFill = CanvasRenderingContext2D.prototype.fillText;
    var origStroke = CanvasRenderingContext2D.prototype.strokeText;
    function fitCall(origFn, ctx, text, x, y, maxW) {
      var str = String(text == null ? "" : text);
      if (!str || (maxW === undefined && str.length <= 6)) {
        return maxW !== undefined ? origFn.call(ctx, text, x, y, maxW) : origFn.call(ctx, text, x, y);
      }
      var limit = maxW;
      if (limit === undefined && ctx.canvas && ctx.canvas.width > 0) {
        var tr = ctx.getTransform ? ctx.getTransform() : { a: 1, b: 0, c: 0, e: 0 };
        if (Math.abs(tr.b) < 1e-4 && Math.abs(tr.c) < 1e-4 && tr.a > 0) {
          var cw = ctx.canvas.width / tr.a;
          var lx = x + (tr.e || 0) / tr.a;
          var pad = cw >= 400 ? Math.round(cw * 0.055) : 6;
          var align = ctx.textAlign || "start";
          if (align === "center") {
            limit = Math.min(lx - pad, cw - pad - lx) * 2;
          } else if (align === "right" || align === "end") {
            limit = lx - pad;
          } else {
            limit = cw - pad - lx;
          }
        }
      }
      if (limit !== undefined && limit > 32) {
        var m = ctx.measureText(str).width;
        if (m > limit) {
          var savedFont = ctx.font;
          var ratio = Math.max(0.56, limit / m);
          var updated = savedFont.replace(/(\\d+(?:\\.\\d+)?)px/, function(_, n) {
            return Math.max(9, +(parseFloat(n) * ratio).toFixed(1)) + "px";
          });
          if (updated !== savedFont) {
            ctx.font = updated;
            try {
              return origFn.call(ctx, text, x, y, limit);
            } finally {
              ctx.font = savedFont;
            }
          }
          return origFn.call(ctx, text, x, y, limit);
        }
      }
      return maxW !== undefined ? origFn.call(ctx, text, x, y, maxW) : origFn.call(ctx, text, x, y);
    }
    CanvasRenderingContext2D.prototype.fillText = function(t, x, y, w) { return fitCall(origFill, this, t, x, y, w); };
    CanvasRenderingContext2D.prototype.strokeText = function(t, x, y, w) { return fitCall(origStroke, this, t, x, y, w); };
  }
  function enhanceVietLabUI() {
    document.querySelectorAll("#top .chain5 .cd, #right .sub, #right .slh .lb, #right .sw .nm, #top .brand h1").forEach(function(el) {
      if (!el.getAttribute("title") && el.textContent) {
        el.setAttribute("title", el.textContent.trim().replace(/\\s+/g, " "));
      }
    });
    if (window.__lab && window.__lab.hud && typeof window.__lab.hud.layoutTrack === "function") {
      window.__lab.hud.layoutTrack();
    }
    if (!window.__STEP_TEST && !navigator.webdriver && window.innerWidth <= 900 && window.__lab && window.__lab.hud) {
      window.__lab.hud.fold("R", true);
      if (window.innerWidth <= 640) window.__lab.hud.fold("L", true);
    }
  }
  window.addEventListener("DOMContentLoaded", function() {
    setTimeout(enhanceVietLabUI, 60);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function() {
        enhanceVietLabUI();
        window.dispatchEvent(new Event("resize"));
      });
    }
  });
})();
</script>`;

function buildCourseSeoHeadAndAeoBody(catEntry, cfg) {
  const slug = catEntry.slug;
  const title = cfg?.meta?.title || catEntry.title;
  const sName = SUBJECT_NAMES[catEntry.subject] || cfg?.meta?.subject || 'Khoa học Tự nhiên THPT';
  const locate = cfg?.meta?.locate || (Array.isArray(catEntry.textbook) ? catEntry.textbook.join(' · ') : String(catEntry.textbook || ''));
  const mainQ = cfg?.mainline?.q || catEntry.question || '';
  const totalEq = cfg?.top?.total || '';
  const steps = cfg?.steps || [];
  const units = cfg?.units || [];
  const quizList = cfg?.quiz?.list || [];

  const fullTitle = `${title} — Mô phỏng 3D Tương tác (${sName} · GDPT 2018) | VietLab 3D`;
  const desc = `${mainQ}${totalEq ? ` Phương trình / Nguyên lý: ${totalEq}.` : ''} Bài giảng mô phỏng 3D tương tác gồm ${steps.length} bước khám phá theo ${locate}.`;
  const keywords = [
    title,
    `mô phỏng 3D ${title}`,
    sName,
    'GDPT 2018',
    'VietLab 3D',
    ...steps.map((s) => s.tag).filter(Boolean),
    ...units.map((u) => u.name).filter(Boolean),
  ].join(', ');

  const courseUrl = `${SITE_URL}/courses/${slug}.html`;
  const detailUrl = `${SITE_URL}/c/${slug}/`;
  const coverUrl = `${SITE_URL}/covers/${slug}.webp`;

  const faqEntities = [];
  for (const st of steps) {
    if (st.q && st.concl) {
      faqEntities.push({
        '@type': 'Question',
        name: st.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${st.concl}${st.eq ? ` (Phương trình / Nguyên lý: ${st.eq})` : ''}${st.exam ? ` Lưu ý trọng tâm: ${st.exam}` : ''}`,
        },
      });
    }
  }
  for (const qz of quizList.slice(0, 4)) {
    if (qz.q && Array.isArray(qz.opts) && qz.opts[qz.ans] != null) {
      faqEntities.push({
        '@type': 'Question',
        name: qz.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Đáp án đúng: ${qz.opts[qz.ans]}. Giải thích: ${qz.why || ''}`,
        },
      });
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LearningResource', 'WebApplication'],
        '@id': courseUrl,
        name: title,
        headline: fullTitle,
        description: desc,
        url: courseUrl,
        mainEntityOfPage: detailUrl,
        image: coverUrl,
        inLanguage: 'vi',
        isAccessibleForFree: true,
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any (WebGL2 Browser)',
        learningResourceType: ['Interactive Simulation', '3D Virtual Lab', 'Inquiry-Based Lesson'],
        educationalLevel: 'THPT (Lớp 10, 11, 12)',
        teaches: [mainQ, ...steps.map((s) => s.concl).filter(Boolean)],
        educationalAlignment: {
          '@type': 'AlignmentObject',
          alignmentType: 'educationalSubject',
          educationalFramework: 'Chương trình Giáo dục Phổ thông 2018 (Bộ GD&ĐT Việt Nam)',
          targetName: locate,
        },
        author: {
          '@type': 'Organization',
          name: 'VietLab 3D',
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'VietLab 3D', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: sName, item: `${SITE_URL}/?s=${catEntry.subject}#courses` },
          { '@type': 'ListItem', position: 3, name: title, item: detailUrl },
          { '@type': 'ListItem', position: 4, name: 'Mô phỏng 3D Toàn màn hình', item: courseUrl },
        ],
      },
      ...(faqEntities.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${courseUrl}#faq`,
              mainEntity: faqEntities,
            },
          ]
        : []),
    ],
  };

  const headHtml = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(keywords)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${courseUrl}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="VietLab 3D — Học liệu Khoa học 3D GDPT 2018">
<meta property="og:locale" content="vi_VN">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${courseUrl}">
<meta property="og:image" content="${coverUrl}">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="800">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${coverUrl}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
${UI_OPT_CSS}
${CANVAS_GUARD_JS}`;

  const stepsSummaryHtml = steps
    .map(
      (st, idx) =>
        `<li><strong>Bước ${idx + 1} (${esc(st.tag)}): ${esc(st.q)}</strong> — <em>Kết luận:</em> ${esc(st.concl || '')}${st.eq ? ` | <code>${esc(st.eq)}</code>` : ''}</li>`
    )
    .join('\n      ');

  const aeoArticleHtml = `<article id="vietlab-aeo-kb" class="vl-sr-only" aria-label="Tóm tắt kiến thức khoa học và câu hỏi trọng tâm">
  <h1>${esc(title)} — Mô phỏng 3D Tương tác (${esc(sName)})</h1>
  <p><strong>Câu hỏi trọng tâm:</strong> ${esc(mainQ)}</p>
  ${totalEq ? `<p><strong>Phương trình / Nguyên lý cốt lõi:</strong> <code>${esc(totalEq)}</code></p>` : ''}
  <p><strong>Đối chiếu Chương trình GDPT 2018:</strong> ${esc(locate)}</p>
  <h2>Chuỗi bước khám phá và kết luận khoa học (${steps.length} bước)</h2>
  <ol>
      ${stepsSummaryHtml}
  </ol>
  <p><a href="/c/${slug}/">Xem trang chi tiết bài giảng, hướng dẫn lớp học và câu hỏi ôn tập ${esc(title)}</a> · <a href="/">Trang chủ VietLab 3D</a></p>
</article>`;

  return { headHtml, aeoArticleHtml };
}

let updatedCount = 0;
const allExtractedConfigs = {};

for (const catEntry of catalog) {
  const filePath = path.join(ROOT, 'courses', `${catEntry.slug}.html`);
  const rawHtml = fs.readFileSync(filePath, 'utf8');
  const scriptMatch = rawHtml.match(/<script type="module">([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    throw new Error(`Missing <script type="module"> in ${filePath}`);
  }

  const upgradedJs = upgradeCanvasAndLayoutInJs(scriptMatch[1]);
  // Verify JS syntax before writing
  new vm.Script(upgradedJs, { filename: `${catEntry.slug}.js` });

  const cfg = extractCourseConfigFromJs(upgradedJs);
  if (!cfg) {
    throw new Error(`Failed to extract course config C from ${catEntry.slug}.html`);
  }
  allExtractedConfigs[catEntry.slug] = {
    meta: cfg.meta,
    top: cfg.top,
    mainline: cfg.mainline,
    units: (cfg.units || []).map((u) => ({
      no: u.no,
      name: u.name,
      short: u.short,
      brief: u.brief,
    })),
    steps: (cfg.steps || []).map((s, idx) => ({
      num: idx + 1,
      no: s.no,
      tag: s.tag,
      q: s.q,
      eq: s.eq || '',
      eqCal: s.eqCal || '',
      concl: s.concl || '',
      exam: s.exam || '',
      points: Array.isArray(s.points) ? s.points : [],
      actText: s.act?.text || '',
      expectText: s.expect?.text || '',
    })),
    quiz: (cfg.quiz?.list || []).map((qz) => ({
      tag: qz.tag || '',
      q: qz.q || '',
      opts: Array.isArray(qz.opts) ? qz.opts : [],
      ans: qz.ans,
      why: qz.why || '',
    })),
  };

  const { headHtml, aeoArticleHtml } = buildCourseSeoHeadAndAeoBody(catEntry, cfg);

  const finalHtml = `<!doctype html>
<html lang="vi">
<head>
${headHtml}
</head>
<body>
<canvas id="gl"></canvas>
${aeoArticleHtml}
<script type="module">${upgradedJs}</script>
</body>
</html>
`;

  fs.writeFileSync(filePath, finalHtml, 'utf8');
  updatedCount++;
}

fs.writeFileSync(
  path.join(ROOT, 'data', 'courses-knowledge.json'),
  JSON.stringify(allExtractedConfigs, null, 2),
  'utf8'
);

console.log(
  `Successfully optimized UI display, Canvas 2D typography, and SEO/GEO/AEO metadata across ${updatedCount}/54 courses/*.html files!`
);
console.log('Saved extracted knowledge base to D:/tongjiang-lab/data/courses-knowledge.json');
