import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GiftsGrid from "@/components/GiftsGrid";
import Faq from "@/components/Faq";
import { giftFaqs } from "@/data/content";
import { getProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Quà Tặng — AI System Creator",
  description: "Các sản phẩm AI miễn phí, tải về và sử dụng ngay.",
};

function isFreeProduct(price: string) {
  return price.trim().toLowerCase().includes("miễn phí");
}

export default async function GiftsPage() {
  const products = await getProducts();
  const freeProducts = products.filter((p) => isFreeProduct(p.price));

  return (
    <>
      <PageHero
        eyebrow="Quà Tặng"
        title="Sản phẩm AI miễn phí dành cho bạn"
        description="Tải về và dùng ngay, không mất phí, không cần đăng ký."
      />
      <GiftsGrid products={freeProducts} />
      <Faq items={giftFaqs} title="Câu hỏi về Quà Tặng" withSectionId={false} />
    </>
  );
}
