import Link from "next/link";
import { getContactSubmissions, getOrders, getProducts, getSiteContent } from "@/lib/store";
import { logout, updateSiteContent } from "@/app/admin/actions";
import DeleteProductButton from "@/app/admin/DeleteProductButton";
import DeleteContactButton from "@/app/admin/DeleteContactButton";

export default async function AdminDashboardPage() {
  const [products, site, contacts, orders] = await Promise.all([
    getProducts(),
    getSiteContent(),
    getContactSubmissions(),
    getOrders(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản trị nội dung</h1>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            Đăng xuất
          </button>
        </form>
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Nội dung Trang chủ &amp; Liên hệ</h2>
        <p className="mt-1 text-sm text-muted">
          Chỉnh sửa tiêu đề, mô tả và thông tin liên hệ hiển thị trên trang chủ.
        </p>

        <form action={updateSiteContent} className="mt-6 flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold text-accent-2">Hero — Trang chủ</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" name="hero_eyebrow" defaultValue={site.hero.eyebrow} />
              <Field label="Tiêu đề (đầu)" name="hero_headline" defaultValue={site.hero.headline} />
              <Field
                label="Tiêu đề (nhấn mạnh)"
                name="hero_headlineHighlight"
                defaultValue={site.hero.headlineHighlight}
              />
              <Field label="Tiêu đề (cuối)" name="hero_headlineEnd" defaultValue={site.hero.headlineEnd} />
              <Field label="Nút chính" name="hero_primaryCta" defaultValue={site.hero.primaryCta} />
              <Field label="Nút phụ" name="hero_secondaryCta" defaultValue={site.hero.secondaryCta} />
            </div>
            <TextAreaField
              label="Mô tả"
              name="hero_description"
              defaultValue={site.hero.description}
            />
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-accent-2">Liên hệ</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" name="contact_eyebrow" defaultValue={site.contact.eyebrow} />
              <Field label="Tiêu đề" name="contact_headline" defaultValue={site.contact.headline} />
              <Field
                label="Email"
                name="contact_email"
                defaultValue={site.contact.info[0]?.value ?? ""}
              />
              <Field
                label="Hotline"
                name="contact_hotline"
                defaultValue={site.contact.info[1]?.value ?? ""}
              />
              <Field
                label="Địa chỉ"
                name="contact_address"
                defaultValue={site.contact.info[2]?.value ?? ""}
              />
              <Field
                label="Giờ làm việc"
                name="contact_hours"
                defaultValue={site.contact.info[3]?.value ?? ""}
              />
            </div>
            <TextAreaField
              label="Mô tả"
              name="contact_description"
              defaultValue={site.contact.description}
            />
          </div>

          <button
            type="submit"
            className="w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-2"
          >
            Lưu nội dung
          </button>
        </form>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sản phẩm ({products.length})</h2>
            <p className="mt-1 text-sm text-muted">Thêm, sửa ảnh hoặc xoá sản phẩm.</p>
          </div>
          <Link
            href="/admin/products/new"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-2"
          >
            + Thêm sản phẩm
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white/90">
                    {product.name.slice(-2)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-muted">
                    {product.category} · {product.price} · ★ {product.rating}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent-2"
                >
                  Sửa
                </Link>
                <DeleteProductButton productId={product.id} productName={product.name} />
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">Chưa có sản phẩm nào.</p>
          )}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Yêu cầu liên hệ ({contacts.length})</h2>
        <p className="mt-1 text-sm text-muted">
          Danh sách khách hàng đã gửi yêu cầu qua trang &quot;Liên hệ&quot;, mới nhất ở trên.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">{contact.name}</p>
                  <p className="text-xs text-muted">
                    {contact.email}
                    {contact.phone ? ` · ${contact.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(contact.submittedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <DeleteContactButton contactId={contact.id} contactName={contact.name} />
              </div>
              <p className="mt-3 text-sm text-muted">{contact.message}</p>
            </div>
          ))}

          {contacts.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">Chưa có yêu cầu liên hệ nào.</p>
          )}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Đơn hàng thanh toán SePay ({orders.length})</h2>
        <p className="mt-1 text-sm text-muted">
          Đơn được tạo khi khách bấm &quot;Tạo mã QR thanh toán&quot;. Trạng thái tự cập nhật khi
          SePay báo đã nhận tiền qua webhook.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  {order.productName}{" "}
                  <span className="font-mono text-xs text-muted">({order.code})</span>
                </p>
                <p className="text-xs text-muted">
                  {order.email} · {order.amount.toLocaleString("vi-VN")}đ ·{" "}
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  order.status === "paid"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-surface-2 text-muted"
                }`}
              >
                {order.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
              </span>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">Chưa có đơn hàng nào.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="mt-4 flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}
