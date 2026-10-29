import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'D:/tongjiang-lab';
const COURSES_DIR = path.join(ROOT, 'courses');
const CATALOG_PATH = path.join(ROOT, 'catalog.json');

// Safe Unicode unescape for printable symbols inside JS (never touches quotes, backslashes, or newlines)
function unescapeSafeSymbols(js) {
  return js
    .replace(/\\xB0/g, '°')
    .replace(/\\xB7/g, '·')
    .replace(/\\u2013/g, '–')
    .replace(/\\u2014/g, '—')
    .replace(/\\u2032/g, '′')
    .replace(/\\u2192/g, '→')
    .replace(/\\u2190/g, '←')
    .replace(/\\u2194/g, '↔')
    .replace(/\\u2212/g, '−')
    .replace(/\\u2264/g, '≤')
    .replace(/\\u2265/g, '≥')
    .replace(/\\u03C6/g, 'φ')
    .replace(/\\u03B4/g, 'δ')
    .replace(/\\u03BB/g, 'λ')
    .replace(/\\u2103/g, '℃')
    .replace(/\\uFF0C/g, '，')
    .replace(/\\u3002/g, '。')
    .replace(/\\uFF1B/g, '；')
    .replace(/\\u246([0-8])/g, (_, d) => String.fromCharCode(0x2460 + parseInt(d, 16)));
}

