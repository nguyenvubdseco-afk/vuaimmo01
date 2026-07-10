import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

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

const STORE_DIR = path.join(process.cwd(), "src", "data", "store");
const PRODUCTS_FILE = path.join(STORE_DIR, "products.json");
const SITE_FILE = path.join(STORE_DIR, "site.json");
const CONTACTS_FILE = path.join(STORE_DIR, "contacts.json");
const ORDERS_FILE = path.join(STORE_DIR, "orders.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "products");
const SOFTWARE_DIR = path.join(process.cwd(), "public", "uploads", "software");

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

// Trình duyệt thường không gửi MIME type đáng tin cậy cho các định dạng này
// (hay báo application/octet-stream), nên xét theo phần mở rộng tên tệp gốc.
const MAX_SOFTWARE_BYTES = 200 * 1024 * 1024;
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

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson(file: string, data: unknown) {
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export function getProducts(): Promise<Product[]> {
  return readJson<Product[]>(PRODUCTS_FILE);
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.id === id) ?? null;
}

export function saveProducts(products: Product[]): Promise<void> {
  return writeJson(PRODUCTS_FILE, products);
}

export function getSiteContent(): Promise<SiteContent> {
  return readJson<SiteContent>(SITE_FILE);
}

export function saveSiteContent(content: SiteContent): Promise<void> {
  return writeJson(SITE_FILE, content);
}

export function createProductId(): string {
  return randomUUID();
}

/** Trả về [] nếu file chưa tồn tại (chưa có yêu cầu liên hệ nào). */
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  try {
    return await readJson<ContactSubmission[]>(CONTACTS_FILE);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function addContactSubmission(
  fields: Omit<ContactSubmission, "id" | "submittedAt">,
): Promise<ContactSubmission> {
  const submissions = await getContactSubmissions();
  const entry: ContactSubmission = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    ...fields,
  };
  submissions.unshift(entry);
  await fs.mkdir(STORE_DIR, { recursive: true });
  await writeJson(CONTACTS_FILE, submissions);
  return entry;
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const submissions = await getContactSubmissions();
  await writeJson(
    CONTACTS_FILE,
    submissions.filter((s) => s.id !== id),
  );
}

/** Trả về [] nếu file chưa tồn tại (chưa có đơn hàng nào). */
export async function getOrders(): Promise<Order[]> {
  try {
    return await readJson<Order[]>(ORDERS_FILE);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) ?? null;
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
  const orders = await getOrders();
  const order: Order = {
    id: randomUUID(),
    code: createOrderCode(),
    productName: fields.productName,
    email: fields.email,
    amount: fields.amount,
    status: "pending",
    createdAt: new Date().toISOString(),
    paidAt: null,
    gatewayTransactionId: null,
  };
  orders.unshift(order);
  await fs.mkdir(STORE_DIR, { recursive: true });
  await writeJson(ORDERS_FILE, orders);
  return order;
}

/** Tìm đơn theo mã chuyển khoản xuất hiện trong nội dung giao dịch ngân hàng (webhook SePay gửi về). */
export async function findOrderByTransferContent(content: string): Promise<Order | null> {
  const normalized = content.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const orders = await getOrders();
  return (
    orders.find(
      (o) => o.status === "pending" && normalized.includes(o.code.toUpperCase()),
    ) ?? null
  );
}

export async function markOrderPaid(id: string, gatewayTransactionId: string): Promise<void> {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return;
  orders[index] = {
    ...orders[index],
    status: "paid",
    paidAt: new Date().toISOString(),
    gatewayTransactionId,
  };
  await writeJson(ORDERS_FILE, orders);
}

/** Lưu ảnh sản phẩm được upload vào public/uploads/products và trả về đường dẫn public. */
export async function saveProductImage(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Ảnh vượt quá dung lượng cho phép (tối đa 5MB).");
  }
  const extension = ALLOWED_IMAGE_TYPES[file.type];
  if (!extension) {
    throw new Error("Định dạng ảnh không hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP hoặc GIF.");
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);

  return `/uploads/products/${filename}`;
}

/** Xoá ảnh sản phẩm cũ trên đĩa (bỏ qua nếu không tồn tại hoặc không thuộc thư mục upload). */
export async function deleteProductImage(imagePath: string | null): Promise<void> {
  if (!imagePath || !imagePath.startsWith("/uploads/products/")) return;
  const filePath = path.join(process.cwd(), "public", imagePath);
  await fs.unlink(filePath).catch(() => undefined);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Lưu tệp phần mềm (bản dùng thử) được quản trị viên tải lên vào public/uploads/software. */
export async function saveProductFile(
  file: File,
): Promise<{ path: string; originalName: string; size: string }> {
  if (file.size > MAX_SOFTWARE_BYTES) {
    throw new Error("Tệp phần mềm vượt quá dung lượng cho phép (tối đa 200MB).");
  }
  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED_SOFTWARE_EXTENSIONS.has(extension)) {
    throw new Error(
      "Định dạng tệp không hỗ trợ. Chỉ chấp nhận ZIP, RAR, 7Z, EXE, MSI, DMG, APK, TAR hoặc GZ.",
    );
  }

  await fs.mkdir(SOFTWARE_DIR, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(SOFTWARE_DIR, filename), buffer);

  return {
    path: `/uploads/software/${filename}`,
    originalName: file.name,
    size: formatFileSize(file.size),
  };
}

/** Xoá tệp phần mềm cũ trên đĩa (bỏ qua nếu không tồn tại hoặc không thuộc thư mục upload). */
export async function deleteProductFile(filePath: string | null): Promise<void> {
  if (!filePath || !filePath.startsWith("/uploads/software/")) return;
  const fullPath = path.join(process.cwd(), "public", filePath);
  await fs.unlink(fullPath).catch(() => undefined);
}
