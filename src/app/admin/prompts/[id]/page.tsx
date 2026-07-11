import Link from "next/link";
import { notFound } from "next/navigation";
import { promptCategories } from "@/data/prompts";
import { getPrompt } from "@/lib/store";
import { updatePrompt } from "@/app/admin/actions";
import DeletePromptButton from "@/app/admin/DeletePromptButton";

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) notFound();

  const categories = promptCategories.filter((c) => c !== "Tất cả");
  const updatePromptWithId = updatePrompt.bind(null, prompt.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin?tab=prompt-tham-khao" className="text-sm text-muted hover:text-foreground">
        ← Quay lại
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Sửa prompt</h1>

      <form
        action={updatePromptWithId}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
      >
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Tiêu đề</span>
          <input
            type="text"
            name="title"
            required
            defaultValue={prompt.title}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Mô tả ngắn</span>
          <input
            type="text"
            name="description"
            defaultValue={prompt.description}
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
            defaultValue={prompt.category}
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
            defaultValue={prompt.tools.join("\n")}
            className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-muted">Mỗi dòng là một công cụ.</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" defaultChecked={prompt.isNew} className="h-4 w-4" />
          <span className="font-medium">Đánh dấu là prompt mới (badge &quot;Mới&quot;)</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Nội dung template</span>
          <textarea
            name="template"
            rows={8}
            required
            defaultValue={prompt.template}
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
          Lưu thay đổi
        </button>
      </form>

      <div className="mt-4">
        <DeletePromptButton promptId={prompt.id} promptTitle={prompt.title} />
      </div>
    </div>
  );
}
