import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";
import Features from "@/components/Features";
import DownloadTools from "@/components/DownloadTools";
import Faq from "@/components/Faq";
import { getProducts, getSiteContent } from "@/lib/store";

export default async function Home() {
  const [products, site] = await Promise.all([getProducts(), getSiteContent()]);

  return (
    <>
      <Hero hero={site.hero} />
      <ProductsGrid products={products} limit={8} showViewAll />
      <Features />
      <DownloadTools />
      <Faq />
    </>
  );
}
