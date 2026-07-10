"use client";

import { useState } from "react";

export default function SoftwareFileInput({ name = "softwareFile" }: { name?: string }) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <label className="inline-flex w-fit cursor-pointer items-center rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-2">
        Tải lên
        <input
          type="file"
          name={name}
          accept=".zip,.rar,.7z,.exe,.msi,.dmg,.apk,.tar,.gz"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>
      <span className="text-xs text-muted">{fileName ?? "Chưa chọn tệp nào"}</span>
    </div>
  );
}
