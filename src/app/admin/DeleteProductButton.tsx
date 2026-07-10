"use client";

import { deleteProduct } from "@/app/admin/actions";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Xoá sản phẩm "${productName}"?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:border-red-400"
      >
        Xoá
      </button>
    </form>
  );
}
