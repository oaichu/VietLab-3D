// scripts/localize-shell.mjs
// Shared 3D Engine Shell Localizer + AST-Safe JS CJK Segment Tokenizer/Replacer

export function decodeCjkEscapes(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => {
    const code = parseInt(hex, 16);
    if ((code >= 0x3000 && code <= 0x303f) || (code >= 0x4e00 && code <= 0x9fff) || (code >= 0xff00 && code <= 0xffef)) {
      return String.fromCharCode(code);
    }
    return m;
  });
}

// Tokenize JS code and visit all string literals and template quasi chunks containing CJK
export function scanJsCjkSegments(code, onSegment) {
  let i = 0;
  const n = code.length;
  const templateBraceStack = [];

  while (i < n) {
    const ch = code[i];

    if (ch === '/' && code[i + 1] === '/') {
      i += 2;
      while (i < n && code[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < n && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      const start = i;
      i++;
      while (i < n && code[i] !== quote) {
        if (code[i] === '\\') i += 2;
        else i++;
      }
      i++;
      const raw = code.slice(start, i);
      const inner = raw.slice(1, -1);
      const dec = decodeCjkEscapes(inner);
      if (/[\u4e00-\u9fff]/.test(dec)) {
        onSegment({ kind: 'string', quote, start, end: i, raw, dec });
      }
      continue;
    }
    if (ch === '`') {
      let segStart = i + 1;
      i++;
      while (i < n) {
        if (code[i] === '\\') {
          i += 2;
          continue;
        }
        if (code[i] === '`') {
          const rawSeg = code.slice(segStart, i);
          const dec = decodeCjkEscapes(rawSeg);
          if (/[\u4e00-\u9fff]/.test(dec)) {
            onSegment({ kind: 'quasi', start: segStart, end: i, raw: rawSeg, dec });
          }
          i++;
          break;
        }
        if (code[i] === '$' && code[i + 1] === '{') {
          const rawSeg = code.slice(segStart, i);
          const dec = decodeCjkEscapes(rawSeg);
          if (/[\u4e00-\u9fff]/.test(dec)) {
            onSegment({ kind: 'quasi', start: segStart, end: i, raw: rawSeg, dec });
          }
          i += 2;
          templateBraceStack.push(1);
          break;
        }
        i++;
      }
      continue;
    }
    if (templateBraceStack.length > 0) {
      if (ch === '{') {
        templateBraceStack[templateBraceStack.length - 1]++;
        i++;
        continue;
      }
      if (ch === '}') {
        templateBraceStack[templateBraceStack.length - 1]--;
        if (templateBraceStack[templateBraceStack.length - 1] === 0) {
          templateBraceStack.pop();
          let segStart = i + 1;
          i++;
          while (i < n) {
            if (code[i] === '\\') {
              i += 2;
              continue;
            }
            if (code[i] === '`') {
              const rawSeg = code.slice(segStart, i);
              const dec = decodeCjkEscapes(rawSeg);
              if (/[\u4e00-\u9fff]/.test(dec)) {
                onSegment({ kind: 'quasi', start: segStart, end: i, raw: rawSeg, dec });
              }
              i++;
              break;
            }
            if (code[i] === '$' && code[i + 1] === '{') {
              const rawSeg = code.slice(segStart, i);
              const dec = decodeCjkEscapes(rawSeg);
              if (/[\u4e00-\u9fff]/.test(dec)) {
                onSegment({ kind: 'quasi', start: segStart, end: i, raw: rawSeg, dec });
              }
              i += 2;
              templateBraceStack.push(1);
              break;
            }
            i++;
          }
          continue;
        }
        i++;
        continue;
      }
    }
    i++;
  }
}

function encodeSegment(text, kind, quote) {
  if (kind === 'string') {
    // Wait: text may already have escape sequences like \n, \xB7, \u2192, \" from original raw string,
    // OR it may be a fresh Vietnamese translation with raw chars.
    // Let's normalize: if text came from a JSON translation file, any literal newline or quote needs escaping.
    let res = '';
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '\\') {
        // Keep valid escape sequence if next char exists
        if (i + 1 < text.length) {
          res += c + text[i + 1];
          i++;
        } else {
          res += '\\\\';
        }
      } else if (c === quote) {
        res += '\\' + quote;
      } else if (c === '\n') {
        res += '\\n';
      } else if (c === '\r') {
        res += '\\r';
      } else {
        res += c;
      }
    }
    return quote + res + quote;
  } else {
    // template quasi segment
    let res = '';
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '\\') {
        if (i + 1 < text.length) {
          res += c + text[i + 1];
          i++;
        } else {
          res += '\\\\';
        }
      } else if (c === '`') {
        res += '\\`';
      } else if (c === '$' && text[i + 1] === '{') {
        res += '\\${';
        i++;
      } else {
        res += c;
      }
    }
    return res;
  }
}

export function replaceJsCjkSegments(code, lookupFn) {
  const edits = [];
  let idx = 0;
  scanJsCjkSegments(code, seg => {
    const translated = lookupFn(seg, idx++);
    if (translated != null) {
      edits.push({
        start: seg.start,
        end: seg.end,
        replacement: encodeSegment(translated, seg.kind, seg.quote)
      });
    }
  });
  let out = '';
  let last = 0;
  for (const e of edits) {
    out += code.slice(last, e.start) + e.replacement;
    last = e.end;
  }
  out += code.slice(last);
  return out;
}

