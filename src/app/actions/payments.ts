"use server";

import { createOrder } from "@/lib/store";
import { buildSepayQrUrl, isSepayConfigured, parseVndAmount } from "@/lib/sepay";

export type CreateOrderResult =
  | { ok: true; orderId: string; qrUrl: string; amount: number }
  | { ok: false; error: string };

export async function createPaymentOrder(
  productName: string,
  priceLabel: string,
  email: string,
): Promise<CreateOrderResult> {
  if (!email.trim()) {
    return { ok: false, error: "Vui lòng nhập email." };
  }

  const amount = parseVndAmount(priceLabel);
  if (!amount) {
    return { ok: false, error: "Gói này không cần thanh toán." };
  }

  if (!isSepayConfigured()) {
    return {
      ok: false,
      error: "Chưa cấu hình cổng thanh toán SePay. Vui lòng liên hệ quản trị viên.",
    };
  }

  const order = await createOrder({ productName, email: email.trim(), amount });
  const qrUrl = buildSepayQrUrl(amount, order.code);

  return { ok: true, orderId: order.id, qrUrl, amount };
}
