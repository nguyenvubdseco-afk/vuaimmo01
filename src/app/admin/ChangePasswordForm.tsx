"use client";

import { useActionState } from "react";
import { changeAdminPassword, type ChangePasswordState } from "@/app/admin/actions";

const initialState: ChangePasswordState = { success: false };

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changeAdminPassword, initialState);

  return (
    <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold">Đổi mật khẩu quản trị</h2>
      <p className="mt-1 text-sm text-muted">
        Có hiệu lực ngay sau khi lưu, không cần sửa cấu hình hay deploy lại.
      </p>

      <form action={formAction} className="mt-6 flex max-w-sm flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mật khẩu hiện tại</span>
          <input
            type="password"
            name="currentPassword"
            required
            autoComplete="current-password"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mật khẩu mới</span>
          <input
            type="password"
            name="newPassword"
            required
            minLength={8}
            autoComplete="new-password"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">Tối thiểu 8 ký tự.</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Xác nhận mật khẩu mới</span>
          <input
            type="password"
            name="confirmPassword"
            required
            autoComplete="new-password"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
        {state.success && (
          <p className="text-sm text-emerald-400">Đã đổi mật khẩu thành công.</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Đang lưu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </section>
  );
}
