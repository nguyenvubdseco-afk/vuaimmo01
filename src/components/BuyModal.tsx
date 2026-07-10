"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createPaymentOrder } from "@/app/actions/payments";

type BuyModalProps = {
  productName: string;
  price: string;
  triggerLabel?: string;
  triggerClassName?: string;
  downloadUrl?: string | null;
  downloadFileName?: string | null;
};

type Step = "form" | "qr" | "paid";

export default function BuyModal({
  productName,
  price,
  triggerLabel = "Mua ngay",
  triggerClassName = "w-full rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90",
  downloadUrl,
  downloadFileName,
}: BuyModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  function close() {
    setOpen(false);
    setStep("form");
    setEmail("");
    setError(null);
    setOrderId(null);
    setQrUrl(null);
    setAmount(null);
  }

  async function handleCreateOrder() {
    setIsCreating(true);
    setError(null);
    const result = await createPaymentOrder(productName, price, email);
    setIsCreating(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOrderId(result.orderId);
    setQrUrl(result.qrUrl);
    setAmount(result.amount);
    setStep("qr");
  }

  // Đóng modal thì khoá cuộn trang + cho phép Esc để đóng.
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Khi đang ở bước hiện mã QR, tự động kiểm tra định kỳ xem SePay đã báo thanh toán chưa.
  useEffect(() => {
    if (step !== "qr" || !orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (!res.ok) return;
        const data: { status: string } = await res.json();
        if (data.status === "paid") setStep("paid");
      } catch {
        // Bỏ qua lỗi mạng tạm thời, lần poll sau sẽ thử lại.
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, orderId]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        {triggerLabel}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm animate-[modal-overlay-in_0.15s_ease-out]"
            onClick={close}
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 animate-[modal-panel-in_0.2s_ease-out]"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Đóng"
                className="absolute right-4 top-4 text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>

              {step === "form" && (
                <>
                  <h3 className="pr-6 text-lg font-semibold">Mua {productName}</h3>
                  <p className="mt-1 text-sm text-muted">
                    Giá {price} — thanh toán một lần, nhận link tải qua email ngay sau khi thanh
                    toán.
                  </p>

                  <label className="mt-5 flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Email nhận link tải</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@email.com"
                      className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    />
                  </label>

                  {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                  <button
                    type="button"
                    disabled={!email || isCreating}
                    onClick={handleCreateOrder}
                    className="mt-5 w-full rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isCreating ? "Đang tạo mã QR..." : "Tạo mã QR thanh toán"}
                  </button>

                  {downloadUrl && (
                    <>
                      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                        <span className="h-px flex-1 bg-border" />
                        hoặc
                        <span className="h-px flex-1 bg-border" />
                      </div>

                      <a
                        href={downloadUrl}
                        download={downloadFileName ?? undefined}
                        onClick={close}
                        className="mt-4 flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent-2"
                      >
                        Tải về và dùng thử 7 ngày
                      </a>
                    </>
                  )}
                </>
              )}

              {step === "qr" && qrUrl && (
                <>
                  <h3 className="pr-6 text-lg font-semibold">Quét mã để thanh toán</h3>
                  <p className="mt-1 text-sm text-muted">
                    {productName} · {amount?.toLocaleString("vi-VN")}đ
                  </p>

                  <div className="mt-5 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrUrl}
                      alt="Mã QR thanh toán SePay"
                      className="w-64 rounded-xl bg-white p-2"
                    />
                  </div>

                  <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-accent-2" />
                    Đang chờ thanh toán — trang sẽ tự cập nhật khi nhận được tiền.
                  </p>
                  <p className="mt-1 text-center text-xs text-muted">
                    Link tải sẽ gửi tới <span className="text-foreground">{email}</span> ngay sau
                    khi thanh toán thành công.
                  </p>
                </>
              )}

              {step === "paid" && (
                <>
                  <h3 className="pr-6 text-lg font-semibold">Thanh toán thành công 🎉</h3>
                  <p className="mt-2 text-sm text-muted">
                    Cảm ơn bạn đã mua {productName}. Link tải sẽ được gửi tới{" "}
                    <span className="text-foreground">{email}</span> trong ít phút.
                  </p>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