// Course-specific exact replacements for Vietnam geography, coordinates, landmarks & SGK GDPT 2018
const COURSE_REPLACEMENTS = {
  'earth-motion-step': [
    [
      'Cùng một thời điểm, vì sao ở Bắc Kinh/Hà Nội là buổi trưa còn ở New York lại là nửa đêm, và vì sao ngày mùa hè lại dài hơn ngày mùa đông?',
      'Cùng một thời điểm, vì sao ở Hà Nội (Việt Nam) là buổi trưa còn ở New York lại là nửa đêm, và vì sao ở Bắc bán cầu ngày mùa hè lại dài hơn ngày mùa đông?'
    ],
    [
      'Thường gặp trong đề thi: Cho kinh độ hai nơi để tính giờ địa phương; «Giờ Bắc Kinh» là giờ của múi giờ Đông 8 (UTC+8, giờ địa phương của kinh tuyến 120°E), không phải giờ địa phương tại kinh tuyến 116°E của Bắc Kinh.',
      'Thường gặp trong đề thi: Cho kinh độ hai nơi để tính giờ địa phương; «Giờ Việt Nam (Giờ Hà Nội)» là giờ của múi giờ Đông 7 (UTC+7, giờ địa phương tại kinh tuyến chuẩn 105°E đi qua lãnh thổ Việt Nam), áp dụng thống nhất trên toàn quốc (dù trung tâm Hà Nội ở kinh độ khoảng 105°51′E).'
    ],
    [
      'eqCal:"Giờ Bắc Kinh = Giờ múi Đông 8 (UTC+8) = Giờ địa phương của kinh tuyến 120°E"',
      'eqCal:"Giờ Việt Nam (Hà Nội) = Giờ múi Đông 7 (UTC+7) = Giờ địa phương của kinh tuyến chuẩn 105°E"'
    ],
    [
      'Tại Bắc Kinh (40°N), độ cao Mặt Trời lúc chính ngọ giảm từ 73.4° (Hạ chí 73°26′) → 26.6° (Đông chí 26°34′); vĩ độ có Mặt Trời lên thiên đỉnh dịch chuyển từ Chí tuyến Bắc về Chí tuyến Nam',
      'Tại vĩ tuyến tham chiếu 40°N, độ cao Mặt Trời lúc chính ngọ giảm từ 73.4° (Hạ chí 73°26′) → 26.6° (Đông chí 26°34′); vĩ độ có Mặt Trời lên thiên đỉnh dịch chuyển từ Chí tuyến Bắc về Chí tuyến Nam (quét qua toàn bộ lãnh thổ Việt Nam từ 23°23′N đến 8°34′N khiến nước ta có 2 lần Mặt Trời lên thiên đỉnh trong năm)'
    ],
    [
      'Công thức H = 90° − |φ − δ|, càng gần vĩ độ có Mặt Trời lên thiên đỉnh thì H càng lớn; tại 40°N vào ngày Hạ chí H = 73°26′, ngày Đông chí H = 26°34′.',
      'Công thức H = 90° − |φ − δ|, càng gần vĩ độ có Mặt Trời lên thiên đỉnh thì H càng lớn; tại vĩ tuyến 40°N ngày Hạ chí H = 73°26′, Đông chí H = 26°34′ (còn tại Hà Nội 21°02′N thuộc vùng nội chí tuyến Việt Nam, Hạ chí đạt 87°36′, Đông chí đạt 45°32′ và có 2 lần đạt 90°).'
    ],
    [
      'Kiểm tra: Lễ khai mạc World Cup diễn ra tại Moscow lúc 17:30 ngày 14/6 (múi Đông 3), hỏi giờ Bắc Kinh (múi Đông 8) là mấy giờ?',
      'Kiểm tra: Lễ khai mạc World Cup diễn ra tại Moscow lúc 17:30 ngày 14/6 (múi Đông 3), hỏi Giờ Việt Nam (Hà Nội, múi Đông 7) là mấy giờ?'
    ],
    [
      'Chỉnh kinh độ về 120°E, giờ quốc tế (UTC) về 14.5 giờ, ngày về 14/6 (ngày thứ 165) để giờ địa phương tại 120°E (giờ Bắc Kinh) dừng ở 22:30',
      'Chỉnh kinh độ về 105°E, giờ quốc tế (UTC) về 14.5 giờ (14:30), ngày về 14/6 (ngày thứ 165) để giờ địa phương tại kinh tuyến chuẩn 105°E (Giờ Việt Nam) dừng ở 21:30'
    ],
    [
      'Đạt chuẩn: Giờ địa phương (120°E) là 22:30, múi giờ Đông 8, ngày 14/6; giữa chừng giờ quốc tế sẽ bị lệch về 08:00, hãy chỉnh lại về 14:30',
      'Đạt chuẩn: Giờ Việt Nam (105°E) là 21:30, múi giờ Đông 7 (UTC+7), ngày 14/6; giữa chừng giờ quốc tế sẽ bị lệch về 08:00, hãy chỉnh lại về 14:30'
    ],
    [
      'eq:"Giờ Bắc Kinh = Giờ múi Đông 8 (UTC+8) = Giờ địa phương của kinh tuyến 120°E"',
      'eq:"Giờ Việt Nam (Hà Nội) = Giờ múi Đông 7 (UTC+7) = Giờ địa phương của kinh tuyến chuẩn 105°E"'
    ],
    [
      'eqCal:"Moscow (Đông 3) 17:30 → Bắc Kinh (Đông 8) 22:30"',
      'eqCal:"Moscow (Đông 3) 17:30 → Việt Nam / Hà Nội (Đông 7) 21:30"'
    ],
    [
      'tags:["Giờ múi (Giờ khu vực)","Độ lệch múi giờ","22:30"]',
      'tags:["Giờ múi (Giờ khu vực)","Múi giờ Đông 7 (UTC+7)","21:30"]'
    ],
    [
      'Trước hết tính độ lệch múi giờ giữa hai nơi: Moscow ở múi Đông 3 (UTC+3), Bắc Kinh ở múi Đông 8 (UTC+8), cách nhau 5 múi giờ.',
      'Trước hết tính độ lệch múi giờ giữa hai nơi: Moscow ở múi Đông 3 (UTC+3), Việt Nam (Hà Nội) ở múi Đông 7 (UTC+7), cách nhau 4 múi giờ.'
    ],
    [
      'Càng về phía Đông giờ càng sớm hơn, nên Giờ Bắc Kinh = 17:30 + 5 giờ = 22:30 (tức 14:30 giờ UTC).',
      'Càng về phía Đông giờ càng sớm hơn, nên Giờ Việt Nam = 17:30 + 4 giờ = 21:30 (tức 14:30 giờ UTC).'
    ],
    [
      'Giờ Bắc Kinh là giờ múi của múi Đông 8, tức là giờ địa phương tại kinh tuyến 120°E, không phải giờ địa phương tại kinh độ 116°E của Bắc Kinh.',
      'Giờ Việt Nam là giờ múi của múi Đông 7 (UTC+7), tức giờ địa phương tại kinh tuyến chuẩn 105°E đi qua lãnh thổ Việt Nam (kinh độ trung tâm Hà Nội khoảng 105°51′E).'
    ],
    [
      'Lễ khai mạc tại Moscow (múi Đông 3) lúc 17:30 giờ địa phương, Bắc Kinh ở múi Đông 8, lệch nhau 5 múi giờ về phía Đông nên giờ Bắc Kinh là 22:30.',
      'Lễ khai mạc tại Moscow (múi Đông 3) lúc 17:30 giờ địa phương, Việt Nam (Hà Nội) ở múi Đông 7 (UTC+7), lệch nhau 4 múi giờ về phía Đông nên Giờ Việt Nam là 21:30.'
    ],
    [
      'start:{doy:165,hour:4,lat:40,lon:120}',
      'start:{doy:165,hour:4,lat:21,lon:105}'
    ],
    [
      'start:{doy:172,hour:0,lat:40,lon:120}',
      'start:{doy:172,hour:0,lat:21,lon:105}'
    ],
    [
      'start:{doy:172,hour:4,lat:40,lon:120}',
      'start:{doy:172,hour:4,lat:40,lon:105}'
    ],
    [
      'Mm={ref:{doy:172,hour:4,lon:120,lat:40}',
      'Mm={ref:{doy:172,hour:5,lon:105,lat:21}'
    ],
    [
      '{key:"lon",label:ei.lon,icon:"expand",min:-180,max:180,step:5,ref:120',
      '{key:"lon",label:ei.lon,icon:"expand",min:-180,max:180,step:5,ref:105'
    ],
    [
      'exam:{ok:(i,t)=>Math.abs(t.localT-22.5)<.05&&t.zone===8&&t.date.month===6&&t.date.day===14,hold:12,score:15,events:[{at:5,set:{hour:8},toast:"Giờ quốc tế (UTC) vừa bị chỉnh sang 08:00, hãy điều chỉnh lại về đúng giờ!"}],solve:{doy:165,hour:14.5,lon:120,lat:40},goal:{title:"Quy đổi giờ khai mạc sang Giờ Bắc Kinh (múi Đông 8)",tip:"Moscow ở múi Đông 3, Bắc Kinh ở múi Đông 8 — trước hết hãy tính độ lệch múi giờ",short:"Giờ địa phương (120°E) 22:30"}}',
      'exam:{ok:(i,t)=>Math.abs(t.localT-21.5)<.05&&t.zone===7&&t.date.month===6&&t.date.day===14,hold:12,score:15,events:[{at:5,set:{hour:8},toast:"Giờ quốc tế (UTC) vừa bị chỉnh sang 08:00, hãy điều chỉnh lại về đúng giờ!"}],solve:{doy:165,hour:14.5,lon:105,lat:21},goal:{title:"Quy đổi giờ khai mạc sang Giờ Việt Nam — Hà Nội (múi Đông 7)",tip:"Moscow ở múi Đông 3 (UTC+3), Việt Nam ở múi Đông 7 (UTC+7) — trước hết hãy tính độ lệch múi giờ",short:"Giờ Việt Nam (105°E) 21:30"}}'
    ]
  ],

  'insolation-step': [
    [
      'dọc theo kinh tuyến Bắc Kinh',
      'dọc theo kinh tuyến quan sát'
    ],
    [
      'Vào chính ngọ ngày Hạ chí ở Bắc Kinh, Mặt Trời lên cao bao nhiêu độ?',
      'Vào chính ngọ ngày Hạ chí tại trạm vĩ độ 40°N (và tại Việt Nam ~20°N–21°N), Mặt Trời lên cao bao nhiêu độ?'
    ],
    [
      'Kéo ngày tháng từ Hạ chí đến Đông chí, quan sát mặt phẳng chân trời Bắc Kinh phóng to ở phía trên: Mặt Trời trượt dọc cung kinh tuyến về phía nào và số đo góc thay đổi ra sao',
      'Kéo ngày tháng từ Hạ chí đến Đông chí, quan sát mặt phẳng chân trời địa phương phóng to ở phía trên: Mặt Trời trượt dọc cung kinh tuyến về phía nào và số đo góc thay đổi ra sao'
    ],
    [
      'Độ cao Mặt Trời lúc chính ngọ được tính theo công thức a = 90° − |φ − δ|, trong đó δ lấy giá trị dương vào nửa năm mùa hạ và giá trị âm vào nửa năm mùa đông; tại Bắc Kinh (40°N), ngày Hạ chí là 73°26′, ngày Đông chí là 26°34′. Góc giữa tấm phẳng nhỏ tại Bắc Kinh trên quả cầu với tia sáng nằm ngang chính là góc a; mô hình phóng to phía trên đặt phẳng mặt đất này để dễ quan sát số đo góc thay đổi theo ngày.',
      'Độ cao Mặt Trời lúc chính ngọ được tính theo công thức a = 90° − |φ − δ|, trong đó δ lấy giá trị dương vào nửa năm mùa hạ và giá trị âm vào nửa năm mùa đông; tại trạm tham chiếu 40°N, ngày Hạ chí là 73°26′, ngày Đông chí là 26°34′ (còn tại Hà Nội 21°02′N thuộc vùng nội chí tuyến Việt Nam, ngày Hạ chí đạt ~87°36′, Đông chí đạt ~45°32′ và có 2 lần Mặt Trời lên thiên đỉnh đạt 90°). Góc giữa mặt phẳng chân trời tại điểm quan sát trên quả cầu với tia sáng chính là góc a.'
    ],
    [
      'Độ cao Mặt Trời lúc chính ngọ a = 90° − |φ − δ|: tại điểm lên thiên đỉnh là 90°, trên đường phân chia sáng - tối là 0°, các nơi khác giảm dần theo độ chênh lệch vĩ độ so với điểm lên thiên đỉnh; tại Bắc Kinh (40°N) ngày Hạ chí đạt 73°26′, ngày Đông chí đạt 26°34′.',
      'Độ cao Mặt Trời lúc chính ngọ a = 90° − |φ − δ|: tại điểm lên thiên đỉnh là 90°, trên đường phân chia sáng - tối là 0°, các nơi khác giảm dần theo độ chênh lệch vĩ độ so với điểm lên thiên đỉnh; tại vĩ tuyến 40°N ngày Hạ chí đạt 73°26′, ngày Đông chí đạt 26°34′ (tại vùng nội chí tuyến Việt Nam đều có 2 lần đạt 90° trong năm).'
    ],
    [
      'Kéo điểm quan sát từ Bắc Kinh (40°N) lên thẳng 80°N, xem số đo, đỉnh đường cong trên bảng điều khiển và đối chiếu với hàng góc ở rìa quả cầu',
      'Kéo điểm quan sát từ vĩ tuyến 40°N lên thẳng 80°N, xem số đo, đỉnh đường cong trên bảng điều khiển và đối chiếu với hàng góc ở rìa quả cầu'
    ],
    [
      'Kéo điểm quan sát từ 40°N vào vùng nội chí tuyến (20°N), xem trong mô hình phóng to Mặt Trời nằm ở phía nào so với thiên đỉnh và bóng cọc ngả về hướng nào',
      'Kéo điểm quan sát từ 40°N về vùng nội chí tuyến — vĩ độ Bắc Bộ Việt Nam (20°N, khu vực Hà Nội – Ninh Bình – Thanh Hóa), xem trong mô hình phóng to Mặt Trời nằm ở phía nào so với thiên đỉnh và bóng cọc ngả về hướng nào'
    ],
    [
      'beijing:"Bắc Kinh "',
      'beijing:"Trạm 40°N "'
    ],
    [
      'beijingPin:"Bắc Kinh (40°N)"',
      'beijingPin:"Trạm vĩ độ 40°N"'
    ],
    [
      'Độ cao Mặt Trời lúc chính ngọ tại Bắc Kinh (40°N) vào ngày Đông chí xấp xỉ bằng',
      'Độ cao Mặt Trời lúc chính ngọ tại vĩ tuyến tham chiếu 40°N vào ngày Đông chí xấp xỉ bằng'
    ],
    [
      'kinh tuyến chính ngọ lấy theo Bắc Kinh (116.4°E)',
      'kinh tuyến chính ngọ minh họa ở Đông bán cầu (khu vực múi giờ Việt Nam / Đông Á)'
    ]
  ],

  'river-step': [
    [
      'Tại sao đường bờ đoạn sông Trường Giang qua Trấn Giang lại liên tục dịch chuyển về phía bắc?',
      'Tại sao ở các khúc uốn sông Hồng và sông Cửu Long (Việt Nam), một bên bờ liên tục sạt lở còn bờ đối diện lại bồi tụ bãi nổi làm lòng sông dịch chuyển?'
    ],
    [
      'Ở đoạn sông Trường Giang qua Trấn Giang, bờ nam là bờ lồi (bồi tụ), bờ bắc là bờ lõm (xói lở), nên đường bờ dịch chuyển về phía bắc.',
      'Ở các khúc uốn điển hình của hạ lưu sông Hồng hay sông Tiền – sông Hậu (Việt Nam), nơi có bờ nam là bờ lồi (bồi tụ phù sa) và bờ bắc là bờ lõm (xói lở mạnh do dòng chủ lưu ép sát), đường bờ sông sẽ liên tục dịch chuyển về phía bắc.'
    ],
    [
      'Đoạn sông Trường Giang qua Trấn Giang có bờ nam là bờ lồi, bờ bắc là bờ lõm, do đó đường bờ',
      'Một đoạn sông uốn khúc ở hạ lưu sông Hồng có bờ nam là bờ lồi (bồi tụ), bờ bắc là bờ lõm (xói lở), do đó đường bờ'
    ]
  ],

  'karst-step': [
    [
      'Điển hình nhất ở Quảng Tây · Quý Châu · Vân Nam (và Hạ Long, Phong Nha, Hà Giang)',
      'Điển hình tại Việt Nam: Vịnh Hạ Long (Quảng Ninh), Phong Nha – Kẻ Bàng (Quảng Bình), Cao nguyên đá Đồng Văn (Hà Giang), Tràng An (Ninh Bình)'
    ],
    [
      'Nhờ đó trên mặt đất và dưới lòng đất hình thành các dạng địa hình đa dạng, gọi chung là địa hình Karst; điển hình ở Quảng Tây, Quý Châu, Vân Nam (Trung Quốc) hay Vịnh Hạ Long, Phong Nha - Kẻ Bàng (Việt Nam).',
      'Nhờ đó trên mặt đất và dưới lòng đất hình thành các dạng địa hình đa dạng, gọi chung là địa hình Karst; tại Việt Nam phát triển vô cùng điển hình ở Vịnh Hạ Long (Quảng Ninh), Phong Nha – Kẻ Bàng (Quảng Bình), Cao nguyên đá Đồng Văn (Hà Giang), Tràng An – Tam Cốc (Ninh Bình) và Bắc Sơn (Lạng Sơn).'
    ],
    [
      'Rãnh Karst → Lòng chảo Karst (Bá tử / Cánh đồng Karst)',
      'Rãnh Karst → Lòng chảo Karst (Cánh đồng Karst / Thung lũng đá vôi)'
    ],
    [
      'Bá tử là tên gọi địa phương của lòng chảo Karst có đáy phẳng',
      'Cánh đồng Karst (thung lũng đá vôi) là lòng chảo Karst có đáy bằng phẳng'
    ],
    [
      'Bá tử (Cánh đồng Karst)',
      'Cánh đồng Karst (Thung lũng đá vôi)'
    ],
    [
      'Lòng chảo Karst có đáy bằng phẳng ở Vân Nam, Quý Châu được gọi là «Bá tử» (cánh đồng giữa núi đá vôi), là vùng canh tác nông nghiệp quan trọng tại địa phương — đây là tên gọi địa phương của lòng chảo Karst chứ không phải một kiểu địa hình khác.',
      'Lòng chảo Karst có đáy bằng phẳng phủ trầm tích ở các vùng núi đá vôi Việt Nam (như Hà Giang, Cao Bằng, Lạng Sơn, Hòa Bình, Ninh Bình) tạo thành các «cánh đồng Karst» (địa phương thường gọi là «thung» hoặc «lũng» giữa núi đá vôi), là vùng canh tác nông nghiệp và quần cư quan trọng — đây là dạng lòng chảo Karst đáy phẳng chứ không phải một kiểu địa hình tách biệt.'
    ],
    [
      'Nếu bỏ qua bước này: «Bá tử» sẽ bị hiểu nhầm thành một kiểu địa hình độc lập.',
      'Nếu bỏ qua bước này: học sinh sẽ hiểu nhầm «cánh đồng Karst / thung lũng đá vôi» thành một kiểu địa hình tách rời khỏi quá trình tiến hóa của lòng chảo Karst.'
    ],
    [
      'Dễ nhầm: Coi «Bá tử» là một kiểu địa hình riêng biệt — đó chỉ là tên gọi địa phương của lòng chảo Karst đáy phẳng ở vùng Vân Nam, Quý Châu.',
      'Dễ nhầm: Coi cánh đồng Karst (thung lũng giữa núi đá vôi) là một kiểu địa hình riêng biệt — thực chất đó là lòng chảo Karst có đáy bằng phẳng.'
    ],
    [
      'Rãnh Karst phát triển tiếp có thể tạo thành lòng chảo Karst diện tích lớn; lòng chảo có đáy bằng phẳng được người dân địa phương gọi là Bá tử (cánh đồng Karst), là vùng canh tác nông nghiệp quan trọng.',
      'Rãnh Karst phát triển tiếp có thể tạo thành lòng chảo Karst diện tích lớn; lòng chảo có đáy bằng phẳng tạo nên các cánh đồng Karst (thung lũng đá vôi), là vùng canh tác nông nghiệp quan trọng ở miền núi đá vôi Việt Nam.'
    ],
    [
      'Lòng chảo (Bá tử)',
      'Lòng chảo (Cánh đồng Karst)'
    ],
    [
      'opts:["Quảng Tây, Quý Châu, Vân Nam","Đồng bằng Đông Bắc","Cao nguyên Nội Mông","Bồn địa Tarim"],ans:0,why:"A2.1: «Khu vực Quảng Tây, Quý Châu, Vân Nam có địa hình Karst điển hình và phân bố rộng rãi nhất», A5 #2."',
      'opts:["Vịnh Hạ Long, Phong Nha – Kẻ Bàng, Cao nguyên đá Đồng Văn, Tràng An","Đồng bằng phù sa trẻ sông Cửu Long","Cao nguyên đất đỏ bazan Tây Nguyên","Vùng đồi cát ven biển Nam Trung Bộ"],ans:0,why:"Theo SGK Địa lý 10 GDPT 2018: Tại Việt Nam, địa hình Karst phát triển điển hình và rộng khắp tại các vùng núi đá vôi lớn ở Bắc Bộ và Bắc Trung Bộ như Vịnh Hạ Long, Phong Nha – Kẻ Bàng, Cao nguyên đá Đồng Văn, Tràng An – Tam Cốc."'
    ],
    [
      'q:"Nhận định đúng về «Bá tử» là",opts:["Là một kiểu địa hình độc lập hoàn toàn","Là tên gọi địa phương của lòng chảo Karst đáy phẳng ở Vân Nam, Quý Châu","Là một dạng của Rừng đá","Là châu thổ do sông bồi tụ tạo thành"],ans:1,why:"A2.2 #3 (p.67)，A5 #3。"',
      'q:"Nhận định đúng về «Cánh đồng Karst» (thung lũng giữa núi đá vôi) là",opts:["Là một kiểu địa hình độc lập hoàn toàn với Karst","Là dạng lòng chảo Karst có đáy bằng phẳng phủ trầm tích, thuận lợi cho canh tác ở vùng núi đá vôi","Là một dạng của Rừng đá trên đỉnh núi","Là châu thổ do sông lớn bồi tụ ở cửa biển"],ans:1,why:"Theo SGK Địa lý 10 GDPT 2018: Lòng chảo Karst mở rộng và có đáy bằng phẳng phủ lớp đất trầm tích tạo thành cánh đồng Karst (thung lũng đá vôi), là vùng canh tác nông nghiệp quan trọng ở miền núi đá vôi."'
    ],
    [
      'why:"Theo SGK tr.66 (A2.1), A5 #1."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Đá dễ hòa tan (như đá vôi CaCO₃) bị nước giàu CO₂ ăn mòn hòa tan rồi cuốn đi, hoặc kết tủa trở lại tạo thành các dạng địa hình Karst trên mặt đất và dưới lòng đất."'
    ],
    [
      'why:"Hình 4.2 (A2.2 #6), A5 #4."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Cụm đỉnh đá vôi có phần bệ đá dưới chân nối liền nhau, còn Rừng đá có các đỉnh tháp đá vôi tách rời nhau trên nền phẳng."'
    ],
    [
      'why:"Theo đúng trình tự A2.2 #1–#4 (SGK tr.67)."',
      'why:"Theo trình tự tiến hóa địa hình Karst bề mặt: Rãnh Karst → Lòng chảo Karst → Cụm đỉnh, Rừng đá → Đỉnh sót → Đồi sót (SGK Địa lý 10 GDPT 2018)."'
    ],
    [
      'why:"A2.3 #1 (p.68)，A5 #8。"',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Hang động Karst (như động Phong Nha, hang Sơn Đoòng ở Quảng Bình) có quy mô từ vài mét đến hàng chục, hàng trăm kilômét và thường phân bố thành nhiều tầng."'
    ],
    [
      'why:"Theo SGK A2.3 #2 (tr.68), A5 #6."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Nước chứa Ca(HCO₃)₂ nhỏ giọt từ trần hang kết tủa CaCO₃ tạo nhũ đá rủ từ trên xuống; nước rơi xuống đáy hang kết tủa bồi đắp từ dưới lên tạo măng đá."'
    ],
    [
      'why:"A2.3 #2 (p.68)，A5 #7。"',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Khi nhũ đá từ trần hang phát triển dài xuống và nối liền với măng đá từ đáy hang vươn lên sẽ tạo thành cột đá vững chắc."'
    ]
  ],

  'tectonic-step': [
    [
      'Vì sao trên cao nguyên Thanh Tạng lại tìm thấy hóa thạch lá cây thân gỗ lá rộng — sức mạnh nào đã nâng bề mặt Trái Đất lên cao rồi lại cắt xẻ nó ra?',
      'Vì sao trên các dãy núi cao như Himalaya hay Hoàng Liên Sơn lại tìm thấy dấu tích trầm tích và hóa thạch sinh vật cổ — sức mạnh nội lực nào đã nâng bề mặt Trái Đất lên cao rồi cắt xẻ nó ra?'
    ],
    [
      'Khối đá nâng lên qua phong hóa và xâm thực thường trở thành núi khối tảng hoặc vùng cao (như Hoa Sơn, Lư Sơn, Thái Sơn); khối đá sụt xuống tương đối thường tạo thành thung lũng hoặc vùng trũng thấp (như đồng bằng Vị Hà, thung lũng Phần Hà).',
      'Khối đá nâng lên (địa lũy) qua phong hóa và xâm thực thường trở thành núi khối tảng hoặc vùng núi cao (như dãy núi Con Voi, khối nâng Hoàng Liên Sơn ở Việt Nam); khối đá sụt xuống tương đối (địa hào) thường tạo thành thung lũng kiến tạo hoặc vùng trũng bồi tụ phù sa (như trũng sụt Đồng bằng sông Hồng, thung lũng đứt gãy sông Chảy – sông Lô).'
    ],
    [
      'Dễ nhầm: Gọi các núi khối tảng (Hoa Sơn, Lư Sơn, Thái Sơn) là núi uốn nếp; hoặc gọi địa hào (đồng bằng Vị Hà, thung lũng Phần Hà) là thung lũng thuần túy do dòng chảy xâm thực.',
      'Dễ nhầm: Gọi các núi khối tảng / địa lũy (như dãy Con Voi) là núi uốn nếp; hoặc gọi các địa hào / trũng sụt đứt gãy (như trũng sụt Sông Hồng) là thung lũng thuần túy chỉ do dòng chảy xâm thực.'
    ],
    [
      'opts:["Hoa Sơn, Lư Sơn, Thái Sơn","Dãy Himalaya","Núi Phú Sĩ","Dãy Tần Lĩnh (phần chính)"],ans:0,why:"A2.3 #3 (tr.28): Khối đá nâng lên thường tạo thành núi khối tảng hoặc vùng cao, như Hoa Sơn, Lư Sơn, Thái Sơn; A5 #6."',
      'opts:["Dãy núi khối tảng Con Voi, khối nâng Hoàng Liên Sơn","Dãy Himalaya (núi uốn nếp trẻ)","Núi lửa Phú Sĩ","Các nếp uốn trầm tích điển hình"],ans:0,why:"Theo SGK Địa lý 10 GDPT 2018: Trong đứt gãy kiến tạo, khối đá được nâng lên (địa lũy) thường tạo thành núi khối tảng hoặc vùng núi cao, tiêu biểu ở Việt Nam là dãy núi Con Voi (nằm giữa đứt gãy sông Hồng và sông Chảy)."'
    ],
    [
      'q:"Nguyên nhân hình thành đồng bằng Vị Hà và thung lũng Phần Hà là",opts:["Dòng chảy xâm thực tạo thành thung lũng","Khối đá sụt xuống tương đối tạo thành thung lũng hoặc vùng trũng (địa hào)","Băng hà xâm thực","Miệng núi lửa"],ans:1,why:"A2.3 #3 (p.28)，A5 #7。"',
      'q:"Nguyên nhân kiến tạo hình thành vùng trũng sụt Đồng bằng sông Hồng (địa hào sông Hồng) và các thung lũng đứt gãy là",opts:["Thuần túy do dòng chảy xâm thực tạo thành thung lũng","Khối đá sụt xuống tương đối dọc đứt gãy tạo thành vùng trũng kiến tạo (địa hào), sau đó được phù sa bồi đắp","Băng hà xâm thực","Miệng núi lửa cổ sụp đổ"],ans:1,why:"Theo SGK Địa lý 10 GDPT 2018: Khối đá bị sụt lún tương đối dọc theo các đới đứt gãy kiến tạo tạo thành địa hào (như trũng sụt Sông Hồng), sau đó được sông ngòi bồi tụ phù sa tạo nên đồng bằng."'
    ],
    [
      'why:"Theo SGK tr.27 (A2.2 #1)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Do lực nén ép theo phương nằm ngang của nội lực, các tầng đá trầm tích bị biến dạng dẻo và uốn cong thành các nếp uốn."'
    ],
    [
      'why:"A2.2 #1 (p.27)。"',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Ở nếp lồi các tầng đá uốn vồng lên trên; ở nếp lõm các tầng đá uốn võng xuống dưới."'
    ],
    [
      'why:"Theo Hình 2.15 (nhân nếp lồi cổ, hai cánh trẻ) + chú thích «① Cổ nhất, ⑦ Trẻ nhất» (A2.2 #6, A5 #8)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Ở nếp lồi, tầng đá cổ nhất nằm ở phần nhân (tâm) và các tầng đá trẻ hơn nằm đối xứng ở hai bên cánh; ở nếp lõm thì ngược lại."'
    ],
    [
      'why:"Theo SGK A2.2 #2 (tr.27), A5 #2."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Đỉnh nếp lồi chịu lực căng nên phát sinh nhiều khe nứt, dễ bị ngoại lực xâm thực khoét sâu thành thung lũng; còn đáy nếp lõm chịu lực nén ép nên đá đặc chắc, khó bị bào mòn và trở thành đỉnh núi."'
    ],
    [
      'why:"A2.3 #1 (p.27)，A5 #4。"',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Sự dịch chuyển dọc mặt đứt gãy của các khối đá có cả thành phần dịch chuyển theo phương nằm ngang và phương thẳng đứng."'
    ],
    [
      'why:"A2.3 #4 (p.28)，A5 #9。"',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Dọc theo đới đứt gãy (như đứt gãy sông Hồng, sông Chảy, sông Lô ở miền Bắc Việt Nam), đá bị nghiền ép vụn nát nên dễ bị phong hóa và dòng chảy xâm thực tạo thành thung lũng sông suối."'
    ]
  ],

  'soil-step': [
    [
      'Ở bồn địa Tứ Xuyên có đá gốc màu tím nên đất hình thành trên đó cũng mang màu tím — nhân tố chủ đạo của hiện tượng này chính là đá mẹ.',
      'Ở vùng Tây Nguyên và Đông Nam Bộ Việt Nam, đá mẹ bazan phong hóa tạo nên lớp đất đỏ bazan (feralit nâu đỏ) giàu khoáng chất; hay nơi có đá gốc màu tím thì đất hình thành trên đó cũng mang màu tím — nhân tố chủ đạo quyết định màu sắc và thành phần khoáng của đất chính là đá mẹ.'
    ],
    [
      'Ở bồn địa Tứ Xuyên có những nơi đá gốc màu tím và đất hình thành trên đó cũng có màu tím; nhân tố hình thành đất chủ đạo của hiện tượng này là',
      'Ở Tây Nguyên và Đông Nam Bộ Việt Nam, trên đá mẹ bazan hình thành lớp đất đỏ bazan đặc trưng (hoặc trên đá gốc màu tím hình thành đất màu tím); nhân tố hình thành đất chủ đạo quyết định đặc tính này là'
    ]
  ],

  'thermal-step': [
    [
      ', Mở đầu «Đài Hải Sứ Tra Lục» (tr.34)',
      ''
    ],
    [
      'Tại sao hướng gió hai bờ eo biển Đài Loan lại đảo ngược trong một ngày?',
      'Tại sao ở vùng ven biển Việt Nam (như Đà Nẵng, Nha Trang, Vịnh Bắc Bộ), hướng gió biển – đất liền lại đảo ngược đều đặn giữa ngày và đêm?'
    ],
    [
      'Ban ngày ở eo biển Đài Loan gió thổi theo hướng nào?',
      'Ban ngày ở vùng bờ biển Việt Nam (như bãi biển Đà Nẵng, Nha Trang, Vịnh Bắc Bộ), gió thổi theo hướng nào?'
    ],
    [
      'Ban ngày, gió sát mặt đất ở eo biển Đài Loan thổi từ',
      'Ban ngày, gió sát mặt đất ở vùng ven biển Việt Nam (gió biển) thổi từ'
    ]
  ],

  'wind-step': [
    [
      'Trong phần Hoạt động ở tr.40 SGK, điểm Giáp (phía đông Mông Cổ, đường đẳng áp dày) và điểm Ất (rìa nam bồn địa Tứ Xuyên, đường đẳng áp thưa) được so sánh chính bằng cách này.',
      'Trong thực tế phân tích bản đồ thời tiết tại Việt Nam, khu vực Vịnh Bắc Bộ khi gió mùa Đông Bắc tràn về (các đường đẳng áp xếp rất dày, gió mạnh cấp 6–7) và vùng khuất gió nội địa (đường đẳng áp thưa, gió nhẹ) được so sánh chính bằng nguyên lý này.'
    ]
  ],

  'water-cycle-step': [
    [
      'Ruộng phủ sỏi cát (sa điền) là phương pháp trải một lớp sỏi đá và cát dày 10—15 cm lên mặt đất canh tác, cây trồng được gieo thành hàng giữa lớp sỏi đá (Hoạt động SGK tr.48, Hình 3.3).',
      'Canh tác phủ mặt đất bằng lớp sỏi cát (hoặc tủ gốc giữ ẩm tại các vùng khô hạn như Ninh Thuận – Bình Thuận và vùng núi đá) là phương pháp trải lớp vật liệu thô dày 10—15 cm lên mặt đất canh tác để đón nước mưa thấm xuống và hạn chế bốc hơi (theo SGK Địa lý 10 GDPT 2018).'
    ],
    [
      'Lớp phủ sỏi cát của ruộng sa điền làm cho',
      'Lớp phủ sỏi cát trên mặt ruộng canh tác vùng khô hạn làm cho'
    ]
  ],

  'circulation-step': [
    [
      'Sự thay đổi theo mùa của các trung tâm khí áp làm cho hướng gió thịnh hành đổi chiều theo mùa, tạo thành gió mùa: Đông Á mùa đông thổi gió mùa Tây Bắc, mùa hè thổi gió mùa Đông Nam.',
      'Sự thay đổi theo mùa của các trung tâm khí áp làm cho hướng gió thịnh hành đổi chiều theo mùa, tạo thành gió mùa điển hình ở châu Á: tại Việt Nam và Đông Nam Á, mùa đông chịu tác động của áp cao Xibia thổi gió mùa Đông Bắc lạnh khô (đầu đông) và lạnh ẩm (cuối đông), mùa hạ chịu tác động của áp thấp Nam Á và dải hội tụ nhiệt đới thổi gió mùa Tây Nam nóng ẩm, mưa nhiều (ở Đông Á là gió mùa Tây Bắc và Đông Nam).'
    ]
  ],

  'currents-step': [
    [
      'Ở vùng biển Bắc Ấn Độ Dương, mùa đông thịnh hành gió mùa Đông Bắc nên nước biển chảy về phía tây và xoáy ngược chiều kim đồng hồ; mùa hạ thịnh hành gió mùa Tây Nam nên nước biển chảy về phía đông và xoáy thuận chiều kim đồng hồ.',
      'Ở vùng biển Bắc Ấn Độ Dương (cũng như trên Biển Đông Việt Nam), dòng biển đổi chiều rõ rệt theo gió mùa: tại Bắc Ấn Độ Dương, mùa đông thịnh hành gió mùa Đông Bắc nên nước biển chảy về phía tây và xoáy ngược chiều kim đồng hồ; mùa hạ thịnh hành gió mùa Tây Nam nên nước biển chảy về phía đông và xoáy thuận chiều kim đồng hồ (trên Biển Đông Việt Nam, dòng biển mùa đông chảy hướng Đông Bắc – Tây Nam, mùa hạ chảy hướng Tây Nam – Đông Bắc).'
    ],
    [
      'Ở vùng biển ven bờ Peru, dưới tác động của gió Mậu dịch Đông Nam, nước biển tầng mặt bị đẩy lệch ra xa bờ, nước lạnh từ tầng sâu mang theo chất dinh dưỡng dưới đáy biển trồi lên, cũng tạo nên ngư trường nổi tiếng thế giới.',
      'Ở vùng biển ven bờ Peru, dưới tác động của gió Mậu dịch Đông Nam, nước biển tầng mặt bị đẩy lệch ra xa bờ, nước lạnh từ tầng sâu mang theo chất dinh dưỡng dưới đáy biển trồi lên tạo nên ngư trường lớn (tương tự tại vùng biển Ninh Thuận – Bình Thuận Việt Nam vào mùa hạ, gió mùa Tây Nam cũng tạo nên vùng nước trồi giàu dinh dưỡng và ngư trường trọng điểm).'
    ]
  ],

  'carbon-step': [
    [
      '{k:"phút",t:"Một phần được đại dương và đất liền hấp thụ, phần còn lại lưu giữ lâu dài trong khí quyển"}',
      '{k:"Phân bổ",t:"Một phần được đại dương và đất liền hấp thụ, phần còn lại lưu giữ lâu dài trong khí quyển"}'
    ],
    [
      'Mất không gian sinh tồn là tác động nghiêm trọng nhất của biến đổi khí hậu đối với an ninh quốc gia: các quốc đảo nhỏ như Maldives, Tuvalu... đối mặt với nguy cơ bị nước biển nhấn chìm.',
      'Mất không gian sinh tồn là tác động nghiêm trọng nhất của biến đổi khí hậu đối với an ninh quốc gia: các quốc đảo nhỏ như Maldives, Tuvalu đối mặt với nguy cơ bị nước biển nhấn chìm, và tại Việt Nam các vùng đồng bằng trũng thấp ven biển như Đồng bằng sông Cửu Long, Đồng bằng sông Hồng cũng đứng trước nguy cơ ngập lụt và xâm nhập mặn nghiêm trọng khi mực nước biển dâng.'
    ],
    [
      'why:"Theo định nghĩa SGK tr.82 (A2.1, A7-4)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Chu trình carbon là sự di chuyển và chuyển hóa không ngừng của nguyên tố carbon giữa bốn quyển: khí quyển, thủy quyển, sinh quyển và thạch quyển."'
    ],
    [
      'why:"Theo SGK A2.2: «thông qua hai phương thức sử dụng nhiên liệu hóa thạch và thay đổi sử dụng đất» (A7-5)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Từ sau Cách mạng công nghiệp, con người làm biến đổi chu trình carbon toàn cầu chủ yếu qua việc đốt nhiên liệu hóa thạch và thay đổi mục đích sử dụng đất (chặt phá rừng)."'
    ],
    [
      'why:"Theo SGK tr.82, tiêu chí cốt lõi của bài học (A2.2, A7-6)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Lượng CO₂ do con người phát thải một phần được đại dương và hệ sinh thái lục địa hấp thụ, phần còn lại tích tụ lâu dài trong khí quyển."'
    ],
    [
      'why:"Theo SGK A2.3: khí nhà kính hấp thụ mạnh bức xạ sóng dài của mặt đất, có tác dụng giữ nhiệt cho Trái Đất (A7-1/3)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Khí nhà kính hấp thụ mạnh bức xạ sóng dài (hồng ngoại) của mặt đất và phát xạ ngược lại mặt đất, giữ nhiệt cho tầng đối lưu."'
    ],
    [
      'why:"Theo Hình 3.33 và câu hỏi hoạt động 1 SGK: độ tăng nhiệt tăng đơn điệu theo lượng phát thải tích lũy (A7-12)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Biên độ nóng lên toàn cầu tăng đơn điệu gần như tuyến tính theo tổng lượng CO₂ phát thải tích lũy."'
    ],
    [
      'why:"Theo A2.5: «tăng vượt quá 2 ℃ so với trước Cách mạng công nghiệp»; SGK không hề nói «dưới 2 ℃ là không có ảnh hưởng» (A7-14)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Ngưỡng 2 ℃ trong Thỏa thuận Paris là giới hạn cảnh báo nguy hiểm so với thời kỳ tiền công nghiệp; ngay cả dưới 2 ℃ biến đổi khí hậu vẫn gây ra nhiều tác động đáng kể."'
    ],
    [
      'why:"A2.4 chỉ dùng cụm từ «nghiêm trọng nhất» cho nhóm tác động ① (A7-11)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Mực nước biển dâng làm ngập lụt và thu hẹp không gian sinh tồn ở các quốc đảo và vùng đồng bằng trũng thấp ven biển là mối đe dọa trực tiếp, nghiêm trọng nhất."'
    ],
    [
      'why:"A2.6: Giảm nhẹ = Giảm phát thải + Tăng bể hấp thụ; còn công trình chống lũ, bảo hiểm thiên tai, chuyển đổi cơ cấu cây trồng thuộc về Thích ứng (A7-7/8)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Giảm nhẹ biến đổi khí hậu gồm giảm phát thải khí nhà kính (năng lượng sạch) và tăng bể hấp thụ carbon (trồng rừng); các biện pháp công trình chống lũ, chuyển đổi cây trồng thuộc nhóm Thích ứng."'
    ]
  ],

  'enso-step': [
    [
      'Dòng khí giáng xuống ở phía đông yếu đi, thậm chí chuyển thành dòng bốc lên, khiến bờ đông từ khô hạn chuyển sang mưa lũ (+72 mm/tháng); dòng bốc lên ở phía tây yếu đi, chuyển sang khô hạn (−45 mm/tháng).',
      'Dòng khí giáng xuống ở phía đông yếu đi, thậm chí chuyển thành dòng bốc lên, khiến bờ đông từ khô hạn chuyển sang mưa lũ (+72 mm/tháng); dòng bốc lên ở phía tây (Đông Nam Á, Việt Nam, Indonesia, Australia) yếu đi, chuyển sang khô hạn (−45 mm/tháng), tại Việt Nam thường gây thiếu hụt lượng mưa, nắng nóng kéo dài và xâm nhập mặn sâu ở Đồng bằng sông Cửu Long.'
    ],
    [
      'Hệ quả cũng ngược lại: bờ đông càng khô hạn hơn (−60 mm/tháng), bờ tây mưa nhiều và ngập lụt hơn (+60 mm/tháng).',
      'Hệ quả cũng ngược lại: bờ đông càng khô hạn hơn (−60 mm/tháng), bờ tây (Đông Nam Á, Việt Nam, Indonesia) mưa nhiều hơn (+60 mm/tháng), tại Việt Nam thường kèm theo mưa bão dồn dập và lũ lụt lớn ở miền Trung.'
    ],
    [
      'why:"Dữ kiện A1.3 ②#6 (Hình 4.15 SGK Địa lý 10)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Đại dương truyền nhiệt lượng vào khí quyển chủ yếu thông qua quá trình bốc hơi và ngưng tụ của nước biển (nhiệt ẩn hóa hơi)."'
    ],
    [
      'why:"Dữ kiện A2.3 #2 và Hình 4.18 (SGK Địa lý 10)."',
      'why:"Theo SGK Địa lý 10 GDPT 2018: Vào năm bình thường, vùng biển phía tây Thái Bình Dương Xích đạo ấm nên không khí bốc lên gây mưa; vùng biển phía đông lạnh do nước trồi nên không khí giáng xuống, thời tiết khô ráo."'
    ]
  ]
};

