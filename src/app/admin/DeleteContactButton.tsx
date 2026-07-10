"use client";

import { deleteContact } from "@/app/admin/actions";

export default function DeleteContactButton({
  contactId,
  contactName,
}: {
  contactId: string;
  contactName: string;
}) {
  return (
    <form
      action={deleteContact}
      onSubmit={(e) => {
        if (!confirm(`Xoá yêu cầu liên hệ của "${contactName}"?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={contactId} />
      <button
        type="submit"
        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:border-red-400"
      >
        Xoá
      </button>
    </form>
  );
}
