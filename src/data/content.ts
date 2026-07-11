// Toàn bộ nội dung hiển thị trên trang được gom về đây.
// Khi có thông tin thật, chỉ cần chỉnh sửa các giá trị trong file này — không cần đụng tới component.

export const siteConfig = {
  brand: "AI System Creator",
  tagline: "AI Marketplace",
  nav: [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/san-pham" },
    { label: "Prompt tham khảo", href: "/prompt-tham-khao" },
    { label: "Quà Tặng", href: "/qua-tang" },
    { label: "Liên hệ", href: "/lien-he" },
  ],
};

// Nội dung Hero có thể chỉnh sửa qua /admin được lưu ở src/data/store/site.json.
// Chỉ số thống kê bên dưới giữ tĩnh vì ít khi thay đổi.
export const heroStats = [
  { value: "600+", label: "Công cụ AI" },
  { value: "98%", label: "Khách hàng hài lòng" },
  { value: "5 phút", label: "Thời gian triển khai" },
];

export const gradients = [
  "from-violet-500 to-fuchsia-500",
  "from-orange-400 to-rose-500",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-pink-500 to-purple-600",
  "from-cyan-400 to-indigo-500",
  "from-lime-400 to-emerald-600",
  "from-red-400 to-pink-600",
  "from-indigo-400 to-violet-600",
  "from-yellow-400 to-red-500",
  "from-teal-400 to-cyan-600",
];

export const productCategories = ["Tất cả", "Tool & App", "Chatbot & Prompt", "Sản phẩm số"];

// Danh sách sản phẩm giờ được quản lý qua /admin — xem src/lib/store.ts (đọc từ
// src/data/store/products.json) thay vì mảng tĩnh ở đây.

export const features = [
  {
    title: "Triển khai trong vài phút",
    description: "Kết nối và đưa công cụ AI vào vận hành ngay mà không cần đội ngũ kỹ thuật riêng.",
  },
  {
    title: "Analytics thời gian thực",
    description: "Theo dõi hiệu quả sử dụng và tác động của từng công cụ AI ngay trên một bảng điều khiển.",
  },
  {
    title: "Bảo mật đạt chuẩn",
    description: "Dữ liệu doanh nghiệp được mã hóa và tuân thủ các tiêu chuẩn bảo mật quốc tế.",
  },
  {
    title: "Hỗ trợ đội ngũ 24/7",
    description: "Đội ngũ chuyên gia luôn sẵn sàng đồng hành cùng bạn trong suốt quá trình sử dụng.",
  },
  {
    title: "Tích hợp nhanh chóng",
    description: "Kết nối liền mạch với các hệ thống và công cụ bạn đang sử dụng hằng ngày.",
  },
  {
    title: "Mở rộng linh hoạt",
    description: "Dễ dàng nâng cấp quy mô khi doanh nghiệp của bạn phát triển.",
  },
];

export const downloadTools = [
  { name: "Tool tải về 01", tagline: "Xử lý tác vụ AI ngay trên máy tính, không cần internet", price: "299.000đ", platform: "Windows / macOS" },
  { name: "Tool tải về 02", tagline: "Tối ưu hình ảnh và video hàng loạt bằng AI cục bộ", price: "199.000đ", platform: "Windows" },
  { name: "Tool tải về 03", tagline: "Trích xuất và tóm tắt văn bản từ tài liệu", price: "Miễn phí", platform: "macOS" },
  { name: "Tool tải về 04", tagline: "Quản lý và tự động hóa tác vụ hằng ngày", price: "249.000đ", platform: "Windows / macOS" },
  { name: "Tool tải về 05", tagline: "Sao lưu và đồng bộ dữ liệu thông minh", price: "149.000đ", platform: "Windows" },
];

export const faqs = [
  {
    question: "Tôi cần kỹ năng kỹ thuật gì để bắt đầu?",
    answer:
      "Không cần. Nền tảng được thiết kế để bất kỳ ai cũng có thể triển khai công cụ AI chỉ với vài thao tác đơn giản.",
  },
  {
    question: "Tôi có thể dùng thử trước khi trả phí không?",
    answer:
      "Có. Bạn có thể dùng thử miễn phí nhiều công cụ AI trước khi quyết định nâng cấp lên gói trả phí.",
  },
  {
    question: "Dữ liệu của tôi có được bảo mật không?",
    answer:
      "Toàn bộ dữ liệu được mã hóa và tuân thủ các tiêu chuẩn bảo mật quốc tế, chỉ bạn mới có quyền truy cập.",
  },
  {
    question: "Tôi có thể hủy gói dịch vụ bất kỳ lúc nào không?",
    answer: "Có. Bạn có thể nâng cấp, hạ cấp hoặc hủy gói dịch vụ bất kỳ lúc nào mà không mất phí ẩn.",
  },
  {
    question: "Nền tảng có hỗ trợ tích hợp với hệ thống hiện tại không?",
    answer:
      "Có. Nền tảng hỗ trợ tích hợp với hầu hết các công cụ và hệ thống phổ biến mà doanh nghiệp đang sử dụng.",
  },
  {
    question: "Tôi có thể liên hệ hỗ trợ bằng cách nào?",
    answer: "Đội ngũ hỗ trợ luôn sẵn sàng 24/7 qua chat trực tuyến, email hoặc hotline.",
  },
];

