import fs from 'fs';
import path from 'path';

const ROOT = 'D:/tongjiang-lab';
const SITE_URL = 'https://vietlab.9cloudmedia.com';
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8'));
const knowledgePath = path.join(ROOT, 'data', 'courses-knowledge.json');
const knowledgeMap = fs.existsSync(knowledgePath)
  ? JSON.parse(fs.readFileSync(knowledgePath, 'utf8'))
  : {};

const SUBJECTS = {
  phys: {
    key: 'phys',
    code: 'VẬT LÝ · 10 BÀI GIẢNG',
    name: 'Vật lý',
    count: 10,
    cover: '/covers/current-field-step.webp',
    desc: 'Từ định luật II Newton, cơ năng, cảm ứng điện từ đến hiệu ứng quang điện và chuyển động Brown — biến phương trình thành thực nghiệm 3D định lượng.',
  },
  chem: {
    key: 'chem',
    code: 'HÓA HỌC · 25 BÀI GIẢNG',
    name: 'Hóa học',
    count: 25,
    cover: '/covers/haber-step.webp',
    desc: 'Bao trọn chuỗi quy trình công nghiệp (tổng hợp NH₃, tiếp xúc H₂SO₄, gang thép, điện phân) và chuẩn độ, cân bằng, tốc độ phản ứng trong phòng thí nghiệm.',
  },
  bio: {
    key: 'bio',
    code: 'SINH HỌC · 5 BÀI GIẢNG',
    name: 'Sinh học',
    count: 5,
    cover: '/covers/mitosis-step.webp',
    desc: 'Phóng đại cấu trúc tế bào và phân tử: co và phản co nguyên sinh, vận chuyển qua màng, dẫn truyền xung thần kinh, nguyên phân và động học enzyme.',
  },
  geo: {
    key: 'geo',
    code: 'ĐỊA LÝ · 14 BÀI GIẢNG',
    name: 'Địa lý',
    count: 14,
    cover: '/covers/enso-step.webp',
    desc: 'Đưa vận động Trái Đất, hoàn lưu khí quyển, ENSO, dòng biển, vòng tuần hoàn nước và địa mạo sông ngòi – Karst vào sa bàn 3D có thể xoay 360°.',
  },
};

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSeoHead({ title, desc, canonical, ogImage, ogType = 'website', keywords = '', jsonLd }) {
  const imgUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;
  const ldStr = JSON.stringify(jsonLd).replace(/<\//g, '<\\/');
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">\n` : ''}<meta name="author" content="VietLab 3D — Học liệu Khoa học Tương tác GDPT 2018">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" hreflang="vi-VN" href="${esc(canonical)}">
<link rel="alternate" type="text/markdown" href="${SITE_URL}/llms.txt" title="VietLab 3D — Chỉ mục Học liệu cho AI/LLM">
<meta property="og:type" content="${esc(ogType)}">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="VietLab 3D — Học liệu Khoa học 3D GDPT 2018">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(imgUrl)}">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="800">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(imgUrl)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">${ldStr}</script>`;
}

function getTextbookList(c) {
  if (Array.isArray(c.textbook)) return c.textbook.map((x) => String(x).trim()).filter(Boolean);
  return String(c.textbook || '')
    .split(' / ')
    .map((x) => x.trim())
    .filter(Boolean);
}

function buildBooksMeta(courses) {
  const booksBySubj = { phys: [], chem: [], bio: [], geo: [] };
  const bookMap = { phys: new Map(), chem: new Map(), bio: new Map(), geo: new Map() };
  let bSeq = 0;
  let cSeq = 0;

  for (const c of courses) {
    const s = c.subject;
    const segments = getTextbookList(c);
    const bKeys = [];
    const cKeys = [];

    for (const seg of segments) {
      const parts = seg.split(' · ').map((x) => x.trim()).filter(Boolean);
      const bookName = parts[0] || 'Chương trình GDPT 2018';
      const chapName = parts[1] || 'Chuyên đề cốt lõi';

      let bEntry = bookMap[s].get(bookName);
      if (!bEntry) {
        bEntry = { k: `b${bSeq++}`, name: bookName, ch: [], chMap: new Map() };
        bookMap[s].set(bookName, bEntry);
        booksBySubj[s].push(bEntry);
      }
      if (!bKeys.includes(bEntry.k)) bKeys.push(bEntry.k);

      let cEntry = bEntry.chMap.get(chapName);
      if (!cEntry) {
        cEntry = { k: `c${cSeq++}`, name: chapName };
        bEntry.chMap.set(chapName, cEntry);
        bEntry.ch.push(cEntry);
      }
      if (!cKeys.includes(cEntry.k)) cKeys.push(cEntry.k);
    }

    c._bKey = bKeys.join('|');
    c._cKey = cKeys.join('|');
    c._textbookStr = getTextbookList(c).join(' / ');
    c._shortBook = segments[0]
      ? segments[0].split(' · ').slice(0, 2).join(' · ')
      : c._textbookStr;
  }

  const clean = {};
  for (const s of Object.keys(booksBySubj)) {
    clean[s] = booksBySubj[s].map(({ k, name, ch }) => ({ k, name, ch }));
  }
  return clean;
}

function renderNav(activePage) {
  return `<header class="nav">
  <div class="nav-in">
    <a class="brand" href="/">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>VietLab 3D</span>
      <span class="brand-sub">GDPT 2018 · 54 Mô phỏng</span>
    </a>
    <nav class="nav-links" aria-label="Điều hướng chính">
      <a href="/#courses"${activePage === 'home' ? ' class="active"' : ''}>Thư viện bài giảng</a>
      <a href="/guide/"${activePage === 'guide' ? ' class="active"' : ''}>Hướng dẫn lớp học</a>
      <a class="hide-m" href="/how/"${activePage === 'how' ? ' class="active"' : ''}>Phương pháp xây dựng</a>
      <a class="hide-m" href="/about/"${activePage === 'about' ? ' class="active"' : ''}>Giới thiệu</a>
      <a class="nav-gh" href="https://github.com/oaichu/vietlab-3d" target="_blank" rel="noopener">GitHub ↗</a>
    </nav>
  </div>
</header>`;
}

function renderFooter() {
  return `<footer class="foot">
  <div class="wrap foot-in">
    <div>
      <strong style="color:var(--fg)">VietLab 3D — Học liệu Khoa học Tự nhiên &amp; Địa lý 3D Tương tác</strong>
      <span style="margin-left:10px">Mã nguồn mở · CC BY-NC-SA 4.0 · Chuẩn Chương trình GDPT 2018</span>
    </div>
    <div class="foot-links">
      <a href="/#courses">Tất cả bài giảng</a>
      <a href="/guide/">Hướng dẫn lớp học</a>
      <a href="/how/">Phương pháp xây dựng</a>
      <a href="/about/">Giới thiệu</a>
      <a href="/catalog.json">catalog.json</a>
      <a href="/sitemap.xml">Sitemap</a>
      <a href="/llms.txt">llms.txt (AI/GEO)</a>
      <a href="https://github.com/oaichu/vietlab-3d" target="_blank" rel="noopener">GitHub ↗</a>
    </div>
  </div>
</footer>`;
}

function renderCourseCard(c, withFilterAttrs = false) {
  const sName = SUBJECTS[c.subject]?.name || c.subjectLabel;
  const stepCount = c.steps.length;
  const kb = knowledgeMap[c.slug];
  const eqText = kb?.top?.total || '';
  const searchText = [
    c.title,
    c.question,
    c._textbookStr,
    sName,
    c.slug,
    eqText,
    ...(c.steps || []),
  ]
    .join(' ')
    .toLowerCase();

  const dataAttrs = withFilterAttrs
    ? ` data-s="${esc(c.subject)}" data-b="${esc(c._bKey)}" data-c="${esc(c._cKey)}" data-t="${esc(searchText)}"`
    : '';

  return `<article class="cc"${dataAttrs}>
  <a class="cc-thumb" href="/c/${c.slug}/">
    <img src="/covers/${c.slug}.webp" alt="${esc(c.title)} — Mô phỏng 3D môn ${esc(sName)}" loading="lazy" width="640" height="400">
    <span class="cc-badge">${esc(sName)}</span>
    <span class="cc-steps">${stepCount} bước</span>
  </a>
  <div class="cc-body">
    <div class="cc-book">${esc(c._shortBook)}</div>
    <h3 class="cc-title"><a href="/c/${c.slug}/">${esc(c.title)}</a></h3>
    <p class="cc-q">${esc(c.question)}</p>
    <div class="cc-foot">
      <a href="/c/${c.slug}/">Chi tiết bài giảng →</a>
      <a class="cc-direct" href="/courses/${c.slug}.html" target="_blank" rel="noopener" title="Mở trực tiếp mô phỏng 3D toàn màn hình">Mở 3D ↗</a>
    </div>
  </div>
</article>`;
}

function buildHomePage(courses, booksMeta) {
  const featuredSlugs = [
    'photoelectric-step',
    'haber-step',
    'mitosis-step',
    'enso-step',
    'galvanic-step',
    'projectile-step',
  ];
  const featured = featuredSlugs
    .map((s) => courses.find((c) => c.slug === s))
    .filter(Boolean);

  const subjectCardsHtml = Object.values(SUBJECTS)
    .map(
      (s) => `<a class="sc" data-s="${s.key}" data-jump-s="${s.key}" href="/#courses">
        <div>
          <div class="sc-top">
            <span class="sc-tag">${esc(s.code)}</span>
            <span class="sc-count">${s.count} bài</span>
          </div>
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.desc)}</p>
        </div>
        <div>
          <div class="sc-thumb"><img src="${s.cover}" alt="Mô phỏng 3D môn ${esc(s.name)}" loading="lazy" width="640" height="360"></div>
          <div class="sc-foot" style="margin-top:12px"><span>Duyệt môn ${esc(s.name)}</span><span>→</span></div>
        </div>
      </a>`
    )
    .join('\n      ');

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${SITE_URL}/#organization`,
        name: 'VietLab 3D',
        alternateName: 'Nền tảng Học liệu Khoa học 3D Tương tác Chuẩn GDPT 2018',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/favicon.svg`,
        description:
          'Thư viện 54 bài giảng mô phỏng 3D tương tác môn Vật lý, Hóa học, Sinh học và Địa lý THPT được Việt hóa 100% theo Chương trình GDPT 2018 của Bộ Giáo dục và Đào tạo Việt Nam.',
        sameAs: ['https://github.com/oaichu/vietlab-3d'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'VietLab 3D — Học liệu Khoa học 3D Tương tác GDPT 2018',
        inLanguage: 'vi-VN',
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/?q={search_term_string}#courses`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#courselist`,
        name: 'Danh mục 54 Bài giảng Mô phỏng 3D Tương tác THPT (GDPT 2018)',
        numberOfItems: courses.length,
        itemListElement: courses.map((c, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: c.title,
          description: `${c.question} (${c._textbookStr})`,
          url: `${SITE_URL}/c/${c.slug}/`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'VietLab 3D gồm những môn học nào trong Chương trình GDPT 2018?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'VietLab 3D cung cấp 54 bài giảng mô phỏng 3D tương tác bao phủ 4 môn học bậc THPT theo Chương trình GDPT 2018: Vật lý (10 bài), Hóa học (25 bài), Sinh học (5 bài) và Địa lý (14 bài).',
            },
          },
          {
            '@type': 'Question',
            name: 'Làm sao để sử dụng bài giảng 3D của VietLab 3D khi lớp học không có Internet?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mỗi bài giảng trong VietLab 3D được đóng gói thành 1 tệp HTML độc lập duy nhất (~860 KB) tích hợp sẵn động cơ đồ họa Three.js WebGL2 và bộ giải toán học. Giáo viên chỉ cần nhấn nút «Tải tệp HTML» để lưu vào máy tính hoặc USB và mở trực tiếp trên trình duyệt mà không cần mạng.',
            },
          },
          {
            '@type': 'Question',
            name: 'VietLab 3D có miễn phí và cho phép nhúng vào hệ thống LMS không?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Có. Toàn bộ 54 mô phỏng 3D được phát hành miễn phí theo giấy phép mở CC BY-NC-SA 4.0, không yêu cầu đăng nhập, và hỗ trợ mã nhúng <iframe> để tích hợp trực tiếp vào Canvas, Moodle, Google Sites hoặc Notion.',
            },
          },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi">
