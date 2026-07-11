import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Tab "Bảng giá" (/gia) đã đổi thành "Quà Tặng" (/qua-tang) — giữ redirect
      // để link cũ đã chia sẻ/lưu trước đây không bị lỗi 404.
      { source: "/gia", destination: "/qua-tang", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      // Ảnh/tệp phần mềm giờ tải thẳng lên Supabase Storage từ trình duyệt (xem
      // src/lib/uploadClient.ts), không đi qua server action nữa — vì Vercel giới hạn
      // cứng mỗi request qua Serverless Function chỉ 4.5MB. Form action giờ chỉ nhận
      // text (mô tả, tính năng...) nên không cần giới hạn cao.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
