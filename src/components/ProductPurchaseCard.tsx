"use client";

import { useState } from "react";
import { gradients } from "@/data/content";
import type { Product } from "@/lib/store";
import BuyModal from "@/components/BuyModal";

export default function ProductPurchaseCard({ product }: { product: Product }) {
  const tiers = product.pricingTiers;
  const [selected, setSelected] = useState(Math.max(0, tiers.length - 1));
  const selectedTier = tiers[selected];
  const externalUrl = product.externalDownloadUrl || null;
  const downloadUrl = externalUrl ?? product.softwareFile;
  const hasDownload = Boolean(downloadUrl);
  const trialDays = product.trialDays > 0 ? product.trialDays : 7;
  const gradient = gradients[product.name.length % gradients.length];
  const isFreeSelection = (selectedTier?.price ?? product.price)
    .trim()
    .toLowerCase()
    .includes("miễn phí");

  const metaLine = [product.version ? `v${product.version}` : null, product.softwareFileSize]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5">
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full rounded-xl object-cover"
        />
      ) : (
        <div
          className={`flex h-40 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
        >
          <span className="text-4xl font-bold text-white/90">{product.name.slice(-2)}</span>
        </div>
      )}

      {tiers.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          {tiers.map((tier, i) => (
            <button
              key={tier.label}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                selected === i
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/40"
              }`}
            >
              <span>
                <span className="block text-sm font-semibold">{tier.label}</span>
                {tier.note && <span className="block text-xs text-muted">{tier.note}</span>}
              </span>
              <span className="text-base font-bold">{tier.price}</span>
            </button>
          ))}
        </div>
      )}

      {metaLine && <p className="mt-4 text-xs text-muted">{metaLine}</p>}

      {!isFreeSelection && hasDownload && (
        <div className="mt-4">
          <a
            href={downloadUrl!}
            download={externalUrl ? undefined : (product.softwareFileName ?? undefined)}
            target={externalUrl ? "_blank" : undefined}
            rel={externalUrl ? "noopener noreferrer" : undefined}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent-2 transition-colors hover:bg-accent/10"
          >
            <span aria-hidden>⬇</span>
            Tải về và dùng thử {trialDays} ngày
          </a>
          <p className="mt-2 text-center text-xs text-muted">Không cần thẻ tín dụng để dùng thử</p>
        </div>
      )}

      <div className="mt-3">
        {isFreeSelection ? (
          downloadUrl && (
            <a
              href={downloadUrl}
              download={externalUrl ? undefined : (product.softwareFileName ?? undefined)}
              target={externalUrl ? "_blank" : undefined}
              rel={externalUrl ? "noopener noreferrer" : undefined}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <span aria-hidden>⬇</span>
              Tải về miễn phí
            </a>
          )
        ) : (
          <BuyModal
            productName={`${product.name}${selectedTier ? ` (${selectedTier.label})` : ""}`}
            price={selectedTier?.price ?? product.price}
            triggerClassName="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          />
        )}
      </div>
    </div>
  );
}