// Complete Vietnamese dictionary for Shared Shell & Common Cross-Course UI Strings
export const SHARED_DICT = {
  // 1. Default HUD Dictionary (Ip)
  "目录": "Mục lục",
  "回到课程目录（学习进度会自动保存）": "Quay về danh mục bài giảng (tiến độ học được lưu tự động)",
  "检测": "Kiểm tra",
  "玩法": "Hướng dẫn",
  "全屏": "Toàn màn hình",
  "设备名": "Tên thiết bị",
  "运行中": "Đang chạy",
  "已停车": "Đã dừng",
  "报警": "Cảnh báo",
  "事故": "Sự cố",
  "得分": "Điểm số",
  "主线问题": "Câu hỏi trọng tâm",
  "因果链": "Chuỗi nhân quả",
  "步骤": "Các bước",
  "本步": "Bước này",
  "问句 \\u2192 动手 \\u2192 结论 + 要点 + 考点": "Câu hỏi \\u2192 Thao tác \\u2192 Kết luận + Trọng tâm + Điểm thi",
  "收起": "Thu gọn",
  "方程式 \\xB7 条件": "Phương trình \\xB7 Điều kiện",
  "动手试一试": "Thử thao tác",
  "应该看到": "Hiện tượng quan sát",
  "关键结论": "Kết luận cốt lõi",
  "要点": "Trọng tâm",
  "考点提示": "Lưu ý thi cử",
  "流程": "Lộ trình",
  "整体": "Tổng thể",
  "揭示结论": "Mở kết luận",
  "结论已揭示": "Đã mở kết luận",
  "复位本步": "Đặt lại bước này",
  "做过了": "Đã thực hiện",
  "还没做": "Chưa thực hiện",
  "依据": "Căn cứ",
  "第": "Bước",
  " 步": "",
  "\\u2039 上一步": "\\u2039 Bước trước",
  "下一步 \\u203A": "Bước tiếp \\u203A",
  "没动手也行：先自动演示一遍这一步\\u2026": "Tự động biểu diễn thao tác của bước này\\u2026",
  "已经是第 ": "Đã hoàn thành bước ",
  " 步：达标后本课结束，可随时点步骤条回看。": " — bạn có thể bấm vào thanh bước phía trên để xem lại bất kỳ bước nào.",
  "\\u2190 \\u2192 翻步 \\xB7 点步骤条任一步可跳 \\xB7 1\\u2013": "\\u2190 \\u2192 Chuyển bước \\xB7 Bấm thanh bước để nhảy \\xB7 Phím 1\\u2013",
  " 跳步 \\xB7 Esc 回中控台": " chọn bước \\xB7 Esc Về bảng điều khiển",
  "中控台": "Bảng điều khiển",
  "拖一个滑块，看全局的代价": "Kéo thanh trượt để quan sát tác động toàn cục",
  "\\u2190 回控制台": "\\u2190 Về bảng điều khiển",
  "量程": "Dải đo",
  "教材": "SGK",
  "参考": "Tham chiếu",
  "参考工况": "Điều kiện chuẩn",
  "开车": "Chạy máy",
  "停车": "Dừng máy",
  "课件设定": "Thiết lập mô phỏng",
  "达标": "Đạt chuẩn",
  "未达标": "Chưa đạt",
  "实验记录": "Bảng ghi số liệu",
  "记录一组": "Ghi 1 lần đo",
  " 组": " lần đo",
  "前 ": "Đã thu gọn ",
  " 组已收起": " lần đo trước",
  "（旧数据，不计入拟合）": " (Dữ liệu cũ, không tính vào đường khớp)",
  "旧数据 ": "Đã thu gọn ",
  " 批已收起": " nhóm dữ liệu cũ",
  "还没有记录": "Chưa có dữ liệu ghi nhận",
  "这一组已经记过了": "Tổ hợp thông số này đã được ghi nhận",
  "现在读数不稳，等一下再记": "Số đo đang dao động, vui lòng chờ ổn định rồi ghi",
  "随堂检测": "Kiểm tra nhanh",
  " 题单选，答错会指回主线": " câu trắc nghiệm, trả lời sai sẽ dẫn về bước kiến thức tương ứng",
  "下一题": "Câu tiếp theo",
  "完成": "Hoàn thành",
  "答对了": "Chính xác!",
  "再想想": "Chưa chính xác",
  "解析": "Giải thích",
  "检测结果": "Kết quả kiểm tra",
  "再做一次": "Làm lại",
  "关闭": "Đóng",
  "这道题考的是第": "Câu hỏi này thuộc nội dung phần",
  "回看主线": "Xem lại:",
  "全对！": "Xuất sắc! Bạn đã trả lời đúng tất cả các câu hỏi!",
  "不错，把错题的解析再读一遍。": "Khá tốt! Hãy đọc kỹ lại phần giải thích của các câu sai nhé.",
  "建议回看主线，再走一遍。": "Hãy ôn lại lộ trình các bước thí nghiệm rồi thử sức lại nhé.",
  "事故复盘": "Phân tích sự cố",
  "抢修重启（回到参考工况）": "Khắc phục & Khởi động lại (Về điều kiện chuẩn)",
  "先看看现场": "Quan sát hiện trường",
  "联锁预警": "Cảnh báo an toàn liên động",
  "3 秒内不处理，装置将破裂": "Nếu không xử lý trong 3 giây, thiết bị sẽ gặp sự cố!",
  "参数已回到安全区，联锁解除": "Thông số đã về vùng an toàn, gỡ bỏ cảnh báo",
  "原因链": "Chuỗi nguyên nhân",
  "玩法与快捷键": "Hướng dẫn & Phím tắt",
  "知道了": "Đã hiểu",
  "已回到参考工况": "Đã khôi phục điều kiện chuẩn",
  "紧急停车：联锁解除": "Dừng khẩn cấp: Đã ngắt liên động",
  "抢修完成：复位参数，重新开车": "Đã khắc phục xong: Đặt lại thông số và khởi động lại",
  "本步已复位：工况回到这一步的起点，结论收起": "Đã đặt lại bước này về trạng thái ban đầu",
  "达标：保持住了": "Đạt yêu cầu: Đã duy trì ổn định thông số mục tiêu!",

  // 2. Section Viewer (s0 / o0)
  "封头": "Nắp đỉnh tháp",
  "触媒筐": "Giỏ xúc tác",
  " 段床层": " tầng xúc tác",
  "段间冷激管": "Ống làm nguội trung gian",
  "中心管": "Ống trung tâm",
  "底部分离空间": "Khoang tách đáy",
  "\" width=\"100%\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"合成塔 R-401 等轴测剖面讲义图\">\r\n<rect x=\"0\" y=\"0\" width=\"": "\" width=\"100%\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Sơ đồ mặt cắt trục đo tháp tổng hợp R-401\">\r\n<rect x=\"0\" y=\"0\" width=\"",
  "\" width=\"100%\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"合成塔 R-401 等轴测剖面讲义图\">\n<rect x=\"0\" y=\"0\" width=\"": "\" width=\"100%\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Sơ đồ mặt cắt trục đo tháp tổng hợp R-401\">\n<rect x=\"0\" y=\"0\" width=\"",
  "\\u2460 讲解": "\\u2460 Giảng giải",
  "\\u2461 分层拆开": "\\u2461 Tách lớp 3D",
  "\\u2462 讲义图": "\\u2462 Sơ đồ mặt cắt",
  "剖面": "Mặt cắt",
  "出气 \\u2191": "Khí ra \\u2191",
  "越界": "Vượt ngưỡng",
  "拆开态": "Tách lớp",
  "温度": "Nhiệt độ",
  "温度场": "Trường nhiệt độ",
  "气流": "Dòng khí",
  "出气路径": "Đường khí ra",
  "\r\n      <div class=\"sec-voice-0\">\r\n        <div class=\"sec-say\"><span class=\"sec-idx\"></span><span></span></div>\r\n        <div class=\"sec-nav\"><button class=\"sec-prev\">\\u2190 上句</button><button class=\"sec-next\">下句 \\u2192</button><span class=\"sec-intent\"></span></div>\r\n      </div>\r\n      <div class=\"sec-voice-1\" hidden>\r\n        <div class=\"sec-nav sec-subchips\"></div>\r\n        <div class=\"sec-nav\"><button class=\"sec-play\">": "\r\n      <div class=\"sec-voice-0\">\r\n        <div class=\"sec-say\"><span class=\"sec-idx\"></span><span></span></div>\r\n        <div class=\"sec-nav\"><button class=\"sec-prev\">\\u2190 Câu trước</button><button class=\"sec-next\">Câu tiếp \\u2192</button><span class=\"sec-intent\"></span></div>\r\n      </div>\r\n      <div class=\"sec-voice-1\" hidden>\r\n        <div class=\"sec-nav sec-subchips\"></div>\r\n        <div class=\"sec-nav\"><button class=\"sec-play\">",
  "\n      <div class=\"sec-voice-0\">\n        <div class=\"sec-say\"><span class=\"sec-idx\"></span><span></span></div>\n        <div class=\"sec-nav\"><button class=\"sec-prev\">\\u2190 上句</button><button class=\"sec-next\">下句 \\u2192</button><span class=\"sec-intent\"></span></div>\n      </div>\n      <div class=\"sec-voice-1\" hidden>\n        <div class=\"sec-nav sec-subchips\"></div>\n        <div class=\"sec-nav\"><button class=\"sec-play\">": "\n      <div class=\"sec-voice-0\">\n        <div class=\"sec-say\"><span class=\"sec-idx\"></span><span></span></div>\n        <div class=\"sec-nav\"><button class=\"sec-prev\">\\u2190 Câu trước</button><button class=\"sec-next\">Câu tiếp \\u2192</button><span class=\"sec-intent\"></span></div>\n      </div>\n      <div class=\"sec-voice-1\" hidden>\n        <div class=\"sec-nav sec-subchips\"></div>\n        <div class=\"sec-nav\"><button class=\"sec-play\">",
  "整段连播 \\u25B6": "Phát liên tục \\u25B6",
  "打印 / 导出 PDF": "In / Xuất PDF",
  "合上": "Đóng lại",
  "拆开": "Tách rời",
  "保持": "Giữ nguyên",
  "复装": "Lắp lại",
  "讲义图": "Sơ đồ mặt cắt",
  "<div class=\"sec-sheet-none\">本课未提供讲义图</div>": "<div class=\"sec-sheet-none\">Bài học này không có sơ đồ mặt cắt</div>",

  // 3. Shared Shell Contract & Diagnostic Messages
  "TONE.sun 要是 [x, y, z]（y > 0，主光在台面上方）": "TONE.sun phải là [x, y, z] (y > 0, nguồn sáng chính phía trên mặt bàn)",
  "TONE.envIntensity 要是 \\u2265 0 的数": "TONE.envIntensity phải là số \\u2265 0",
  "TONE.finish 要是 true / false（质感套件：柔光箱、材质档位、液体透射；缺省关）": "TONE.finish phải là true / false",
  "未知的场景调性预设：": "Thiết lập cảnh không xác định: ",
  "（只有 plant / studio）": " (chỉ hỗ trợ plant / studio)",
  "\\xB0 不在 CAMERA.polar ": "\\xB0 nằm ngoài CAMERA.polar ",
  "\\xB0 之内（拖动视角会被夹回去）": "\\xB0 (góc nhìn sẽ bị giới hạn)",
  "步骤条外壳契约错误：\r\n": "Lỗi cấu hình khung bước học:\r\n",
  "步骤条外壳契约错误：\n": "Lỗi cấu hình khung bước học:\n",
  "world.build() 返回 ": "world.build() trả về ",
  " 个单元，C.units 有 ": " cụm thiết bị, nhưng C.units có ",
  " 个，必须一一对应": " cụm, phải khớp 1-1",
  "步骤条外壳契约错误：labels '": "Lỗi cấu hình: labels '",
  "'.visible 要是函数 ctx => bool": "'.visible phải là hàm ctx => bool",
  "步骤条外壳契约错误：units[": "Lỗi cấu hình: units[",
  "].labelVisible 要是函数 ctx => bool": "].labelVisible phải là hàm ctx => bool",
  "].realBox 要是 true / false": "].realBox phải là true / false",
  "步骤条外壳契约错误：labelOccluder 要是 { center: Vector3 | [x, y, z], r }": "Lỗi cấu hình: labelOccluder phải là { center: Vector3 | [x, y, z], r }",
  "'.text 要是文字或函数 ctx => string": "'.text phải là chuỗi hoặc hàm ctx => string",
  " 步：": ": ",
  "预热失败（不影响运行）": "Khởi tạo trước shader thất bại (không ảnh hưởng vận hành)",
  "测试标注": "Nhãn kiểm thử",
  " 不在 -1\\u2026": " nằm ngoài phạm vi -1\\u2026",
  ".act.text 没写（每种 kind 都要，卡片「动手试一试」显示它）": ".act.text chưa khai báo",
  "' 不是中控台控件": "' không phải điều khiển hợp lệ",
  " 不是多档开关 ": " không thuộc công tắc đa nấc ",
  " 的一档": "",
  " 不是多档开关的一档": " không phải một nấc hợp lệ",
  ".act：custom 要有 ok(ctx) 和 demo(ctx)": ".act: custom cần có ok(ctx) và demo(ctx)",
  ".act：record 步要有 CONSOLE.record.row（rows 型整表现算，没有「记录一组」）": ".act: bước record cần có CONSOLE.record.row",
  "：要是 1\\u2013": ": phải là số nguyên từ 1\\u2013",
  " 的整数（记满 n 行算完成）": " (ghi đủ n dòng để hoàn thành)",
  ".act：record 步要有 states（预设工况数组或 (S, R) => 数组）或 demo(ctx)，自动演示用": ".act: bước record cần có states hoặc demo(ctx)",
  " 不是中控台控件": " không phải điều khiển hợp lệ",
  ".prep 要是函数 (ctx, want) => void": ".prep phải là hàm (ctx, want) => void",
  ".subSeq.keys 要是 \\u2265 2 个 CONSOLE.subs 的 key（按点亮顺序）": ".subSeq.keys cần \\u2265 2 khóa trong CONSOLE.subs",
  ".subSeq.every 要是正数（秒）": ".subSeq.every phải là số dương (giây)",
  "'：只能是 'keep' 或不写": "': chỉ nhận 'keep' hoặc để trống",
  ".cam 只能写 { box, pitch, yaw }": ".cam chỉ nhận { box, pitch, yaw }",
  "（多了 ": " (thừa ",
  ".cam.box 要写成 { min: [x, y, z], max: [x, y, z] }": ".cam.box phải có dạng { min: [x, y, z], max: [x, y, z] }",
  ".cam.pitch 要是度数": ".cam.pitch phải tính bằng độ",
  ".cam.yaw 要是弧度（同 CAMERA.yaw）": ".cam.yaw phải tính bằng radian",
  ".layers 里的 '": ".layers chứa '",
  "' 不在 world.LAYERS": "' không có trong world.LAYERS",
  ".inAll 要是 true / false": ".inAll phải là true / false",
  "：识别色只有 1\\u20135（规范 \\xA72.4）": ": mã màu đơn vị chỉ từ 1\\u20135",
  "有 hold 步但 CONSOLE.exam 没写": "có bước hold nhưng thiếu CONSOLE.exam",
  "CONSOLE.record.cols 要是 [{ key, label, unit?, fmt? }]，至少一列": "CONSOLE.record.cols phải có ít nhất 1 cột",
  "CONSOLE.record.cols 的 key 重复了": "CONSOLE.record.cols bị trùng lặp key",
  "CONSOLE.record 的 row(S, R) 和 rows(S, R) 二选一：row 按「记录一组」存行，rows 整表由工况算出": "CONSOLE.record chỉ chọn row(S, R) hoặc rows(S, R)",
  "：要是 1\\u201320 的整数（缺省 8）": ": phải là số nguyên 1\\u201320 (mặc định 8)",
  "CONSOLE.record.plot 的 x / y 要是 cols 里的 key（现在 ": "CONSOLE.record.plot cần x / y thuộc cols (hiện tại ",
  "'：只能是 'line'、'origin' 或不写": "': chỉ nhận 'line', 'origin' hoặc để trống",
  "CONSOLE.record.plot 画在中控台曲线上，要有 CONSOLE.chart": "CONSOLE.record.plot cần có CONSOLE.chart",
  "CONSOLE.record.hi 要是函数 (S, R, rows) => 行下标 | null": "CONSOLE.record.hi phải là hàm",
  "CONSOLE.record.group 要是函数 (S, R) => 组名（短文字，表格里旧组的标题），且只用于 row 型": "CONSOLE.record.group phải là hàm",
  "CONSOLE.chart.bandY 要是 [lo, hi] 或 { range: [lo, hi], tone, label }": "CONSOLE.chart.bandY phải là [lo, hi] hoặc object",
  "'：只能是 'bad'、'sci' 或不写": "': chỉ nhận 'bad', 'sci' hoặc để trống",
  "CONSOLE.exam.record：要有 CONSOLE.record.row（考核步显示「记录一组」）": "CONSOLE.exam.record cần có CONSOLE.record.row",
  "] 要是 { 控件: 值\\u2026, record?: true }": "] phải là object thông số hợp lệ",
  "].record：考核要记数据先写 CONSOLE.exam.record: true": "].record cần bật CONSOLE.exam.record: true",
  "'.states 要是 \\u2265 2 个 { v, t }，v 互不相同": "'.states cần \\u2265 2 trạng thái { v, t }",
  "'.states[j].lock 要是函数 S => string | null": "'.states[j].lock phải là hàm",
  "CONSOLE.main.label 要是文字或函数 (S, R) => string": "CONSOLE.main.label phải là chuỗi hoặc hàm",
  " 要是文字或函数 (S, R) => string": " phải là chuỗi hoặc hàm (S, R) => string",
  "CAMERA.homeBox 要写成 { min: [x, y, z], max: [x, y, z] }": "CAMERA.homeBox phải có dạng { min: [x, y, z], max: [x, y, z] }",
  "：要写成区间 [下, 上]（单元步目标点高度夹在这里；只想固定一个高度就写 [h, h]）": ": phải là khoảng [min, max]",
  "'：目前只有 'free'（方位角限位计划在 v1.1）": "': hiện chỉ hỗ trợ 'free'",

  // 4. Common Cross-Course Strings (Subjects, Categories, Controls, Shortcuts, Helpers)
  "高中物理": "Vật lý THPT (GDPT 2018)",
  "高中化学": "Hóa học THPT (GDPT 2018)",
  "高中生物": "Sinh học THPT (GDPT 2018)",
  "高中地理": "Địa lý THPT (GDPT 2018)",
  "物理": "Vật lý",
  "化学": "Hóa học",
  "生物": "Sinh học",
  "地理": "Địa lý",
  "原理与现象": "Nguyên lý & Hiện tượng",
  "原理与实验": "Nguyên lý & Thí nghiệm",
  "工业流程": "Quy trình công nghiệp",
  "原理与现象模拟": "Mô phỏng nguyên lý & hiện tượng",
  "拖动 / 滚轮": "Kéo chuột / Con lăn",
  "空格": "Phím cách (Space)",
  "考核": "Thực hành đánh giá",
  "跳步": "Nhảy bước",
  "翻步": "Chuyển bước",
  "旋转、缩放；双击空白复位视角": "Xoay, thu phóng; nhấp đúp vào khoảng trống để đặt lại góc nhìn",
  "回到中控台": "Về bảng điều khiển",
  "回到控制台": "Về bảng điều khiển",
  "回中控台": "Về bảng điều khiển",
  "保持 15 s": "Duy trì 15 s",
  "翻步；点步骤条任一步可跳": "Chuyển bước; bấm vào thanh bước bất kỳ để nhảy tới",
  "随堂检测（6 题）": "Câu hỏi trắc nghiệm (6 câu)",
  "随堂检测（8 题）": "Câu hỏi trắc nghiệm (8 câu)",
  "器材": "Dụng cụ thí nghiệm",
  "开 / 停": "Chạy / Dừng",
  "开 / 停车": "Chạy / Dừng máy",
  "开停车": "Chạy / Dừng",
  "看进去": "Quan sát vi mô",
  "旋转、缩放": "Xoay & Thu phóng",
  "旋转、缩放视角": "Xoay & thu phóng góc nhìn",
  "示意放大": "Phóng đại minh họa",
  "快捷键 \\u2190 \\u2192 翻步 \\xB7 Q 检测 \\xB7 F 全屏": "Phím tắt: \\u2190 \\u2192 Chuyển bước \\xB7 Q Kiểm tra \\xB7 F Toàn màn hình",
  "快捷键 1\\u20139 跳步 \\xB7 Q 检测 \\xB7 空格 开停 \\xB7 F 全屏 \\xB7 Esc 回控制台": "Phím tắt: 1\\u20139 Chọn bước \\xB7 Q Kiểm tra \\xB7 Space Chạy/Dừng \\xB7 F Toàn màn hình \\xB7 Esc Bảng ĐK",
  "快捷键 1\\u20138 跳步 \\xB7 Q 检测 \\xB7 空格 开停 \\xB7 F 全屏 \\xB7 Esc 回控制台": "Phím tắt: 1\\u20138 Chọn bước \\xB7 Q Kiểm tra \\xB7 Space Chạy/Dừng \\xB7 F Toàn màn hình \\xB7 Esc Bảng ĐK",
  "快捷键 \\u2190 \\u2192 翻步 \\xB7 1\\u20139 跳步 \\xB7 Q 检测 \\xB7 F 全屏": "Phím tắt: \\u2190 \\u2192 Chuyển bước \\xB7 1\\u20139 Chọn bước \\xB7 Q Kiểm tra \\xB7 F Toàn màn hình",
  "快捷键 \\u2190 \\u2192 翻步 \\xB7 1\\u20138 跳步 \\xB7 Q 检测 \\xB7 F 全屏": "Phím tắt: \\u2190 \\u2192 Chuyển bước \\xB7 1\\u20138 Chọn bước \\xB7 Q Kiểm tra \\xB7 F Toàn màn hình",
  "快捷键 \\u2190 \\u2192 翻步 \\xB7 1\\u20137 跳步 \\xB7 Q 检测 \\xB7 F 全屏": "Phím tắt: \\u2190 \\u2192 Chuyển bước \\xB7 1\\u20137 Chọn bước \\xB7 Q Kiểm tra \\xB7 F Toàn màn hình",
  "快捷键 \\u2190 \\u2192 翻步 \\xB7 1\\u20138 跳步 \\xB7 Q 检测 \\xB7 空格 开停车 \\xB7 N 设备名 \\xB7 F 全屏 \\xB7 Esc 回中控台": "Phím tắt: \\u2190 \\u2192 Chuyển bước \\xB7 1\\u20138 Chọn bước \\xB7 Q Kiểm tra \\xB7 Space Chạy/Dừng \\xB7 N Tên TB \\xB7 F Toàn màn hình",
  "快捷键 \\u2190 \\u2192 翻步 \\xB7 Q 检测 \\xB7 F 全屏 \\xB7 Esc 回中控台": "Phím tắt: \\u2190 \\u2192 Chuyển bước \\xB7 Q Kiểm tra \\xB7 F Toàn màn hình \\xB7 Esc Bảng ĐK",
  "快捷键 \\u2190 \\u2192 翻步 \\xB7 Q 检测 \\xB7 F 全屏 \\xB7 空格 开停车": "Phím tắt: \\u2190 \\u2192 Chuyển bước \\xB7 Q Kiểm tra \\xB7 F Toàn màn hình \\xB7 Space Chạy/Dừng",
  "上一步 / 下一步": "Bước trước / Bước tiếp",
  "上一步、下一步": "Bước trước, Bước tiếp",
  "实验台": "Bàn thí nghiệm",
  "工程上怎么防": "Biện pháp phòng ngừa kỹ thuật",
  "跳到第 n 步": "Nhảy đến bước n",
  "跳到某一步": "Nhảy đến bước bất kỳ",
  "不变": "Không đổi",
  "示意": "Minh họa",
  "没有新内容：前八步做对，这里就是把它们同时照顾好。": "Bước tổng hợp: Kết hợp đồng thời các điều kiện tối ưu đã tìm được ở 8 bước trước.",
  "没有新内容：前七步的条件同时满足，就是通过。": "Bước tổng hợp: Thỏa mãn đồng thời các điều kiện của 7 bước trước để vượt qua.",
  "工段流程": "Quy trình công đoạn",
  "设备名开关": "Bật/Tắt tên thiết bị",
  "已投用": "Đã vận hành",
  "真实器材": "Dụng cụ thực tế",
  "理想器材": "Dụng cụ lý tưởng",
  "接通": "Đóng mạch",
  "断开": "Ngắt mạch",
  "已接通": "Đã đóng mạch",
  "已断开": "Đã ngắt mạch",
  "已切断": "Đã ngắt",
  "开关断开": "Công tắc mở",
  "综合": "Tổng hợp",
  "无法判断": "Không thể xác định",
  "认识器材": "Làm quen dụng cụ",
  "认识实验": "Làm quen thí nghiệm",
  "认识实验台": "Làm quen bàn thí nghiệm",
  "认识装置": "Làm quen hệ thống thiết bị",
  "认识电路": "Làm quen sơ đồ mạch điện",
  "认识沙盘": "Làm quen sa bàn",
  "偏小": "Nhỏ hơn thực tế",
  "偏大": "Lớn hơn thực tế",
  "偏低": "Thấp hơn chuẩn",
  "hold 15 s \\xB7 多解可接受": "Duy trì 15 s \\xB7 Chấp nhận nhiều phương án tối ưu",
  "文字读数": "Số đo hiển thị",
  "浓度": "Nồng độ",
  "已加入": "Đã thêm",
  "未加入": "Chưa thêm",
  "已滴加": "Đã nhỏ giọt",
  "未滴加": "Chưa nhỏ giọt",
  "单元": "Cụm thiết bị",
  "平衡": "Cân bằng",
  "误差": "Sai số",
  "四个站位": "Bốn cụm thí nghiệm",
  "示意读数": "Số đo minh họa",
  "示意读数 \\xB7 课件设定": "Số đo minh họa \\xB7 Thiết lập mô phỏng",
  "模型读数 \\xB7 本班达标线": "Số đo mô hình \\xB7 Ngưỡng đạt chuẩn",
  "整厂 \\xB7 五个工段": "Toàn nhà máy \\xB7 5 công đoạn",
  "整厂 \\xB7 五段装置": "Toàn nhà máy \\xB7 5 cụm thiết bị",
  "五个工段": "5 công đoạn",
  "值班考核": "Đánh giá vận hành ca",
  "\\u2467 值班考核": "\\u2467 Đánh giá vận hành",
  "考核 \\xB7 当实验员": "Thực hành \\xB7 Vai trò kỹ thuật viên",
  "考核 \\xB7 当班长": "Thực hành \\xB7 Vai trò trưởng ca",
  "净化": "Làm sạch khí",
  "转动地球、拉近拉远": "Xoay quả địa cầu, phóng to / thu nhỏ",
  "拖一个滑块，看全厂的代价": "Kéo thanh trượt để xem tác động lên toàn dây chuyền",
  "拖动视角，绕这张实验台看一圈（滚轮拉近拉远）": "Kéo chuột xoay góc nhìn quanh bàn thí nghiệm (lăn chuột để thu phóng)",
  "拖动视角，绕这张实验台看一圈（滚轮可拉近）": "Kéo chuột xoay góc nhìn quanh bàn thí nghiệm (lăn chuột để phóng to)",
  "拖动视角，绕这张台面看一圈（滚轮可拉近）": "Kéo chuột xoay góc nhìn quanh mặt bàn (lăn chuột để phóng to)",
  "拖动视角，绕这张台面看一圈（滚轮拉近拉远）": "Kéo chuột xoay góc nhìn quanh mặt bàn (lăn chuột để thu phóng)",
  "拖动视角，绕着厂区看一圈（滚轮拉近拉远）": "Kéo chuột xoay góc nhìn toàn cảnh nhà máy (lăn chuột để thu phóng)",
  "对照": "Đối chứng",
  "对照管": "Ống đối chứng",
  "控制变量": "Kiểm soát biến số",
  "变量控制": "Kiểm soát biến số",
  "结论": "Kết luận",
  "过原点": "Đi qua gốc tọa độ",
  "过原点斜率": "Hệ số góc qua gốc tọa độ",
  "过原点直线": "Đường thẳng qua gốc tọa độ",
  "状态": "Trạng thái",
  "学生电源": "Nguồn điện học sinh",
  "交流电源": "Nguồn điện xoay chiều",
  "计时器电源": "Nguồn bộ đếm thời gian",
  "电源与开关": "Nguồn điện & Công tắc",
  "电源\\xB7开关": "Nguồn \\xB7 Công tắc",
  "总开关": "Công tắc tổng",
  "发生": "Phát sinh",
  "发生装置": "Bộ phận điều chế khí",
  "整套装置": "Toàn bộ hệ thống thiết bị",
  "加热": "Đun nóng",
  "未加热": "Chưa đun nóng",
  "浓硫酸": "H₂SO₄ đặc",
  "稀硫酸": "H₂SO₄ loãng",
  "硫酸": "Sulfuric acid (H₂SO₄)",
  "稀硝酸": "HNO₃ loãng",
  "碱石灰": "Vôi tôi xút (CaO + NaOH)",
  "饱和食盐水": "Dung dịch NaCl bão hòa",
  "蒸馏水": "Nước cất",
  "氯水": "Nước chlorine (Cl₂)",
  "酚酞": "Phenolphthalein",
  "未滴酚酞": "Chưa nhỏ phenolphthalein",
  "蔗糖": "Saccharose",
  "煤油": "Dầu hỏa",
  "铁粉": "Bột sắt (Fe)",
  "铁水": "Gang nóng chảy",
  "氢气": "Khí hydrogen (H₂)",
  "空气": "Không khí",
  "隔绝空气": "Cách ly không khí",
  "安全风险 \\xB7 示意": "Chỉ số rủi ro an toàn \\xB7 Minh họa",
  "风险指数": "Chỉ số rủi ro",
  "铭牌": "Nhãn thông số",
  "正常": "Bình thường",
  "裙座": "Chân đế tháp",
  "强弱": "Độ mạnh yếu",
  "Q 检测": "Q Kiểm tra",
  "F 全屏": "F Toàn màn hình",
  "全屏投影": "Trình chiếu toàn màn hình",
  "做题": "Làm bài tập",
  "整体 \\xB7 一张实验台四组器材": "Tổng thể \\xB7 Bàn thí nghiệm 4 cụm dụng cụ",
  "整体 \\xB7 参考案例 1 的装置": "Tổng thể \\xB7 Hệ thống thí nghiệm mẫu 1",
  "参考案例 1": "Phương án mẫu 1",
  "大气": "Khí quyển",
  "海洋": "Đại dương",
  "误差与错误操作": "Sai số & Thao tác sai",
  "折中": "Tối ưu dung hòa",
  "尾气": "Khí thải",
  "尾气吸收": "Hấp thụ khí thải",
  "月": "Tháng",
  "月份": "Tháng",
  " 年": " năm",
  "日期": "Ngày",
  "春分": "Xuân phân",
  "夏至": "Hạ chí",
  "秋分": "Thu phân",
  "冬至": "Đông chí",
  "东": "Đông",
  "西": "Tây",
  "北": "Bắc",
  "北边": "Phía Bắc",
  "南边": "Phía Nam",
  "赤道": "Xích đạo",
  "电流表": "Ampe kế",
  "电流表读数": "Số chỉ Ampe kế",
  "电流表读数 I": "Số chỉ Ampe kế I",
  "电流传感器": "Cảm biến dòng điện",
  "电流 I": "Dòng điện I",
  "有电流": "Có dòng điện",
  "V \\xB7 电压表": "V \\xB7 Vôn kế",
  "电表": "Đồng hồ đo điện",
  "地转偏向力": "Lực Coriolis",
  "放大": "Phóng đại",
  "现象": "Hiện tượng",
  "水浴温度": "Nhiệt độ bể điều nhiệt",
  "（教材区间）": " (Khoảng SGK)",
  "无": "Không có",
  "无变化": "Không đổi",
  "无色": "Không màu",
  "已熄灭": "Đã tắt",
  "试纸变蓝": "Giấy quỳ hóa xanh",
  "转化": "Chuyển hóa",
  "打点": "Đánh dấu điểm",
  "打点计时器": "Đồng hồ đánh dấu đầu cần",
  "天平": "Cân điện tử",
  "坐标纸": "Giấy kẻ ô ly",
  "坐标纸板": "Bảng giấy tọa độ",
  "误差方向": "Chiều sai số",
  "收集": "Thu khí",
  "怎么收集": "Phương pháp thu khí",
  "个数": "Số lượng",
  "逆流": "Ngược chiều",
  "账": "Bài toán kinh tế",
  "越界走事故": "Vượt ngưỡng an toàn gây sự cố",
  "吸收塔": "Tháp hấp thụ",
  "洗涤塔": "Tháp rửa khí",
  "氨合成塔": "Tháp tổng hợp NH₃",
  "吸收": "Hấp thụ",
  "\\u2463 吸收": "\\u2463 Hấp thụ",
  "\\u2461 净化": "\\u2461 Làm sạch",
  "\\u2461 温度": "\\u2461 Nhiệt độ",
  "\\u2460 类型": "\\u2460 Phân loại",
  "\\u2463 曲线": "\\u2463 Đồ thị",
  "\\u2464 误差": "\\u2464 Sai số",
  "催化剂": "Chất xúc tác",
  "pH 计": "Máy đo pH",
  "两条路": "Hai nhánh",
  "拖视角绕实验台看一圈，顺着导线走一遍回路": "Kéo góc nhìn quanh bàn thí nghiệm và dò theo đường dây dẫn kín mạch",
  "公式 \\xB7 条件": "Công thức \\xB7 Điều kiện",
  "分": "phút",
  "越线": "Vượt ngưỡng",
  "气候": "Khí hậu",
  "温室气体": "Khí nhà kính",
  "太阳短波辐射": "Bức xạ sóng ngắn Mặt Trời",
  "地面长波辐射": "Bức xạ sóng dài mặt đất",
  "太阳辐射": "Bức xạ Mặt Trời",
  "超量程": "Vượt quá thang đo",
  "电解": "Điện phân",
  "参照带": "Dải tham chiếu",
  "剖开槽": "Mặt cắt bình điện phân",
  "槽温": "Nhiệt độ bình",
  "槽电压": "Điện áp bình",
  "电流效率": "Hiệu suất dòng điện",
  "基本不变": "Hầu như không đổi",
  "未接入": "Chưa mắc vào mạch",
  "NaHCO\\u2083 溶液": "Dung dịch NaHCO\\u2083",
  "分布": "Phân bố",
  "东北信风": "Gió Mậu dịch Đông Bắc",
  "东南信风": "Gió Mậu dịch Đông Nam",
  "极地东风": "Gió Đông địa cực",
  "季风": "Gió mùa",
  "无风": "Lặng gió",
  "显示": "Hiển thị",
  "隐藏": "Ẩn",
  "地球自转 开 / 停": "Tự quay Trái Đất: Chạy / Dừng",
  "火炬": "Đuốc đốt khí dư",
  "点装置或左栏编号": "Bấm vào thiết bị 3D hoặc số thứ tự bên trái",
  "镜头飞向该工段": "Di chuyển góc máy tới công đoạn đó",
  "导线 \\xB7 鳄鱼夹 \\xB7 电流表读数": "Dây dẫn \\xB7 Kẹp cá sấu \\xB7 Số chỉ Ampe kế",
  "物质": "Chất thử",
  "线圈": "Cuộn dây",
  "逆时针": "Ngược chiều kim đồng hồ",
  "顺时针": "Cùng chiều kim đồng hồ",
  "\\u2014 曲线 \\xB7 \\u25CB 当前": "\\u2014 Đường cong \\xB7 \\u25CB Hiện tại",
  "通电": "Cấp điện",
  "通电时间": "Thời gian điện phân",
  "装置": "Thiết bị",
  "洋流": "Dòng biển",
  "正午太阳高度": "Góc nhập xạ lúc chính ngọ",
  "直射点": "Điểm Mặt Trời lên thiên đỉnh",
  "正午高度": "Độ cao Mặt Trời lúc chính ngọ",
  "接法": "Cách mắc mạch",
  "条件": "Điều kiện",
  "理想": "Lý tưởng",
  "顺序": "Trình tự",
  "环": "Vòng",
  "蒸发": "Bốc hơi",
  "弱": "Yếu",
  "强": "Mạnh",
  "传导": "Dẫn truyền",
  "风": "Gió",
  "温度站": "Trạm điều nhiệt",
  "判据": "Tiêu chí đánh giá",
  "正向": "Phân cực thuận",
  "教材色名": "Màu sắc theo SGK",
  "解离": "Phân ly",
  "塔内什么样": "Cấu tạo bên trong tháp",
  "系统压力": "Áp suất hệ thống",
  "此温度下平衡转化率最高": "Tại nhiệt độ này hiệu suất chuyển hóa cân bằng đạt cực đại",
  "平衡常数增大": "Hằng số cân bằng K tăng lên",
  "达到平衡的时间缩短，平衡转化率不变": "Rút ngắn thời gian đạt cân bằng, hiệu suất cân bằng không đổi",
  "方向相反": "Ngược chiều nhau",
  "按物理公式计算": "Tính theo công thức vật lý",
  "溶液示意放大": "Phóng đại vi mô dung dịch",
  "点一下台面上方那个放大箱，看里面的离子怎么结合": "Bấm vào hộp phóng đại vi mô phía trên bàn để xem các ion kết hợp",
  "转运蛋白": "Protein vận chuyển",
  "回归": "Chuyển động biểu kiến",
  "演化阶段": "Giai đoạn tiến hóa địa hình",
  "年降水量": "Lượng mưa trung bình năm",
  "年均温": "Nhiệt độ trung bình năm",
  "风蚀作用": "Bào mòn do gió",
  "冰川刨蚀": "Bào mòn do băng hà",
  "旋转、缩放岩块": "Xoay & thu phóng khối địa chất",
  "设定": "Thiết lập",
  " 个": " hạt",
  "风险 0.85 \\u2192 0.10": "Rủi ro 0.85 \\u2192 0.10",
  "实验工况": "Điều kiện thí nghiệm",
  "渗透": "Thẩm thấu",
  "半透膜 + 浓度差": "Màng bán thấm + Chênh lệch nồng độ",
  "细胞膜 \\xB7 示意放大": "Màng sinh chất \\xB7 Phóng đại vi mô",
  "细胞膜": "Màng sinh chất",
  "协助扩散": "Khuếch tán tăng cường",
  "自由扩散": "Khuếch tán đơn giản",
  "细胞": "Tế bào",
  "水平": "Phương ngang",
  "没有规律": "Không có quy luật",
  "垂直": "Phương thẳng đứng",
  "压": "Áp suất",
  "高空": "Tầng cao",
  "近地面": "Sát mặt đất",
  "气压梯度": "Gradient khí áp",
  "地面冷热不均": "Sự đốt nóng không đều trên bề mặt Trái Đất",
  "摩擦力": "Lực ma sát",
  "去掉这一步：学生会把「测出来和算出来不一样」当成自己算错。": "Nếu bỏ qua bước này, học sinh dễ nhầm lẫn giữa sai số hệ thống của dụng cụ thực tế với việc tính toán sai.",

  // 5. 3D Bench Helper Contract Strings in Course Tails
  " 是台高（地面到台面，缺省 0.78 m），至少 top + 0.12；台面高度用 root.position.y 设": " là chiều cao bàn (mặc định 0.78 m)",
  "：colors 里没有 ": ": không có màu trong bảng colors ",
  "（可用：": " (hỗ trợ: ",
  "screws：head 只能是 'pan' 或 'flat'（现在 ": "screws: head chỉ nhận 'pan' hoặc 'flat' (hiện tại ",
  " 的整数倍": " (bội số nguyên)",
  " 契约问题：": " lỗi cấu hình: ",
  " 要是 minor=": " phải là bội số của minor=",
  "，刻度太密（单边 \\u2264 80 小格），加大 minor": ", vạch chia quá dày, hãy tăng minor",
  "dualRangeMeter：ranges 要是 [小量程, 大量程]（现在 ": "dualRangeMeter: ranges phải là [thang nhỏ, thang lớn] (hiện tại ",
  " 要是 major=": " phải là major=",
  " 的整数倍，major 要是 mid=": " (bội số nguyên), major phải là mid="
};

