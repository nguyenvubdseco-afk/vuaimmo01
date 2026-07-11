import Link from "next/link";
import { promptCategories } from "@/data/prompts";
import { createPrompt } from "@/app/admin/actions";

export default function NewPromptPage() {
  const categories = promptCategories.filter((c) => c !== "Tất cả");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin?tab=prompt-tham-khao" className="text-sm text-muted hover:text-foreground">
        ← Quay lại
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Thêm prompt mới</h1>

      <form
        action={createPrompt}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
      >
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Tiêu đề</span>
          <input
            type="text"
            name="title"
            required
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mô tả ngắn</span>
          <input
            type="text"
            name="description"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Danh mục</span>
          <input
            type="text"
            name="category"
            list="prompt-category-options"
            required
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <datalist id="prompt-category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Công cụ AI phù hợp</span>
          <textarea
            name="tools"
            rows={3}
            placeholder={"Mỗi dòng một công cụ, ví dụ:\nChatGPT\nClaude"}
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">Mỗi dòng là một công cụ.</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" className="h-4 w-4" />
          <span className="font-medium">Đánh dấu là prompt mới (badge &quot;Mới&quot;)</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Nội dung template</span>
          <textarea
            name="template"
            rows={8}
            required
            placeholder="Nội dung prompt đầy đủ, dùng [Trong ngoặc vuông] cho chỗ người dùng cần điền..."
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">
            Đây là nội dung khách sẽ bấm &quot;Sao chép prompt&quot; để lấy.
          </span>
        </label>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-2"
        >
          Tạo prompt
        </button>
      </form>
    </div>
  );
}