<head>
${renderSeoHead({
  title: 'VietLab 3D — Nền tảng Học liệu Khoa học 3D Tương tác Chuẩn GDPT 2018',
  desc: '54 bài giảng mô phỏng 3D tương tác môn Vật lý, Hóa học, Sinh học và Địa lý THPT theo Chương trình GDPT 2018. Mở trực tiếp trên trình duyệt hoặc tải về 1 tệp HTML duy nhất hoạt động ngoại tuyến.',
  canonical: `${SITE_URL}/`,
  ogImage: '/covers/haber-step.webp',
  keywords:
    'VietLab 3D, mô phỏng 3D, thí nghiệm ảo 3D, học liệu số GDPT 2018, Vật lý 3D, Hóa học 3D, Sinh học 3D, Địa lý 3D, tổng hợp ammonia Haber, hiệu ứng quang điện, nguyên phân, ENSO',
  jsonLd: homeJsonLd,
})}
</head>
<body>
${renderNav('home')}

<main>
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <div class="eyebrow"><span class="dot"></span>MÃ NGUỒN MỞ · 54 BÀI GIẢNG 3D · ĐỐI CHIẾU GDPT 2018</div>
        <h1>Biến những trang sách giáo khoa trừu tượng thành <em>mô phỏng 3D chạm và thử</em> ngay trên lớp.</h1>
        <p class="hero-lead">Bao phủ 4 môn Vật lý, Hóa học, Sinh học và Địa lý THPT. Mỗi bài giảng được dẫn dắt bằng chuỗi câu hỏi từng bước theo tiến trình nhận thức thực tế; mở trực tiếp trên trình duyệt hoặc tải về 1 tệp HTML duy nhất để dạy học hoàn toàn ngoại tuyến.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#courses">Khám phá 54 bài giảng ↓</a>
          <a class="btn" href="/guide/">Hướng dẫn giảng dạy 45 phút</a>
        </div>
        <div class="hero-meta">
          <div><strong>54 bài</strong>Vật lý 10 · Hóa học 25 · Sinh học 5 · Địa lý 14</div>
          <div><strong>1 tệp HTML</strong>Tải về chạy ngay, không cần cài đặt hay mạng</div>
          <div><strong>100% chuẩn</strong>Khớp thuật ngữ &amp; yêu cầu cần đạt GDPT 2018</div>
        </div>
      </div>

      <div class="stage-wrap">
        <div class="stage" id="stage" role="region" aria-label="Bàn thí nghiệm 3D tương tác: Chuyển động của hạt mang điện trong từ trường đều">
          <div class="hud-top">
            <span class="hud-pill"><span class="live"></span>Mô phỏng thời gian thực · Lực Lorentz F = qvB</span>
            <span class="hud-pill hide-xs" id="h-read">r = 4.18 cm · T = 131 ns</span>
          </div>
          <div class="hud-bot">
            <div class="hud-ctrl">
              <label>B <input id="hb" type="range" min="0.2" max="1.2" step="0.05" value="0.5"><span class="val" id="hb-val">0.50 T</span></label>
              <label>v <input id="hv" type="range" min="0.8" max="3.6" step="0.1" value="2.0"><span class="val" id="hv-val">2.00×10⁶ m/s</span></label>
              <div class="hud-seg" role="group" aria-label="Điện tích hạt">
                <button type="button" class="on" data-hq="1">+q Proton</button>
                <button type="button" data-hq="-1">−q Phản proton</button>
              </div>
            </div>
            <a class="hud-open" href="/c/centripetal-step/">Xem cấu trúc bài giảng →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="sec-kicker">BỘ MÔN · SUBJECTS</div>
          <h2 class="sec-title">Bốn bộ môn Khoa học · Bấm để lọc ngay theo chương trình</h2>
        </div>
        <p class="sec-sub">Tập trung giải quyết các chủ đề khó hình dung nhất trên bảng phấn 2D: trường lực không gian 3 chiều, dây chuyền thiết bị công nghiệp, động học phân tử vi mô và hoàn lưu địa cầu.</p>
      </div>
      <div class="sgrid">
        ${subjectCardsHtml}
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="sec-kicker">TIÊU BIỂU · FEATURED</div>
          <h2 class="sec-title">6 bài giảng tiêu biểu nên trải nghiệm đầu tiên</h2>
        </div>
        <p class="sec-sub">Bao quát 4 bộ môn từ thí nghiệm đo hằng số Planck, tháp tổng hợp ammonia Haber–Bosch đến chu kỳ nguyên phân và dao động Nam phương ENSO.</p>
      </div>
      <div class="cgrid">
        ${featured.map((c) => renderCourseCard(c, false)).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="sec" id="courses">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="sec-kicker">THƯ VIỆN · ALL 54 COURSES</div>
          <h2 class="sec-title">Toàn bộ bài giảng (<span id="fcount">${courses.length}</span> / ${courses.length})</h2>
        </div>
        <p class="sec-sub">Lọc theo bộ môn, khối lớp / chuyên đề GDPT 2018, chương học hoặc nhấn phím <code>/</code> để tìm nhanh (hỗ trợ cả tiếng Việt có dấu và không dấu).</p>
      </div>

      <div class="fbar">
        <div class="fbar-row">
          <div class="fpills" id="fs" role="tablist" aria-label="Lọc theo bộ môn">
            <button type="button" class="fpill on" data-s="all">Tất cả <span class="n">${courses.length}</span></button>
            <button type="button" class="fpill" data-s="phys">Vật lý <span class="n">10</span></button>
            <button type="button" class="fpill" data-s="chem">Hóa học <span class="n">25</span></button>
            <button type="button" class="fpill" data-s="bio">Sinh học <span class="n">5</span></button>
            <button type="button" class="fpill" data-s="geo">Địa lý <span class="n">14</span></button>
          </div>
          <div class="fsearch">
            <span class="ic">⌕</span>
            <input id="q" type="search" placeholder="Tìm bài giảng, câu hỏi, chương học…" autocomplete="off" aria-label="Tìm kiếm bài giảng">
            <span class="kbd">/</span>
          </div>
        </div>
        <div class="fsec" id="fb" hidden>
          <span>Khối lớp / Chuyên đề:</span>
          <select id="sb" aria-label="Chọn khối lớp hoặc chuyên đề"></select>
          <span>Chương học:</span>
          <select id="sc" aria-label="Chọn chương học"></select>
        </div>
      </div>

      <div class="cgrid" id="lib">
        ${courses.map((c) => renderCourseCard(c, true)).join('\n        ')}
        <div class="fempty" id="empty" hidden>Không tìm thấy bài giảng phù hợp. Hãy thử từ khóa khác hoặc chọn lại bộ lọc «Tất cả».</div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="sec-kicker">SỬ DỤNG TRONG LỚP HỌC · IN THE CLASSROOM</div>
          <h2 class="sec-title">4 bước đưa bài giảng 3D vào tiết học 45 phút</h2>
        </div>
        <a class="btn" href="/guide/">Xem hướng dẫn chi tiết →</a>
      </div>
      <div class="steps">
        <div class="step">
          <div class="step-num">BƯỚC 01 · CHỌN BÀI</div>
          <h3>Tra theo bài học GDPT 2018</h3>
          <p>Mỗi bài giảng đều ghi rõ khối lớp, chương và chuyên đề tương ứng trong Chương trình GDPT 2018 để giáo viên đưa thẳng vào kế hoạch bài dạy.</p>
        </div>
        <div class="step">
          <div class="step-num">BƯỚC 02 · MỞ HOẶC TẢI VỀ</div>
          <h3>Có mạng mở ngay, mất mạng vẫn chạy</h3>
          <p>Nhấp «Mở 3D» để trình chiếu trực tiếp; hoặc tải về tệp <code>.html</code> độc lập (~860 KB) lưu vào USB để chạy ngoại tuyến trên mọi máy tính lớp học.</p>
        </div>
        <div class="step">
          <div class="step-num">BƯỚC 03 · DẠY THEO MẠCH BƯỚC</div>
          <h3>Mỗi bước một câu hỏi trọng tâm</h3>
          <p>Dùng phím <code>←</code> <code>→</code> hoặc thanh bước để dẫn dắt học sinh: đặt câu hỏi dự đoán trước, thao tác 3D kiểm chứng sau, cuối cùng chốt kiến thức cốt lõi.</p>
        </div>
        <div class="step">
          <div class="step-num">BƯỚC 04 · TỰ LUYỆN SAU GIỜ HỌC</div>
          <h3>Học sinh tự khám phá tại nhà</h3>
          <p>Chia sẻ đường dẫn bài giảng hoặc nhúng <code>&lt;iframe&gt;</code> vào hệ thống LMS của trường; bước cuối mỗi bài luôn có phần thử thách thực hành có chấm điểm.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" style="border-bottom:0">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="sec-kicker">PHƯƠNG PHÁP · METHODOLOGY</div>
          <h2 class="sec-title">Quy trình kiểm chứng học thuật 4 giai đoạn</h2>
        </div>
        <a class="btn" href="/how/">Tìm hiểu quy trình xây dựng →</a>
      </div>
      <div class="hgrid">
        <div class="hcard">
          <div class="k">01 · ĐỐI CHIẾU DỮ KIỆN KHOA HỌC</div>
          <h3>Xác lập hằng số, phương trình &amp; ranh giới mô hình</h3>
          <p>Mọi phương trình vật lý, nhiệt động học hóa học và số liệu thực nghiệm đều được đối chiếu với tài liệu chuẩn trước khi viết dòng mã đầu tiên.</p>
        </div>
        <div class="hcard">
          <div class="k">02 · THIẾT KẾ MẠCH NHẬN THỨC</div>
          <h3>Biến mục tiêu bài học thành thao tác 3D</h3>
          <p>Không nhồi nhét văn bản lên màn hình 3D. Mỗi bước học chỉ giữ 1 câu hỏi mở đầu, 1 thao tác kiểm chứng trực quan và 3 ý kết luận cô đọng.</p>
        </div>
        <div class="hcard">
          <div class="k">03 · ĐÓNG GÓI ĐỘC LẬP &amp; KIỂM THỬ</div>
          <h3>Một tệp HTML tự chứa, 60 khung hình/giây</h3>
          <p>Toàn bộ động cơ đồ họa Three.js, bộ giải phương trình và giao diện tiếng Việt được đóng gói trong 1 tệp HTML duy nhất, kiểm thử tự động trên trình duyệt thật.</p>
        </div>
      </div>
    </div>
  </section>
</main>

<script id="books" type="application/json">${JSON.stringify(booksMeta)}</script>
${renderFooter()}
<script type="module" src="/assets/site.js"></script>
</body>
</html>`;
}

function buildDetailPage(c, allCourses) {
  const sMeta = SUBJECTS[c.subject] || SUBJECTS.phys;
  const kb = knowledgeMap[c.slug] || null;
  const steps = kb?.steps?.length
    ? kb.steps
    : (c.steps || []).map((t, i) => ({ num: i + 1, tag: t, q: '', eq: '', eqCal: '', concl: '', exam: '', points: [] }));
  const units = kb?.units || [];
  const chain = kb?.mainline?.chain || [];
  const seps = kb?.mainline?.seps || [];
  const totalEq = kb?.top?.total || '';
  const quizList = kb?.quiz || [];

  const related = allCourses
    .filter((x) => x.subject === c.subject && x.slug !== c.slug)
    .slice(0, 6);

  const trackHtml = steps
    .map((st, idx) => {
      const numStr = String(idx + 1).padStart(2, '0');
      return `<li>
        <span class="n">${numStr}</span>
        <div>
          <div class="t">${esc(st.tag)}</div>
          ${st.q ? `<div class="q">${esc(st.q)}</div>` : ''}
          ${st.eq ? `<div class="step-eq"><code>${esc(st.eq)}</code>${st.eqCal ? ` <span>· ${esc(st.eqCal)}</span>` : ''}</div>` : ''}
          ${st.concl ? `<div class="step-concl"><strong>Kết luận:</strong> ${esc(st.concl)}</div>` : ''}
        </div>
      </li>`;
    })
    .join('\n        ');

  const chainHtml = chain.length
    ? `<div class="ch-chain" aria-label="Chuỗi nhân quả cốt lõi">
      <span class="ch-chain-label">Mạch logic cốt lõi:</span>
      ${chain
        .map(
          (item, idx) =>
            `<span class="ch-chain-pill"><b>${esc(item.k)}</b><span>${esc(item.t)}</span></span>${
              idx < chain.length - 1 ? `<span class="ch-chain-sep">${esc(seps[idx] || '→')}</span>` : ''
            }`
        )
        .join('\n      ')}
    </div>`
    : '';

  const unitsSectionHtml = units.length
    ? `<section class="ch-sec">
    <h2>Cấu trúc trạm thiết bị &amp; cụm mô hình 3D (${units.length} khu vực)</h2>
    <div class="ugrid">
      ${units
        .map(
          (u) => `<div class="ucard">
        <div class="ucard-top">
          <span class="ucard-no">${esc(u.no)}</span>
          <span class="ucard-name">${esc(u.name)}</span>
        </div>
        <p class="ucard-brief">${esc(u.brief)}</p>
      </div>`
        )
        .join('\n      ')}
    </div>
  </section>`
    : '';

  // Build FAQ items combining key step inquiry questions and quiz questions
  const faqItems = [];
  for (const st of steps) {
    if (st.q && (st.concl || st.points?.length)) {
      faqItems.push({
        badge: `Bước ${st.num} · ${st.tag}`,
        q: st.q,
        concl: st.concl,
        eq: st.eq,
        exam: st.exam,
      });
    }
  }
  for (const qz of quizList.slice(0, 5)) {
    if (qz.q && qz.why) {
      const ansOpt = Array.isArray(qz.opts) && qz.opts[qz.ans] ? qz.opts[qz.ans] : '';
      faqItems.push({
        badge: `Câu hỏi ôn tập · ${qz.tag || sMeta.name}`,
        q: qz.q,
        concl: ansOpt ? `Đáp án đúng: ${ansOpt}. ${qz.why}` : qz.why,
        eq: '',
        exam: '',
      });
    }
  }

  const faqSectionHtml = faqItems.length
    ? `<section class="ch-sec">
    <h2>Câu hỏi Thường gặp &amp; Giải đáp Trọng tâm (Chuẩn GDPT 2018)</h2>
    <div class="faq-list">
      ${faqItems
        .map(
          (f, idx) => `<details class="faq-item"${idx < 2 ? ' open' : ''}>
        <summary><span><span class="faq-tag">${esc(f.badge)}</span>${esc(f.q)}</span></summary>
        <div class="faq-body">
          ${f.eq ? `<p><strong>Phương trình / Quy luật:</strong> <code>${esc(f.eq)}</code></p>` : ''}
          <p>${esc(f.concl)}</p>
          ${f.exam ? `<p><strong>Lưu ý trọng tâm thi cử:</strong> ${esc(f.exam)}</p>` : ''}
        </div>
      </details>`
        )
        .join('\n      ')}
    </div>
  </section>`
    : '';

  const iframeSnippet = `<iframe src="${SITE_URL}/courses/${c.slug}.html" width="100%" height="640" style="border:0;border-radius:12px" allowfullscreen loading="lazy"></iframe>`;
  const issueTitle = encodeURIComponent(`[Báo lỗi học liệu] ${c.title} (${c.slug})`);

  const detailJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Course', 'LearningResource'],
        '@id': `${SITE_URL}/c/${c.slug}/#course`,
        name: `${c.title} — Mô phỏng 3D Tương tác (${sMeta.name})`,
        headline: c.title,
        description: `${c.question} Mô phỏng 3D tương tác gồm ${steps.length} bước khám phá thuộc môn ${sMeta.name} (${c._textbookStr}).`,
        inLanguage: 'vi-VN',
        learningResourceType: ['Interactive Simulation', '3D Virtual Lab', 'Course'],
        educationalLevel: 'Trung học phổ thông (THPT) — Chương trình GDPT 2018',
        educationalAlignment: {
          '@type': 'AlignmentObject',
          alignmentType: 'educationalSubject',
          educationalFramework: 'Chương trình Giáo dục Phổ thông 2018 (Bộ GD&ĐT Việt Nam)',
          targetName: c._textbookStr,
        },
        url: `${SITE_URL}/c/${c.slug}/`,
        image: `${SITE_URL}/covers/${c.slug}.webp`,
        isAccessibleForFree: true,
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'VietLab 3D',
          url: `${SITE_URL}/`,
        },
        hasPart: steps.map((st) => ({
          '@type': 'LearningResource',
          position: st.num,
          name: `Bước ${st.num}: ${st.tag}`,
          description: `${st.q} ${st.concl || ''}`.trim(),
        })),
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/courses/${c.slug}.html#webapp`,
        name: `${c.title} — Phòng thí nghiệm 3D WebGL2`,
        url: `${SITE_URL}/courses/${c.slug}.html`,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web Browser (WebGL2)',
        inLanguage: 'vi-VN',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/c/${c.slug}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ VietLab 3D', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: sMeta.name, item: `${SITE_URL}/?s=${c.subject}#courses` },
          { '@type': 'ListItem', position: 3, name: c.title, item: `${SITE_URL}/c/${c.slug}/` },
        ],
      },
      ...(faqItems.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${SITE_URL}/c/${c.slug}/#faq`,
              mainEntity: faqItems.slice(0, 10).map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: [f.eq ? `Phương trình: ${f.eq}.` : '', f.concl, f.exam ? `Lưu ý: ${f.exam}` : '']
                    .filter(Boolean)
                    .join(' '),
                },
              })),
            },
          ]
        : []),
    ],
  };

  const keywords = [
    c.title,
    `mô phỏng 3D ${c.title}`,
    sMeta.name,
    'GDPT 2018',
    'VietLab 3D',
    totalEq,
    ...steps.map((s) => s.tag),
  ]
    .filter(Boolean)
    .join(', ');

  return `<!doctype html>
<html lang="vi">
<head>
${renderSeoHead({
  title: `${c.title} · Mô phỏng 3D Tương tác (${sMeta.name}) — VietLab 3D`,
  desc: `${c.question} (${c._textbookStr}) — Bài giảng mô phỏng 3D tương tác gồm ${steps.length} bước khám phá, giải thích chi tiết công thức và câu hỏi trọng tâm GDPT 2018.`,
  canonical: `${SITE_URL}/c/${c.slug}/`,
  ogImage: `/covers/${c.slug}.webp`,
  ogType: 'article',
  keywords,
  jsonLd: detailJsonLd,
})}
</head>
<body>
${renderNav('')}

<main class="wrap">
  <nav class="crumb" aria-label="Đường dẫn">
    <a href="/">Trang chủ</a><span>/</span>
    <a href="/?s=${c.subject}#courses">${esc(sMeta.name)}</a><span>/</span>
    <span>${esc(c.title)}</span>
  </nav>

  <header class="ch-head">
    <div class="ch-badges">
      <span class="badge badge-s" data-s="${c.subject}">${esc(sMeta.name)}</span>
      <span class="badge">${steps.length} bước khám phá</span>
      ${totalEq ? `<span class="badge">${esc(totalEq)}</span>` : ''}
      <span class="badge badge-v">✓ Đã kiểm chứng dữ kiện &amp; thuật ngữ GDPT 2018</span>
    </div>
    <h1 class="ch-title">${esc(c.title)}</h1>
    <p class="ch-q">${esc(c.question)}</p>
    ${chainHtml}
  </header>

  <section class="ch-main">
    <div class="pv-box">
      <div class="pv-bar">
        <span class="pv-bar-left"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:var(--phys);display:inline-block"></span>Không gian thí nghiệm 3D · WebGL2</span>
        <div class="pv-bar-actions" role="group" aria-label="Chế độ khung nhìn">
          <button type="button" class="pv-mode-btn on" data-pv-mode="cover">Ảnh bìa</button>
          <button type="button" class="pv-mode-btn" data-pv-mode="live">Tương tác 3D trực tiếp</button>
        </div>
      </div>
      <div class="pv" id="pv-stage" data-src="/courses/${c.slug}.html">
        <img src="/covers/${c.slug}.webp" alt="${esc(c.title)} — Mô phỏng 3D môn ${esc(sMeta.name)}" width="1280" height="800">
        <div class="pv-cta">
          <button type="button" class="pv-btn" data-pv-start><span class="play">▶</span>Khởi chạy mô phỏng 3D ngay trên trang</button>
        </div>
      </div>
    </div>

    <aside class="pv-act">
      <h2>Sử dụng bài giảng</h2>
      <a class="btn btn-primary" href="/courses/${c.slug}.html" target="_blank" rel="noopener">Mở toàn màn hình (Khuyên dùng trên lớp) ↗</a>
      <div class="pv-act-row">
        <a class="btn" href="/courses/${c.slug}.html" download="${c.slug}.html">↓ Tải tệp HTML</a>
        <details class="act-share">
          <summary class="btn" style="width:100%">⟨/⟩ Nhúng / Chia sẻ</summary>
          <div class="share-pop">
            <div>Mã nhúng <code>&lt;iframe&gt;</code> vào LMS / Notion / Website:</div>
            <code>${esc(iframeSnippet)}</code>
            <button type="button" class="btn" style="padding:5px 10px;font-size:12px" data-copy="${esc(iframeSnippet)}">Sao chép mã nhúng</button>
          </div>
        </details>
      </div>
      <dl class="pv-spec">
        <dt>Bộ môn</dt><dd>${esc(sMeta.name)}</dd>
        <dt>Số bước học</dt><dd>${steps.length} bước</dd>
        <dt>Định dạng</dt><dd>1 tệp HTML độc lập · WebGL2</dd>
        <dt>Chế độ ngoại tuyến</dt><dd>Hoạt động 100% không cần mạng</dd>
        <dt>Giấy phép</dt><dd>CC BY-NC-SA 4.0</dd>
        <dt>Góp ý học thuật</dt><dd><a href="https://github.com/oaichu/vietlab-3d/issues/new?title=${issueTitle}" target="_blank" rel="noopener" style="color:var(--phys)">Báo lỗi bài giảng ↗</a></dd>
      </dl>
    </aside>
  </section>

  ${unitsSectionHtml}

  <section class="ch-sec">
    <h2>Mạch tư duy &amp; câu hỏi khám phá (${steps.length} bước)</h2>
    <ol class="track">
      ${trackHtml}
    </ol>
  </section>

  ${faqSectionHtml}

  <section class="ch-sec">
    <h2>Đối chiếu Chương trình Giáo dục Phổ thông 2018</h2>
    <div class="tbook">
      <strong>Vị trí trong chương trình:</strong> ${esc(c._textbookStr)}
    </div>
  </section>

  <section class="ch-sec" style="border-bottom:0">
    <div class="sec-head" style="margin-bottom:18px">
      <h2>Các bài giảng 3D khác môn ${esc(sMeta.name)}</h2>
      <a class="btn" href="/?s=${c.subject}#courses">Xem tất cả ${sMeta.count} bài môn ${esc(sMeta.name)} →</a>
    </div>
    <div class="cgrid">
      ${related.map((r) => renderCourseCard(r, false)).join('\n      ')}
    </div>
  </section>
</main>

${renderFooter()}
<script type="module" src="/assets/site.js"></script>
</body>
</html>`;
}

