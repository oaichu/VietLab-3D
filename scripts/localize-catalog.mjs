import fs from 'fs';

const origPath = 'D:/tongjiang-lab/data/orig-catalog.json';
const catPath = 'D:/tongjiang-lab/catalog.json';

if (!fs.existsSync(origPath)) {
  fs.copyFileSync(catPath, origPath);
}

const LOCALIZED_CATALOG = [
  {
    slug: "haber-step",
    subject: "chem",
    title: "Công nghiệp tổng hợp Ammonia (Quy trình Haber–Bosch)",
    type: "Quy trình công nghiệp",
    question: "Làm thế nào để biến khí nitrogen trong không khí thành ammonia vừa nhanh, hiệu suất cao, lại tiết kiệm chi phí?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 1: Cân bằng hóa học · Bài: Điều khiển tốc độ phản ứng và cân bằng hóa học",
      "Hóa học 11 (GDPT 2018) · Chương 2: Nitrogen và Sulfur · Bài: Ammonia và muối ammonium"
    ],
    steps: [
      "Vì sao xây nhà máy",
      "Vì sao phải tinh chế",
      "Vì sao tăng áp suất",
      "Vì sao cần nhiệt độ cao",
      "Cấu tạo tháp tổng hợp",
      "Vì sao phải tuần hoàn khí",
      "Kiểm tra · Ca trưởng vận hành"
    ],
    file: "courses/haber-step.html",
    cover: "covers/haber-step.webp",
    online: "/c/haber-step/"
  },
  {
    slug: "river-step",
    subject: "geo",
    title: "Sự hình thành và phát triển địa hình sông ngòi",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao đường bờ sông ở các khúc uốn liên tục dịch chuyển — bờ nào bị xói lở, bờ nào được bồi tụ?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 3: Thạch quyển — Nội lực và Ngoại lực · Bài: Tác động của ngoại lực đến địa hình bề mặt Trái Đất"
    ],
    steps: [
      "Làm quen sa bàn",
      "Thung lũng chữ V vùng núi",
      "Mặt cắt thung lũng sông",
      "Nón phóng vật (Quạt bồi tụ)",
      "Bờ lõm và bờ lồi",
      "Bãi bồi ven sông",
      "Châu thổ (Đồng bằng tam giác)",
      "Kiểm tra · Mùa lũ về"
    ],
    file: "courses/river-step.html",
    cover: "covers/river-step.webp",
    online: "/c/river-step/"
  },
  {
    slug: "rate-step",
    subject: "chem",
    title: "Các yếu tố ảnh hưởng đến tốc độ phản ứng hóa học",
    type: "Nguyên lý & Hiện tượng",
    question: "Cùng là phản ứng hóa học, vì sao có phản ứng xong trong vài giây, có phản ứng phải chờ hàng giờ? Yếu tố nào quyết định tốc độ?",
    textbook: [
      "Hóa học 10 (GDPT 2018) · Chương 6: Tốc độ phản ứng hóa học · Bài: Các yếu tố ảnh hưởng đến tốc độ phản ứng"
    ],
    steps: [
      "Làm quen bàn thí nghiệm",
      "Ảnh hưởng của nồng độ",
      "Ảnh hưởng của nhiệt độ",
      "Vai trò chất xúc tác",
      "Đo tốc độ định lượng",
      "Góc nhìn vi mô",
      "Sai số và lỗi thao tác",
      "Kiểm tra · Kỹ thuật viên"
    ],
    file: "courses/rate-step.html",
    cover: "covers/rate-step.webp",
    online: "/c/rate-step/"
  },
  {
    slug: "insolation-step",
    subject: "geo",
    title: "Chuyển động biểu kiến của Mặt Trời, các mùa và năm đới khí hậu",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao góc nhập xạ lúc chính ngọ và hướng Mặt Trời tại địa phương lại biến đổi tuần hoàn trong suốt một năm?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 2: Trái Đất — Hệ quả chuyển động · Bài: Hệ quả địa lý các chuyển động của Trái Đất"
    ],
    steps: [
      "Góc nghiêng hoàng đạo",
      "Chuyển động biểu kiến",
      "Góc chiếu lúc chính ngọ",
      "Phân bố theo vĩ độ",
      "Biến thiên trong năm",
      "Hướng Mặt Trời chính ngọ",
      "Bốn mùa trong năm",
      "Năm đới nhiệt",
      "Kiểm tra · Xác định vĩ độ"
    ],
    file: "courses/insolation-step.html",
    cover: "covers/insolation-step.webp",
    online: "/c/insolation-step/"
  },
  {
    slug: "ball-stick-step",
    subject: "chem",
    title: "Lắp ráp mô hình rỗng (cầu – que) khám phá cấu trúc phân tử hữu cơ",
    type: "Mô phỏng Nguyên lý & Hiện tượng",
    question: "Công thức cấu tạo vẽ trên giấy là mặt phẳng, vậy hình dạng không gian 3 chiều thực sự của phân tử hữu cơ trông như thế nào?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 3: Đại cương hóa học hữu cơ · Bài: Cấu tạo hóa học hợp chất hữu cơ"
    ],
    steps: [
      "Hộp linh kiện nguyên tử",
      "Phân tử Methane (CH₄)",
      "Phân tử Dichloromethane",
      "Sự quay quanh liên kết đơn",
      "Mạch carbon",
      "Hiện tượng đồng phân",
      "Ethylene và Acetylene",
      "Vòng Benzene (C₆H₆)",
      "Kiểm tra thực hành"
    ],
    file: "courses/ball-stick-step.html",
    cover: "covers/ball-stick-step.webp",
    online: "/c/ball-stick-step/"
  },
  {
    slug: "titration-step",
    subject: "chem",
    title: "Chuẩn độ trung hòa acid mạnh – base mạnh",
    type: "Nguyên lý & Hiện tượng",
    question: "Nhỏ hơn 20 mL đầu gần như không đổi màu, vì sao chỉ nửa giọt cuối cùng lại làm dung dịch đổi màu đột ngột?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 1: Cân bằng hóa học · Bài: pH của dung dịch và Chuẩn độ acid – base"
    ],
    steps: [
      "Hệ thống dụng cụ chuẩn độ",
      "Tráng rửa và đuổi bọt khí",
      "Lấy mẫu và thêm chất chỉ thị",
      "Nhỏ dung dịch chuẩn",
      "Khống chế nửa giọt cuối",
      "Đọc thể tích và tính toán",
      "Góc nhìn vi mô (Đường cong pH)",
      "Phân tích sai số thao tác",
      "Kiểm tra · Kỹ thuật viên chuẩn độ"
    ],
    file: "courses/titration-step.html",
    cover: "covers/titration-step.webp",
    online: "/c/titration-step/"
  },
  {
    slug: "chlorine-step",
    subject: "chem",
    title: "Điều chế và tính chất của khí Chlorine (Cl₂)",
    type: "Nguyên lý & Hiện tượng",
    question: "Để thu được một bình khí chlorine khô và tinh khiết, mỗi bình rửa khí trong dây chuyền đảm nhiệm vai trò gì?",
    textbook: [
      "Hóa học 10 (GDPT 2018) · Chương 7: Nguyên tố nhóm VIIA (Halogen) · Bài: Đơn chất vùng Halogen và Chlorine"
    ],
    steps: [
      "Tổng quan bộ dụng cụ",
      "Vì sao phải đun nóng",
      "Vì sao dùng HCl đặc",
      "Bình rửa thứ nhất giữ gì",
      "Bình rửa thứ hai giữ gì",
      "Phương pháp thu khí",
      "Xử lý khí chlorine dư",
      "Thành phần nước chlorine",
      "Kiểm tra · Thí nghiệm viên"
    ],
    file: "courses/chlorine-step.html",
    cover: "covers/chlorine-step.webp",
    online: "/c/chlorine-step/"
  },
  {
    slug: "blast-furnace-step",
    subject: "chem",
    title: "Luyện gang trong lò cao",
    type: "Quy trình công nghiệp",
    question: "Quặng sắt đổ từ đỉnh lò xuống, làm sao chỉ sau vài giờ đã hóa thành dòng gang nóng chảy ở đáy lò?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 6: Đại cương về kim loại · Bài: Tách kim loại và tái chế kim loại"
    ],
    steps: [
      "Từ quặng sắt thành gang",
      "Nạp liệu phân lớp",
      "Mặt cắt cấu tạo lò cao",
      "Đốt cháy than cốc ở mắt gió",
      "Khử oxit sắt theo từng tầng",
      "Đá vôi tạo xỉ tách tạp chất",
      "Bài toán nhiệt độ gió nóng",
      "Kiểm tra · Ca trưởng lò cao"
    ],
    file: "courses/blast-furnace-step.html",
    cover: "covers/blast-furnace-step.webp",
    online: "/c/blast-furnace-step/"
  },
  {
    slug: "smelting-step",
    subject: "chem",
    title: "Luyện kim: Điện phân nóng chảy Al₂O₃ & Phản ứng nhiệt nhôm",
    type: "Quy trình công nghiệp",
    question: "Vì sao nhôm chỉ có thể tách ra bằng dòng điện, trong khi sắt lại có thể được nhôm đẩy ra khỏi oxit?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 6: Đại cương về kim loại · Bài: Tách kim loại và tái chế kim loại"
    ],
    steps: [
      "Ba khu vực luyện kim",
      "Vì sao nhôm phải điện phân",
      "Mặt cắt bể điện phân nhôm",
      "Sự dịch chuyển của các ion",
      "Vai trò của Cryolite (Na₃AlF₆)",
      "Bài toán tiêu hao điện năng",
      "Phản ứng nhiệt nhôm hàn đường ray",
      "Kiểm tra · Kỹ sư vận hành"
    ],
    file: "courses/smelting-step.html",
    cover: "covers/smelting-step.webp",
    online: "/c/smelting-step/"
  },
  {
    slug: "currents-step",
    subject: "geo",
    title: "Quy luật phân bố dòng biển trên thế giới và hệ quả địa lý",
    type: "Nguyên lý & Hiện tượng",
    question: "Hàng vạn chú vịt đồ chơi rơi xuống biển vì sao lại trôi dạt đến khắp các bờ đại dương trên thế giới?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 5: Thủy quyển — Vòng tuần hoàn nước và Dòng biển · Bài: Sóng, thủy triều và dòng biển"
    ],
    steps: [
      "Gió đẩy nước tạo dòng",
      "Vòng hoàn lưu vĩ độ thấp",
      "Vòng hoàn lưu vĩ độ cao",
      "Dòng biển nóng và lạnh",
      "Thí nghiệm đảo chiều tự quay",
      "Tính chất nước biển",
      "Ảnh hưởng đến khí hậu ven bờ",
      "Hình thành ngư trường lớn",
      "Kiểm tra · Bốn trạm hải lưu"
    ],
    file: "courses/currents-step.html",
    cover: "covers/currents-step.webp",
    online: "/c/currents-step/"
  },
  {
    slug: "enso-step",
    subject: "geo",
    title: "Tương tác Biển – Khí quyển: Hiện tượng El Niño và La Niña (ENSO)",
    type: "Nguyên lý & Hiện tượng",
    question: "Ven bờ Peru quanh năm khô hạn, vì sao khi nước biển ấm lên bất thường lại gây mưa lũ lịch sử?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 5: Thủy quyển — Vòng tuần hoàn nước và Dòng biển · Bài: Sóng, thủy triều và dòng biển",
      "Địa lý 11–12 & Chuyên đề (GDPT 2018) · Chuyên đề: Biến đổi khí hậu toàn cầu và An ninh môi trường · Bài: Hiện tượng ENSO"
    ],
    steps: [
      "Trao đổi nhiệt – ẩm biển khí",
      "Chênh lệch nhiệt độ Đông – Tây",
      "Hoàn lưu Walker bình thường",
      "Khi El Niño xuất hiện",
      "Ngưỡng dị thường nhiệt độ",
      "Khi La Niña xuất hiện",
      "Kiểm tra · Chẩn đoán ENSO"
    ],
    file: "courses/enso-step.html",
    cover: "covers/enso-step.webp",
    online: "/c/enso-step/"
  },
  {
    slug: "coal-gas-step",
    subject: "chem",
    title: "Chế biến tổng hợp than đá: Công nghệ khí hóa than",
    type: "Quy trình công nghiệp",
    question: "Than đá chỉ dùng để đốt thôi sao? Làm thế nào biến than thành khí tổng hợp để sản xuất phân bón và methanol?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chuyên đề 11.1: Phân bón & Hóa học vô cơ công nghiệp · Bài: Chế biến than và khí tổng hợp"
    ],
    steps: [
      "Vì sao phải khí hóa than",
      "Cấp nhiệt hay tạo khí",
      "Bên trong lò khí hóa",
      "Tối ưu lượng hơi nước",
      "Phản ứng chuyển hóa điều chỉnh tỷ lệ",
      "Vì sao phải tách lưu huỳnh",
      "Sản phẩm từ khí tổng hợp",
      "Kiểm tra thực hành"
    ],
    file: "courses/coal-gas-step.html",
    cover: "covers/coal-gas-step.webp",
    online: "/c/coal-gas-step/"
  },
  {
    slug: "sulfuric-step",
    subject: "chem",
    title: "Sản xuất Sulfuric Acid (H₂SO₄) theo phương pháp tiếp xúc",
    type: "Quy trình công nghiệp",
    question: "Làm thế nào biến lưu huỳnh trong quặng pyrite thành H₂SO₄ đặc với hiệu suất tối đa và an toàn môi trường?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 2: Nitrogen và Sulfur · Bài: Sulfuric acid và muối sulfate"
    ],
    steps: [
      "Vì sao chia thành 5 công đoạn",
      "Vì sao phải tinh chế khí SO₂",
      "Vì sao chọn nhiệt độ tối ưu",
      "Vì sao vận hành ở áp suất thường",
      "Cấu tạo tháp tiếp xúc",
      "Vì sao hấp thụ bằng H₂SO₄ 98%",
      "Kiểm tra · Ca trưởng vận hành"
    ],
    file: "courses/sulfuric-step.html",
    cover: "covers/sulfuric-step.webp",
    online: "/c/sulfuric-step/"
  },
  {
    slug: "hydrolysis-step",
    subject: "chem",
    title: "Sự thủy phân của muối và ứng dụng thực tiễn",
    type: "Nguyên lý & Hiện tượng",
    question: "Muối không chứa H⁺ hay OH⁻ tự do trong công thức, vì sao khi tan vào nước lại làm dung dịch có tính acid hoặc base?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 1: Cân bằng hóa học · Bài: Thuyết Brønsted–Lowry và sự thủy phân của các ion"
    ],
    steps: [
      "Làm quen bàn thí nghiệm",
      "Phân loại muối và pH",
      "Góc nhìn vi mô phân tử",
      "Ảnh hưởng của nồng độ",
      "Ảnh hưởng của nhiệt độ",
      "Thêm acid để ức chế thủy phân",
      "Ứng dụng làm trong nước",
      "Đun sôi và cô cạn dung dịch",
      "Kiểm tra · Pha chế dung dịch"
    ],
    file: "courses/hydrolysis-step.html",
    cover: "covers/hydrolysis-step.webp",
    online: "/c/hydrolysis-step/"
  },
  {
    slug: "heating-step",
    subject: "geo",
    title: "Quá trình thụ nhiệt của khí quyển và hiệu ứng nhà kính",
    type: "Nguyên lý & Hiện tượng",
    question: "Mặt Trời chiếu suốt ban ngày, vì sao mặt đất nóng lên trước rồi mới truyền cho không khí, và khí quyển giữ ấm Trái Đất bằng cách nào?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 4: Khí quyển — Nhiệt, Khí áp và Gió · Bài: Nhiệt độ không khí"
    ],
    steps: [
      "Khí quyển làm suy giảm bức xạ",
      "Mặt đất hấp thụ bức xạ ngắn",
      "Bức xạ sóng dài của mặt đất",
      "Khí quyển giữ nhiệt sóng dài",
      "Bức xạ ngược của khí quyển",
      "Vai trò của tầng mây",
      "Khí nhà kính",
      "So sánh với bề mặt Mặt Trăng",
      "Kiểm tra thực hành"
    ],
    file: "courses/heating-step.html",
    cover: "covers/heating-step.webp",
    online: "/c/heating-step/"
  },
  {
    slug: "karst-step",
    subject: "geo",
    title: "Sự hình thành và nhận diện địa hình Karst (Các-xtơ)",
    type: "Nguyên lý & Hiện tượng",
    question: "Những cụm núi đá vôi dựng đứng và hang động thạch nhũ kỳ vĩ được kiến tạo từ một tầng đá vôi liền khối như thế nào?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 3: Thạch quyển — Nội lực và Ngoại lực · Bài: Tác động của ngoại lực đến địa hình bề mặt Trái Đất"
    ],
    steps: [
      "Hòa tan đá vôi",
      "Rãnh Karst → Hố sụt",
      "Cụm đỉnh → Rừng đá (Phong lâm)",
      "Núi sót → Đồi tàn dư",
      "Các yếu tố quyết định tốc độ",
      "Hang động ngầm và thạch nhũ",
      "Kiểm tra nhận diện"
    ],
    file: "courses/karst-step.html",
    cover: "covers/karst-step.webp",
    online: "/c/karst-step/"
  },
  {
    slug: "cement-step",
    subject: "chem",
    title: "Công nghiệp sản xuất xi măng Silicate",
    type: "Quy trình công nghiệp",
    question: "Đá vôi và đất sét sau khi nghiền mịn, nung lò quay rồi nghiền với thạch cao đã biến thành xi măng chịu lực như thế nào?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chuyên đề 11.1: Phân bón & Hóa học vô cơ công nghiệp · Bài: Công nghiệp Silicate"
    ],
    steps: [
      "Toàn cảnh nhà máy xi măng",
      "Phối trộn nguyên liệu sống",
      "Gia nhiệt sơ bộ & phân hủy",
      "Di chuyển trong lò quay",
      "Vùng nung kết khối Clinker",
      "Làm nguội nhanh Clinker",
      "Nghiền cùng thạch cao",
      "Kiểm tra · Ca trưởng vận hành"
    ],
    file: "courses/cement-step.html",
    cover: "covers/cement-step.webp",
    online: "/c/cement-step/"
  },
  {
    slug: "carbon-step",
    subject: "geo",
    title: "Chu trình Carbon, Biến đổi khí hậu toàn cầu và An ninh môi trường",
    type: "Nguyên lý & Hiện tượng",
    question: "Dòng dịch chuyển carbon giữa các quyển bị mất cân bằng như thế nào và tác động ra sao đến mực nước biển và an ninh quốc gia?",
    textbook: [
      "Địa lý 11–12 & Chuyên đề (GDPT 2018) · Chuyên đề: Biến đổi khí hậu toàn cầu và An ninh môi trường · Bài: Biến đổi khí hậu và ứng phó"
    ],
    steps: [
      "Chu trình Carbon tự nhiên",
      "Hai nguồn phát thải nhân sinh",
      "Điểm đến của khí phát thải",
      "Gia tăng hiệu ứng giữ nhiệt",
      "Vượt ngưỡng cảnh báo nhiệt độ",
      "Tác động đến các quốc gia",
      "Giải pháp giảm nhẹ & thích ứng",
      "Kiểm tra thực hành"
    ],
    file: "courses/carbon-step.html",
    cover: "covers/carbon-step.webp",
    online: "/c/carbon-step/"
  },
  {
    slug: "tectonic-step",
    subject: "geo",
    title: "Sự hình thành địa hình kiến tạo (Uốn nếp và Đứt gãy)",
    type: "Nguyên lý & Hiện tượng",
    question: "Lực nội sinh nào đã uốn cong các tầng đá trầm tích thành dãy núi uốn nếp hoặc cắt đứt chúng thành địa hào, địa lũy?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 3: Thạch quyển — Nội lực và Ngoại lực · Bài: Nội lực và tác động của nội lực đến địa hình"
    ],
    steps: [
      "Uốn nếp tầng đá",
      "Nếp lồi và nếp lõm",
      "Nghịch đảo địa hình",
      "Đứt gãy trượt ngang",
      "Địa lũy và địa hào",
      "Kiểm tra nhận diện"
    ],
    file: "courses/tectonic-step.html",
    cover: "covers/tectonic-step.webp",
    online: "/c/tectonic-step/"
  },
  {
    slug: "photoelectric-step",
    subject: "phys",
    title: "Hiện tượng quang điện ngoài và Hằng số Planck",
    type: "Nguyên lý & Thí nghiệm",
    question: "Cùng một chùm sáng, vì sao đổi sang kim loại khác lại không bứt được quang electron nào? Động năng ban đầu cực đại phụ thuộc vào yếu tố nào?",
    textbook: [
      "Vật lý 12 (GDPT 2018) · Chương 4: Vật lý lượng tử & Hạt nhân · Bài: Hiện tượng quang điện và Thuyết lượng tử ánh sáng"
    ],
    steps: [
      "Sơ đồ mạch tế bào quang điện",
      "Tăng áp đến dòng quang điện bão hòa",
      "Quét điện áp ngược tìm hiệu điện thế hãm",
      "Thay đổi cường độ chùm sáng",
      "Thay đổi tần số ánh sáng kích thích",
      "Thay đổi kim loại làm cathode",
      "Vẽ đồ thị xác định hằng số Planck h",
      "Quan sát thiết bị thực tế",
      "Kiểm tra thực hành"
    ],
    file: "courses/photoelectric-step.html",
    cover: "covers/photoelectric-step.webp",
    online: "/c/photoelectric-step/"
  },
  {
    slug: "capacitor-step",
    subject: "phys",
    title: "Khảo sát quá trình nạp và phóng điện của tụ điện",
    type: "Nguyên lý & Thí nghiệm",
    question: "Tụ điện tích trữ năng lượng như thế nào và làm sao đo được điện dung C qua đường cong dòng điện theo thời gian?",
    textbook: [
      "Vật lý 11 (GDPT 2018) · Chương 3: Điện trường · Bài: Tụ điện và Năng lượng tụ điện"
    ],
    steps: [
      "Làm quen dụng cụ thí nghiệm",
      "Đóng khóa sang chốt 1: Nạp tụ",
      "Đóng khóa sang chốt 2: Phóng điện",
      "Tính diện tích dưới đồ thị tìm điện tích",
      "Hai cách mắc mạch đo",
      "Khảo sát đường đặc trưng q–u",
      "Thay đổi điện dung C và điện trở R",
      "Quan sát linh kiện thực tế",
      "Kiểm tra thực hành"
    ],
    file: "courses/capacitor-step.html",
    cover: "covers/capacitor-step.webp",
    online: "/c/capacitor-step/"
  },
  {
    slug: "earth-motion-step",
    subject: "geo",
    title: "Hệ quả địa lý của chuyển động tự quay và quay quanh Mặt Trời",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao cùng một thời điểm nơi này là giữa trưa, nơi kia là nửa đêm, và độ dài ngày đêm lại thay đổi theo mùa?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 2: Trái Đất — Hệ quả chuyển động · Bài: Hệ quả địa lý các chuyển động của Trái Đất"
    ],
    steps: [
      "Chuyển động tự quay",
      "Chuyển động quanh Mặt Trời",
      "Bán cầu ngày và bán cầu đêm",
      "Đường phân giới sáng – tối",
      "Giờ địa phương",
      "Múi giờ và đường đổi ngày quốc tế",
      "Độ dài ngày và đêm",
      "Góc nhập xạ lúc chính ngọ",
      "Kiểm tra · Tính múi giờ"
    ],
    file: "courses/earth-motion-step.html",
    cover: "covers/earth-motion-step.webp",
    online: "/c/earth-motion-step/"
  },
  {
    slug: "accel-force-step",
    subject: "phys",
    title: "Thí nghiệm khảo sát mối liên hệ giữa gia tốc, lực và khối lượng (Định luật II Newton)",
    type: "Nguyên lý & Hiện tượng",
    question: "Chỉ với một băng giấy cần rung điện và các quả nặng, làm sao xác định định lượng mối quan hệ giữa gia tốc a với lực F và khối lượng m?",
    textbook: [
      "Vật lý 10 (GDPT 2018) · Chương 3: Động lực học · Bài: Định luật II Newton và Thực hành đo gia tốc"
    ],
    steps: [
      "Làm quen bộ thí nghiệm",
      "Cân bằng lực ma sát trên máng",
      "Ghi dấu băng giấy bằng cần rung",
      "Tính gia tốc từ băng giấy",
      "Khảo sát quan hệ a và F",
      "Khảo sát quan hệ a và m",
      "Phân tích sai số hệ thống",
      "Kiểm tra thực hành"
    ],
    file: "courses/accel-force-step.html",
    cover: "covers/accel-force-step.webp",
    online: "/c/accel-force-step/"
  },
  {
    slug: "iron-step",
    subject: "chem",
    title: "Sắt và hợp chất của sắt: Sự chuyển hóa giữa Fe(II) và Fe(III)",
    type: "Nguyên lý & Hiện tượng",
    question: "Cùng là nguyên tố sắt, vì sao trong ống nghiệm lúc mang số oxi hóa +2, lúc mang +3, và dùng thuốc thử nào để nhận biết chính xác?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 8: Sơ lược về dãy kim loại chuyển tiếp thứ nhất · Bài: Sắt và hợp chất của sắt"
    ],
    steps: [
      "Làm quen bàn thí nghiệm",
      "Điều chế kết tủa trắng Fe(OH)₂",
      "Biện pháp ngăn cách không khí",
      "Nhận biết Fe³⁺ bằng KSCN",
      "Khử Fe³⁺ về Fe²⁺",
      "Oxi hóa Fe²⁺ lên Fe³⁺",
      "Góc nhìn vi mô trao đổi electron",
      "Trạm kiểm nghiệm ion sắt",
      "Kiểm tra · Bảo toàn Fe(II)"
    ],
    file: "courses/iron-step.html",
    cover: "covers/iron-step.webp",
    online: "/c/iron-step/"
  },
  {
    slug: "plasmolysis-step",
    subject: "bio",
    title: "Sự hút nước, mất nước và co nguyên sinh ở tế bào thực vật",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao rau héo ngâm nước lại tươi cứng cáp, còn ướp muối lại tiết nước và mềm nhũn? Tế bào thực vật thẩm thấu nước như thế nào?",
    textbook: [
      "Sinh học 10 (GDPT 2018) · Chương 2: Cấu trúc tế bào & Trao đổi chất qua màng · Bài: Thực hành co và phản co nguyên sinh"
    ],
    steps: [
      "Hiện tượng thẩm thấu",
      "Cấu trúc lớp nguyên sinh chất",
      "Co nguyên sinh khi mất nước",
      "Khoảng trống chứa dung dịch gì",
      "Phản co nguyên sinh",
      "Tự phục hồi trong dung dịch Glycerol",
      "Đo nồng độ dịch bào đẳng trương",
      "Kiểm tra thực hành"
    ],
    file: "courses/plasmolysis-step.html",
    cover: "covers/plasmolysis-step.webp",
    online: "/c/plasmolysis-step/"
  },
  {
    slug: "electrolysis-step",
    subject: "chem",
    title: "Nguyên lý điện phân: Dung dịch CuCl₂ và dung dịch NaCl bão hòa",
    type: "Nguyên lý & Hiện tượng",
    question: "Cùng một nguồn điện một chiều, vì sao điện phân CuCl₂ thu được Cu và Cl₂, còn điện phân nước muối bão hòa lại thu được H₂, Cl₂ và NaOH?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 5: Pin điện và Điện phân · Bài: Điện phân"
    ],
    steps: [
      "Làm quen bình điện phân",
      "Đóng mạch điện phân CuCl₂",
      "Quan sát theo thời gian điện phân",
      "Góc nhìn vi mô chuyển dịch ion",
      "Đổi sang dung dịch NaCl bão hòa",
      "Vùng cathode hóa đỏ với phenolphthalein",
      "Thứ tự phóng điện tại điện cực",
      "Khi dùng đồng làm anode tan",
      "Kiểm tra · Điện phân thu 29,6 mg Cu"
    ],
    file: "courses/electrolysis-step.html",
    cover: "covers/electrolysis-step.webp",
    online: "/c/electrolysis-step/"
  },
  {
    slug: "ammonia-step",
    subject: "chem",
    title: "Điều chế và tính chất của khí Ammonia (Thí nghiệm đài phun nước)",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao một bình khí ammonia khô lại có thể tự hút nước từ chậu thủy tinh vọt lên thành đài phun nước màu hồng?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 2: Nitrogen và Sulfur · Bài: Ammonia và muối ammonium"
    ],
    steps: [
      "Tổng quan bộ dụng cụ",
      "Hướng nghiêng miệng ống nghiệm",
      "Lựa chọn chất làm khô",
      "Phương pháp thu khí NH₃",
      "Thời gian thu đầy bình",
      "Thử đầy bình và hiện tượng khói trắng",
      "Thực hiện thí nghiệm đài phun",
      "Góc nhìn vi mô phân tử",
      "Kiểm tra · Thực hành đài phun"
    ],
    file: "courses/ammonia-step.html",
    cover: "covers/ammonia-step.webp",
    online: "/c/ammonia-step/"
  },
  {
    slug: "equilibrium-step",
    subject: "chem",
    title: "Khảo sát các yếu tố ảnh hưởng đến chuyển dịch cân bằng hóa học",
    type: "Nguyên lý & Thí nghiệm",
    question: "Khi thay đổi nồng độ hoặc nhiệt độ, dựa vào dấu hiệu thực nghiệm nào để khẳng định cân bằng chuyển dịch theo nguyên lý Le Chatelier?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 1: Cân bằng hóa học · Bài: Cân bằng trong dung dịch và Nguyên lý Le Chatelier"
    ],
    steps: [
      "Làm quen bàn thí nghiệm",
      "Hệ Fe³⁺/SCN⁻: Tăng nồng độ chất đầu",
      "Hệ Fe³⁺/SCN⁻: Giảm nồng độ bằng bột sắt",
      "Hệ Cr₂O₇²⁻/CrO₄²⁻: Thêm kiềm",
      "Hệ Cr₂O₇²⁻/CrO₄²⁻: Thêm acid",
      "Hệ NO₂/N₂O₄: Ngâm nước đá và nước nóng",
      "Góc nhìn vi mô tốc độ thuận – nghịch",
      "Phân tích sai số đối chứng",
      "Kiểm tra thực hành"
    ],
    file: "courses/equilibrium-step.html",
    cover: "covers/equilibrium-step.webp",
    online: "/c/equilibrium-step/"
  },
  {
    slug: "flame-step",
    subject: "chem",
    title: "Thử màu ngọn lửa và Quang phổ nguyên tử kim loại",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao mỗi kim loại khi đốt trên ngọn lửa lại phát ra một màu sắc đặc trưng, và màu đó tiết lộ điều gì về cấu trúc lớp vỏ electron?",
    textbook: [
      "Hóa học 10 (GDPT 2018) · Chương 1: Cấu tạo nguyên tử · Bài: Lớp và phân lớp electron",
      "Hóa học 12 (GDPT 2018) · Chương 7: Nguyên tố nhóm IA và IIA · Bài: Kim loại kiềm và nhận biết ion bằng màu ngọn lửa"
    ],
    steps: [
      "Làm quen dụng cụ thử ngọn lửa",
      "Làm sạch dây platinum bằng HCl",
      "Vạch kép màu vàng của Sodium (Na)",
      "Quan sát Potassium (K) qua kính xanh cobalt",
      "Liên hệ năng lượng nhảy mức và bước sóng",
      "Quang phổ phát xạ và hấp thụ",
      "So sánh 6 kim loại đặc trưng",
      "Kiểm tra · Nhận biết ion K⁺"
    ],
    file: "courses/flame-step.html",
    cover: "covers/flame-step.webp",
    online: "/c/flame-step/"
  },
  {
    slug: "galvanic-step",
    subject: "chem",
    title: "Pin điện hóa Galvani: Từ pin một dung dịch đến pin hai dung dịch có cầu muối",
    type: "Nguyên lý & Hiện tượng",
    question: "Nhúng Zn và Cu vào cùng một cốc H₂SO₄ loãng đã có dòng điện, vì sao phải tách thành hai cốc riêng biệt nối bằng cầu muối?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 5: Pin điện và Điện phân · Bài: Thế điện cực và nguồn điện hóa học"
    ],
    steps: [
      "So sánh hai cấu hình pin",
      "Đóng mạch dẫn electron",
      "Chiều dịch chuyển hạt mang điện",
      "Nhược điểm của pin một dung dịch",
      "Chuyển sang pin hai dung dịch",
      "Thử rút cầu muối ra khỏi mạch",
      "Góc nhìn vi mô tại bề mặt điện cực",
      "Ảnh hưởng của nồng độ điện dịch",
      "Kiểm tra · Lắp ráp pin chuẩn"
    ],
    file: "courses/galvanic-step.html",
    cover: "covers/galvanic-step.webp",
    online: "/c/galvanic-step/"
  },
  {
    slug: "conductivity-step",
    subject: "chem",
    title: "Sự điện li, độ dẫn điện của dung dịch và bản chất phản ứng trao đổi ion",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao muối ăn khan không dẫn điện nhưng khi hòa tan vào nước hoặc đun nóng chảy lại làm bóng đèn sáng rực?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 1: Cân bằng hóa học · Bài: Sự điện li trong dung dịch nước"
    ],
    steps: [
      "Làm quen bàn đo độ dẫn điện",
      "NaCl rắn khan và NaCl nóng chảy",
      "Quá trình hòa tan và hydrat hóa",
      "So sánh nước cất và dung dịch đường",
      "Chất điện li mạnh và chất điện li yếu",
      "Chuẩn độ Ba(OH)₂ bằng H₂SO₄ loãng",
      "Góc nhìn vi mô phản ứng tạo kết tủa",
      "Khi đổi chất nhỏ giọt khác",
      "Kiểm tra · Xác định điểm tương đương"
    ],
    file: "courses/conductivity-step.html",
    cover: "covers/conductivity-step.webp",
    online: "/c/conductivity-step/"
  },
  {
    slug: "energy-step",
    subject: "phys",
    title: "Thí nghiệm kiểm chứng Định luật bảo toàn cơ năng",
    type: "Nguyên lý & Hiện tượng",
    question: "Khi quả nặng rơi tự do, độ giảm thế năng trọng trường có bằng đúng độ tăng động năng không? Làm sao kiểm chứng bằng băng giấy?",
    textbook: [
      "Vật lý 10 (GDPT 2018) · Chương 4: Công, năng lượng, công suất · Bài: Cơ năng và Định luật bảo toàn cơ năng"
    ],
    steps: [
      "Làm quen bộ dụng cụ",
      "Quy tắc bật nguồn trước khi thả rơi",
      "Chọn điểm chuẩn trên băng giấy",
      "Đo quãng đường h và tính vận tốc v",
      "Ghi bảng số liệu và vẽ đồ thị",
      "Thay đổi khối lượng quả nặng",
      "Phân tích nguyên nhân hao hụt cơ năng",
      "Kiểm tra thực hành"
    ],
    file: "courses/energy-step.html",
    cover: "covers/energy-step.webp",
    online: "/c/energy-step/"
  },
  {
    slug: "soil-step",
    subject: "geo",
    title: "Các nhân tố hình thành đất và Quan sát phẫu diện đất",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao đất đen ôn đới có tầng mùn dày và màu mỡ, trong khi đất đỏ feralit vùng nhiệt đới ẩm lại bị rửa trôi mạnh?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 6: Sinh quyển và Thổ nhưỡng quyển · Bài: Lớp đất trên Trái Đất và các nhân tố hình thành đất"
    ],
    steps: [
      "Cấu trúc phẫu diện đất",
      "Vai trò của đá mẹ",
      "Vai trò của sinh vật",
      "Vai trò của khí hậu",
      "Vai trò của địa hình",
      "Thời gian hình thành đất",
      "Tác động của con người",
      "Kiểm tra nhận diện phẫu diện"
    ],
    file: "courses/soil-step.html",
    cover: "covers/soil-step.webp",
    online: "/c/soil-step/"
  },
  {
    slug: "projectile-step",
    subject: "phys",
    title: "Thí nghiệm khảo sát đặc điểm của chuyển động ném ngang",
    type: "Nguyên lý & Hiện tượng",
    question: "Chỉ với một máng nghiêng và bảng tọa độ, làm sao tách chuyển động ném ngang thành hai chuyển động thành phần và đo vận tốc ban đầu v₀?",
    textbook: [
      "Vật lý 10 (GDPT 2018) · Chương 2: Động học · Bài: Chuyển động ném ngang và ném xiên"
    ],
    steps: [
      "Làm quen bộ thí nghiệm",
      "Kiểm chứng thành phần rơi tự do",
      "Điều chỉnh đầu máng nằm ngang",
      "Chấm các vị trí quỹ đạo",
      "Xác định khoảng thời gian bằng nhau",
      "Kiểm chứng chuyển động đều phương ngang",
      "Thay đổi vị trí thả bi",
      "Phân tích hai nguồn sai số",
      "Kiểm tra thực hành"
    ],
    file: "courses/projectile-step.html",
    cover: "covers/projectile-step.webp",
    online: "/c/projectile-step/"
  },
  {
    slug: "transport-step",
    subject: "bio",
    title: "Vận chuyển các chất qua màng sinh chất",
    type: "Nguyên lý & Hiện tượng",
    question: "Cùng một màng tế bào, vì sao O₂ tự đi qua lớp kép phospholipid, glucose cần protein vận chuyển, còn K⁺ lại đi ngược chiều gradient nồng độ?",
    textbook: [
      "Sinh học 10 (GDPT 2018) · Chương 2: Cấu trúc tế bào & Trao đổi chất qua màng · Bài: Trao đổi chất qua màng tế bào"
    ],
    steps: [
      "Khuếch tán đơn giản",
      "Tính thấm chọn lọc của màng",
      "Khuếch tán tăng cường",
      "Protein kênh và protein mang",
      "Vận chuyển chủ động (Bơm ATP)",
      "Nhập bào và xuất bào",
      "Tổng hợp so sánh các phương thức",
      "Kiểm tra thực hành"
    ],
    file: "courses/transport-step.html",
    cover: "covers/transport-step.webp",
    online: "/c/transport-step/"
  },
  {
    slug: "nitric-lab-step",
    subject: "chem",
    title: "Tính chất của Nitric Acid (HNO₃) đặc, loãng và sự chuyển hóa Nitrogen Oxide",
    type: "Nguyên lý & Hiện tượng",
    question: "Cùng là đồng tác dụng với nitric acid, vì sao một bình bốc khói nâu đỏ NO₂ còn bình kia sinh ra khí không màu NO?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 2: Nitrogen và Sulfur · Bài: Các oxide của nitrogen và Nitric acid"
    ],
    steps: [
      "Hệ thống dụng cụ thí nghiệm kín",
      "Nhúng dây đồng vào HNO₃ đặc",
      "Đổi sang HNO₃ loãng",
      "Thụ động hóa sắt trong HNO₃ đặc nguội",
      "Xử lý khí thải bằng kiềm",
      "Vì sao bảo quản HNO₃ trong lọ tối màu",
      "Bơm không khí chuyển hóa NO",
      "Lắc đều hấp thụ và góc nhìn vi mô",
      "Kiểm tra · Hấp thụ triệt để khí nitrogen oxide"
    ],
    file: "courses/nitric-lab-step.html",
    cover: "covers/nitric-lab-step.webp",
    online: "/c/nitric-lab-step/"
  },
  {
    slug: "centripetal-step",
    subject: "phys",
    title: "Khảo sát độ lớn lực hướng tâm theo bán kính, tốc độ góc và khối lượng",
    type: "Nguyên lý & Hiện tượng",
    question: "Thiết bị quay tay chỉ hiển thị số vạch trên hai ống thước đo — làm sao dùng phương pháp kiểm soát biến để tìm công thức F = mω²r?",
    textbook: [
      "Vật lý 10 (GDPT 2018) · Chương 6: Chuyển động tròn · Bài: Lực hướng tâm và gia tốc hướng tâm"
    ],
    steps: [
      "Cấu tạo máy khảo sát lực hướng tâm",
      "Kiểm tra cân bằng thiết bị",
      "Khảo sát F theo khối lượng m",
      "Khảo sát F theo bán kính quay r",
      "Khảo sát F theo tốc độ góc ω",
      "Tổng hợp biểu thức F = mω²r",
      "Phân tích sai số và lỗi thao tác",
      "Kiểm tra · Chứng minh F tỉ lệ với ω²"
    ],
    file: "courses/centripetal-step.html",
    cover: "covers/centripetal-step.webp",
    online: "/c/centripetal-step/"
  },
  {
    slug: "self-induction-step",
    subject: "phys",
    title: "Hiện tượng tự cảm, dòng điện Foucault (dòng xoáy) và hãm điện từ",
    type: "Nguyên lý & Thí nghiệm",
    question: "Vì sao nhánh có cuộn cảm làm bóng đèn sáng trễ khi đóng khóa K, và khi ngắt khóa K bóng đèn lại lóe sáng rồi mới tắt?",
    textbook: [
      "Vật lý 12 (GDPT 2018) · Chương 3: Từ trường & Cảm ứng điện từ · Bài: Hiện tượng cảm ứng điện từ và Dòng điện Foucault"
    ],
    steps: [
      "Làm quen mạch thí nghiệm",
      "Hiện tượng tự cảm khi đóng mạch",
      "Hiện tượng tự cảm khi ngắt mạch",
      "Đồ thị dòng điện i(t)",
      "Thay đổi độ tự cảm L của cuộn dây",
      "Quan sát linh kiện thực tế",
      "Dòng điện Foucault (Dòng điện xoáy)",
      "Hãm điện từ và dẫn động điện từ",
      "Kiểm tra thực hành"
    ],
    file: "courses/self-induction-step.html",
    cover: "covers/self-induction-step.webp",
    online: "/c/self-induction-step/"
  },
  {
    slug: "emf-step",
    subject: "phys",
    title: "Thực hành đo suất điện động và điện trở trong của nguồn điện",
    type: "Nguyên lý & Thí nghiệm",
    question: "Làm thế nào dùng một vôn kế, một ampe kế và một biến trở để xác định chính xác suất điện động E và điện trở trong r của pin?",
    textbook: [
      "Vật lý 11 (GDPT 2018) · Chương 4: Dòng điện, mạch điện · Bài: Thực hành đo suất điện động và điện trở trong của pin"
    ],
    steps: [
      "Sơ đồ mạch điện đo",
      "Đặt biến trở ở giá trị cực đại",
      "Đo nhiều cặp giá trị (U, I)",
      "Vẽ đồ thị đặc trưng U–I",
      "Chọn gốc tọa độ trục tung",
      "So sánh khi chỉ đo 2 điểm",
      "Đổi cách mắc ampe kế",
      "Phân tích sai số hệ thống",
      "Kiểm tra thực hành"
    ],
    file: "courses/emf-step.html",
    cover: "covers/emf-step.webp",
    online: "/c/emf-step/"
  },
  {
    slug: "impulse-step",
    subject: "bio",
    title: "Sự hình thành và dẫn truyền xung thần kinh qua sợi trục và Synapse",
    type: "Nguyên lý & Hiện tượng",
    question: "Từ lúc tai nghe tiếng súng xuất phát đến khi cơ chân co lại chỉ mất hơn 0,1 giây — tín hiệu điện – hóa đã chạy qua hệ thần kinh như thế nào?",
    textbook: [
      "Sinh học 11 (GDPT 2018) · Chương 2: Cảm ứng ở sinh vật · Bài: Dẫn truyền xung thần kinh trên sợi thần kinh và qua Synapse"
    ],
    steps: [
      "Khái niệm xung thần kinh",
      "Điện thế nghỉ (Phân cực)",
      "Điện thế hoạt động (Khử cực & Đảo cực)",
      "Dòng điện cục bộ trên sợi trục",
      "Cấu trúc và truyền tin qua Synapse",
      "Tính một chiều và độ trễ Synapse",
      "Tác động của chất ức chế thu hồi (Cocaine)",
      "Ảnh hưởng của nồng độ Na⁺ ngoại bào",
      "Kiểm tra thực hành"
    ],
    file: "courses/impulse-step.html",
    cover: "covers/impulse-step.webp",
    online: "/c/impulse-step/"
  },
  {
    slug: "bromine-step",
    subject: "chem",
    title: "Tách chiết Bromine (Br₂) từ nước biển bằng phương pháp thổi khí",
    type: "Quy trình công nghiệp",
    question: "Hàm lượng ion bromide trong nước biển chỉ khoảng 65 mg/L, làm sao làm giàu và tinh chế thành bromine lỏng công nghiệp?",
    textbook: [
      "Hóa học 10 (GDPT 2018) · Chương 7: Nguyên tố nhóm VIIA (Halogen) · Bài: Điều chế và ứng dụng các Halogen"
    ],
    steps: [
      "Toàn cảnh dây chuyền",
      "Acid hóa nước biển ót",
      "Oxi hóa Br⁻ bằng khí Cl₂",
      "Thổi không khí tách hơi Br₂",
      "Hấp thụ làm giàu bằng SO₂",
      "Chưng cất thu bromine lỏng",
      "Kiểm tra · Vận hành dây chuyền"
    ],
    file: "courses/bromine-step.html",
    cover: "covers/bromine-step.webp",
    online: "/c/bromine-step/"
  },
  {
    slug: "thermal-step",
    subject: "geo",
    title: "Hoàn lưu nhiệt khí quyển (Gió biển – đất liền và Đảo nhiệt đô thị)",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao vùng ven biển ban ngày gió thổi từ biển vào bờ, còn ban đêm lại đổi chiều thổi từ đất liền ra biển?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 4: Khí quyển — Nhiệt, Khí áp và Gió · Bài: Khí áp và gió trên Trái Đất"
    ],
    steps: [
      "Chênh lệch nhiệt độ bề mặt",
      "Biến đổi khí áp trên cao",
      "Biến đổi khí áp sát mặt đất",
      "Khép kín vòng hoàn lưu nhiệt",
      "Cường độ dòng hoàn lưu",
      "Gió biển ban ngày",
      "Gió đất ban đêm",
      "Hiệu ứng đảo nhiệt đô thị",
      "Kiểm tra thực hành"
    ],
    file: "courses/thermal-step.html",
    cover: "covers/thermal-step.webp",
    online: "/c/thermal-step/"
  },
  {
    slug: "mitosis-step",
    subject: "bio",
    title: "Quan sát các kỳ nguyên phân ở mô phân sinh chóp rễ hành",
    type: "Nguyên lý & Hiện tượng",
    question: "Trên tiêu bản chóp rễ hành, làm sao nhận diện tế bào ở từng kỳ nguyên phân và ước tính thời gian của mỗi kỳ?",
    textbook: [
      "Sinh học 10 (GDPT 2018) · Chương 4: Chu kỳ tế bào và Phân bào · Bài: Thực hành làm tiêu bản và quan sát nguyên phân"
    ],
    steps: [
      "Quy trình làm tiêu bản ép",
      "Định vị vùng mô phân sinh",
      "Kỳ đầu (Prophase)",
      "Kỳ giữa (Metaphase)",
      "Kỳ sau (Anaphase)",
      "Kỳ cuối (Telophase)",
      "Thống kê số lượng tế bào",
      "Tính thời gian từng kỳ",
      "Kiểm tra thực hành"
    ],
    file: "courses/mitosis-step.html",
    cover: "covers/mitosis-step.webp",
    online: "/c/mitosis-step/"
  },
  {
    slug: "sodium-step",
    subject: "chem",
    title: "Tính chất của kim loại Sodium (Na) và nguyên tắc chữa cháy kim loại kiềm",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao kim loại sodium ánh bạc phải ngâm kỹ trong dầu hỏa, và khi bốc cháy tuyệt đối không được dập bằng nước hay bình CO₂?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 7: Nguyên tố nhóm IA và IIA · Bài: Kim loại kiềm và hợp chất quan trọng"
    ],
    steps: [
      "Làm quen bàn thí nghiệm",
      "Vết cắt ánh bạc nhanh xỉn màu",
      "Bảo quản trong dầu hỏa",
      "Đun nóng cháy tạo Na₂O₂ vàng",
      "Phản ứng với nước: Nổi – Chảy – Chạy – Kêu – Đỏ",
      "Khống chế kích thước mẩu Na",
      "Góc nhìn vi mô truyền electron",
      "Chữa cháy kim loại kiềm bằng cát khô",
      "Kiểm tra thực hành"
    ],
    file: "courses/sodium-step.html",
    cover: "covers/sodium-step.webp",
    online: "/c/sodium-step/"
  },
  {
    slug: "sulfur-step",
    subject: "chem",
    title: "Tính chất của Sulfur, SO₂, H₂SO₄ đặc và sự chuyển hóa các số oxi hóa của lưu huỳnh",
    type: "Nguyên lý & Hiện tượng",
    question: "Cùng là nguyên tố lưu huỳnh, vì sao có thể chuyển hóa linh hoạt giữa các mức oxi hóa -2, 0, +4 và +6?",
    textbook: [
      "Hóa học 11 (GDPT 2018) · Chương 2: Nitrogen và Sulfur · Bài: Lưu huỳnh, Sulfur dioxide và Sulfuric acid"
    ],
    steps: [
      "Tổng quan bộ thí nghiệm liên hoàn",
      "Đun hỗn hợp bột lưu huỳnh và bột sắt",
      "Phản ứng giữa Cu và H₂SO₄ đặc nóng",
      "Khác biệt giữa H₂SO₄ đặc và loãng",
      "Tẩy màu fuchsin và đun nóng hồi màu",
      "Ba ống nghiệm kiểm tra & bông tẩm kiềm",
      "Phản ứng tự oxi hóa – khử về S(0)",
      "Góc nhìn vi mô · Thang số oxi hóa",
      "Kiểm tra · Thử thách tẩy màu"
    ],
    file: "courses/sulfur-step.html",
    cover: "covers/sulfur-step.webp",
    online: "/c/sulfur-step/"
  },
  {
    slug: "wind-step",
    subject: "geo",
    title: "Chuyển động ngang của không khí — Các lực tác động đến hướng và tốc độ gió",
    type: "Nguyên lý & Hiện tượng",
    question: "Trên bản đồ thời tiết, vì sao gió không thổi thẳng góc từ vùng áp cao sang vùng áp thấp mà lại bị lệch hướng?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 4: Khí quyển — Nhiệt, Khí áp và Gió · Bài: Khí áp và gió trên Trái Đất"
    ],
    steps: [
      "Đường đẳng áp",
      "Lực gradient khí áp",
      "Lực làm lệch hướng Coriolis",
      "Gió ở tầng cao (Song song đường đẳng áp)",
      "Gió sát mặt đất (Cắt xiên đường đẳng áp)",
      "So sánh Bắc bán cầu và Nam bán cầu",
      "Mật độ đường đẳng áp và tốc độ gió",
      "Kiểm tra thực hành"
    ],
    file: "courses/wind-step.html",
    cover: "covers/wind-step.webp",
    online: "/c/wind-step/"
  },
  {
    slug: "corrosion-step",
    subject: "chem",
    title: "Ăn mòn điện hóa (Ăn mòn hấp thụ oxygen), Thiết kế túi sưởi ấm và Bảo vệ kim loại",
    type: "Nguyên lý & Hiện tượng",
    question: "Sự gỉ sắt diễn ra rất chậm ngoài tự nhiên, làm sao tăng tốc nó để chế tạo túi chườm ấm trên 45 °C, hoặc đảo ngược để bảo vệ vỏ tàu biển?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 6: Đại cương về kim loại · Bài: Ăn mòn kim loại và chống ăn mòn kim loại"
    ],
    steps: [
      "Bốn trạm thí nghiệm",
      "Vì sao cột nước dâng lên trong ống dẫn",
      "Vai trò của bột than hoạt tính",
      "Khi đổi sang môi trường acid (Ăn mòn thoát H₂)",
      "Góc nhìn vi mô pin điện hóa vi mô",
      "Cấu tạo và cơ chế tỏa nhiệt túi sưởi",
      "Hậu quả khi bịt kín lỗ thoáng khí",
      "Bảo vệ vỏ sắt bằng điện cực hy sinh Zn",
      "Kiểm tra · Thiết kế túi sưởi đạt chuẩn"
    ],
    file: "courses/corrosion-step.html",
    cover: "covers/corrosion-step.webp",
    online: "/c/corrosion-step/"
  },
  {
    slug: "enzyme-step",
    subject: "bio",
    title: "Khảo sát các yếu tố ảnh hưởng đến hoạt tính của Enzyme",
    type: "Nguyên lý & Hiện tượng",
    question: "Cùng một loại enzyme, vì sao đun sôi sẽ làm mất hoạt tính vĩnh viễn, trong khi ngâm nước đá chỉ làm giảm hoạt tính tạm thời?",
    textbook: [
      "Sinh học 10 (GDPT 2018) · Chương 3: Chuyển hóa năng lượng & Enzyme · Bài: Enzyme và vai trò của enzyme trong quá trình trao đổi chất"
    ],
    steps: [
      "Làm quen bàn thí nghiệm",
      "Ảnh hưởng của nhiệt độ",
      "Ảnh hưởng của độ pH",
      "Biến tính không thuận nghịch ở nhiệt độ cao",
      "Phục hồi hoạt tính từ nhiệt độ thấp",
      "Góc nhìn vi mô trung tâm hoạt động",
      "Tác động của môi trường quá acid hoặc quá kiềm",
      "Kiểm tra · Kỹ thuật viên sinh hóa"
    ],
    file: "courses/enzyme-step.html",
    cover: "covers/enzyme-step.webp",
    online: "/c/enzyme-step/"
  },
  {
    slug: "chlor-alkali-step",
    subject: "chem",
    title: "Công nghiệp Chlorine – Kiềm (Điện phân màng trao đổi ion)",
    type: "Quy trình công nghiệp",
    question: "Làm thế nào điện phân dung dịch nước muối bão hòa với màng trao đổi cation để thu được xút NaOH tinh khiết, tiết kiệm điện và an toàn?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 5: Pin điện và Điện phân · Bài: Ứng dụng điện phân trong công nghiệp"
    ],
    steps: [
      "Ba sản phẩm chiến lược",
      "Tinh chế nước muối thô",
      "Mặt cắt buồng điện phân",
      "Cơ chế màng trao đổi ion",
      "Tác động khi tăng cường độ dòng điện",
      "Điều chỉnh nhiệt độ buồng điện phân",
      "Nguy cơ khi rách màng ngăn",
      "Kiểm tra · Ca trưởng vận hành"
    ],
    file: "courses/chlor-alkali-step.html",
    cover: "covers/chlor-alkali-step.webp",
    online: "/c/chlor-alkali-step/"
  },
  {
    slug: "hou-soda-step",
    subject: "chem",
    title: "Công nghệ sản xuất Soda (Na₂CO₃) liên hợp phương pháp Solvay – Hầu Đức Bảng",
    type: "Quy trình công nghiệp",
    question: "Làm thế nào kết hợp nhà máy muối ăn và nhà máy ammonia để đồng thời sản xuất soda công nghiệp (Na₂CO₃) và phân đạm NH₄Cl?",
    textbook: [
      "Hóa học 12 (GDPT 2018) · Chương 7: Nguyên tố nhóm IA và IIA · Bài: Sodium carbonate và công nghệ sản xuất Soda",
      "Hóa học 11 (GDPT 2018) · Chuyên đề 11.1: Phân bón & Hóa học vô cơ công nghiệp · Bài: Sản xuất phân bón vô cơ"
    ],
    steps: [
      "Từ muối ăn đến soda",
      "Vì sao sục NH₃ trước rồi mới sục CO₂",
      "Vì sao NaHCO₃ kết tinh tách ra trước",
      "Khống chế nhiệt độ tháp carbon hóa",
      "Lọc tách thành hai nhánh sản phẩm",
      "Nung NaHCO₃ thu soda khan",
      "Tuần hoàn nước ót và kết tinh NH₄Cl",
      "Kiểm tra · Ca trưởng điều hành"
    ],
    file: "courses/hou-soda-step.html",
    cover: "covers/hou-soda-step.webp",
    online: "/c/hou-soda-step/"
  },
  {
    slug: "current-field-step",
    subject: "phys",
    title: "Từ trường của dòng điện chạy trong các dây dẫn có hình dạng đặc biệt",
    type: "Nguyên lý & Hiện tượng",
    question: "Từ trường không thể nhìn thấy bằng mắt thường — làm sao biểu diễn bằng đường sức từ và xác định chiều bằng quy tắc nắm tay phải?",
    textbook: [
      "Vật lý 12 (GDPT 2018) · Chương 3: Từ trường & Cảm ứng điện từ · Bài: Từ trường và Đường sức từ"
    ],
    steps: [
      "Mạt sắt hiển thị đường sức từ",
      "Đường sức tròn đồng tâm quanh dây thẳng",
      "Quy tắc nắm tay phải cho dây thẳng",
      "Mật độ đường sức biểu thị độ mạnh từ trường",
      "Từ trường của khung dây tròn",
      "Chồng chất từ trường nhiều vòng dây",
      "Sự suy giảm từ trường dọc trục",
      "Từ trường đều bên trong ống dây (Solenoid)",
      "Kiểm tra · Xác định cực từ ống dây"
    ],
    file: "courses/current-field-step.html",
    cover: "covers/current-field-step.webp",
    online: "/c/current-field-step/"
  },
  {
    slug: "brownian-step",
    subject: "phys",
    title: "Chuyển động Brown và hiện tượng khuếch tán phân tử",
    type: "Nguyên lý & Hiện tượng",
    question: "Các phân tử chất lỏng nhỏ đến mức kính hiển vi quang học không thấy được — bằng chứng thực nghiệm nào chứng tỏ chúng chuyển động hỗn loạn không ngừng?",
    textbook: [
      "Vật lý 12 (GDPT 2018) · Chương 1: Vật lý nhiệt & Động học phân tử · Bài: Mô hình động học phân tử và Chuyển động Brown"
    ],
    steps: [
      "Quan sát hạt phấn hoa dưới kính hiển vi",
      "Ghi vị trí hạt sau mỗi 30 giây",
      "Độ dịch chuyển tăng theo thời gian",
      "Hạt càng nhỏ chuyển động càng rõ",
      "Nhiệt độ càng cao chuyển động càng mãnh liệt",
      "Cơ chế va chạm không cân bằng từ phân tử nước",
      "Quỹ đạo ngẫu nhiên và quy luật thống kê",
      "Hiện tượng khuếch tán theo gradient nồng độ",
      "Kiểm tra · Làm chuyển động Brown rõ nhất"
    ],
    file: "courses/brownian-step.html",
    cover: "covers/brownian-step.webp",
    online: "/c/brownian-step/"
  },
  {
    slug: "water-cycle-step",
    subject: "geo",
    title: "Vòng tuần hoàn nước trên Trái Đất và ý nghĩa địa lý",
    type: "Nguyên lý & Hiện tượng",
    question: "Sông ngòi không ngừng đổ nước ra biển, vì sao mực nước đại dương không dâng tràn mãi mà luôn duy trì cân bằng động?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 5: Thủy quyển — Vòng tuần hoàn nước và Dòng biển · Bài: Thủy quyển và vòng tuần hoàn nước"
    ],
    steps: [
      "Toàn cảnh vòng tuần hoàn nước",
      "Quá trình bốc hơi mặt nước",
      "Thoát hơi nước ở thực vật",
      "Vận chuyển hơi ẩm trong khí quyển",
      "Thấm nước và dòng chảy ngầm",
      "Ba loại vòng tuần hoàn nước",
      "Kỹ thuật phủ sỏi cát giữ ẩm ruộng",
      "Ý nghĩa địa lý của tuần hoàn nước",
      "Kiểm tra thực hành"
    ],
    file: "courses/water-cycle-step.html",
    cover: "covers/water-cycle-step.webp",
    online: "/c/water-cycle-step/"
  },
  {
    slug: "circulation-step",
    subject: "geo",
    title: "Các đai khí áp, đới gió và hoàn lưu khí quyển ba vòng (Hadley, Ferrel, Cực)",
    type: "Nguyên lý & Hiện tượng",
    question: "Vì sao hạm đội Magellan có chặng thuận gió Mậu dịch, có chặng ngược gió Tây ôn đới, và khi đi qua vĩ độ 30° lại gặp vùng lặng gió?",
    textbook: [
      "Địa lý 10 (GDPT 2018) · Chương 4: Khí quyển — Nhiệt, Khí áp và Gió · Bài: Khí áp và gió trên Trái Đất"
    ],
    steps: [
      "Đai áp thấp xích đạo",
      "Dòng giáng tạo áp cao cận chí tuyến 30°",
      "Frông cực và áp thấp ôn đới 60°",
      "Bảy đai khí áp và sáu đới gió",
      "Sự dịch chuyển theo mùa của đai áp – gió",
      "Ảnh hưởng của phân bố lục địa – đại dương",
      "Kiểm tra · Hải trình Magellan"
    ],
    file: "courses/circulation-step.html",
    cover: "covers/circulation-step.webp",
    online: "/c/circulation-step/"
  }
];

fs.writeFileSync(catPath, JSON.stringify(LOCALIZED_CATALOG, null, 2) + '\n', 'utf8');
console.log(`Localized ${LOCALIZED_CATALOG.length} courses in catalog.json`);
