"use client";

import { deletePrompt } from "@/app/admin/actions";

export default function DeletePromptButton({
  promptId,
  promptTitle,
}: {
  promptId: string;
  promptTitle: string;
}) {
  return (
    <form
      action={deletePrompt}
      onSubmit={(e) => {
        if (!confirm(`Xoá prompt "${promptTitle}"?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={promptId} />
      <button
        type="submit"
        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:border-red-400"
      >
        Xoá
      </button>
    </form>
  );
}
