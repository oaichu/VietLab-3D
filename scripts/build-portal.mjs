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
    code: 'PHÂN MÔN VẬT LÝ',
    name: 'Vật lý',
    count: 10,
    cover: '/covers/current-field-step.webp',
    desc: 'Từ định luật II Newton, bảo toàn cơ năng, cảm ứng điện từ đến hiệu ứng quang điện và chuyển động Brown — trực quan hóa các phương trình vật lý bằng thực nghiệm 3D định lượng.',
  },
  chem: {
    key: 'chem',
    code: 'PHÂN MÔN HÓA HỌC',
    name: 'Hóa học',
    count: 25,
    cover: '/covers/haber-step.webp',
    desc: 'Bao quát dây chuyền công nghiệp hóa chất (tổng hợp NH₃, tiếp xúc H₂SO₄, luyện gang thép, điện phân) và các thí nghiệm chuẩn độ, cân bằng, tốc độ phản ứng theo danh pháp IUPAC.',
  },
  bio: {
    key: 'bio',
    code: 'PHÂN MÔN SINH HỌC',
    name: 'Sinh học',
    count: 5,
    cover: '/covers/mitosis-step.webp',
    desc: 'Mô hình hóa cấu trúc vi mô tế bào và phân tử: co và phản co nguyên sinh, vận chuyển chất qua màng sinh chất, dẫn truyền xung thần kinh, chu kỳ nguyên phân và động học enzyme.',
  },
  geo: {
    key: 'geo',
    code: 'PHÂN MÔN ĐỊA LÝ',
    name: 'Địa lý',
    count: 14,
    cover: '/covers/enso-step.webp',
    desc: 'Tái hiện hệ quả chuyển động Trái Đất, hoàn lưu khí quyển, hiện tượng ENSO, dòng biển, vòng tuần hoàn nước và địa mạo sông ngòi – Karst trên sa bàn địa cầu 3D.',
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
  return `<div class="top-ribbon">
  <div class="top-ribbon-in">
    <span class="top-ribbon-left"><span class="top-ribbon-dot"></span>HỆ THỐNG HỌC LIỆU KHOA HỌC TỰ NHIÊN &amp; ĐỊA LÝ 3D · CHUẨN CHƯƠNG TRÌNH GDPT 2018</span>
    <span class="top-ribbon-right">Cấp Trung học Phổ thông (Lớp 10 · 11 · 12) · Học liệu Mở CC BY-NC-SA 4.0</span>
  </div>
</div>
<header class="nav">
  <div class="nav-in">
    <a class="brand" href="/">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>VietLab 3D</span>
      <span class="brand-sub">GDPT 2018 · 54 Bài giảng</span>
    </a>
    <nav class="nav-links" aria-label="Điều hướng chính">
      <a href="/#courses"${activePage === 'home' ? ' class="active"' : ''}>Danh mục Học liệu</a>
      <a href="/guide/"${activePage === 'guide' ? ' class="active"' : ''}>Hướng dẫn Giảng dạy</a>
      <a class="hide-m" href="/how/"${activePage === 'how' ? ' class="active"' : ''}>Tiêu chuẩn Học thuật</a>
      <a class="hide-m" href="/about/"${activePage === 'about' ? ' class="active"' : ''}>Hồ sơ Dự án</a>
      <a class="nav-gh" href="https://github.com/oaichu/vietlab-3d" target="_blank" rel="noopener">Mã nguồn ↗</a>
    </nav>
  </div>
</header>`;
}

