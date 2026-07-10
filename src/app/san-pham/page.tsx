import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProductsGrid from "@/components/ProductsGrid";
import { getProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Sản phẩm — AI System Creator",
  description: "Khám phá toàn bộ công cụ AI của AI System Creator cho doanh nghiệp của bạn.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        eyebrow="Thư viện công cụ"
        title="Tất cả sản phẩm AI"
        description="Duyệt qua toàn bộ công cụ AI theo từng danh mục để tìm giải pháp phù hợp với doanh nghiệp của bạn."
      />
      <ProductsGrid products={products} syncWithUrl />
    </>
  );
}
