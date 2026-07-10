import Link from "next/link";
import { productCategories } from "@/data/content";
import { createProduct } from "@/app/admin/actions";
import AdminFileUpload from "@/app/admin/AdminFileUpload";

export default function NewProductPage() {
  const categories = productCategories.filter((c) => c !== "Tất cả");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin" className="text-sm text-muted hover:text-foreground">
        ← Quay lại
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Thêm sản phẩm mới</h1>

      <form
        action={createProduct}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
      >
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Tên sản phẩm</span>
          <input
            type="text"
            name="name"
            required
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mô tả ngắn (tagline)</span>
          <input
            type="text"
            name="tagline"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Danh mục</span>
          <input
            type="text"
            name="category"
            list="category-options"
            required
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Giá</span>
            <input
              type="text"
              name="price"
              placeholder="Miễn phí / 299.000đ"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Đánh giá</span>
            <input
              type="text"
              name="rating"
              placeholder="4.8"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Ảnh sản phẩm (tuỳ chọn)</span>
          <AdminFileUpload
            kind="image"
            fieldName="image"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          <span className="text-xs text-muted">
            Không chọn ảnh sẽ dùng khối màu mặc định. Tối đa 5MB.
          </span>
        </div>

        <div className="border-t border-border pt-4">
          <h2 className="text-sm font-semibold text-accent-2">Trang chi tiết sản phẩm</h2>
          <p className="mt-1 text-xs text-muted">
            Nội dung này hiển thị trên trang chi tiết khi khách bấm &quot;Xem chi tiết&quot;.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" className="h-4 w-4" />
          <span className="font-medium">Đánh dấu là sản phẩm mới (badge &quot;NEW&quot;)</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Số ngày dùng thử</span>
            <input
              type="number"
              name="trialDays"
              min={0}
              placeholder="0 = không có bản dùng thử"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Phiên bản</span>
            <input
              type="text"
              name="version"
              placeholder="1.0.0"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Link hướng dẫn sử dụng (tuỳ chọn)</span>
          <input
            type="text"
            name="guideUrl"
            placeholder="https://blog.cua-ban.com/huong-dan"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mô tả chi tiết</span>
          <textarea
            name="description"
            rows={3}
            placeholder="Mô tả đầy đủ về sản phẩm..."
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Tính năng nổi bật</span>
          <textarea
            name="features"
            rows={5}
            placeholder={"Mỗi dòng một tính năng, ví dụ:\nTạo nội dung theo giọng văn thương hiệu\nHỗ trợ đa ngôn ngữ"}
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">Mỗi dòng là một tính năng.</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Cách sử dụng</span>
          <textarea
            name="usageSteps"
            rows={4}
            placeholder={"Mỗi dòng một bước, ví dụ:\nĐăng nhập vào tài khoản của bạn\nChọn công cụ và nhập yêu cầu"}
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">Mỗi dòng là một bước, sẽ hiển thị theo thứ tự.</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Các gói giá</span>
          <textarea
            name="pricingTiers"
            rows={3}
            placeholder={"Mỗi dòng một gói, dạng Nhãn|Giá|Ghi chú (ghi chú tuỳ chọn), ví dụ:\n1 tháng|99.000đ\n1 năm|790.000đ|Tiết kiệm hơn dùng theo tháng\nTrọn đời|1.990.000đ|Mua 1 lần, dùng mãi"}
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">
            Mỗi dòng dạng <code>Nhãn|Giá</code> hoặc <code>Nhãn|Giá|Ghi chú</code>.
          </span>
        </label>

        <div className="border-t border-border pt-4">
          <h2 className="text-sm font-semibold text-accent-2">Phần mềm tải về</h2>
          <p className="mt-1 text-xs text-muted">
            Khách hàng sẽ tải về khi bấm nút &quot;Tải về và dùng thử&quot; ở trang chi tiết sản
            phẩm. Chọn 1 trong 2 cách bên dưới — nếu có cả hai, ưu tiên dùng link ngoài.
          </p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Link tải về ngoài (Google Drive, v.v. — tuỳ chọn)</span>
          <input
            type="text"
            name="externalDownloadUrl"
            placeholder="https://drive.google.com/file/d/..."
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">
            Dùng khi file lớn và bạn muốn lưu trên Google Drive thay vì upload trực tiếp.
          </span>
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Hoặc tải tệp cài đặt lên trực tiếp (tuỳ chọn)</span>
          <AdminFileUpload
            kind="software"
            fieldName="softwareFile"
            accept=".zip,.rar,.7z,.exe,.msi,.dmg,.apk,.tar,.gz"
            triggerLabel="Tải lên"
            withMetaFields
          />
          <span className="text-xs text-muted">
            Hỗ trợ ZIP, RAR, 7Z, EXE, MSI, DMG, APK, TAR, GZ — tối đa 50MB.
          </span>
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-2"
        >
          Tạo sản phẩm
        </button>
      </form>
    </div>
  );
}