// Auto-translate textbook / fact-table citation strings (e.g., "facts A2.1、B2.1 第 0、8 条；图4.2-1（p.88）")
export function translateFactCitation(str) {
  if (!(/^(?:facts\b|§\d|[A-Z]\d)/i.test(str) && /[\u4e00-\u9fff]/.test(str))) {
    return null;
  }
  return str
    .replace(/^facts\b/i, 'Hồ sơ chuẩn')
    .replace(/标准值表/g, 'Bảng giá trị chuẩn')
    .replace(/人教版/g, 'SGK chuẩn')
    .replace(/人教/g, 'SGK ')
    .replace(/选择性必修/g, 'Chuyên đề ')
    .replace(/选必/g, 'Chuyên đề ')
    .replace(/必修第一册/g, 'Khối 10')
    .replace(/必修第二册/g, 'Khối 10–11')
    .replace(/必修第三册/g, 'Khối 11')
    .replace(/必修\s*1/g, 'Khối 10')
    .replace(/必修\s*2/g, 'Khối 11')
    .replace(/必修/g, 'Cơ bản ')
    .replace(/印刷页/g, 'trang in')
    .replace(/第\s*([0-9、，,\s–\\u2013-]+)\s*条/g, 'mục $1')
    .replace(/第\s*([0-9、，,\s–\\u2013-]+)\s*节/g, 'bài $1')
    .replace(/第\s*([0-9、，,\s–\\u2013-]+)\s*章/g, 'chương $1')
    .replace(/第\s*([0-9、，,\s–\\u2013-]+)\s*步/g, 'bước $1')
    .replace(/算子\s*/g, 'biểu thức ')
    .replace(/行\s*([0-9/、，,\s–\\u2013-]+)/g, 'dòng $1')
    .replace(/图\s*([0-9.-]+)/g, 'Hình $1')
    .replace(/表\s*([0-9A-Za-z.-]+)/g, 'Bảng $1')
    .replace(/页/g, 'trang')
    .replace(/、/g, ', ')
    .replace(/；/g, '; ')
    .replace(/（/g, ' (')
    .replace(/）/g, ')');
}

