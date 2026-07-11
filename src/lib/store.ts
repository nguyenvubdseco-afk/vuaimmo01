import { randomUUID } from "node:crypto";
import { supabase } from "@/lib/supabase";

export type PricingTier = {
  label: string;
  price: string;
  note?: string;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: string;
  rating: string;
  image: string | null;
  description: string;
  features: string[];
  usageSteps: string[];
  pricingTiers: PricingTier[];
  softwareFile: string | null;
  softwareFileName: string | null;
  softwareFileSize: string | null;
  /** Link tải về ngoài (Google Drive, v.v.) — dùng thay cho softwareFile khi file quá lớn để tự lưu trữ. */
  externalDownloadUrl: string;
  isNew: boolean;
  trialDays: number;
  version: string;
  guideUrl: string;
};

export type PromptItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  tools: string[];
  isNew: boolean;
  template: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
};

export type Order = {
  id: string;
  /** Mã ngắn dùng làm nội dung chuyển khoản để đối chiếu với webhook SePay. */
  code: string;
  productName: string;
  email: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt: string | null;
  /** Mã giao dịch ngân hàng do SePay gửi về, dùng để đối soát. */
  gatewayTransactionId: string | null;
};

export type SiteContent = {
  hero: {
    eyebrow: string;
    headline: string;
    headlineHighlight: string;
    headlineEnd: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  contact: {
    eyebrow: string;
    headline: string;
    description: string;
    info: { label: string; value: string }[];
  };
};

const PRODUCT_IMAGES_BUCKET = "product-images";
const SOFTWARE_FILES_BUCKET = "software-files";

// Giới hạn dung lượng thực tế được enforce ở cấp bucket Supabase Storage (xem
// scripts/seed-supabase.mjs) vì file giờ tải thẳng lên Storage, không qua server nữa.
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const ALLOWED_IMAGE_EXTENSIONS = new Set(Object.values(ALLOWED_IMAGE_TYPES));

// Trình duyệt thường không gửi MIME type đáng tin cậy cho các định dạng này
// (hay báo application/octet-stream), nên xét theo phần mở rộng tên tệp gốc.
const ALLOWED_SOFTWARE_EXTENSIONS = new Set([
  ".zip",
  ".rar",
  ".7z",
  ".exe",
  ".msi",
  ".dmg",
  ".apk",
  ".tar",
  ".gz",
]);

function extname(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot).toLowerCase();
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

type ProductRow = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: string;
  rating: string;
  image: string | null;
  description: string;
  features: string[];
  usage_steps: string[];
  pricing_tiers: PricingTier[];
  software_file: string | null;
  software_file_name: string | null;
  software_file_size: string | null;
  external_download_url: string;
  is_new: boolean;
  trial_days: number;
  version: string;
  guide_url: string;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    price: row.price,
    rating: row.rating,
    image: row.image,
    description: row.description,
    features: row.features ?? [],
    usageSteps: row.usage_steps ?? [],
    pricingTiers: row.pricing_tiers ?? [],
    softwareFile: row.software_file,
    softwareFileName: row.software_file_name,
    softwareFileSize: row.software_file_size,
    externalDownloadUrl: row.external_download_url ?? "",
    isNew: row.is_new,
    trialDays: row.trial_days,
    version: row.version ?? "",
    guideUrl: row.guide_url ?? "",
  };
}

function productToRow(product: Product): ProductRow {
  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    category: product.category,
    price: product.price,
    rating: product.rating,
    image: product.image,
    description: product.description,
    features: product.features,
    usage_steps: product.usageSteps,
    pricing_tiers: product.pricingTiers,
    software_file: product.softwareFile,
    software_file_name: product.softwareFileName,
    software_file_size: product.softwareFileSize,
    external_download_url: product.externalDownloadUrl,
    is_new: product.isNew,
    trial_days: product.trialDays,
    version: product.version,
    guide_url: product.guideUrl,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase()
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data as ProductRow) : null;
}

export async function insertProduct(product: Product): Promise<void> {
  const { error } = await supabase().from("products").insert(productToRow(product));
  if (error) throw error;
}

