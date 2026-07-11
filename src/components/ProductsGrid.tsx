"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { gradients, productCategories } from "@/data/content";
import type { Product } from "@/lib/store";
import Reveal from "@/components/Reveal";

type ProductsGridProps = {
  products: Product[];
  /** Cap how many products are shown (used for the homepage preview). Omit to show all. */
  limit?: number;
  /** Show a "xem tất cả" button below the grid, linking to the full products page. */
  showViewAll?: boolean;
  /** Read ?category= from the URL to pre-select a tab (used on /san-pham, linked from the nav dropdown). */
  syncWithUrl?: boolean;
  title?: string;
  description?: string;
};

function CategoryUrlSync({ onCategory }: { onCategory: (category: string) => void }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    onCategory(
      categoryParam && productCategories.includes(categoryParam)
        ? categoryParam
        : productCategories[0],
    );
  }, [categoryParam, onCategory]);

  return null;
}

export default function ProductsGrid({
  products,
  limit,
  showViewAll = false,
  syncWithUrl = false,
  title = "Sản phẩm nổi bật",
  description = "Những công cụ AI được sử dụng nhiều nhất bởi khách hàng của chúng tôi.",
}: ProductsGridProps) {
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);

  const filteredProducts =
    activeCategory === "Tất cả"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const visibleProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  return (
    <section id="products" className="px-6 py-20">
      {syncWithUrl && (
        <Suspense fallback={null}>
          <CategoryUrlSync onCategory={setActiveCategory} />
        </Suspense>
      )}

      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
            <p className="mt-2 text-sm text-muted sm:text-base">{description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {productCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  activeCategory === category
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface text-muted hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product, i) => {
            const isFree = product.price.trim().toLowerCase().includes("miễn phí");
            const downloadUrl = product.externalDownloadUrl || product.softwareFile;
            const isExternal = Boolean(product.externalDownloadUrl);

            return (
            <Reveal key={product.id} delay={(i % 4) * 80}>
              <article className="group flex flex-col rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/60">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-28 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]}`}
                  >
                    <span className="text-3xl font-bold text-white/90">
                      {product.name.slice(-2)}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">{product.name}</h3>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                    ★ {product.rating}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted">{product.tagline}</p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs font-semibold text-accent-2">
                    {product.price}
                  </span>
                  <Link
                    href={`/san-pham/${product.id}`}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors group-hover:border-accent group-hover:text-accent-2"
                  >
                    Xem chi tiết
                  </Link>
                </div>

                {isFree ? (
                  downloadUrl && (
                    <a
                      href={downloadUrl}
                      download={isExternal ? undefined : (product.softwareFileName ?? undefined)}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <span aria-hidden>⬇</span>
                      Tải về miễn phí
                    </a>
                  )
                ) : (
                  <Link
                    href={`/san-pham/${product.id}`}
                    className="mt-3 w-full rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Mua ngay
                  </Link>
                )}
              </article>
            </Reveal>
            );
          })}
        </div>

        {showViewAll && (
          <Reveal className="mt-10 flex justify-center">
            <Link
              href="/san-pham"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent-2"
            >
              Xem tất cả sản phẩm
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
