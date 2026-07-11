// Cấu hình các tab trong mục "Sản phẩm" của trang quản trị — mỗi tab ứng với 1 module
// trên site. Dùng chung giữa admin/page.tsx (điều hướng + lọc danh sách) và các trang
// thêm/sửa sản phẩm (để prefill danh mục/giá theo tab đang mở).
export type ProductTab = {
  slug: string;
  label: string;
  kind: "category" | "free" | "prompts";
  category?: string;
};

export const PRODUCT_TABS: ProductTab[] = [
  { slug: "tool-app", label: "Tool & App", kind: "category", category: "Tool & App" },
  { slug: "chatbot-prompt", label: "Chatbot & Prompt", kind: "category", category: "Chatbot & Prompt" },
  { slug: "san-pham-so", label: "Sản phẩm số", kind: "category", category: "Sản phẩm số" },
  { slug: "qua-tang", label: "Quà tặng", kind: "free" },
  { slug: "prompt-tham-khao", label: "Prompt tham khảo", kind: "prompts" },
];

export const DEFAULT_TAB_SLUG = PRODUCT_TABS[0].slug;

export function resolveTab(slug: string | undefined): ProductTab {
  return PRODUCT_TABS.find((tab) => tab.slug === slug) ?? PRODUCT_TABS[0];
}
