import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requestSignedUpload } from "@/app/admin/actions";
import type { UploadKind } from "@/lib/store";

let browserClient: SupabaseClient | undefined;

function getBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Chưa cấu hình NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  browserClient = createClient(url, key);
  return browserClient;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Tải file thẳng từ trình duyệt lên Supabase Storage, bỏ qua server (và giới hạn 4.5MB
 * của Vercel Serverless Function). `requestSignedUpload` chỉ gửi 1 request nhỏ để xin
 * URL có chữ ký — phần dữ liệu file thật đi thẳng tới Supabase.
 */
export async function uploadProductFile(kind: UploadKind, file: File): Promise<string> {
  const { bucket, path, token, publicUrl } = await requestSignedUpload(kind, file.name);

  const { error } = await getBrowserClient().storage.from(bucket).uploadToSignedUrl(path, token, file);
  if (error) throw error;

  return publicUrl;
}