// Clean internal Chinese authoring spec codes across all 54 courses
function cleanPedagogicalCitations(js) {
  // 1. Clean meta.locate page numbers like (tr.2–14), (SGK tr. 88–93)
  js = js.replace(/\blocate:"((?:[^"\\]|\\.)*)"/g, (_, loc) => {
    const cleaned = loc
      .replace(/\\"/g, '')
      .replace(/,?\s*Mở đầu\s*«[^»]+»\s*(?:\([^)]*\))?/g, '')
      .replace(/,?\s*Nghiên cứu điển hình\s*(?:\([^)]*\))?/g, '')
      .replace(/\s*\((?:SGK\s*)?(?:tr\.|p\.)\s*[\d–\-,\s]+\)/gi, '')
      .trim();
    return `locate:"${cleaned}"`;
  });

  const locateMatch = js.match(/\blocate:"((?:[^"\\]|\\.)*)"/);
  const courseLocate = (locateMatch ? locateMatch[1] : 'Chương trình GDPT 2018').replace(/\\"/g, '');

  // 2. Replace raw internal fact-sheet codes in step.ref:"..."
  js = js.replace(/\bref:"((?:[^"\\]|\\.)*)"/g, (full, refVal) => {
    if (/[AB][1-9][\.\-]|facts|Hồ sơ chuẩn|Dữ kiện|Dữ liệu mục|SGK tr\.|\bp\.\d|Bảng giá trị chuẩn/i.test(refVal)) {
      return `ref:"Chuẩn yêu cầu cần đạt · ${courseLocate}"`;
    }
    return full;
  });

  // 3. Clean quiz.why strings that have Chinese page citations or trailing (dữ kiện A2.x...)
  js = js.replace(/\bwhy:"((?:[^"\\]|\\.)*)"/g, (full, whyVal) => {
    let w = whyVal
      .replace(/^(?:Nguyên văn\s+|Chú thích\s+|Kết luận phần Hoạt động\s+)?SGK\s*(?:Khối\s*\d+\s*)?(?:tr\.|p\.)\s*[\d–\-,\s]+(?:&\s*tr\.\s*\d+\s*)?(?:trọng tâm\s*\d+\s*)?(?:Hình\s*[\d\.\-a-z]+\s*)?:?\s*/i, 'Theo SGK GDPT 2018: ')
      .replace(/^Dữ kiện\s+[AB]\d[^\:]*:\s*/i, 'Theo SGK GDPT 2018: ')
      .replace(/\s*\((?:dữ kiện|mục|kiểm chứng|phương pháp suy ngược|cách xác định|Bài tập|Mở rộng|Hình|SGK|hướng giải thích)[^")\\]*(?:[AB]\d|tr\.\s*\d|p\.\s*\d|Bảng)[^")\\]*\)/gi, '')
      .replace(/\s*\([AB]\d[\d\.\-a-zA-Z,\s/#①-⑳]*\)/g, '');
    return `why:"${w}"`;
  });

  // 4. Clean inline Chinese page numbers in points / notes like (SGK tr.88), (Hoạt động SGK tr.48, Hình 3.3), (facts B2.1, ký hiệu est)
  js = js
    .replace(/\(\s*(?:nguyên văn\s+|Đề bài\s+)?(?:Hoạt động\s+)?SGK\s*(?:Khối\s*\d+\s*)?(?:tr\.|p\.)\s*[\d–\-,\s]+(?:[^)]*)\)/gi, '(theo SGK GDPT 2018)')
    .replace(/SGK\s*\((?:tr\.|p\.)\s*[\d–\-,\s]+\)/gi, 'SGK GDPT 2018')
    .replace(/\(facts\s+[^)]+\)/gi, '(theo mô hình học liệu)')
    .replace(/;\s*nhiệt độ xem tại facts\s+[A-Z0-9]+/gi, '');

  return js;
}