function buildGuidePage() {
  const guideJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        '@id': `${SITE_URL}/guide/#howto`,
        name: 'Hướng dẫn đưa mô phỏng 3D VietLab 3D vào tiết học 45 phút',
        description:
          'Quy trình 4 bước giúp giáo viên THPT sử dụng 54 bài giảng mô phỏng 3D tương tác trong tiết học 45 phút, dạy học ngoại tuyến và giao bài tự học trên LMS.',
        inLanguage: 'vi-VN',
        totalTime: 'PT45M',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Chuẩn bị trước giờ lên lớp (2 phút)',
            text: 'Truy cập thư viện bài giảng theo Chương trình GDPT 2018 để mở trực tiếp hoặc tải tệp HTML độc lập (~860 KB) về USB nếu phòng học không có mạng.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Điều khiển bằng phím tắt trên bục giảng',
            text: 'Dùng phím mũi tên trái/phải để chuyển bước, phím Space để bật/tắt trình chiếu tự động, phím R để đặt lại góc nhìn 3D.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Dạy học theo cấu trúc sư phạm 3 pha',
            text: 'Đặt câu hỏi dự đoán mở đầu, thao tác kiểm chứng trực tiếp trên mô hình 3D, sau đó đối chiếu công thức và ghi chú dạy học.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Giao bài thực hành và nhúng vào LMS',
            text: 'Học sinh thực hiện thử thách thực hành ở bước cuối hoặc làm bài qua khung nhúng iframe trên Canvas, Moodle, Google Sites.',
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ VietLab 3D', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Hướng dẫn lớp học', item: `${SITE_URL}/guide/` },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi">
<head>
${renderSeoHead({
  title: 'Hướng dẫn sử dụng trong lớp học — VietLab 3D',
  desc: 'Hướng dẫn giáo viên và học sinh khai thác hiệu quả 54 bài giảng mô phỏng 3D tương tác trong tiết học 45 phút, dạy học ngoại tuyến và tự học tại nhà.',
  canonical: `${SITE_URL}/guide/`,
  ogImage: '/covers/current-field-step.webp',
  keywords: 'hướng dẫn dạy học 3D, học liệu số THPT, kế hoạch bài dạy GDPT 2018, thí nghiệm ảo ngoại tuyến, VietLab 3D',
  jsonLd: guideJsonLd,
})}
</head>
<body>
${renderNav('guide')}