export async function updateProductRow(
  id: string,
  fields: Omit<Product, "id">,
): Promise<void> {
  const row = productToRow({ id, ...fields });
  const { error } = await supabase().from("products").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteProductRow(id: string): Promise<void> {
  const { error } = await supabase().from("products").delete().eq("id", id);
  if (error) throw error;
}

export function createProductId(): string {
  return randomUUID();
}

/** Sản phẩm hiển thị ở trang "Quà Tặng" — bất kỳ sản phẩm nào đang để giá "Miễn phí". */
export function isFreeProduct(price: string): boolean {
  return price.trim().toLowerCase().includes("miễn phí");
}

// ---------------------------------------------------------------------------
// Thư viện Prompt tham khảo
// ---------------------------------------------------------------------------

type PromptRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  tools: string[];
  is_new: boolean;
  template: string;
};

function rowToPrompt(row: PromptRow): PromptItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    tools: row.tools ?? [],
    isNew: row.is_new,
    template: row.template,
  };
}

function promptToRow(prompt: PromptItem): PromptRow {
  return {
    id: prompt.id,
    title: prompt.title,
    description: prompt.description,
    category: prompt.category,
    tools: prompt.tools,
    is_new: prompt.isNew,
    template: prompt.template,
  };
}

export async function getPrompts(): Promise<PromptItem[]> {
  const { data, error } = await supabase()
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as PromptRow[]).map(rowToPrompt);
}

export async function getPrompt(id: string): Promise<PromptItem | null> {
  const { data, error } = await supabase()
    .from("prompts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToPrompt(data as PromptRow) : null;
}

export async function insertPrompt(prompt: PromptItem): Promise<void> {
  const { error } = await supabase().from("prompts").insert(promptToRow(prompt));
  if (error) throw error;
}

export async function updatePromptRow(id: string, fields: Omit<PromptItem, "id">): Promise<void> {
  const row = promptToRow({ id, ...fields });
  const { error } = await supabase().from("prompts").update(row).eq("id", id);
  if (error) throw error;
}

export async function deletePromptRow(id: string): Promise<void> {
  const { error } = await supabase().from("prompts").delete().eq("id", id);
  if (error) throw error;
}

export function createPromptId(): string {
  return randomUUID();
}

// ---------------------------------------------------------------------------
// Nội dung trang chủ / liên hệ (bảng chỉ có 1 dòng, id = 1)
// ---------------------------------------------------------------------------

export async function getSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase()
    .from("site_content")
    .select("hero, contact")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return {
    hero: (data?.hero as SiteContent["hero"]) ?? null,
    contact: (data?.contact as SiteContent["contact"]) ?? null,
  } as SiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const { error } = await supabase()
    .from("site_content")
    .upsert({ id: 1, hero: content.hero, contact: content.contact });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Mật khẩu quản trị — lưu dạng hash trong DB để đổi được ngay từ /admin, không
// cần sửa biến môi trường ADMIN_PASSWORD + deploy lại nữa (env var chỉ còn dùng
// làm mật khẩu khởi tạo cho tới lần đầu đổi mật khẩu qua giao diện).
// ---------------------------------------------------------------------------

export async function getAdminPasswordHash(): Promise<string | null> {
  const { data, error } = await supabase()
    .from("admin_settings")
    .select("password_hash")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data?.password_hash ?? null;
}

export async function setAdminPasswordHash(hash: string): Promise<void> {
  const { error } = await supabase().from("admin_settings").upsert({ id: 1, password_hash: hash });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Yêu cầu liên hệ
// ---------------------------------------------------------------------------

type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submitted_at: string;
};

function rowToContact(row: ContactRow): ContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    submittedAt: row.submitted_at,
  };
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase()
    .from("contacts")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data as ContactRow[]).map(rowToContact);
}

