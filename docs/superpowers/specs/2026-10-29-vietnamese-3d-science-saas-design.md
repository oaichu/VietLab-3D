# VietLab 3D — Nền tảng Mô phỏng Khoa học Tự nhiên & Địa lý 3D Chuẩn SaaS (Bản Thiết kế Kỹ thuật)

- **Ngày lập:** 2026-10-29
- **Trạng thái:** Đã được phê duyệt bởi Người dùng & Hội đồng Chuyên môn 5 Thành viên
- **Thư mục dự án:** `D:\tongjiang-lab` (liên kết tại `C:\Users\HOME\tongjiang-lab`)
- **Tham chiếu gốc:** `https://github.com/smithjohn78390/tongjiang-lab` & `https://lab.tongjiang.app/`

---

## 1. Tầm nhìn & Mục tiêu (Vision & Objectives)

Chuyển đổi toàn diện kho học liệu 3D `tongjiang-lab` thành **VietLab 3D** — nền tảng mô phỏng khoa học tương tác 3D bằng tiếng Việt đạt chuẩn **Precision Scientific SaaS**:
1. **Việt hóa 100% không sót ký tự CJK:** Toàn bộ `catalog.json`, giao diện cổng thông tin (Portal), khung điều khiển 3D dùng chung (`Ip`, `o0`/`s0`, `Lp`, `r0`) và toàn bộ 55 bài giảng độc lập (`courses/*.html`) được biên dịch sang thuật ngữ tiếng Việt chuẩn xác theo **Chương trình Giáo dục Phổ thông 2018 (GDPT 2018)** của Bộ GD&ĐT.
2. **Trải nghiệm Website đạt và vượt chuẩn `lab.tongjiang.app`:**
   - **Trang chủ (`/index.html`):** Thanh điều hướng dính (Sticky Command Bar), Hero tương tác 3D trực tiếp (hạt mang điện chuyển động trong từ trường đều — lực Lorentz / Cyclotron với thanh trượt `B`, `v`, nút đảo hạt `Proton p⁺` / `Phản proton p⁻`, đọc tức thời bán kính quỹ đạo $r$ và chu kỳ $T$), 4 thẻ bộ môn (Vật lý, Hóa học, Sinh học, Địa lý), bài giảng tiêu biểu, thư viện 55 bài giảng lọc đa chiều (Tìm kiếm `/` + Môn học + Sách/Khối lớp + Chương/Chuyên đề), quy trình 4 bước dạy học trên lớp, phương pháp kiểm định 4 lớp và chân trang.
   - **55 Trang chi tiết bài giảng (`/c/<slug>/index.html`):** Breadcrumb, huy hiệu môn học & trạng thái kiểm định, câu hỏi trọng tâm (`lead`), khung xem trước 16:9 tích hợp **Chế độ Chạy thử 3D trực tiếp ngay trên trang (Live Interactive Stage)** bên cạnh nút Mở toàn màn hình, Tải file HTML độc lập chạy offline, Sao chép mã nhúng `<iframe>`, Báo lỗi học liệu, Lộ trình từng bước giảng giải (`<ol class="track">`), hộp đối chiếu SGK GDPT 2018, và danh sách bài giảng cùng chuyên đề.
   - **Các trang chuyên đề:** `/guide/index.html` (Hướng dẫn sử dụng trong lớp học), `/how/index.html` (Phương pháp xây dựng & kiểm định 4 lớp), `/about/index.html` (Giới thiệu dự án & bản quyền MIT).

---

## 2. Thiết kế từ Hội đồng Chuyên môn 5 Thành viên