<main class="prose-wrap">
  <header class="prose-head">
    <div class="sec-kicker">HƯỚNG DẪN LỚP HỌC · CLASSROOM GUIDE</div>
    <h1>Đưa mô phỏng 3D vào tiết học 45 phút mà không làm gián đoạn nhịp giảng bài</h1>
    <p>VietLab 3D được thiết kế xoay quanh bục giảng thực tế: mở nhanh trong 1 giây, điều khiển gọn bằng bàn phím hoặc màn hình cảm ứng tương tác, và luôn hoạt động ngay cả khi phòng học mất kết nối Internet.</p>
  </header>

  <article class="prose">
    <h2>1. Chuẩn bị trước giờ lên lớp (2 phút)</h2>
    <ul>
      <li><strong>Nếu lớp học có Internet ổn định:</strong> Truy cập trực tiếp <a href="/#courses" style="color:var(--phys)">Thư viện bài giảng</a>, chọn bài học tương ứng với tiết dạy trong Chương trình GDPT 2018 và nhấn <code>Mở toàn màn hình ↗</code>.</li>
      <li><strong>Nếu mạng trường học chập chờn hoặc không có mạng:</strong> Nhấn nút <code>↓ Tải tệp HTML</code> trên trang chi tiết bài giảng. Toàn bộ mô hình 3D, động cơ vật lý và giao diện tiếng Việt đã được đóng gói gọn trong <strong>1 tệp <code>.html</code> duy nhất (~860 KB)</strong>. Chép tệp này vào USB và mở bằng Chrome, Edge hoặc Firefox trên máy tính lớp học.</li>
    </ul>

    <div class="callout">
      <strong>Mẹo trình chiếu trên TV / Bảng tương tác thông minh:</strong> Sau khi mở bài giảng, nhấn phím <code>F11</code> để vào chế độ toàn màn hình trình duyệt. Ở góc dưới bên trái mỗi bài giảng luôn có nút <strong>Giao diện Sáng / Tối</strong> — hãy chuyển sang <em>Giao diện Sáng (Nền giấy sáng)</em> nếu phòng học có nhiều ánh nắng chiếu vào màn hình.
    </div>

    <h2>2. Phím tắt điều khiển nhanh trên bục giảng</h2>
    <p>Giáo viên có thể điều khiển toàn bộ tiến trình bài giảng chỉ với bàn phím hoặc chuột không dây:</p>
    <div class="kbd-list">
      <div class="kbd-item"><span>Chuyển sang bước tiếp theo</span><kbd>→</kbd></div>
      <div class="kbd-item"><span>Quay lại bước trước đó</span><kbd>←</kbd></div>
      <div class="kbd-item"><span>Bật / tắt tự động trình chiếu</span><kbd>Space</kbd></div>
      <div class="kbd-item"><span>Đặt lại góc nhìn 3D mặc định</span><kbd>R</kbd></div>
      <div class="kbd-item"><span>Xoay mô hình 3D 360°</span><kbd>Kéo chuột trái</kbd></div>
      <div class="kbd-item"><span>Phóng to / thu nhỏ chi tiết</span><kbd>Con lăn chuột</kbd></div>
    </div>

    <h2>3. Cấu trúc sư phạm 3 pha trong mỗi bước học</h2>
    <p>Mỗi bài giảng trong VietLab 3D gồm từ 6 đến 10 bước, được thiết kế thống nhất theo chu trình nhận thức <strong>Dự đoán → Thao tác kiểm chứng → Chốt kiến thức</strong>:</p>
    <ol>
      <li><strong>Đặt vấn đề bằng câu hỏi mở đầu:</strong> Trước khi thao tác thanh trượt hoặc công tắc trên màn hình, hãy chiếu câu hỏi ở đầu thẻ bước để học sinh thảo luận nhanh (30–60 giây).</li>
      <li><strong>Thao tác kiểm chứng trên mô hình 3D:</strong> Thực hiện thao tác được gợi ý trong khung <em>Thao tác bước này</em> (hoặc nhấn <code>Tự động thao tác</code> để hệ thống tự thực hiện chuẩn xác), đồng thời quan sát hiện tượng xảy ra trong khung <em>Quan sát trọng tâm</em>.</li>
      <li><strong>Đối chiếu công thức &amp; bản chất:</strong> Mở thẻ <em>Ghi chú dạy học</em> nếu cần giải thích sâu hơn về bẫy sai lầm thường gặp hoặc giới hạn của mô hình sách giáo khoa.</li>
    </ol>

    <h2>4. Giao bài tập thực hành &amp; nhúng vào LMS</h2>
    <p>Bước cuối cùng của mọi bài giảng đều là một <strong>thử thách thực hành tương tác</strong> (ví dụ: điều chỉnh thông số tháp tổng hợp NH₃ theo yêu cầu ca trưởng, chuẩn độ đến đúng điểm tương đương, hay xác định cực từ của ống dây). Bạn có thể sao chép mã <code>&lt;iframe&gt;</code> trên trang chi tiết để nhúng trực tiếp vào Canvas, Moodle, Google Sites hoặc Notion của lớp.</p>
  </article>