const files = fs.readdirSync(COURSES_DIR).filter(f => f.endsWith('.html')).sort();
let updatedCount = 0;

for (const f of files) {
  const slug = f.replace(/\.html$/, '');
  const filePath = path.join(COURSES_DIR, f);
  let html = fs.readFileSync(filePath, 'utf8');

  // Unescape safe symbols across the HTML/JS so string matching works cleanly
  let nextHtml = unescapeSafeSymbols(html);

  const rules = COURSE_REPLACEMENTS[slug] || [];
  for (const [target, replacement] of rules) {
    if (nextHtml.includes(target)) {
      nextHtml = nextHtml.split(target).join(replacement);
    } else if (replacement && !nextHtml.includes(replacement)) {
      console.warn(`[WARN] ${slug}: target not found -> ${target.slice(0, 80)}...`);
    }
  }

  nextHtml = cleanPedagogicalCitations(nextHtml);

  if (nextHtml !== html) {
    fs.writeFileSync(filePath, nextHtml, 'utf8');
    updatedCount++;
  }
}

// Update catalog.json questions to match localized Vietnamese geography questions
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
const catalogQuestionUpdates = {
  'earth-motion-step': 'Cùng một thời điểm, vì sao ở Hà Nội (Việt Nam) là buổi trưa còn ở New York lại là nửa đêm, và vì sao ở Bắc bán cầu ngày mùa hè lại dài hơn ngày mùa đông?',
  'river-step': 'Tại sao ở các khúc uốn sông Hồng và sông Cửu Long (Việt Nam), một bên bờ liên tục sạt lở còn bờ đối diện lại bồi tụ bãi nổi làm lòng sông dịch chuyển?',
  'tectonic-step': 'Vì sao trên các dãy núi cao như Himalaya hay Hoàng Liên Sơn lại tìm thấy dấu tích trầm tích và hóa thạch sinh vật cổ — sức mạnh nội lực nào đã nâng bề mặt Trái Đất lên cao rồi cắt xẻ nó ra?',
  'thermal-step': 'Tại sao ở vùng ven biển Việt Nam (như Đà Nẵng, Nha Trang, Vịnh Bắc Bộ), hướng gió biển – đất liền lại đảo ngược đều đặn giữa ngày và đêm?'
};

for (const item of catalog) {
  if (catalogQuestionUpdates[item.slug]) {
    item.question = catalogQuestionUpdates[item.slug];
  }
}
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');

console.log(`Updated ${updatedCount}/${files.length} course files and catalog.json.`);