### 2.1. Thành viên 1 — Kiến trúc sư trưởng SaaS UI/UX (`anti-slop-ui`)
- **Triết lý thị giác:** *Precision Scientific SaaS* — kết hợp sự tinh gọn của tài liệu kỹ thuật hiện đại (Stripe Docs / Linear) với độ tương phản rõ nét của bàn thí nghiệm quang-cơ-điện. Tuyệt đối không dùng gradient tím-hồng-xanh neon (AI slop), không lạm dụng hiệu ứng phát sáng lòe loẹt.
- **Hệ thống Token Màu sắc (CSS Variables):**
  - `--bg: #F8FAFC` (Nền trang Slate Alabaster dịu mắt)
  - `--paper: #FFFFFF` (Thẻ nội dung nổi)
  - `--paper-2: #F1F5F9` (Bề mặt phụ, ô tìm kiếm, hộp thông tin SGK)
  - `--ink: #0F172A`, `--ink-2: #334155`, `--ink-3: #64748B`, `--ink-4: #94A3B8`
  - `--line: #E2E8F0`, `--line-2: #CBD5E1` (Đường viền 1px sắc nét)
  - `--brand: #0284C7`, `--brand-2: #0369A1`, `--brand-bg: #F0F9FF`
  - **Mã màu bộ môn:**
    - Vật lý (`phys`): `--phys: #2563EB`, `--phys-bg: #EFF6FF`
    - Hóa học (`chem`): `--chem: #0D9488`, `--chem-bg: #F0FDFA`
    - Sinh học (`bio`): `--bio: #16A34A`, `--bio-bg: #F0FDF4`
    - Địa lý (`geo`): `--geo: #D97706`, `--geo-bg: #FFFBEB`
- **Hệ thống Typography hỗ trợ hoàn hảo tiếng Việt:**
  - `--sans: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - `--serif: 'Newsreader', 'Lora', 'Noto Serif', Georgia, serif` (dùng có chọn lọc cho tiêu đề lớn mang tính học thuật)
  - `--mono: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace` kèm `font-variant-numeric: tabular-nums` cho toàn bộ số đo vật lý/hóa học, chỉ số bước và phím tắt.

### 2.2. Thành viên 2 — Chuyên gia Chương trình GDPT 2018 & Sư phạm KHTN
- **Chuẩn hóa phân loại Sách giáo khoa & Chuyên đề (`#books` & `catalog.json`):**
  - Ánh xạ toàn bộ các quyển `必修 / 选择性必修` sang cấu trúc **Chương trình GDPT 2018 (Lớp 10, Lớp 11, Lớp 12 & Chuyên đề học tập)**:
    - **Vật lý (10 bài):** Vật lý 10 (Động học & Động lực học; Công, Năng lượng & Chuyển động tròn), Vật lý 11 (Dao động & Sóng; Điện trường & Dòng điện), Vật lý 12 (Từ trường & Cảm ứng điện từ; Vật lý lượng tử & Hạt nhân).
    - **Hóa học (26 bài):** Hóa học 10 (Cấu tạo nguyên tử & Liên kết hóa học; Phản ứng oxi hóa - khử & Tốc độ phản ứng), Hóa học 11 (Cân bằng hóa học & Hóa học công nghiệp Nitrogen–Sulfur; Đại cương & Hóa hữu cơ), Hóa học 12 (Điện hóa học & Pin – Điện phân; Phức chất, Tinh thể & Công nghiệp Hóa chất), Thực hành Thí nghiệm Hóa học.
    - **Sinh học (5 bài):** Sinh học 10 (Trao đổi chất & Chuyển hóa năng lượng tế bào; Chu kỳ tế bào & Phân bào), Sinh học 12 (Cơ chế di truyền cấp độ phân tử).
    - **Địa lý (14 bài):** Địa lý 10 (Trái Đất trong Hệ Mặt Trời & Hệ quả chuyển động; Thạch quyển, Kiến tạo mảng & Nội/Ngoại lực; Khí quyển & Hoàn lưu khí quyển; Thủy quyển, Chu trình nước & Dòng biển).
