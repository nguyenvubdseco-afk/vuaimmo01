import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import { pricingFaqs } from "@/data/content";

export const metadata: Metadata = {
  title: "Bảng giá — AI System Creator",
  description: "Các gói dịch vụ AI System Creator phù hợp với mọi quy mô doanh nghiệp.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Bảng giá"
        title="Chọn gói phù hợp với doanh nghiệp của bạn"
        description="Bắt đầu miễn phí, nâng cấp bất kỳ lúc nào khi doanh nghiệp của bạn phát triển."
      />
      <Pricing />
      <Faq
        items={pricingFaqs}
        title="Câu hỏi về bảng giá"
        withSectionId={false}
      />
    </>
  );
}