export async function addContactSubmission(
  fields: Omit<ContactSubmission, "id" | "submittedAt">,
): Promise<ContactSubmission> {
  const { data, error } = await supabase()
    .from("contacts")
    .insert({ name: fields.name, email: fields.email, phone: fields.phone, message: fields.message })
    .select()
    .single();
  if (error) throw error;
  return rowToContact(data as ContactRow);
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const { error } = await supabase().from("contacts").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Đơn hàng thanh toán SePay
// ---------------------------------------------------------------------------

type OrderRow = {
  id: string;
  code: string;
  product_name: string;
  email: string;
  amount: number;
  status: "pending" | "paid";
  created_at: string;
  paid_at: string | null;
  gateway_transaction_id: string | null;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    code: row.code,
    productName: row.product_name,
    email: row.email,
    amount: row.amount,
    status: row.status,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    gatewayTransactionId: row.gateway_transaction_id,
  };
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(rowToOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await supabase().from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToOrder(data as OrderRow) : null;
}

/** Sinh mã ngắn dùng làm nội dung chuyển khoản, ví dụ "DH7K2M9P" — ngắn gọn để không bị ngân hàng cắt bớt. */
function createOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "DH";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createOrder(fields: {
  productName: string;
  email: string;
  amount: number;
}): Promise<Order> {
  const { data, error } = await supabase()
    .from("orders")
    .insert({
      code: createOrderCode(),
      product_name: fields.productName,
      email: fields.email,
      amount: fields.amount,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return rowToOrder(data as OrderRow);
}

/** Tìm đơn theo mã chuyển khoản xuất hiện trong nội dung giao dịch ngân hàng (webhook SePay gửi về). */
export async function findOrderByTransferContent(content: string): Promise<Order | null> {
  const normalized = content.toUpperCase().replace(/[^A-Z0-9]/g, "");

  const { data, error } = await supabase()
    .from("orders")
    .select("*")
    .eq("status", "pending");
  if (error) throw error;

  const match = (data as OrderRow[]).find((row) => normalized.includes(row.code.toUpperCase()));
  return match ? rowToOrder(match) : null;
}

export async function markOrderPaid(id: string, gatewayTransactionId: string): Promise<void> {
  const { error } = await supabase()
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      gateway_transaction_id: gatewayTransactionId,
    })
    .eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Upload ảnh sản phẩm / tệp phần mềm — lưu trên Supabase Storage vì filesystem
// của server (đặc biệt Vercel) không bền vững / không ghi được lúc chạy production.
// ---------------------------------------------------------------------------

function isManagedStorageUrl(url: string | null, bucket: string): boolean {
  return Boolean(url && url.includes(`/storage/v1/object/public/${bucket}/`));
}

export type UploadKind = "image" | "software";

function bucketForKind(kind: UploadKind): string {
  return kind === "image" ? PRODUCT_IMAGES_BUCKET : SOFTWARE_FILES_BUCKET;
}

/**
 * Tạo signed URL để trình duyệt tải file THẲNG lên Supabase Storage, không đi qua server.
 * Bắt buộc phải làm vậy vì Vercel giới hạn cứng mỗi request qua Serverless Function chỉ
 * tối đa 4.5MB — ảnh/tệp phần mềm lớn hơn sẽ bị chặn nếu gửi qua server action thông thường.
 */
export async function createSignedUpload(
  kind: UploadKind,
  originalName: string,
): Promise<{ bucket: string; path: string; token: string; publicUrl: string }> {
  const extension = extname(originalName);
  if (kind === "image" && !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    throw new Error("Định dạng ảnh không hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP hoặc GIF.");
  }
  if (kind === "software" && !ALLOWED_SOFTWARE_EXTENSIONS.has(extension)) {
    throw new Error(
      "Định dạng tệp không hỗ trợ. Chỉ chấp nhận ZIP, RAR, 7Z, EXE, MSI, DMG, APK, TAR hoặc GZ.",
    );
  }

  const bucket = bucketForKind(kind);
  const filename = `${randomUUID()}${extension}`;

  const { data, error } = await supabase().storage.from(bucket).createSignedUploadUrl(filename);
  if (error) throw error;

  const { data: publicData } = supabase().storage.from(bucket).getPublicUrl(filename);
  return { bucket, path: filename, token: data.token, publicUrl: publicData.publicUrl };
}

/** Xoá ảnh sản phẩm cũ trên Supabase Storage (bỏ qua nếu không thuộc bucket quản lý — vd. ảnh seed thủ công). */
export async function deleteProductImage(imagePath: string | null): Promise<void> {
  if (!isManagedStorageUrl(imagePath, PRODUCT_IMAGES_BUCKET)) return;
  const filename = imagePath!.split(`/${PRODUCT_IMAGES_BUCKET}/`).pop();
  if (!filename) return;
  await supabase().storage.from(PRODUCT_IMAGES_BUCKET).remove([filename]);
}

export async function deleteProductFile(filePath: string | null): Promise<void> {
  if (!isManagedStorageUrl(filePath, SOFTWARE_FILES_BUCKET)) return;
  const filename = filePath!.split(`/${SOFTWARE_FILES_BUCKET}/`).pop();
  if (!filename) return;
  await supabase().storage.from(SOFTWARE_FILES_BUCKET).remove([filename]);
}
