// Tích hợp SePay (https://sepay.vn) — tạo mã QR chuyển khoản ngân hàng và xác nhận
// thanh toán tự động qua webhook. Cấu hình tài khoản ngân hàng + API key trong .env.local
// (xem README_SEPAY.md để biết chi tiết từng biến).

/** Đổi chuỗi giá dạng "299.000đ" / "Miễn phí" thành số VNĐ. Trả về null nếu không thu tiền được (vd. miễn phí). */
export function parseVndAmount(price: string): number | null {
  const digits = price.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const amount = Number(digits);
  return amount > 0 ? amount : null;
}

export function isSepayConfigured(): boolean {
  return Boolean(process.env.SEPAY_ACCOUNT_NUMBER && process.env.SEPAY_BANK_CODE);
}

/** Dựng URL ảnh mã QR VietQR do SePay cung cấp — không cần API key, chỉ cần số TK + ngân hàng. */
export function buildSepayQrUrl(amount: number, description: string): string {
  const acc = process.env.SEPAY_ACCOUNT_NUMBER ?? "";
  const bank = process.env.SEPAY_BANK_CODE ?? "";
  const params = new URLSearchParams({
    acc,
    bank,
    amount: String(amount),
    des: description,
    template: "compact",
  });
  return `https://qr.sepay.vn/img?${params.toString()}`;
}
