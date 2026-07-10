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
  store.set(ADMIN_SESSION_COOKIE, createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}
