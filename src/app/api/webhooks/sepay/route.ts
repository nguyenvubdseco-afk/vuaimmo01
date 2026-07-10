import { NextRequest, NextResponse } from "next/server";
import { findOrderByTransferContent, markOrderPaid } from "@/lib/store";

// SePay gọi vào endpoint này mỗi khi tài khoản ngân hàng đã đăng ký nhận được giao dịch.
// Cấu hình URL này (https://ten-mien-cua-ban.com/api/webhooks/sepay) trong mục Webhook
// của dashboard SePay, kèm API Key — SePay sẽ gửi header "Authorization: Apikey <key>".
export async function POST(request: NextRequest) {
  const apiKey = process.env.SEPAY_WEBHOOK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "Webhook chưa được cấu hình." }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader !== `Apikey ${apiKey}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload || payload.transferType !== "in") {
    // Chỉ xử lý giao dịch tiền vào; bỏ qua tiền ra hoặc payload không hợp lệ.
    return NextResponse.json({ success: true });
  }

  const content = String(payload.content ?? payload.description ?? "");
  const order = await findOrderByTransferContent(content);

  if (order) {
    const transactionId = String(payload.id ?? payload.referenceCode ?? "");
    await markOrderPaid(order.id, transactionId);
  }

  // Luôn trả success:true cho SePay dù không khớp đơn nào, để tránh SePay gửi lại liên tục.
  return NextResponse.json({ success: true });
}
