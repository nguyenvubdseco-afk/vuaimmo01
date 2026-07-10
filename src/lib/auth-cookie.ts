// Logic ký/xác minh cookie phiên admin — tách riêng khỏi auth.ts vì file này
// cần chạy được cả trong proxy.ts (Node runtime, không có next/headers).
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

const SESSION_PAYLOAD = "authenticated";

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET chưa được cấu hình. Thêm biến này vào .env.local");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

export function createSessionCookieValue() {
  return `${SESSION_PAYLOAD}.${sign(SESSION_PAYLOAD)}`;
}

export function isValidSessionCookieValue(value: string | undefined | null) {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || payload !== SESSION_PAYLOAD) return false;

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected, "utf-8");
  const actualBuffer = Buffer.from(signature, "utf-8");
  if (expectedBuffer.length !== actualBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD chưa được cấu hình. Thêm biến này vào .env.local");
  }
  const expectedBuffer = Buffer.from(expected, "utf-8");
  const actualBuffer = Buffer.from(password, "utf-8");
  if (expectedBuffer.length !== actualBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