</main>

${renderFooter()}
<script type="module" src="/assets/site.js"></script>
</body>
</html>`;
}

function buildHowPage() {
  const howJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${SITE_URL}/how/#article`,
        headline: 'Kiến trúc kỹ thuật & tiêu chuẩn học thuật đằng sau 54 phòng thí nghiệm 3D VietLab 3D',
        description:
          'Quy trình thiết kế sư phạm, đối chiếu dữ kiện khoa học và kiến trúc kỹ thuật đóng gói đơn tệp HTML của 54 bài giảng 3D tương tác.',
        inLanguage: 'vi-VN',
        author: { '@type': 'EducationalOrganization', name: 'VietLab 3D', url: `${SITE_URL}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ VietLab 3D', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Phương pháp xây dựng', item: `${SITE_URL}/how/` },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi">
<head>
${renderSeoHead({
  title: 'Phương pháp xây dựng & Kiểm chứng học thuật — VietLab 3D',
  desc: 'Quy trình thiết kế sư phạm, đối chiếu dữ kiện khoa học và kiến trúc kỹ thuật đóng gói đơn tệp HTML của 54 bài giảng 3D tương tác.',
  canonical: `${SITE_URL}/how/`,
  ogImage: '/covers/photoelectric-step.webp',
  keywords: 'kiến trúc Three.js WebGL2, mô phỏng khoa học định lượng, chuẩn danh pháp IUPAC GDPT 2018, VietLab 3D',
  jsonLd: howJsonLd,
})}
</head>
<body>
${renderNav('how')}

<main class="prose-wrap">
  <header class="prose-head">
    <div class="sec-kicker">PHƯƠNG PHÁP XÂY DỰNG · HOW IT'S BUILT</div>
    <h1>Kiến trúc kỹ thuật &amp; tiêu chuẩn học thuật đằng sau 54 phòng thí nghiệm 3D</h1>
    <p>Một học liệu mô phỏng khoa học tốt không chỉ đẹp mắt mà phải đúng phương trình vật lý, đúng quy ước ký hiệu sách giáo khoa và bền vững khi vận hành thực tế tại trường phổ thông.</p>
  </header>

  <article class="prose">
    <h2>1. Bốn nguyên tắc thiết kế cốt lõi</h2>
    <ul>
      <li><strong>Mô phỏng từ phương trình thật, không làm hoạt hình giả:</strong> Quỹ đạo vật ném xiên, đường cong chuẩn độ pH, dòng sạc tụ điện <code>i(t) = (U/R)·e^(-t/RC)</code> hay cân bằng tổng hợp ammonia đều được tính toán thời gian thực từ phương trình vi phân và hằng số thực nghiệm.</li>
      <li><strong>Chuẩn hóa thuật ngữ theo Chương trình GDPT 2018:</strong> Danh pháp hóa học quốc tế IUPAC (<em>Sodium, Chlorine, Ammonia, Sulfuric acid, Iron, Copper…</em>), ký hiệu đại lượng Vật lý và phân môn Sinh học – Địa lý tuân thủ nghiêm ngặt quy định của Bộ Giáo dục và Đào tạo Việt Nam.</li>
      <li><strong>Kiến trúc 1 tệp HTML tự chứa (Zero-Dependency Single-File):</strong> Toàn bộ mã nguồn Three.js, shader WebGL2, bộ giải toán học và giao diện sư phạm của mỗi bài giảng được biên dịch vào một tệp <code>.html</code> duy nhất không phụ thuộc CDN bên ngoài.</li>
      <li><strong>Tương phản thích ứng môi trường lớp học:</strong> Hỗ trợ chuyển đổi tức thời giữa nền tối phòng thí nghiệm (tối ưu độ tương phản cho tia sáng, chùm hạt, ngọn lửa) và nền giấy sáng (tối ưu cho máy chiếu lớp học nhiều ánh sáng).</li>
    </ul>

    <h2>2. Quy trình 4 giai đoạn cho mỗi bài giảng</h2>
    <h3>Giai đoạn 1 — Hồ sơ dữ kiện khoa học (Facts Verification)</h3>
    <p>Trước khi dựng hình 3D, mọi số liệu định lượng (nhiệt độ sôi, thế điện cực chuẩn, công thoát quang điện <code>W₀</code>, góc nghiêng trục Trái Đất <code>23°26′</code>, chiều dòng chảy và bố cục thiết bị) đều được khóa chặt và kiểm tra chéo với sách giáo khoa cùng tài liệu tham khảo chuẩn.</p>

    <h3>Giai đoạn 2 — Kịch bản nhận thức từng bước (Stepwise Inquiry)</h3>
    <p>Thay vì giao cho học sinh một bảng điều khiển phức tạp ngay từ đầu, bài giảng được chia thành 6–10 bước tuần tự. Mỗi bước chỉ mở khóa đúng những biến số cần thiết để trả lời câu hỏi của bước đó, giúp học sinh không bị quá tải nhận thức.</p>

    <h3>Giai đoạn 3 — Dựng cảnh 3D thủ tục &amp; Shader thời gian thực</h3>
    <p>Toàn bộ hình học 3D (ống nghiệm, buret, lò cao, địa hình Karst, màng phospholipid kép) được sinh bằng mã thủ tục (procedural geometry) kết hợp vật liệu PBR và hiệu ứng hạt GPU, giúp dung lượng mỗi bài giảng chỉ khoảng 850 KB nhưng vẫn đạt tốc độ 60 FPS.</p>

    <h3>Giai đoạn 4 — Kiểm thử tự động &amp; Việt hóa toàn diện</h3>
    <p>Tất cả 54 bài giảng đều trải qua quy trình kiểm tra cú pháp JavaScript tự động, kiểm tra hiển thị nhãn 3D không chồng lấp và rà soát 100% chuỗi văn bản tiếng Việt.</p>
  </article>
</main>

${renderFooter()}
<script type="module" src="/assets/site.js"></script>
</body>
</html>`;
}

function buildAboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/about/#about`,
        name: 'Giới thiệu dự án VietLab 3D — Học liệu Khoa học 3D Mở Chuẩn GDPT 2018',
        description:
          'Giới thiệu về VietLab 3D — dự án học liệu khoa học 3D tương tác mã nguồn mở dành cho giáo viên và học sinh Việt Nam theo Chương trình GDPT 2018.',
        inLanguage: 'vi-VN',
        mainEntity: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ VietLab 3D', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Giới thiệu dự án', item: `${SITE_URL}/about/` },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi">
<head>
${renderSeoHead({
  title: 'Giới thiệu dự án — VietLab 3D',
  desc: 'Giới thiệu về VietLab 3D — dự án học liệu khoa học 3D tương tác mã nguồn mở dành cho giáo viên và học sinh Việt Nam theo Chương trình GDPT 2018.',
  canonical: `${SITE_URL}/about/`,
  ogImage: '/covers/enso-step.webp',
  keywords: 'giới thiệu VietLab 3D, học liệu mở CC BY-NC-SA 4.0, giáo dục STEM Việt Nam, GDPT 2018',
  jsonLd: aboutJsonLd,
})}
</head>
<body>
${renderNav('about')}

<main class="prose-wrap">
  <header class="prose-head">
    <div class="sec-kicker">GIỚI THIỆU · ABOUT VIETLAB 3D</div>
    <h1>Học liệu khoa học 3D mở, miễn phí và chuẩn hóa cho giáo dục phổ thông Việt Nam</h1>
    <p>VietLab 3D được xây dựng với mục tiêu thu hẹp khoảng cách giữa lý thuyết trên trang sách và trực giác khoa học không gian 3 chiều cho mọi lớp học tại Việt Nam.</p>
  </header>

  <article class="prose">
    <h2>Vì sao chúng tôi thực hiện dự án này?</h2>
    <p>Trong chương trình Khoa học Tự nhiên và Địa lý bậc THPT, rất nhiều khái niệm cốt lõi mang bản chất không gian 3 chiều hoặc động lực học liên tục: từ quy tắc bàn tay trái của lực từ, cấu tạo tháp tiếp xúc sản xuất sulfuric acid, cơ chế dẫn truyền xung thần kinh qua màng neuron, cho đến hoàn lưu khí quyển Ba ô và hiện tượng ENSO.</p>
    <p>Khi chỉ học qua hình vẽ tĩnh 2D, học sinh dễ rơi vào lối học thuộc lòng công thức mà không hình dung được cơ chế nhân – quả. VietLab 3D chuyển hóa 54 chủ đề trọng tâm ấy thành các phòng thí nghiệm ảo 3D có thể xoay, cắt lớp, thay đổi thông số và quan sát kết quả tức thì.</p>

    <h2>Cam kết dành cho giáo viên &amp; học sinh Việt Nam</h2>
    <ul>
      <li><strong>Miễn phí &amp; Không cần tài khoản:</strong> Mọi bài giảng đều mở trực tiếp trên trình duyệt, không thu phí, không quảng cáo và không yêu cầu đăng nhập.</li>
      <li><strong>Sẵn sàng cho vùng khó khăn về hạ tầng mạng:</strong> Mỗi bài giảng là một tệp HTML độc lập có thể tải về một lần và sử dụng mãi mãi mà không cần kết nối Internet.</li>
      <li><strong>Bản địa hóa chuẩn mực theo GDPT 2018:</strong> Hệ thống câu hỏi dẫn dắt, danh pháp hóa học IUPAC và ghi chú sư phạm được biên dịch và hiệu đính toàn diện sang tiếng Việt.</li>
    </ul>

    <div class="callout">
      <strong>Bản quyền &amp; Đóng góp:</strong> Dự án được phát hành theo giấy phép <strong>CC BY-NC-SA 4.0</strong> dựa trên nền tảng mã nguồn mở <em>Tongjiang Lab</em>. Mọi ý kiến đóng góp về mặt học thuật và sư phạm xin gửi qua <a href="https://github.com/oaichu/vietlab-3d/issues" target="_blank" rel="noopener" style="color:var(--phys)">GitHub Issues ↗</a>.
    </div>
  </article>