- **Danh pháp Hóa học & Vật lý:** Kết hợp chuẩn IUPAC tiếng Việt theo GDPT 2018 và tên gọi phổ thông quen thuộc (ví dụ: *Sodium (Natri)*, *Potassium (Kali)*, *Ammonia ($\text{NH}_3$)*, *Sulfuric acid ($\text{H}_2\text{SO}_4$)*, *Ethanol*, *Ethyl acetate*, *Lực Lorentz*, *Hiệu ứng quang điện*).

### 2.3. Thành viên 3 — Kỹ sư Đồ họa 3D & WebGL
- **Bảo toàn engine vật lý & đồ họa:** Giữ nguyên toàn bộ mã nguồn Three.js r183 đã đóng gói trong từng file `courses/*.html` và `assets/hero.js`.
- **Tinh chỉnh bố cục HUD 3D (`Lp`, `r0`) cho tiếng Việt:**
  - Cập nhật `--font` và `--num` trong `Lp` và `r0` để ưu tiên font chữ hỗ trợ tiếng Việt sắc nét (`"Be Vietnam Pro", "Inter", "Segoe UI", system-ui, sans-serif`).
  - Nới nhẹ độ rộng tối đa và `line-height` của các nhãn `.chip`, `.lab`, `.anno`, `#left .cq`, `.slh .lb` để văn bản tiếng Việt hiển thị thoáng, không bị cắt chữ trên màn hình 1366×768.

### 2.4. Thành viên 4 — Kỹ sư Ngôn ngữ & Tự động hóa Biên dịch
- **Kiến trúc 2 tầng cho 55 file `courses/*.html`:**
  1. **Tầng Shared Shell (`Ip`, `Lp`, `s0`, `o0`, `l0`):**
     - Thay thế từ điển `Ip` bằng bản tiếng Việt hoàn chỉnh (`Mục lục`, `Kiểm tra`, `Hướng dẫn`, `Toàn màn hình`, `Tên thiết bị`, `Đang chạy`, `Đã dừng`, `Cảnh báo`, `Sự cố`, `Câu hỏi trọng tâm`, `Chuỗi nhân quả`, `Các bước`, `Bước này`, `Câu hỏi → Thao tác → Kết luận + Trọng tâm + Điểm thi`, `Thu gọn`, `Phương trình · Điều kiện`, `Thử thao tác`, `Hiện tượng quan sát`, `Kết luận cốt lõi`, `Trọng tâm ghi nhớ`, `Lưu ý thi cử`, `Lộ trình`, `Tổng thể`, `Mở kết luận`, `Đã mở kết luận`, `Đặt lại bước này`, `Đã thực hiện`, `Chưa thực hiện`, `Căn cứ`, `Bước`, `‹ Bước trước`, `Bước tiếp ›`, `Bảng điều khiển`, `Kéo thanh trượt để quan sát sự thay đổi toàn cục`, `← Về bảng điều khiển`, `Dải đo`, `SGK`, `Tham chiếu`, `Điều kiện chuẩn`, `Chạy máy`, `Dừng máy`, `Mục tiêu bài học`, `Đạt chuẩn`, `Chưa đạt`, `Nhật ký thí nghiệm`, `Ghi 1 tổ hợp`, `Kiểm tra nhanh`, `Phân tích sự cố`, `Hướng dẫn & Phím tắt`...).
     - Thay thế nhãn mặt cắt trong `s0` và `o0` (`Nắp đỉnh`, `Giỏ xúc tác`, `tầng xúc tác`, `Ống làm nguội trung gian`, `Ống trung tâm`, `Khoang tách đáy`, `① Giảng giải`, `② Tách lớp 3D`, `③ Sơ đồ mặt cắt`, `Ghép lại`, `Tách rời`, `Giữ nguyên`, `Lắp lại`, `← Câu trước`, `Câu tiếp →`, `Phát liên tục ▶`, `In / Xuất PDF`, `Sơ đồ mặt cắt kỹ thuật`).
     - Thay thế CSS `.sl.hi .slh .lb::after,.sw.hi .nm::after{content:"\u672C\u6B65"` thành `content:"Bước này"`.
  2. **Tầng Course Module (phần định nghĩa bài học ở cuối mỗi file `courses/<slug>.html`):**
     - Mỗi bài giảng có phần đuôi từ sau hàm `p_(i,t,e){...}` đến `l0({...});</script>`.
     - Trích xuất phần đuôi của cả 55 bài giảng, dịch toàn bộ chuỗi hiển thị người dùng (`<title>`, `top`, `mainline`, `units`, `layers`, `steps`, `foot`, `quiz`, `help`, `accident`, `CONSOLE`/`uh`, nhãn 3D `labels` trong `world`, và `section` nếu có) sang tiếng Việt chuẩn xác, đồng thời **giữ nguyên 100% các mã định danh biến trạng thái (`key`, `id`, `unit`, `hi`, `ans`, `v`) và biểu thức toán học**.