export const pricingPlans = [
  {
    name: "Miễn phí",
    price: "0đ",
    period: "/ mãi mãi",
    description: "Dành cho cá nhân muốn dùng thử các công cụ AI cơ bản.",
    cta: "Bắt đầu miễn phí",
    highlighted: false,
    features: [
      "Truy cập 5 công cụ AI cơ bản",
      "100 lượt xử lý / tháng",
      "Hỗ trợ qua cộng đồng",
    ],
  },
  {
    name: "Chuyên nghiệp",
    price: "499.000đ",
    period: "/ tháng",
    description: "Dành cho doanh nghiệp nhỏ cần triển khai AI vào vận hành hằng ngày.",
    cta: "Dùng thử 14 ngày",
    highlighted: true,
    features: [
      "Truy cập toàn bộ 600+ công cụ AI",
      "Không giới hạn lượt xử lý",
      "Analytics thời gian thực",
      "Hỗ trợ ưu tiên 24/7",
    ],
  },
  {
    name: "Doanh nghiệp",
    price: "Liên hệ",
    period: "",
    description: "Giải pháp tùy chỉnh cho doanh nghiệp quy mô lớn, yêu cầu bảo mật riêng.",
    cta: "Liên hệ tư vấn",
    highlighted: false,
    features: [
      "Tất cả quyền lợi gói Chuyên nghiệp",
      "Triển khai riêng theo yêu cầu",
      "Bảo mật và hợp đồng SLA riêng",
      "Quản lý tài khoản chuyên trách",
    ],
  },
];

export const giftFaqs = [
  {
    question: "Các sản phẩm trong mục Quà Tặng có thật sự miễn phí không?",
    answer: "Có. Toàn bộ sản phẩm hiển thị ở đây được tải về và sử dụng hoàn toàn miễn phí.",
  },
  {
    question: "Tôi có cần tạo tài khoản để tải về không?",
    answer: "Không cần. Bấm \"Tải về miễn phí\" là tải ngay, không yêu cầu đăng ký hay thanh toán.",
  },
];

// Eyebrow/headline/description/info của Liên hệ được quản lý qua /admin
// (src/data/store/site.json). Phần khai báo form dưới đây giữ tĩnh.
export const contactForm = {
  formFields: [
    { name: "name", label: "Họ và tên", type: "text", placeholder: "Nguyễn Văn A" },
    { name: "email", label: "Email", type: "email", placeholder: "ban@congty.com" },
    { name: "phone", label: "Số điện thoại", type: "tel", placeholder: "09xx xxx xxx" },
  ],
  messageLabel: "Nội dung",
  messagePlaceholder: "Bạn cần hỗ trợ điều gì?",
  submitLabel: "Gửi yêu cầu",
};

export const footer = {
  description:
    "Nền tảng giúp doanh nghiệp khám phá, triển khai và quản lý công cụ AI dễ dàng hơn.",
  columns: [
    {
      title: "Sản phẩm",
      links: [
        { label: "Sản phẩm nổi bật", href: "/san-pham" },
        { label: "Tool tải về", href: "/#downloads" },
        { label: "Quà Tặng", href: "/qua-tang" },
        { label: "Tích hợp", href: "/#features" },
      ],
    },
    {
      title: "Công ty",
      links: [
        { label: "Về chúng tôi", href: "/lien-he" },
        { label: "Blog", href: "#" },
        { label: "Tuyển dụng", href: "#" },
        { label: "Liên hệ", href: "/lien-he" },
      ],
    },
    {
      title: "Hỗ trợ",
      links: [
        { label: "Trung tâm trợ giúp", href: "/lien-he" },
        { label: "Câu hỏi thường gặp", href: "/#faq" },
        { label: "Điều khoản dịch vụ", href: "#" },
        { label: "Chính sách bảo mật", href: "#" },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} ${siteConfig.brand}. Đã đăng ký bản quyền.`,
};
