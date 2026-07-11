"use client";

import { useState } from "react";
import { formatFileSize, uploadProductFile } from "@/lib/uploadClient";
import type { UploadKind } from "@/lib/store";

type Status = "idle" | "uploading" | "done" | "error";

type AdminFileUploadProps = {
  kind: UploadKind;
  /** Tên field ẩn mang URL kết quả sau khi upload — khớp với những gì admin/actions.ts đọc. */
  fieldName: string;
  accept: string;
  triggerLabel?: string;
  /** Với tệp phần mềm, còn cần gửi kèm tên gốc + dung lượng hiển thị. */
  withMetaFields?: boolean;
};

export default function AdminFileUpload({
  kind,
  fieldName,
  accept,
  triggerLabel = "Chọn tệp",
  withMetaFields = false,
}: AdminFileUploadProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [sizeLabel, setSizeLabel] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setError(null);
    setFileName(file.name);
    setSizeLabel(formatFileSize(file.size));

    try {
      const url = await uploadProductFile(kind, file);
      setResultUrl(url);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setResultUrl("");
      const message = err instanceof Error ? err.message : "";
      setError(
        message.includes("exceeded the maximum allowed size")
          ? "Tệp vượt quá 50MB (giới hạn của gói Supabase hiện tại). Với tệp lớn hơn, dùng ô \"Link tải về ngoài\" (Google Drive...) ở trên thay vì tải trực tiếp."
          : message || "Tải lên thất bại, thử lại nhé.",
      );
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <label
          className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-xs font-semibold text-white transition-colors ${
            status === "uploading"
              ? "cursor-not-allowed bg-muted"
              : "cursor-pointer bg-accent hover:bg-accent-2"
          }`}
        >
          {status === "uploading" ? "Đang tải lên..." : triggerLabel}
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={status === "uploading"}
            className="hidden"
          />
        </label>
        <span className="text-xs text-muted">
          {status === "idle" && "Chưa chọn tệp nào"}
          {status === "uploading" && `Đang tải ${fileName}...`}
          {status === "done" && `${fileName} (${sizeLabel})`}
        </span>
      </div>

      {status === "error" && <p className="text-xs text-red-400">{error}</p>}
      {status === "done" && (
        <p className="text-xs text-emerald-400">Đã tải lên thành công, nhớ bấm lưu bên dưới.</p>
      )}

      <input type="hidden" name={fieldName} value={resultUrl} />
      {withMetaFields && (
        <>
          <input type="hidden" name={`${fieldName}OriginalName`} value={status === "done" ? fileName : ""} />
          <input type="hidden" name={`${fieldName}SizeLabel`} value={status === "done" ? sizeLabel : ""} />
        </>
      )}
    </div>
  );
}
