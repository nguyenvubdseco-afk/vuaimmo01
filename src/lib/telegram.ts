// Thoát ký tự đặc biệt trước khi chèn vào tin nhắn dùng parse_mode: "HTML",
// tránh dữ liệu người dùng (tên sản phẩm, email...) làm hỏng định dạng tin nhắn.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Gửi thông báo Telegram khi có sự kiện quan trọng (đơn hàng thanh toán thành công).
// Không throw lỗi ra ngoài — một thông báo lỗi không được phép làm hỏng luồng xử lý webhook chính.
export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!response.ok) {
      console.error("Gửi Telegram thất bại:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Gửi Telegram thất bại:", error);
  }
}
