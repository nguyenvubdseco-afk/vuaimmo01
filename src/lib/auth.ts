import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  createSessionCookieValue,
  isValidSessionCookieValue,
} from "@/lib/auth-cookie";

export async function isAdminAuthenticated() {
  const store = await cookies();
  return isValidSessionCookieValue(store.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function setAdminSessionCookie() {
  const store = await cookies();
  // Không đặt maxAge/expires => cookie phiên (session cookie): trình duyệt tự xoá
  // khi đóng hẳn trình duyệt (đóng toàn bộ cửa sổ), không cần đăng xuất thủ công.
  store.set(ADMIN_SESSION_COOKIE, createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}