</main>

${renderFooter()}
<script type="module" src="/assets/site.js"></script>
</body>
</html>`;
}

function buildSitemapXml(courses) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly', img: `${SITE_URL}/covers/haber-step.webp`, title: 'VietLab 3D — 54 Mô phỏng Khoa học 3D GDPT 2018' },
    { loc: `${SITE_URL}/guide/`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/how/`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/about/`, priority: '0.7', changefreq: 'monthly' },
  ];

  for (const c of courses) {
    const img = `${SITE_URL}/covers/${c.slug}.webp`;
    urls.push({
      loc: `${SITE_URL}/c/${c.slug}/`,
      priority: '0.9',
      changefreq: 'weekly',
      img,
      title: `${c.title} — Chi tiết bài giảng & Giải đáp GDPT 2018`,
    });
    urls.push({
      loc: `${SITE_URL}/courses/${c.slug}.html`,
      priority: '0.9',
      changefreq: 'weekly',
      img,
      title: `${c.title} — Phòng thí nghiệm 3D Tương tác`,
    });
  }

  const itemsXml = urls
    .map(
      (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.img
        ? `\n    <image:image>
      <image:loc>${esc(u.img)}</image:loc>
      <image:title>${esc(u.title)}</image:title>
    </image:image>`
        : ''
    }
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${itemsXml}
</urlset>
`;
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function buildLlmsTxt(courses) {
  const bySubj = { phys: [], chem: [], bio: [], geo: [] };
  for (const c of courses) bySubj[c.subject]?.push(c);

  const renderSection = (sKey) => {
    const sMeta = SUBJECTS[sKey];
    const list = bySubj[sKey] || [];
    const lines = list.map((c) => {
      const kb = knowledgeMap[c.slug];
      const eq = kb?.top?.total ? ` | Phương trình/Quy luật: \`${kb.top.total}\`` : '';
      return `- [${c.title}](${SITE_URL}/c/${c.slug}/) ([Mô phỏng 3D](${SITE_URL}/courses/${c.slug}.html)): ${c.question} (${c._textbookStr}${eq})`;
    });
    return `## ${sMeta.name} (${list.length} bài giảng)\n\n${lines.join('\n')}`;
  };

  return `# VietLab 3D — Nền tảng Học liệu Khoa học 3D Tương tác Chuẩn GDPT 2018

> VietLab 3D (${SITE_URL}) là thư viện mã nguồn mở gồm 54 bài giảng mô phỏng 3D tương tác thời gian thực (WebGL2) thuộc 4 môn học THPT tại Việt Nam: Vật lý (10 bài), Hóa học (25 bài), Sinh học (5 bài) và Địa lý (14 bài). Toàn bộ học liệu được chuẩn hóa danh pháp quốc tế IUPAC và đối chiếu với Chương trình Giáo dục Phổ thông 2018 của Bộ Giáo dục và Đào tạo Việt Nam.

## Tài liệu & Liên kết Hệ thống

- [Trang chủ VietLab 3D](${SITE_URL}/): Cổng tra cứu, lọc theo môn/khối lớp/chương học và tìm kiếm toàn bộ 54 bài giảng 3D.
- [Hồ sơ Tri thức Đầy đủ cho AI/LLM (llms-full.txt)](${SITE_URL}/llms-full.txt): Bản tổng hợp toàn bộ phương trình, chuỗi nhân quả, câu hỏi từng bước, kết luận khoa học và giải đáp câu hỏi trắc nghiệm của 54 bài giảng.
- [Danh mục JSON (catalog.json)](${SITE_URL}/catalog.json): Dữ liệu cấu trúc máy đọc của 54 mô phỏng.
- [Hướng dẫn Sử dụng trong Lớp học](${SITE_URL}/guide/): Quy trình dạy học 45 phút, phím tắt và chế độ ngoại tuyến 1 tệp HTML.
- [Phương pháp Xây dựng & Kiểm chứng](${SITE_URL}/how/): Kiến trúc kỹ thuật Three.js WebGL2 và quy trình kiểm chứng dữ kiện khoa học.

${renderSection('phys')}

${renderSection('chem')}

${renderSection('bio')}

${renderSection('geo')}
`;
}

