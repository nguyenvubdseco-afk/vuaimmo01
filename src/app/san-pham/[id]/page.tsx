import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/store";
import ProductDetail from "@/components/ProductDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Sản phẩm — AI System Creator" };

  return {
    title: `${product.name} — AI System Creator`,
    description: product.tagline,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
