import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Dùng service role key vì mọi ghi dữ liệu đều đi qua server action đã tự xác thực
// bằng cookie admin riêng của site (không dùng Supabase Auth) — service role bỏ qua RLS.
let cachedClient: SupabaseClient | undefined;

export function supabase(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Chưa cấu hình SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trong .env.local",
    );
  }

  cachedClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cachedClient;
}