function buildLlmsFullTxt(courses) {
  const sections = courses.map((c, idx) => {
    const sMeta = SUBJECTS[c.subject] || SUBJECTS.phys;
    const kb = knowledgeMap[c.slug] || {};
    const chain = (kb.mainline?.chain || []).map((x) => `${x.k}: ${x.t}`).join(' -> ');
    const units = (kb.units || []).map((u) => `  - ${u.no} ${u.name}: ${u.brief}`).join('\n');
    const steps = (kb.steps || [])
      .map(
        (st) =>
          `  ${st.num}. [${st.tag}] Câu hỏi: ${st.q}\n` +
          (st.eq ? `     - Phương trình/Quy luật: ${st.eq}${st.eqCal ? ` (${st.eqCal})` : ''}\n` : '') +
          (st.concl ? `     - Kết luận: ${st.concl}\n` : '') +
          (st.exam ? `     - Trọng tâm thi cử: ${st.exam}` : '')
      )
      .join('\n');
    const quizzes = (kb.quiz || [])
      .map((qz, qIdx) => {
        const ans = Array.isArray(qz.opts) && qz.opts[qz.ans] ? qz.opts[qz.ans] : '';
        return `  - Q${qIdx + 1}: ${qz.q}\n    Đáp án: ${ans} — Giải thích: ${qz.why}`;
      })
      .join('\n');

    return `## ${idx + 1}. ${c.title} (${sMeta.name})
- Slug: \`${c.slug}\`
- Trang chi tiết: ${SITE_URL}/c/${c.slug}/
- Mô phỏng 3D trực tiếp: ${SITE_URL}/courses/${c.slug}.html
- Vị trí Chương trình GDPT 2018: ${c._textbookStr}
- Câu hỏi trung tâm: ${c.question}
${kb.top?.total ? `- Phương trình / Nguyên lý tổng quát: ${kb.top.total}\n` : ''}${chain ? `- Chuỗi nhân quả cốt lõi: ${chain}\n` : ''}${units ? `- Các trạm/cụm mô hình 3D:\n${units}\n` : ''}- Mạch khám phá từng bước:\n${steps}
${quizzes ? `- Câu hỏi kiểm tra & Giải thích chuẩn GDPT 2018:\n${quizzes}` : ''}`;
  });

  return `# VietLab 3D — Cơ sở Tri thức Toàn văn 54 Mô phỏng Khoa học 3D (GDPT 2018)

> Tài liệu này cung cấp toàn bộ dữ kiện khoa học, phương trình, mạch câu hỏi nhận thức từng bước, kết luận cốt lõi và giải đáp câu hỏi ôn tập của 54 bài giảng 3D trên nền tảng VietLab 3D (${SITE_URL}).

${sections.join('\n\n---\n\n')}
`;
}

function buildReadme(courses) {
  const bySubj = { phys: [], chem: [], bio: [], geo: [] };
  for (const c of courses) bySubj[c.subject]?.push(c);

  const renderTable = (list) =>
    [
      '| Bài giảng | Câu hỏi cốt lõi | Đối chiếu GDPT 2018 | Số bước | Tệp bài giảng |',
      '|---|---|---|:---:|---|',
      ...list.map(
        (c) =>
          `| **${c.title}** | ${c.question} | ${c._textbookStr} | ${c.steps.length} | [\`courses/${c.slug}.html\`](courses/${c.slug}.html) |`
      ),
    ].join('\n');

  return `# VietLab 3D — Thư viện 54 Bài giảng Khoa học 3D Tương tác (Chuẩn GDPT 2018)

Nền tảng học liệu khoa học 3D tương tác mã nguồn mở dành cho giáo viên và học sinh THPT Việt Nam, bao gồm **54 mô phỏng 3D** thuộc 4 bộ môn: **Vật lý (10)**, **Hóa học (25)**, **Sinh học (5)** và **Địa lý (14)**.

- **100% Tiếng Việt chuẩn Chương trình GDPT 2018:** Danh pháp Hóa học quốc tế IUPAC, thuật ngữ Vật lý – Sinh học – Địa lý và hệ thống câu hỏi dẫn dắt theo hướng phát triển năng lực.
- **Đóng gói đơn tệp độc lập (Single-File HTML):** Mỗi bài giảng trong thư mục [\`courses/\`](courses/) là một tệp \`.html\` tự chứa toàn bộ động cơ 3D (Three.js WebGL2), mô hình toán học và giao diện tiếng Việt — chạy mượt trực tiếp trên trình duyệt hoặc tải về sử dụng ngoại tuyến 100%.
- **Tối ưu hóa toàn diện SEO / GEO / AEO:** Tích hợp JSON-LD (\`Course\`, \`LearningResource\`, \`WebApplication\`, \`FAQPage\`), \`sitemap.xml\`, \`robots.txt\`, \`llms.txt\` và \`llms-full.txt\`.

---

## Cấu trúc thư mục

- [\`index.html\`](index.html) — Trang chủ cổng học liệu VietLab 3D (tích hợp bàn thí nghiệm 3D trực tiếp, bộ lọc theo môn/khối lớp/chương học và thanh tìm kiếm tiếng Việt có dấu & không dấu)
- [\`c/<slug>/index.html\`](c/) — 54 trang chi tiết bài giảng (cho phép chạy thử 3D ngay trên trang, xem mạch câu hỏi từng bước, phương trình, kết luận, giải đáp AEO FAQ, tải tệp HTML độc lập hoặc sao chép mã nhúng \`<iframe>\`)
- [\`courses/<slug>.html\`](courses/) — 54 tệp bài giảng 3D tương tác độc lập
- [\`covers/<slug>.webp\`](covers/) — Ảnh bìa độ phân giải cao của 54 bài giảng
- [\`catalog.json\`](catalog.json) — Danh mục dữ liệu chuẩn hóa của toàn bộ 54 bài giảng
- [\`sitemap.xml\`](sitemap.xml), [\`robots.txt\`](robots.txt), [\`llms.txt\`](llms.txt), [\`llms-full.txt\`](llms-full.txt) — Bộ tệp khám phá chuẩn SEO / GEO / AEO
- [\`guide/index.html\`](guide/index.html) — Hướng dẫn sử dụng trong tiết học 45 phút
- [\`how/index.html\`](how/index.html) — Phương pháp xây dựng & kiểm chứng học thuật
- [\`about/index.html\`](about/index.html) — Giới thiệu dự án

---

## Danh mục 54 bài giảng 3D

### 1. Vật lý (10 bài giảng)

${renderTable(bySubj.phys)}

### 2. Hóa học (25 bài giảng)

${renderTable(bySubj.chem)}

### 3. Sinh học (5 bài giảng)

${renderTable(bySubj.bio)}

### 4. Địa lý (14 bài giảng)

${renderTable(bySubj.geo)}

---

## Giấy phép

Phát hành theo giấy phép **CC BY-NC-SA 4.0**. Tự do sử dụng, tải về, chia sẻ và nhúng vào hệ thống học tập cho mục đích giáo dục phi thương mại.
`;
}

// Execute portal build
const booksMeta = buildBooksMeta(catalog);

fs.writeFileSync(path.join(ROOT, 'index.html'), buildHomePage(catalog, booksMeta), 'utf8');

for (const c of catalog) {
  const dir = path.join(ROOT, 'c', c.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildDetailPage(c, catalog), 'utf8');
}

fs.mkdirSync(path.join(ROOT, 'guide'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'guide', 'index.html'), buildGuidePage(), 'utf8');

fs.mkdirSync(path.join(ROOT, 'how'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'how', 'index.html'), buildHowPage(), 'utf8');

fs.mkdirSync(path.join(ROOT, 'about'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'about', 'index.html'), buildAboutPage(), 'utf8');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemapXml(catalog), 'utf8');
fs.writeFileSync(path.join(ROOT, 'robots.txt'), buildRobotsTxt(), 'utf8');
fs.writeFileSync(path.join(ROOT, 'llms.txt'), buildLlmsTxt(catalog), 'utf8');
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), buildLlmsFullTxt(catalog), 'utf8');
fs.writeFileSync(path.join(ROOT, 'README.md'), buildReadme(catalog), 'utf8');

const redirects = catalog.map((c) => `/${c.slug} /courses/${c.slug}.html 200`).join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, '_redirects'), redirects, 'utf8');

console.log(`Built index.html, ${catalog.length} /c/<slug>/index.html pages, /guide/, /how/, /about/, sitemap.xml, robots.txt, llms.txt, llms-full.txt, _redirects, and README.md.`);
