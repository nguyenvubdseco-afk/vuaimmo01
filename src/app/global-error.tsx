"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="vi" className="dark">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 py-20 text-center text-foreground">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
            aria-hidden
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h1 className="text-xl font-bold sm:text-2xl">Trang gặp sự cố</h1>
        <p className="max-w-md text-sm text-muted">
          Đã có lỗi xảy ra khi tải trang. Vui lòng thử lại, nếu vẫn lỗi hãy tải lại toàn bộ trang.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
          >
            Thử lại
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent-2"
          >
            Tải lại toàn bộ trang
          </button>
        </div>
      </body>
    </html>
  );
}
