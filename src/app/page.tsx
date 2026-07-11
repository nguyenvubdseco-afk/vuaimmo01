import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";
import Features from "@/components/Features";
import DownloadTools from "@/components/DownloadTools";
import Faq from "@/components/Faq";
import { getProducts, getSiteContent, isFreeProduct } from "@/lib/store";

export default async function Home() {
  const [products, site] = await Promise.all([getProducts(), getSiteContent()]);
  const freeProducts = products.filter((p) => isFreeProduct(p.price));

  return (
    <>
      <Hero hero={site.hero} />
      <ProductsGrid products={products} limit={8} showViewAll />
      <Features />
      <DownloadTools products={freeProducts} />
      <Faq />
    </>
  );
}
