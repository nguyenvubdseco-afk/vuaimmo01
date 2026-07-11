// Chạy 1 lần sau khi đã thêm bảng "prompts" từ supabase/schema.sql (mục Prompt tham khảo):
//
//   node scripts/seed-prompts.mjs
//
// Nạp 14 prompt tham khảo gốc (trước đây nằm cứng trong src/data/prompts.ts) vào Supabase.
// An toàn để chạy lại — sẽ báo lỗi "duplicate key" nếu dữ liệu đã tồn tại, bỏ qua được.

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const prompts = [
  {
    title: "Biến tài liệu nghiên cứu thành hệ thống kiến thức",
    description: "Biến giờ đọc tài liệu dài thành hệ thống có cấu trúc, dễ tra cứu lại sau này.",
    category: "Học tập & Research",
    tools: ["NotebookLM", "Claude", "ChatGPT"],
    template:
      "Bạn là trợ lý nghiên cứu. Tôi sẽ cung cấp tài liệu về chủ đề [Chủ đề nghiên cứu]. Hãy: 1) Tóm tắt các luận điểm chính theo cấu trúc phân cấp, 2) Liệt kê thuật ngữ quan trọng kèm định nghĩa ngắn, 3) Tạo bộ câu hỏi ôn tập để tôi tự kiểm tra, 4) Chỉ ra phần còn mơ hồ cần tìm hiểu thêm. Trình bày dưới dạng dễ tra cứu nhanh.",
  },
  {
    title: "Tạo ảnh & video quảng cáo sản phẩm bằng AI",
    description: "Tạo ảnh, video quảng cáo sản phẩm không cần thuê ngoài studio.",
    category: "Hình ảnh & Sáng tạo",
    tools: ["Midjourney", "Nano Banana + Veo", "Sora"],
    template:
      "Tạo ảnh sản phẩm quảng cáo cho [Tên sản phẩm], chất liệu [Chất liệu], đặt trên nền [Bối cảnh], ánh sáng [Kiểu ánh sáng], góc chụp [Góc máy], phong cách [Phong cách hình ảnh]. Kèm 1 đoạn mô tả chuyển động ngắn để dựng video quảng cáo 5-10 giây thể hiện [Hành động chính].",
  },
  {
    title: "Viết caption bán hàng trên Facebook/TikTok Shop",
    description: "Tạo 3 phiên bản caption kèm hashtag, sẵn sàng đăng ngay.",
    category: "Content & Marketing",
    tools: ["ChatGPT", "Claude"],
    template:
      "Viết 3 phiên bản caption bán hàng cho sản phẩm [Tên sản phẩm], mô tả ngắn: [Mô tả sản phẩm], đối tượng khách hàng: [Đối tượng]. Mỗi caption văn phong khác nhau (hài hước / chuyên nghiệp / khẩn cấp-khuyến mãi), kèm 5-7 hashtag liên quan và 1 câu kêu gọi hành động rõ ràng.",
  },
  {
    title: "Lên kế hoạch content pillar 1 tháng",
    description: "Xây khung nội dung 4 tuần cho fanpage, không lo hết ý tưởng.",
    category: "Content & Marketing",
    tools: ["ChatGPT", "Claude"],
    template:
      "Lên kế hoạch nội dung 4 tuần cho fanpage ngành [Ngành/lĩnh vực], mục tiêu: [Mục tiêu]. Với mỗi tuần, đề xuất 1 content pillar (chủ đề trụ cột), 3-5 ý tưởng bài viết cụ thể kèm định dạng (ảnh/video/carousel), và gợi ý thời điểm đăng phù hợp.",
  },
  {
    title: "Email kéo khách cũ quay lại mua hàng",
    description: "Viết email re-engagement chuyên nghiệp, ngắn gọn, có ưu đãi rõ ràng.",
    category: "Email & Giao tiếp",
    tools: ["ChatGPT", "Claude"],
    template:
      "Viết email re-engagement gửi khách hàng cũ chưa mua lại trong [Khoảng thời gian] của [Tên thương hiệu]. Giọng văn thân thiện, nhắc lại giá trị đã mang lại, kèm ưu đãi [Mô tả ưu đãi] và 1 CTA rõ ràng. Giữ độ dài dưới 150 từ.",
  },
  {
    title: "Trả lời email khách hàng đang khiếu nại/phàn nàn",
    description: "Soạn phản hồi xoa dịu khách, giữ hình ảnh thương hiệu chuyên nghiệp.",
    category: "Email & Giao tiếp",
    tools: ["ChatGPT", "Claude"],
    template:
      "Soạn email phản hồi khách hàng đang phàn nàn về [Vấn đề khách gặp phải]. Giọng văn xin lỗi chân thành, không đổ lỗi, đề xuất hướng giải quyết cụ thể ([Phương án xử lý]), kèm 1 lời cam kết cải thiện. Giữ chuyên nghiệp, tránh phòng thủ.",
  },
  {
    title: "Phân tích nhanh chiến lược của đối thủ",
    description: "Tóm lược điểm mạnh, điểm yếu và cơ hội chỉ trong vài phút.",
    category: "Kinh doanh",
    tools: ["ChatGPT", "Claude", "Gemini"],
    template:
      "Phân tích chiến lược kinh doanh của đối thủ [Tên đối thủ] trong ngành [Ngành]. Dựa trên thông tin: [Dán thông tin/website/mô tả đối thủ], hãy tóm tắt điểm mạnh, điểm yếu, phân khúc khách hàng mục tiêu, và 3 cơ hội tôi có thể khai thác để cạnh tranh tốt hơn.",
  },
  {
    title: "Định giá sản phẩm/dịch vụ mới ra mắt",
    description: "Khung giá hợp lý dựa trên chi phí và mặt bằng đối thủ.",
    category: "Kinh doanh",
    tools: ["ChatGPT", "Claude"],
    template:
      "Đề xuất khung giá cho sản phẩm/dịch vụ [Tên sản phẩm], chi phí sản xuất/vận hành ước tính: [Chi phí], đối thủ đang bán ở mức: [Giá đối thủ]. Đưa ra 3 mức giá (thấp/trung bình/cao) kèm lý do và phân khúc khách hàng phù hợp với mỗi mức.",
  },
  {
    title: "Debug đoạn code bị lỗi không rõ nguyên nhân",
    description: "Tìm lỗi nhanh hơn với AI, kèm giải thích nguyên nhân gốc rễ.",
    category: "Code & Kỹ thuật",
    tools: ["Claude", "ChatGPT"],
    template:
      "Tôi có đoạn code sau bị lỗi [Mô tả lỗi/hành vi không mong muốn]:\n\n[Dán đoạn code]\n\nHãy: 1) Xác định nguyên nhân gốc rễ, 2) Giải thích tại sao lỗi xảy ra, 3) Đề xuất bản sửa kèm code hoàn chỉnh, 4) Gợi ý cách viết để tránh lỗi tương tự sau này.",
  },
  {
    title: "Viết unit test cho một function có sẵn",
    description: "Sinh test case bao quát các trường hợp biên, đặt tên rõ ràng.",
    category: "Code & Kỹ thuật",
    tools: ["Claude Code", "Claude"],
    template:
      "Viết bộ unit test cho function sau (ngôn ngữ [Ngôn ngữ lập trình], framework test [Framework]):\n\n[Dán function]\n\nBao quát: input hợp lệ, input biên (edge case), input không hợp lệ/gây lỗi. Đặt tên test rõ ràng, mô tả mục đích từng test.",
  },
  {
    title: "Tóm tắt tài liệu/báo cáo dài thành điểm chính",
    description: "Rút gọn tài liệu, giữ nguyên số liệu và kết luận quan trọng.",
    category: "Học tập & Research",
    tools: ["Claude", "ChatGPT", "Gemini"],
    template:
      "Tóm tắt tài liệu sau thành các điểm chính, giữ nguyên số liệu và kết luận quan trọng, không thêm ý kiến cá nhân:\n\n[Dán nội dung tài liệu]\n\nTrình bày dưới dạng gạch đầu dòng, tối đa [Số lượng] ý, nhóm theo chủ đề nếu tài liệu có nhiều phần.",
  },
  {
    title: "Giải thích khái niệm khó như đang nói với người mới",
    description: "Hiểu nhanh qua ví dụ đời thường, không cần nền tảng chuyên môn.",
    category: "Học tập & Research",
    tools: ["Claude", "ChatGPT"],
    isNew: true,
    template:
      "Giải thích khái niệm [Tên khái niệm] như đang nói chuyện với một người hoàn toàn mới, chưa có kiến thức nền. Dùng ví dụ đời thường dễ hình dung, tránh thuật ngữ chuyên môn (nếu cần dùng thì giải thích luôn), kết thúc bằng 1 câu tóm tắt ngắn gọn nhất.",
  },
  {
    title: "Mô tả chi tiết để tạo ảnh sản phẩm bằng AI",
    description: "Viết prompt chi tiết để hạn chế phải tạo lại nhiều lần.",
    category: "Hình ảnh & Sáng tạo",
    tools: ["Midjourney", "Flux", "Gemini"],
    isNew: true,
    template:
      "Viết prompt tạo ảnh chi tiết cho sản phẩm [Tên sản phẩm]: chất liệu [Chất liệu], màu sắc [Màu sắc], bối cảnh/nền [Bối cảnh], ánh sáng [Kiểu ánh sáng], góc chụp [Góc máy], phong cách [Phong cách hình ảnh]. Thêm từ khóa kỹ thuật (độ phân giải, tỉ lệ khung hình) để hạn chế phải tạo lại nhiều lần.",
  },
  {
    title: "Tạo banner quảng cáo có chữ bằng AI",
    description: "Mô tả layout rõ ràng để AI dựng banner đúng ý ngay từ lần đầu.",
    category: "Hình ảnh & Sáng tạo",
    tools: ["Canva Magic Studio", "Gemini"],
    isNew: true,
    template:
      "Mô tả layout banner quảng cáo cho [Chương trình/sản phẩm], kích thước [Kích thước]. Bố cục gồm: tiêu đề chính '[Tiêu đề]', tiêu đề phụ '[Mô tả ngắn]', vị trí logo, vùng đặt sản phẩm/hình ảnh, màu chủ đạo [Màu thương hiệu], và 1 nút CTA ghi '[Nội dung CTA]'.",
  },
];

async function main() {
  console.log(`Đang chèn ${prompts.length} prompt vào Supabase...`);

  for (const prompt of prompts) {
    const { error } = await supabase.from("prompts").insert({
      id: randomUUID(),
      title: prompt.title,
      description: prompt.description,
      category: prompt.category,
      tools: prompt.tools,
      is_new: prompt.isNew ?? false,
      template: prompt.template,
    });

    if (error) {
      console.error(`  Lỗi khi chèn "${prompt.title}": ${error.message}`);
    } else {
      console.log(`  Đã chèn: ${prompt.title}`);
    }
  }

  console.log("Xong.");
}

main();
