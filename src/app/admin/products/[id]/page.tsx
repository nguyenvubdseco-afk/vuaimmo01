import Link from "next/link";
import { notFound } from "next/navigation";
import { productCategories } from "@/data/content";
import { getProduct } from "@/lib/store";
import { updateProduct } from "@/app/admin/actions";
import DeleteProductButton from "@/app/admin/DeleteProductButton";
import SoftwareFileInput from "@/app/admin/SoftwareFileInput";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const categories = productCategories.filter((c) => c !== "Tất cả");
  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin" className="text-sm text-muted hover:text-foreground">
        ← Quay lại
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Sửa sản phẩm</h1>

      <form
        action={updateProductWithId}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
      >
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Tên sản phẩm</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={product.name}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mô tả ngắn (tagline)</span>
          <input
            type="text"
            name="tagline"
            defaultValue={product.tagline}
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
            defaultValue={product.category}
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
              defaultValue={product.price}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Đánh giá</span>
            <input
              type="text"
              name="rating"
              defaultValue={product.rating}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Ảnh hiện tại</span>
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-24 w-24 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white/90">
              {product.name.slice(-2)}
            </div>
          )}

          {product.image && (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" name="removeImage" />
              Xoá ảnh hiện tại (dùng khối màu mặc định)
            </label>
          )}
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Thay ảnh mới (tuỳ chọn)</span>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
          />
        </label>

        <div className="border-t border-border pt-4">
          <h2 className="text-sm font-semibold text-accent-2">Trang chi tiết sản phẩm</h2>
          <p className="mt-1 text-xs text-muted">
            Nội dung này hiển thị trên trang chi tiết khi khách bấm &quot;Xem chi tiết&quot;.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" defaultChecked={product.isNew} className="h-4 w-4" />
          <span className="font-medium">Đánh dấu là sản phẩm mới (badge &quot;NEW&quot;)</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Số ngày dùng thử</span>
            <input
              type="number"
              name="trialDays"
              min={0}
              defaultValue={product.trialDays || undefined}
              placeholder="0 = không có bản dùng thử"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Phiên bản</span>
            <input
              type="text"
              name="version"
              defaultValue={product.version}
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
            defaultValue={product.guideUrl}
            placeholder="https://blog.cua-ban.com/huong-dan"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mô tả chi tiết</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={product.description}
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Tính năng nổi bật</span>
          <textarea
            name="features"
            rows={5}
            defaultValue={product.features.join("\n")}
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">Mỗi dòng là một tính năng.</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Cách sử dụng</span>
          <textarea
            name="usageSteps"
            rows={4}
            defaultValue={product.usageSteps.join("\n")}
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">Mỗi dòng là một bước, sẽ hiển thị theo thứ tự.</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Các gói giá</span>
          <textarea
            name="pricingTiers"
            rows={3}
            defaultValue={product.pricingTiers
              .map((t) => [t.label, t.price, t.note].filter(Boolean).join("|"))
              .join("\n")}
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
            defaultValue={product.externalDownloadUrl}
            placeholder="https://drive.google.com/file/d/..."
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">
            Dùng khi file lớn và bạn muốn lưu trên Google Drive thay vì upload trực tiếp.
          </span>
        </label>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Tệp hiện tại</span>
          {product.softwareFile ? (
            <a
              href={product.softwareFile}
              download={product.softwareFileName ?? undefined}
              className="w-fit text-sm text-accent-2 underline underline-offset-2 hover:text-accent"
            >
              {product.softwareFileName ?? "Tải tệp hiện tại"}
              {product.softwareFileSize ? ` (${product.softwareFileSize})` : ""}
            </a>
          ) : (
            <span className="text-xs text-muted">Chưa tải lên tệp nào.</span>
          )}

          {product.softwareFile && (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" name="removeSoftwareFile" />
              Xoá tệp hiện tại
            </label>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Hoặc thay tệp cài đặt trực tiếp (tuỳ chọn)</span>
          <SoftwareFileInput />
          <span className="text-xs text-muted">
            Hỗ trợ ZIP, RAR, 7Z, EXE, MSI, DMG, APK, TAR, GZ — tối đa 200MB.
          </span>
        </div>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-2"
        >
          Lưu thay đổi
        </button>
      </form>

      <div className="mt-4">
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