export function findShellBoundary(html) {
  const startMarker = 'home:"\\u76EE\\u5F55"';
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    // Already localized or different marker
    return null;
  }
  const varStart = html.lastIndexOf('var ', startIdx);
  const endMarker = '\\u6B65\\u9AA4\\u6761\\u5916\\u58F3\\u5951\\u7EA6\\u9519\\u8BEF';
  const mIdx = html.lastIndexOf(endMarker);
  if (mIdx === -1) return null;
  const endIdx = html.indexOf(')}', mIdx) + 2;
  const scriptEnd = html.lastIndexOf('</script>');
  return { varStart, endIdx, scriptEnd };
}

export function localizeSharedShell(html) {
  let out = html.replace('<html lang="zh-CN">', '<html lang="vi">');
  const bounds = findShellBoundary(out);
  if (!bounds) return out;

  let shell = out.slice(bounds.varStart, bounds.endIdx);

  // Strip CSS block comments inside Lp and r0 so no Chinese comments remain in CSS
  shell = shell.replace(/\/\*[\s\S]*?\*\//g, '');

  // Update font families in Lp and r0 to Vietnamese-first SaaS stack
  shell = shell.replace(
    '--font:"PingFang SC","Microsoft YaHei","Noto Sans CJK SC","Source Han Sans SC","Hiragino Sans GB",system-ui,sans-serif;',
    '--font:"Be Vietnam Pro","Inter","Segoe UI",system-ui,-apple-system,sans-serif;'
  );
  shell = shell.replace(
    '--num:"SF Pro Display","DIN Alternate","Helvetica Neue","PingFang SC",system-ui,sans-serif;',
    '--num:"JetBrains Mono","Be Vietnam Pro","Inter","Segoe UI",system-ui,sans-serif;'
  );
  shell = shell.replace(
    'font-family:-apple-system,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;',
    'font-family:"Be Vietnam Pro","Inter",-apple-system,"Segoe UI",system-ui,sans-serif;'
  );

  // Update CSS pseudo-element content:"\u672C\u6B65" ("本步") -> content:"Bước này"
  shell = shell.replace(/content:"\\u672C\\u6B65"/g, 'content:"Bước này"');

  // Update default home link "./index.html" to "/" so clicking "Mục lục" inside any course goes back to the portal
  shell = shell.replace('t.meta.home||"./index.html"', 't.meta.home||"/"');

  // Replace all JS CJK string segments in shell
  shell = replaceJsCjkSegments(shell, (seg) => {
    if (SHARED_DICT[seg.dec] !== undefined) {
      return SHARED_DICT[seg.dec];
    }
    return seg.dec;
  });

  return out.slice(0, bounds.varStart) + shell + out.slice(bounds.endIdx);
}
