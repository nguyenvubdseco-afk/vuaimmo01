import { login } from "@/app/admin/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <form
        action={login}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8"
      >
        <h1 className="text-xl font-bold">Đăng nhập quản trị</h1>
        <p className="mt-1 text-sm text-muted">
          Nhập mật khẩu để truy cập trang quản trị nội dung.
        </p>

        <label className="mt-6 flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mật khẩu</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-red-400">Mật khẩu không đúng, vui lòng thử lại.</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-2"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