function renderFooter() {
  return `<footer class="foot">
  <div class="wrap foot-in">
    <div>
      <strong style="color:var(--fg)">VietLab 3D — Hệ thống Học liệu Mô phỏng Khoa học Tự nhiên &amp; Địa lý 3D</strong>
      <span style="margin-left:10px">Chuẩn Chương trình GDPT 2018 · Giấy phép Học liệu Mở CC BY-NC-SA 4.0</span>
    </div>
    <div class="foot-links">
      <a href="/#courses">Danh mục 54 bài giảng</a>
      <a href="/guide/">Hướng dẫn giảng dạy</a>
      <a href="/how/">Tiêu chuẩn học thuật</a>
      <a href="/about/">Hồ sơ dự án</a>
      <a href="/catalog.json">Dữ liệu JSON</a>
      <a href="/sitemap.xml">Sơ đồ trang</a>
      <a href="/llms.txt">Chỉ mục AI (llms.txt)</a>
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
    <span class="cc-badge">Môn ${esc(sName)}</span>
    <span class="cc-steps">${stepCount} bước học</span>
  </a>
  <div class="cc-body">
    <div class="cc-book">${esc(c._shortBook)}</div>
    <h3 class="cc-title"><a href="/c/${c.slug}/">${esc(c.title)}</a></h3>
    <p class="cc-q">${esc(c.question)}</p>
    <div class="cc-foot">
      <a href="/c/${c.slug}/">Hồ sơ bài giảng →</a>
      <a class="cc-direct" href="/courses/${c.slug}.html" target="_blank" rel="noopener" title="Mở trực tiếp phòng thí nghiệm 3D toàn màn hình">Mở phòng 3D ↗</a>
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
            <span class="sc-count">${s.count} bài giảng</span>
          </div>
          <h3>Môn ${esc(s.name)}</h3>
          <p>${esc(s.desc)}</p>
        </div>
        <div>
          <div class="sc-thumb"><img src="${s.cover}" alt="Mô phỏng 3D môn ${esc(s.name)}" loading="lazy" width="640" height="360"></div>
          <div class="sc-foot" style="margin-top:12px"><span>Tra cứu học liệu môn ${esc(s.name)}</span><span>→</span></div>
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
        alternateName: 'Hệ thống Học liệu Khoa học 3D Tương tác Chuẩn GDPT 2018',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/favicon.svg`,
        description:
          'Thư viện 54 bài giảng mô phỏng 3D tương tác môn Vật lý, Hóa học, Sinh học và Địa lý THPT được chuẩn hóa 100% theo Chương trình Giáo dục Phổ thông 2018 của Bộ Giáo dục và Đào tạo Việt Nam.',
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
  title: 'VietLab 3D — Hệ thống Học liệu Khoa học 3D Tương tác Chuẩn GDPT 2018',
  desc: 'Hệ thống 54 bài giảng mô phỏng 3D tương tác môn Vật lý, Hóa học, Sinh học và Địa lý THPT theo Chương trình GDPT 2018. Mở trực tiếp trên trình duyệt hoặc tải về 1 tệp HTML duy nhất hoạt động ngoại tuyến.',
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
      <div class="hero-left">
        <div>
          <div class="eyebrow"><span class="dot"></span>CHUẨN KIẾN THỨC – KỸ NĂNG · CHƯƠNG TRÌNH GDPT 2018</div>
          <h1>Chuyển hóa lý thuyết sách giáo khoa thành <em>mô hình thực nghiệm 3D trực quan</em> trên bục giảng.</h1>
          <p class="hero-lead">Hệ thống bao quát 54 chuyên đề trọng tâm thuộc 4 bộ môn Vật lý, Hóa học, Sinh học và Địa lý cấp Trung học Phổ thông. Mỗi bài giảng được thiết kế theo tiến trình nhận thức từng bước (Khởi động – Thực nghiệm – Kết luận), hỗ trợ trình chiếu trực tiếp hoặc tải về một tệp HTML độc lập để giảng dạy hoàn toàn ngoại tuyến.</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#courses">Tra cứu 54 bài giảng 3D ↓</a>
            <a class="btn" href="/guide/">Hướng dẫn tổ chức tiết dạy 45 phút</a>
          </div>
        </div>
        <div class="hero-meta">
          <div><strong>54 chuyên đề</strong>Vật lý 10 · Hóa học 25 · Sinh học 5 · Địa lý 14</div>
          <div><strong>Đóng gói 1 tệp</strong>Tải tệp HTML độc lập, vận hành 100% không cần mạng</div>
          <div><strong>Chuẩn GDPT 2018</strong>Đồng bộ danh pháp IUPAC &amp; yêu cầu cần đạt</div>
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
            <a class="hud-open" href="/c/centripetal-step/">Xem hồ sơ bài giảng →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="sec-kicker">MỤC 01 · PHÂN MÔN HỌC LIỆU</div>
          <h2 class="sec-title">Bốn bộ môn Khoa học Tự nhiên &amp; Địa lý cấp THPT</h2>
        </div>
        <p class="sec-sub">Giải quyết triệt để các chủ đề đòi hỏi tư duy không gian 3 chiều: trường lực điện từ, dây chuyền công nghiệp hóa chất, cơ chế sinh học phân tử và hoàn lưu địa cầu.</p>
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
          <div class="sec-kicker">MỤC 02 · HỌC LIỆU TIÊU BIỂU</div>
          <h2 class="sec-title">6 chuyên đề thực nghiệm 3D trọng tâm trong chương trình</h2>
        </div>
        <p class="sec-sub">Đại diện cho 4 bộ môn từ thí nghiệm tế bào quang điện đo hằng số Planck, tháp tổng hợp ammonia Haber–Bosch đến chu kỳ nguyên phân và dao động Nam phương ENSO.</p>
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
          <div class="sec-kicker">MỤC 03 · DANH MỤC TOÀN HỆ THỐNG</div>
          <h2 class="sec-title">Tra cứu toàn bộ học liệu 3D (<span id="fcount">${courses.length}</span> / ${courses.length} bài giảng)</h2>
        </div>
        <p class="sec-sub">Lọc theo phân môn, khối lớp / chuyên đề học tập GDPT 2018, chương sách giáo khoa hoặc nhấn phím <code>/</code> để tìm kiếm nhanh (hỗ trợ cả tiếng Việt có dấu và không dấu).</p>
      </div>

      <div class="fbar">
        <div class="fbar-row">
          <div class="fpills" id="fs" role="tablist" aria-label="Lọc theo bộ môn">
            <button type="button" class="fpill on" data-s="all">Tất cả phân môn <span class="n">${courses.length}</span></button>
            <button type="button" class="fpill" data-s="phys">Vật lý <span class="n">10</span></button>
            <button type="button" class="fpill" data-s="chem">Hóa học <span class="n">25</span></button>
            <button type="button" class="fpill" data-s="bio">Sinh học <span class="n">5</span></button>
            <button type="button" class="fpill" data-s="geo">Địa lý <span class="n">14</span></button>
          </div>
          <div class="fsearch">
            <span class="ic">⌕</span>
            <input id="q" type="search" placeholder="Nhập tên bài học, phương trình, chương SGK…" autocomplete="off" aria-label="Tìm kiếm bài giảng">
            <span class="kbd">/</span>
          </div>
        </div>
        <div class="fsec" id="fb" hidden>
          <span>Khối lớp / Chuyên đề SGK:</span>
          <select id="sb" aria-label="Chọn khối lớp hoặc chuyên đề"></select>
          <span>Chương học:</span>
          <select id="sc" aria-label="Chọn chương học"></select>
        </div>
      </div>

      <div class="cgrid" id="lib">
        ${courses.map((c) => renderCourseCard(c, true)).join('\n        ')}
        <div class="fempty" id="empty" hidden>Không tìm thấy bài giảng phù hợp với điều kiện lọc. Vui lòng thử từ khóa khác hoặc chọn lại «Tất cả phân môn».</div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="sec-kicker">MỤC 04 · NGHIỆP VỤ SƯ PHẠM</div>
          <h2 class="sec-title">Quy trình 4 bước tổ chức tiết dạy học thực nghiệm 45 phút</h2>
        </div>
        <a class="btn" href="/guide/">Xem tài liệu hướng dẫn chi tiết →</a>
      </div>
      <div class="steps">
        <div class="step">
          <div class="step-num">BƯỚC 01 · ĐỐI CHIẾU KẾ HOẠCH BÀI DẠY</div>
          <h3>Tra cứu theo chương mục SGK GDPT 2018</h3>
          <p>Mỗi bài giảng đều định danh rõ khối lớp, chương học và chuyên đề tương ứng trong Chương trình GDPT 2018 để giáo viên tích hợp trực tiếp vào kế hoạch bài dạy (Giáo án Công văn 5512).</p>
        </div>
        <div class="step">
          <div class="step-num">BƯỚC 02 · CHUẨN BỊ HỌC LIỆU</div>
          <h3>Trình chiếu trực tuyến hoặc lưu USB ngoại tuyến</h3>
          <p>Nhấn «Mở phòng 3D» để trình chiếu trực tiếp trên lớp; hoặc tải tệp <code>.html</code> độc lập (~860 KB) vào USB để giảng dạy ổn định ngay cả tại phòng học không có kết nối mạng.</p>
        </div>
        <div class="step">
          <div class="step-num">BƯỚC 03 · TỔ CHỨC HOẠT ĐỘNG NHẬN THỨC</div>
          <h3>Dẫn dắt theo mạch câu hỏi từng bước</h3>
          <p>Sử dụng phím mũi tên <code>←</code> <code>→</code> hoặc thanh tiến trình để tổ chức hoạt động: nêu câu hỏi khởi động, thao tác thông số 3D kiểm chứng, sau đó rút ra kết luận chuẩn SGK.</p>
        </div>
        <div class="step">
          <div class="step-num">BƯỚC 04 · ĐÁNH GIÁ &amp; TỰ HỌC</div>
          <h3>Kiểm tra năng lực vận dụng sau tiết học</h3>
          <p>Bước cuối cùng của mỗi mô phỏng tích hợp bài tập thực hành xử lý tình huống và bộ câu hỏi trắc nghiệm có giải thích chi tiết; hỗ trợ nhúng <code>&lt;iframe&gt;</code> vào LMS của nhà trường.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" style="border-bottom:0">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="sec-kicker">MỤC 05 · TIÊU CHUẨN HỌC THUẬT</div>
          <h2 class="sec-title">Quy trình thẩm định dữ kiện khoa học và đóng gói kỹ thuật</h2>
        </div>
        <a class="btn" href="/how/">Xem hồ sơ phương pháp xây dựng →</a>
      </div>
      <div class="hgrid">
        <div class="hcard">
          <div class="k">GIAI ĐOẠN 01 · THẨM ĐỊNH DỮ KIỆN KHOA HỌC</div>
          <h3>Chuẩn hóa hằng số, phương trình &amp; danh pháp IUPAC</h3>
          <p>Toàn bộ phương trình vật lý, nhiệt động học hóa học, số liệu thực nghiệm và danh pháp quốc tế IUPAC được đối chiếu nghiêm ngặt với Sách giáo khoa GDPT 2018 trước khi lập trình.</p>
        </div>
        <div class="hcard">
          <div class="k">GIAI ĐOẠN 02 · THIẾT KẾ SƯ PHẠM PHÁT TRIỂN NĂNG LỰC</div>
          <h3>Cấu trúc hóa mục tiêu cần đạt thành thao tác 3D</h3>
          <p>Giao diện tuân thủ nguyên tắc sư phạm tinh gọn: mỗi bước học tập trung giải quyết 1 câu hỏi nghiên cứu, 1 thao tác điều khiển biến số và hệ thống kết luận – lưu ý thi cử tường minh.</p>
        </div>
        <div class="hcard">
          <div class="k">GIAI ĐOẠN 03 · ĐÓNG GÓI ĐƠN TỆP &amp; KIỂM ĐỊNH</div>
          <h3>Kiến trúc 1 tệp HTML tự chứa, vận hành 60 FPS</h3>
          <p>Động cơ đồ họa Three.js WebGL2, bộ giải toán học thời gian thực và phông chữ tiếng Việt được biên dịch trọn vẹn vào 1 tệp HTML duy nhất, vượt qua kiểm thử tự động trên mọi thiết bị.</p>
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
  const courseType = kb?.meta?.type || 'Mô phỏng thực nghiệm 3D';

  const related = allCourses
    .filter((x) => x.subject === c.subject && x.slug !== c.slug)
    .slice(0, 6);

  const trackHtml = steps
    .map((st, idx) => {
      const numStr = String(idx + 1).padStart(2, '0');
      return `<li>
        <span class="n">${numStr}</span>
        <div>
          <div class="t">Bước ${idx + 1}: ${esc(st.tag)}</div>
          ${st.q ? `<div class="q">${esc(st.q)}</div>` : ''}
          ${st.eq ? `<div class="step-eq"><code>${esc(st.eq)}</code>${st.eqCal ? ` <span>· ${esc(st.eqCal)}</span>` : ''}</div>` : ''}
          ${st.concl ? `<div class="step-concl"><strong>Kết luận chuẩn SGK:</strong> ${esc(st.concl)}</div>` : ''}
        </div>
      </li>`;
    })
    .join('\n        ');

  const chainHtml = chain.length
    ? `<div class="ch-chain" aria-label="Chuỗi nhân quả cốt lõi">
      <span class="ch-chain-label">Chuỗi logic nhân – quả:</span>
      ${chain
        .map(
          (item, idx) =>
            `<span class="ch-chain-pill"><b>${esc(item.k)}:</b><span>${esc(item.t)}</span></span>${
              idx < chain.length - 1 ? `<span class="ch-chain-sep">${esc(seps[idx] || '→')}</span>` : ''
            }`
        )
        .join('\n      ')}
    </div>`
    : '';

  const unitsSectionHtml = units.length
    ? `<section class="ch-sec">
    <div class="ch-sec-head">
      <h2>Cấu trúc trạm thiết bị &amp; phân khu mô hình 3D (${units.length} phân khu)</h2>
      <span style="font-size:12.5px;color:var(--fg-3);font-family:var(--mono)">Bố cục không gian thực nghiệm 3D</span>
    </div>
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
        badge: `Câu hỏi trắc nghiệm · ${qz.tag || sMeta.name}`,
        q: qz.q,
        concl: ansOpt ? `Đáp án đúng: ${ansOpt}. ${qz.why}` : qz.why,
        eq: '',
        exam: '',
      });
    }
  }

  const faqSectionHtml = faqItems.length
    ? `<section class="ch-sec">
    <div class="ch-sec-head">
      <h2>Câu hỏi Thường gặp &amp; Giải đáp Trọng tâm (Chuẩn kiến thức GDPT 2018)</h2>
      <span style="font-size:12.5px;color:var(--fg-3);font-family:var(--mono)">Hồ sơ hỏi – đáp &amp; lưu ý thi cử</span>
    </div>
    <div class="faq-list">
      ${faqItems
        .map(
          (f, idx) => `<details class="faq-item"${idx < 2 ? ' open' : ''}>
        <summary><span><span class="faq-tag">${esc(f.badge)}</span>${esc(f.q)}</span></summary>
        <div class="faq-body">
          ${f.eq ? `<p><strong>Phương trình / Quy luật áp dụng:</strong> <code>${esc(f.eq)}</code></p>` : ''}
          <p><strong>Giải thích chuẩn SGK:</strong> ${esc(f.concl)}</p>
          ${f.exam ? `<p><strong>Lưu ý trọng tâm khi kiểm tra – đánh giá:</strong> ${esc(f.exam)}</p>` : ''}
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
    <a href="/">Danh mục Học liệu</a><span>/</span>
    <a href="/?s=${c.subject}#courses">Phân môn ${esc(sMeta.name)}</a><span>/</span>
    <span>${esc(c.title)}</span>
  </nav>

  <header class="ch-head">
    <div class="ch-badges">
      <span class="badge badge-s" data-s="${c.subject}">Phân môn ${esc(sMeta.name)}</span>
      <span class="badge">${esc(courseType)}</span>
      <span class="badge">${steps.length} bước thực nghiệm</span>
      ${totalEq ? `<span class="badge">${esc(totalEq)}</span>` : ''}
      <span class="badge badge-v">✓ Chuẩn hóa danh pháp &amp; dữ kiện GDPT 2018</span>
    </div>
    <h1 class="ch-title">${esc(c.title)}</h1>
    <p class="ch-q">${esc(c.question)}</p>
    ${chainHtml}
  </header>

  <section class="ch-main">
    <div class="pv-box">
      <div class="pv-bar">
        <span class="pv-bar-left"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:var(--phys);display:inline-block"></span>KHÔNG GIAN THỰC NGHIỆM 3D · ĐỘNG CƠ WEBGL2</span>
        <div class="pv-bar-actions" role="group" aria-label="Chế độ khung nhìn">
          <button type="button" class="pv-mode-btn on" data-pv-mode="cover">Ảnh minh họa</button>
          <button type="button" class="pv-mode-btn" data-pv-mode="live">Tương tác 3D trực tiếp</button>
        </div>
      </div>
      <div class="pv" id="pv-stage" data-src="/courses/${c.slug}.html">
        <img src="/covers/${c.slug}.webp" alt="${esc(c.title)} — Mô phỏng 3D môn ${esc(sMeta.name)}" width="1280" height="800">
        <div class="pv-cta">
          <button type="button" class="pv-btn" data-pv-start><span class="play">▶</span>Khởi chạy phòng thí nghiệm 3D ngay trên trang</button>
        </div>
      </div>
    </div>

    <aside class="pv-act">
      <h2>Hồ sơ Học liệu &amp; Công cụ Giảng dạy</h2>
      <a class="btn btn-primary" href="/courses/${c.slug}.html" target="_blank" rel="noopener">Mở toàn màn hình (Trình chiếu trên lớp) ↗</a>
      <div class="pv-act-row">
        <a class="btn" href="/courses/${c.slug}.html" download="${c.slug}.html">↓ Tải tệp HTML độc lập</a>
        <details class="act-share">
          <summary class="btn" style="width:100%">⟨/⟩ Mã nhúng LMS</summary>
          <div class="share-pop">
            <div>Mã nhúng <code>&lt;iframe&gt;</code> tích hợp vào LMS / Website trường:</div>
            <code>${esc(iframeSnippet)}</code>
            <button type="button" class="btn" style="padding:5px 10px;font-size:12px" data-copy="${esc(iframeSnippet)}">Sao chép mã nhúng</button>
          </div>
        </details>
      </div>
      <dl class="pv-spec">
        <dt>Mã định danh học liệu</dt><dd>${esc(c.slug)}</dd>
        <dt>Phân môn giảng dạy</dt><dd>${esc(sMeta.name)} THPT</dd>
        <dt>Loại hình mô phỏng</dt><dd>${esc(courseType)}</dd>
        <dt>Tiến trình sư phạm</dt><dd>${steps.length} bước nhận thức</dd>
        <dt>Đóng gói kỹ thuật</dt><dd>1 tệp HTML tự chứa · WebGL2</dd>
        <dt>Vận hành ngoại tuyến</dt><dd>Hoạt động 100% không cần mạng</dd>
        <dt>Giấy phép xuất bản</dt><dd>CC BY-NC-SA 4.0</dd>
        <dt>Góp ý chuyên môn</dt><dd><a href="https://github.com/oaichu/vietlab-3d/issues/new?title=${issueTitle}" target="_blank" rel="noopener" style="color:var(--phys)">Gửi phản hồi học thuật ↗</a></dd>
      </dl>
    </aside>
  </section>

  <section class="ch-sec">
    <div class="ch-sec-head">
      <h2>Phiếu Đối chiếu Chương trình Giáo dục Phổ thông 2018</h2>
      <span style="font-size:12.5px;color:var(--fg-3);font-family:var(--mono)">Tham chiếu lập kế hoạch bài dạy (Công văn 5512)</span>
    </div>
    <div class="sgk-grid">
      <div class="sgk-cell">
        <div class="sgk-k">01 · Phân môn &amp; Cấp học</div>
        <div class="sgk-v"><strong>Môn ${esc(sMeta.name)}</strong> — Cấp Trung học Phổ thông (Chương trình GDPT 2018 của Bộ Giáo dục và Đào tạo).</div>
      </div>
      <div class="sgk-cell">
        <div class="sgk-k">02 · Vị trí trong Sách giáo khoa</div>
        <div class="sgk-v"><strong>${esc(c._textbookStr)}</strong></div>
      </div>
      <div class="sgk-cell">
        <div class="sgk-k">03 · Yêu cầu cần đạt &amp; Học liệu</div>
        <div class="sgk-v">Thực nghiệm trực quan qua <strong>${steps.length} bước</strong>; rèn luyện năng lực tìm hiểu tự nhiên, phân tích đồ thị – phương trình và vận dụng thực tiễn.</div>
      </div>
    </div>
  </section>

  ${unitsSectionHtml}

  <section class="ch-sec">
    <div class="ch-sec-head">
      <h2>Tiến trình Nhận thức &amp; Hoạt động Khám phá (${steps.length} bước học)</h2>
      <span style="font-size:12.5px;color:var(--fg-3);font-family:var(--mono)">Khởi động → Thực nghiệm 3D → Kết luận chuẩn SGK</span>
    </div>
    <ol class="track">
      ${trackHtml}
    </ol>
  </section>

  ${faqSectionHtml}

  <section class="ch-sec" style="border-bottom:0">
    <div class="sec-head" style="margin-bottom:20px">
      <div>
        <div class="sec-kicker">HỌC LIỆU CÙNG PHÂN MÔN</div>
        <h2 class="sec-title">Các bài giảng 3D khác thuộc môn ${esc(sMeta.name)}</h2>
      </div>
      <a class="btn" href="/?s=${c.subject}#courses">Xem toàn bộ ${sMeta.count} bài giảng môn ${esc(sMeta.name)} →</a>
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

function renderDocSidebar(activeDoc, docCode, docScope) {
  return `<aside class="doc-side">
    <div class="doc-side-title">Hồ sơ Tài liệu Nghiệp vụ</div>
    <dl class="doc-meta">
      <dt>Mã tài liệu</dt><dd>${esc(docCode)}</dd>
      <dt>Phạm vi</dt><dd>${esc(docScope)}</dd>
      <dt>Chuẩn đối chiếu</dt><dd>GDPT 2018</dd>
      <dt>Định dạng</dt><dd>HTML5 · WebGL2</dd>
      <dt>Bản quyền</dt><dd>CC BY-NC-SA 4.0</dd>
    </dl>
    <div class="doc-side-title" style="margin-top:8px">Danh mục Tài liệu</div>
    <nav class="doc-nav" aria-label="Điều hướng tài liệu">
      <a href="/guide/"${activeDoc === 'guide' ? ' class="on"' : ''}>01. Hướng dẫn Giảng dạy trên Lớp</a>
      <a href="/how/"${activeDoc === 'how' ? ' class="on"' : ''}>02. Tiêu chuẩn Học thuật &amp; Kỹ thuật</a>
      <a href="/about/"${activeDoc === 'about' ? ' class="on"' : ''}>03. Hồ sơ Dự án &amp; Bản quyền</a>
      <a href="/#courses">04. Tra cứu 54 Bài giảng 3D →</a>
    </nav>
  </aside>`;
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
          { '@type': 'ListItem', position: 2, name: 'Hướng dẫn giảng dạy', item: `${SITE_URL}/guide/` },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi">
<head>
${renderSeoHead({
  title: 'Hướng dẫn Giảng dạy & Tổ chức Tiết học 45 phút — VietLab 3D',
  desc: 'Tài liệu hướng dẫn giáo viên và học sinh THPT khai thác hiệu quả 54 bài giảng mô phỏng 3D tương tác trong tiết học 45 phút, dạy học ngoại tuyến và tự học tại nhà.',
  canonical: `${SITE_URL}/guide/`,
  ogImage: '/covers/current-field-step.webp',
  keywords: 'hướng dẫn dạy học 3D, học liệu số THPT, kế hoạch bài dạy GDPT 2018, thí nghiệm ảo ngoại tuyến, VietLab 3D',
  jsonLd: guideJsonLd,
})}
</head>
<body>
${renderNav('guide')}

<main class="doc-wrap">
  <div class="doc-grid">
    ${renderDocSidebar('guide', 'VL3D-HD-01', 'Giáo viên & Học sinh')}
    <div class="doc-sheet">
      <header class="prose-head">
        <div class="sec-kicker">TÀI LIỆU HƯỚNG DẪN NGHIỆP VỤ SƯ PHẠM · MÃ SỐ VL3D-HD-01</div>
        <h1>Tổ chức tiết dạy học thực nghiệm 45 phút với mô hình 3D tương tác</h1>
        <p>Tài liệu này hướng dẫn quy trình tích hợp 54 bài giảng mô phỏng 3D của VietLab 3D vào kế hoạch bài dạy theo định hướng phát triển phẩm chất và năng lực học sinh (Chương trình GDPT 2018), đảm bảo thao tác nhanh gọn trên bục giảng và vận hành ổn định trong mọi điều kiện hạ tầng phòng học.</p>
      </header>

      <article class="prose">
        <h2>1. Công tác chuẩn bị học liệu trước giờ lên lớp (02 phút)</h2>
        <ul>
          <li><strong>Phương án 1 — Phòng học có kết nối Internet ổn định:</strong> Giáo viên truy cập <a href="/#courses" style="color:var(--phys);font-weight:600">Danh mục Học liệu</a>, lọc theo phân môn và chương học tương ứng trong sách giáo khoa GDPT 2018, sau đó nhấn nút <code>Mở toàn màn hình ↗</code> để trình chiếu trực tiếp.</li>
          <li><strong>Phương án 2 — Phòng học mạng yếu hoặc không có Internet:</strong> Tại trang hồ sơ bài giảng, nhấn nút <code>↓ Tải tệp HTML độc lập</code>. Toàn bộ mô hình không gian 3D, bộ giải phương trình toán học và giao diện tiếng Việt đã được đóng gói trọn vẹn trong <strong>01 tệp <code>.html</code> duy nhất (~860 KB)</strong>. Giáo viên lưu tệp vào USB và mở trực tiếp bằng trình duyệt (Chrome, Edge, Firefox, Safari) trên máy tính lớp học mà không cần cài đặt phần mềm phụ trợ.</li>
        </ul>

        <div class="callout">
          <strong>Lưu ý kỹ thuật khi trình chiếu trên Tivi / Bảng tương tác thông minh:</strong> Sau khi mở phòng thí nghiệm 3D, nhấn phím <code>F11</code> để chuyển sang chế độ toàn màn hình. Tại thanh công cụ góc dưới bên trái mỗi bài giảng luôn tích hợp nút chuyển đổi <strong>Nền Sáng / Nền Tối</strong> — giáo viên nên chọn <em>Giao diện Sáng (Nền giấy sáng chuẩn SGK)</em> khi phòng học mở đèn sáng hoặc có nhiều ánh nắng chiếu trực tiếp vào màn hình.
        </div>

        <h2>2. Hệ thống phím tắt điều khiển trên bục giảng</h2>
        <p>Để không làm gián đoạn mạch giảng bài, toàn bộ 54 phòng thí nghiệm 3D được chuẩn hóa cùng một bộ phím tắt điều khiển thống nhất:</p>
        <div class="kbd-list">
          <div class="kbd-item"><span>Chuyển sang bước nhận thức tiếp theo</span><kbd>→</kbd></div>
          <div class="kbd-item"><span>Quay lại bước nhận thức trước đó</span><kbd>←</kbd></div>
          <div class="kbd-item"><span>Bật / tạm dừng trình chiếu tự động</span><kbd>Space</kbd></div>
          <div class="kbd-item"><span>Đặt lại góc nhìn camera 3D mặc định</span><kbd>R</kbd></div>
          <div class="kbd-item"><span>Xoay mô hình thiết bị 360°</span><kbd>Kéo chuột trái</kbd></div>
          <div class="kbd-item"><span>Phóng to / thu nhỏ chi tiết bộ phận</span><kbd>Con lăn chuột</kbd></div>
        </div>

        <h2>3. Tổ chức hoạt động dạy học theo chu trình nhận thức 3 pha</h2>
        <p>Mỗi bài giảng trong VietLab 3D bao gồm từ 6 đến 10 bước tuần tự, khớp với cấu trúc hoạt động trong Công văn 5512 của Bộ Giáo dục và Đào tạo (<strong>Chuyển giao nhiệm vụ → Thực hiện thực nghiệm → Báo cáo &amp; Kết luận</strong>):</p>
        <ol>
          <li><strong>Pha 1 — Nêu vấn đề và dự đoán hiện tượng:</strong> Khi chuyển sang bước mới, giáo viên chiếu câu hỏi khởi động ở đầu bảng bên trái để học sinh suy nghĩ và đưa ra dự đoán (30–60 giây) trước khi thay đổi thông số.</li>
          <li><strong>Pha 2 — Thao tác thực nghiệm kiểm chứng trên mô hình 3D:</strong> Giáo viên hoặc học sinh lên bảng điều chỉnh thanh trượt, công tắc theo hướng dẫn trong mục <em>Thao tác bước này</em> (hoặc nhấn <code>Tự động thao tác</code>), đồng thời quan sát sự biến đổi của mô hình 3D, đồ thị và mặt cắt kỹ thuật ở bảng bên phải.</li>
          <li><strong>Pha 3 — Chốt kiến thức chuẩn SGK và lưu ý thi cử:</strong> Đối chiếu kết quả quan sát được với mục <em>Kết luận</em>, 4 ý kiến thức cốt lõi và mở thẻ <em>Ghi chú dạy học</em> để phân tích các sai lầm học sinh thường mắc phải trong bài kiểm tra.</li>
        </ol>

        <h2>4. Giao nhiệm vụ tự học và tích hợp vào hệ thống LMS nhà trường</h2>
        <p>Bước cuối cùng của mỗi bài giảng là một <strong>nhiệm vụ thực hành tổng hợp</strong> có chấm điểm tự động kèm bộ câu hỏi trắc nghiệm kiểm tra mức độ hiểu bài. Giáo viên có thể sao chép đoạn mã <code>&lt;iframe&gt;</code> trong mục <em>Mã nhúng LMS</em> trên trang hồ sơ bài giảng để nhúng trực tiếp vào hệ thống quản lý học tập (Canvas, Moodle, Google Sites, Microsoft Teams hoặc Notion) phục vụ học sinh tự ôn luyện tại nhà.</p>
      </article>
    </div>
  </div>
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
        headline: 'Tiêu chuẩn Học thuật & Kiến trúc Kỹ thuật của Hệ thống Học liệu 3D VietLab 3D',
        description:
          'Quy trình thiết kế sư phạm, thẩm định dữ kiện khoa học và kiến trúc kỹ thuật đóng gói đơn tệp HTML của 54 bài giảng 3D tương tác.',
        inLanguage: 'vi-VN',
        author: { '@type': 'EducationalOrganization', name: 'VietLab 3D', url: `${SITE_URL}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ VietLab 3D', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Tiêu chuẩn học thuật', item: `${SITE_URL}/how/` },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi">
<head>
${renderSeoHead({
  title: 'Tiêu chuẩn Học thuật & Kiến trúc Kỹ thuật — VietLab 3D',
  desc: 'Quy trình thiết kế sư phạm, đối chiếu dữ kiện khoa học chuẩn GDPT 2018 và kiến trúc kỹ thuật đóng gói đơn tệp HTML của 54 bài giảng 3D tương tác.',
  canonical: `${SITE_URL}/how/`,
  ogImage: '/covers/photoelectric-step.webp',
  keywords: 'kiến trúc Three.js WebGL2, mô phỏng khoa học định lượng, chuẩn danh pháp IUPAC GDPT 2018, VietLab 3D',
  jsonLd: howJsonLd,
})}
</head>
<body>
${renderNav('how')}

<main class="doc-wrap">
  <div class="doc-grid">
    ${renderDocSidebar('how', 'VL3D-TC-02', 'Hội đồng Chuyên môn')}
    <div class="doc-sheet">
      <header class="prose-head">
        <div class="sec-kicker">HỒ SƠ PHƯƠNG PHÁP &amp; KIẾN TRÚC HỌC LIỆU · MÃ SỐ VL3D-TC-02</div>
        <h1>Tiêu chuẩn thẩm định học thuật &amp; kiến trúc kỹ thuật của 54 phòng thí nghiệm 3D</h1>
        <p>Mỗi bài giảng mô phỏng trong VietLab 3D phải đáp ứng đồng thời hai chuẩn mực khắt khe: tính chính xác định lượng của phương trình khoa học theo Sách giáo khoa GDPT 2018 và tính bền vững của kiến trúc phần mềm khi vận hành tại các cơ sở giáo dục phổ thông.</p>
      </header>

      <article class="prose">
        <h2>1. Bốn nguyên tắc thiết kế học liệu cốt lõi</h2>
        <ul>
          <li><strong>Mô phỏng toán học từ phương trình thực, không dùng hoạt hình tĩnh:</strong> Quỹ đạo chuyển động ném xiên, đường cong chuẩn độ acid – base, dòng điện nạp tụ <code>i(t) = (U/R)·e^(-t/RC)</code> hay cân bằng nhiệt động học tổng hợp ammonia đều được tính toán thời gian thực từ hệ phương trình vi phân và hằng số thực nghiệm chuẩn.</li>
          <li><strong>Chuẩn hóa toàn diện theo Chương trình GDPT 2018:</strong> Danh pháp hóa học quốc tế IUPAC (<em>Sodium, Chlorine, Ammonia, Sulfuric acid, Nitric acid, Iron, Copper…</em>), ký hiệu đại lượng Vật lý và thuật ngữ Sinh học – Địa lý tuân thủ nghiêm ngặt quy định của Bộ Giáo dục và Đào tạo Việt Nam.</li>
          <li><strong>Kiến trúc đóng gói đơn tệp tự chứa (Zero-Dependency Single-File HTML):</strong> Toàn bộ động cơ đồ họa Three.js, chương trình đổ bóng WebGL2, bộ giải toán học và giao diện sư phạm tiếng Việt của mỗi bài giảng được biên dịch gọn vào một tệp <code>.html</code> độc lập duy nhất, loại bỏ hoàn toàn sự phụ thuộc vào máy chủ bên ngoài khi chạy ngoại tuyến.</li>
          <li><strong>Chế bản đồ họa thích ứng môi trường giảng đường:</strong> Hệ thống biển tên thiết bị 3D, sơ đồ mặt cắt kỹ thuật SVG và đồ thị Canvas 2D tự động căn chỉnh tỷ lệ phông chữ tiếng Việt, đồng thời hỗ trợ chuyển đổi tức thời giữa giao diện nền tối phòng thí nghiệm và giao diện nền giấy sáng chuẩn ấn phẩm giáo dục.</li>
        </ul>

        <h2>2. Quy trình thẩm định &amp; phát triển 4 giai đoạn</h2>
        <h3>Giai đoạn 1 — Xác lập hồ sơ dữ kiện khoa học (Scientific Fact Sheet)</h3>
        <p>Trước khi khởi tạo mô hình 3D, các thông số định lượng (nhiệt độ sôi, thế điện cực chuẩn, giới hạn bền vật liệu, công thoát quang điện <code>W₀</code>, góc nghiêng trục Trái Đất <code>23°26′</code>, hướng hoàn lưu khí quyển) được lập bảng đối chiếu chéo với sách giáo khoa và tài liệu chuyên khảo đại học.</p>

        <h3>Giai đoạn 2 — Thiết kế kịch bản sư phạm từng bước (Stepwise Pedagogical Script)</h3>
        <p>Để tránh gây quá tải nhận thức cho học sinh, bảng điều khiển phức tạp được phân rã thành chuỗi 6–10 bước học tuần tự. Tại mỗi bước, hệ thống chỉ mở khóa đúng biến số gắn liền với câu hỏi nghiên cứu của bước đó, giúp học sinh nắm vững bản chất quan hệ nhân – quả trước khi bước vào bài toán tổng hợp.</p>

        <h3>Giai đoạn 3 — Dựng hình học thủ tục 3D &amp; Sơ đồ mặt cắt kỹ thuật</h3>
        <p>Toàn bộ thiết bị thí nghiệm và dây chuyền công nghiệp (buret chuẩn độ, lò cao luyện gang, tháp tổng hợp 4 tầng xúc tác, địa hình Karst, màng đôi phospholipid) được kiến tạo bằng thuật toán hình học thủ tục (procedural geometry) kết hợp vật liệu PBR và mặt cắt SVG động, giữ dung lượng tệp ở mức tối ưu (~850 KB) nhưng đạt tốc độ 60 khung hình/giây.</p>

        <h3>Giai đoạn 4 — Kiểm định tự động &amp; Chuẩn hóa dữ liệu AI/SEO</h3>
        <p>Tất cả 54 bài giảng đều được kiểm tra tự động về cú pháp JavaScript, độ tương thích hiển thị đa màn hình và tích hợp siêu dữ liệu cấu trúc (Schema.org <code>Course</code>, <code>LearningResource</code>, <code>FAQPage</code>, <code>llms.txt</code>) phục vụ tra cứu học thuật chính xác.</p>
      </article>
    </div>
  </div>
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
        name: 'Hồ sơ Dự án VietLab 3D — Hệ thống Học liệu Khoa học 3D Mở Chuẩn GDPT 2018',
        description:
          'Thông tin tổng quan về VietLab 3D — dự án học liệu khoa học 3D tương tác mã nguồn mở dành cho giáo viên và học sinh THPT Việt Nam theo Chương trình GDPT 2018.',
        inLanguage: 'vi-VN',
        mainEntity: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ VietLab 3D', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Hồ sơ dự án', item: `${SITE_URL}/about/` },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi">
<head>
${renderSeoHead({
  title: 'Hồ sơ Dự án & Bản quyền Học liệu Mở — VietLab 3D',
  desc: 'Thông tin chính thức về dự án VietLab 3D — hệ thống 54 học liệu khoa học 3D tương tác mã nguồn mở dành cho giáo viên và học sinh THPT Việt Nam theo Chương trình GDPT 2018.',
  canonical: `${SITE_URL}/about/`,
  ogImage: '/covers/enso-step.webp',
  keywords: 'giới thiệu VietLab 3D, học liệu mở CC BY-NC-SA 4.0, giáo dục STEM Việt Nam, GDPT 2018',
  jsonLd: aboutJsonLd,
})}
</head>
<body>
${renderNav('about')}

<main class="doc-wrap">
  <div class="doc-grid">
    ${renderDocSidebar('about', 'VL3D-HS-03', 'Giáo dục Phổ thông')}
    <div class="doc-sheet">
      <header class="prose-head">
        <div class="sec-kicker">THÔNG TIN DỰ ÁN &amp; BẢN QUYỀN HỌC LIỆU MỞ · MÃ SỐ VL3D-HS-03</div>
        <h1>Học liệu khoa học 3D mở, miễn phí và chuẩn hóa cho giáo dục phổ thông Việt Nam</h1>
        <p>VietLab 3D được xây dựng nhằm cung cấp cho giáo viên và học sinh Trung học Phổ thông trên toàn quốc một hệ thống phòng thí nghiệm ảo 3D chuẩn mực, thu hẹp khoảng cách giữa hình vẽ phẳng trong sách giáo khoa và trực giác không gian thực nghiệm.</p>
      </header>

      <article class="prose">
        <h2>1. Bối cảnh và mục tiêu giáo dục</h2>
        <p>Trong Chương trình Giáo dục Phổ thông 2018 ở các môn Vật lý, Hóa học, Sinh học và Địa lý cấp THPT, nhiều chủ đề trọng tâm đòi hỏi học sinh phải hình dung cấu trúc không gian 3 chiều hoặc quá trình động lực học liên tục: từ quy tắc bàn tay trái của lực từ Lorentz, cấu tạo bên trong tháp tổng hợp ammonia và tháp tiếp xúc sản xuất sulfuric acid, cơ chế điện thế hoạt động qua màng neuron, cho đến hoàn lưu khí quyển Ba ô và dao động Nam phương ENSO.</p>
        <p>Khi chỉ tiếp cận qua sơ đồ tĩnh 2D trên giấy, học sinh dễ rơi vào lối học thuộc lòng công thức mà thiếu sự thấu hiểu cơ chế nhân – quả. VietLab 3D giải quyết bài toán này bằng cách chuyển hóa 54 chuyên đề cốt lõi thành các mô hình 3D tương tác có thể xoay 360°, quan sát mặt cắt kỹ thuật, điều chỉnh biến số và kiểm chứng định lượng ngay lập tức.</p>

        <h2>2. Cam kết phục vụ cộng đồng giáo viên và học sinh Việt Nam</h2>
        <ul>
          <li><strong>Hoàn toàn miễn phí và không rào cản truy cập:</strong> Toàn bộ 54 bài giảng mở trực tiếp trên trình duyệt web tiêu chuẩn, không thu phí, không chứa quảng cáo và không yêu cầu tạo tài khoản đăng nhập.</li>
          <li><strong>Đồng hành cùng các trường học vùng khó khăn về hạ tầng mạng:</strong> Nhờ kiến trúc đóng gói đơn tệp (Single-File HTML), giáo viên có thể tải trọn bộ bài giảng về máy tính hoặc USB một lần duy nhất để sử dụng lâu dài tại các phòng học không có kết nối Internet.</li>
          <li><strong>Chuẩn mực ngôn ngữ và thuật ngữ sư phạm:</strong> Toàn bộ hệ thống câu hỏi dẫn dắt, kết luận bài học, danh pháp hóa học IUPAC và lưu ý kiểm tra – đánh giá được biên soạn và rà soát kỹ lưỡng theo chuẩn Chương trình GDPT 2018.</li>
        </ul>

        <div class="callout">
          <strong>Thông tin Giấy phép &amp; Đóng góp Học thuật:</strong> Hệ thống học liệu VietLab 3D được phát hành theo giấy phép <strong>Creative Commons Ghi nhận Công của Tác giả – Phi thương mại – Chia sẻ Tương tự 4.0 Quốc tế (CC BY-NC-SA 4.0)</strong>, kế thừa và bản địa hóa toàn diện từ dự án mã nguồn mở <em>Tongjiang Lab</em>. Các tổ chức giáo dục, nhà trường và giáo viên được tự do sao chép, lưu trữ và nhúng học liệu vào hệ thống dạy học phi thương mại. Mọi đóng góp chuyên môn xin gửi về <a href="https://github.com/oaichu/vietlab-3d/issues" target="_blank" rel="noopener" style="color:var(--phys);font-weight:600">Cổng tiếp nhận góp ý học thuật trên GitHub ↗</a>.
        </div>
      </article>
    </div>
  </div>
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
      title: `${c.title} — Hồ sơ bài giảng & Giải đáp GDPT 2018`,
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

  return `# VietLab 3D — Hệ thống Học liệu Khoa học 3D Tương tác Chuẩn GDPT 2018

> VietLab 3D (${SITE_URL}) là thư viện mã nguồn mở gồm 54 bài giảng mô phỏng 3D tương tác thời gian thực (WebGL2) thuộc 4 môn học THPT tại Việt Nam: Vật lý (10 bài), Hóa học (25 bài), Sinh học (5 bài) và Địa lý (14 bài). Toàn bộ học liệu được chuẩn hóa danh pháp quốc tế IUPAC và đối chiếu với Chương trình Giáo dục Phổ thông 2018 của Bộ Giáo dục và Đào tạo Việt Nam.

## Tài liệu & Liên kết Hệ thống

- [Trang chủ VietLab 3D](${SITE_URL}/): Cổng tra cứu, lọc theo môn/khối lớp/chương học và tìm kiếm toàn bộ 54 bài giảng 3D.
- [Hồ sơ Tri thức Đầy đủ cho AI/LLM (llms-full.txt)](${SITE_URL}/llms-full.txt): Bản tổng hợp toàn bộ phương trình, chuỗi nhân quả, câu hỏi từng bước, kết luận khoa học và giải đáp câu hỏi trắc nghiệm của 54 bài giảng.
- [Danh mục JSON (catalog.json)](${SITE_URL}/catalog.json): Dữ liệu cấu trúc máy đọc của 54 mô phỏng.
- [Hướng dẫn Giảng dạy trong Lớp học](${SITE_URL}/guide/): Quy trình dạy học 45 phút, phím tắt và chế độ ngoại tuyến 1 tệp HTML.
- [Tiêu chuẩn Học thuật & Kỹ thuật](${SITE_URL}/how/): Kiến trúc kỹ thuật Three.js WebGL2 và quy trình kiểm chứng dữ kiện khoa học.

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

  return `# VietLab 3D — Hệ thống 54 Bài giảng Khoa học 3D Tương tác (Chuẩn GDPT 2018)

Nền tảng học liệu khoa học 3D tương tác mã nguồn mở dành cho giáo viên và học sinh THPT Việt Nam, bao gồm **54 mô phỏng 3D** thuộc 4 bộ môn: **Vật lý (10)**, **Hóa học (25)**, **Sinh học (5)** và **Địa lý (14)**.

- **100% Tiếng Việt chuẩn Chương trình GDPT 2018:** Danh pháp Hóa học quốc tế IUPAC, thuật ngữ Vật lý – Sinh học – Địa lý và hệ thống câu hỏi dẫn dắt theo hướng phát triển năng lực.
- **Đóng gói đơn tệp độc lập (Single-File HTML):** Mỗi bài giảng trong thư mục [\`courses/\`](courses/) là một tệp \`.html\` tự chứa toàn bộ động cơ 3D (Three.js WebGL2), mô hình toán học và giao diện tiếng Việt — chạy mượt trực tiếp trên trình duyệt hoặc tải về sử dụng ngoại tuyến 100%.
- **Tối ưu hóa toàn diện SEO / GEO / AEO:** Tích hợp JSON-LD (\`Course\`, \`LearningResource\`, \`WebApplication\`, \`FAQPage\`), \`sitemap.xml\`, \`robots.txt\`, \`llms.txt\` và \`llms-full.txt\`.

---

## Cấu trúc thư mục

- [\`index.html\`](index.html) — Trang chủ cổng học liệu VietLab 3D (tích hợp bàn thí nghiệm 3D trực tiếp, bộ lọc theo môn/khối lớp/chương học và thanh tìm kiếm tiếng Việt có dấu & không dấu)
- [\`c/<slug>/index.html\`](c/) — 54 trang hồ sơ bài giảng (cho phép chạy thử 3D ngay trên trang, xem phiếu đối chiếu GDPT 2018, mạch câu hỏi từng bước, phương trình, kết luận, giải đáp AEO FAQ, tải tệp HTML độc lập hoặc sao chép mã nhúng \`<iframe>\`)
- [\`courses/<slug>.html\`](courses/) — 54 tệp bài giảng 3D tương tác độc lập
- [\`covers/<slug>.webp\`](covers/) — Ảnh bìa độ phân giải cao của 54 bài giảng
- [\`catalog.json\`](catalog.json) — Danh mục dữ liệu chuẩn hóa của toàn bộ 54 bài giảng
- [\`sitemap.xml\`](sitemap.xml), [\`robots.txt\`](robots.txt), [\`llms.txt\`](llms.txt), [\`llms-full.txt\`](llms-full.txt) — Bộ tệp khám phá chuẩn SEO / GEO / AEO
- [\`guide/index.html\`](guide/index.html) — Hướng dẫn giảng dạy trong tiết học 45 phút
- [\`how/index.html\`](how/index.html) — Tiêu chuẩn học thuật & kiến trúc kỹ thuật
- [\`about/index.html\`](about/index.html) — Hồ sơ dự án & bản quyền học liệu mở

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