### 2.5. Thành viên 5 — Chuyên gia QA, Hiệu năng & Accessibility
- **Bộ công cụ kiểm định tự động (`scripts/verify-all.mjs`):**
  - Kiểm tra cú pháp JavaScript (`new Function` / `vm.Script` hoặc `node --check`) cho khối script của cả 55 file `courses/*.html`, `assets/site.js`, và `assets/hero.js`.
  - Quét ký tự CJK (`[\u4e00-\u9fff]`) trên toàn bộ `catalog.json`, `index.html`, `guide/index.html`, `how/index.html`, `about/index.html`, 55 trang `c/<slug>/index.html`, và toàn bộ chuỗi giao diện trong 55 file `courses/*.html` để đảm bảo **0 ký tự tiếng Trung sót lại trên giao diện**.
  - Kiểm tra tính toàn vẹn của liên kết, ảnh bìa (`covers/<slug>.webp`), chức năng lọc và nhúng trực tiếp.

---

## 3. Cấu trúc Thư mục & Tập tin Đích

```text
D:\tongjiang-lab\
├── index.html                  # Trang chủ SaaS với Hero 3D tương tác & Bộ lọc 55 bài giảng
├── catalog.json                # Danh mục 55 bài giảng đã Việt hóa 100% + metadata GDPT 2018
├── README.md                   # Tài liệu dự án bằng tiếng Việt
├── assets/
│   ├── site.css                # Hệ thống thiết kế Precision Scientific SaaS (Anti-Slop UI)
│   ├── site.js                 # Bộ lọc đa chiều, tìm kiếm '/', xem thử 3D trực tiếp, copy/share
│   └── hero.js                 # Mô hình 3D Lực Lorentz / Cyclotron đã Việt hóa nhãn 3D
├── c/
│   └── <slug>/
│       └── index.html          # 55 trang chi tiết bài giảng (/c/photoelectric-step/, v.v.)
├── guide/
│   └── index.html              # Trang Hướng dẫn sử dụng trong lớp học
├── how/
│   └── index.html              # Trang Phương pháp xây dựng & Kiểm định 4 lớp
├── about/
│   └── index.html              # Trang Giới thiệu dự án & Bản quyền MIT
├── courses/
│   └── <slug>.html             # 55 bài giảng 3D độc lập (single-file HTML) đã Việt hóa 100%
├── covers/
│   └── <slug>.webp             # 55 ảnh bìa WebP tốc độ cao
└── scripts/
    ├── extract-tails.mjs       # Trích xuất phần dữ liệu riêng của 55 bài giảng để biên dịch
    ├── localize-shell.mjs      # Việt hóa tầng Shared Shell (Ip, Lp, s0, o0)
    ├── compile-courses.mjs     # Ghép Shared Shell tiếng Việt + Course Tail tiếng Việt & kiểm tra cú pháp
    ├── build-portal.mjs        # Sinh tự động index.html, 55 trang /c/<slug>/, /guide/, /how/, /about/
    └── verify-all.mjs          # Kiểm định tự động toàn diện (Syntax + Zero CJK + Links)
```
