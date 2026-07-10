"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearAdminSessionCookie,
  isAdminAuthenticated,
  setAdminSessionCookie,
} from "@/lib/auth";
import { verifyAdminPassword } from "@/lib/auth-cookie";
import {
  createProductId,
  createSignedUpload,
  deleteContactSubmission,
  deleteProductFile,
  deleteProductImage,
  deleteProductRow,
  getProduct,
  getSiteContent,
  insertProduct,
  saveSiteContent,
  setAdminPasswordHash,
  updateProductRow,
  type PricingTier,
  type Product,
  type UploadKind,
} from "@/lib/store";
import { hashPassword } from "@/lib/password";

async function requireAuth() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");
  }
}

function revalidatePublicPages(productId?: string) {
  revalidatePath("/");
  revalidatePath("/san-pham");
  revalidatePath("/lien-he");
  if (productId) revalidatePath(`/san-pham/${productId}`);
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!(await verifyAdminPassword(password))) {
    redirect("/admin/login?error=1");
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logout() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

export type ChangePasswordState = { success: boolean; error?: string };

export async function changeAdminPassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  await requireAuth();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!(await verifyAdminPassword(currentPassword))) {
    return { success: false, error: "Mật khẩu hiện tại không đúng." };
  }
  if (newPassword.length < 8) {
    return { success: false, error: "Mật khẩu mới cần ít nhất 8 ký tự." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "Xác nhận mật khẩu mới không khớp." };
  }

  const hash = await hashPassword(newPassword);
  await setAdminPasswordHash(hash);

  return { success: true };
}

/**
 * Gọi từ trình duyệt trước khi upload — trả về URL có chữ ký để trình duyệt tải file
 * THẲNG lên Supabase Storage (không đi qua server), vì Vercel giới hạn mỗi request qua
 * Serverless Function tối đa 4.5MB.
 */
export async function requestSignedUpload(kind: UploadKind, originalName: string) {
  await requireAuth();
  return createSignedUpload(kind, originalName);
}

type ProductFields = Omit<
  Product,
  "id" | "image" | "softwareFile" | "softwareFileName" | "softwareFileSize"
>;

/** Mỗi dòng là một phần tử; bỏ qua dòng trống. */
function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Mỗi dòng dạng "Nhãn|Giá" hoặc "Nhãn|Giá|Ghi chú", ví dụ "1 tháng|99.000đ|Tiết kiệm hơn". */
function parsePricingTiers(value: string): PricingTier[] {
  return parseLines(value)
    .map((line) => {
      const [label, price, note] = line.split("|").map((part) => part?.trim() ?? "");
      return note ? { label, price, note } : { label, price };
    })
    .filter((tier) => tier.label && tier.price);
}

function parseProductFields(formData: FormData): ProductFields {
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const rating = String(formData.get("rating") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const features = parseLines(String(formData.get("features") ?? ""));
  const usageSteps = parseLines(String(formData.get("usageSteps") ?? ""));
  const pricingTiers = parsePricingTiers(String(formData.get("pricingTiers") ?? ""));
  const isNew = formData.get("isNew") === "on";
  const trialDays = Math.max(0, Number(formData.get("trialDays") ?? 0) || 0);
  const version = String(formData.get("version") ?? "").trim();
  const guideUrl = String(formData.get("guideUrl") ?? "").trim();
  const externalDownloadUrl = String(formData.get("externalDownloadUrl") ?? "").trim();

  if (!name) throw new Error("Tên sản phẩm là bắt buộc.");
  if (!category) throw new Error("Danh mục là bắt buộc.");

  return {
    name,
    tagline,
    category,
    price,
    rating,
    description,
    features,
    usageSteps,
    pricingTiers,
    isNew,
    trialDays,
    version,
    guideUrl,
    externalDownloadUrl,
  };
}

export async function createProduct(formData: FormData) {
  await requireAuth();
  const fields = parseProductFields(formData);

  // Ảnh/tệp phần mềm đã được trình duyệt tải thẳng lên Supabase Storage trước khi submit
  // form này (xem AdminFileUpload) — ở đây chỉ nhận lại URL kết quả (chuỗi text nhỏ).
  const image = String(formData.get("image") ?? "").trim() || null;
  const softwareFile = String(formData.get("softwareFile") ?? "").trim() || null;
  const softwareFileName = softwareFile
    ? String(formData.get("softwareFileOriginalName") ?? "").trim() || null
    : null;
  const softwareFileSize = softwareFile
    ? String(formData.get("softwareFileSizeLabel") ?? "").trim() || null
    : null;

  const newId = createProductId();
  await insertProduct({
    id: newId,
    ...fields,
    image,
    softwareFile,
    softwareFileName,
    softwareFileSize,
  });

  revalidatePath("/admin");
  revalidatePublicPages(newId);
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAuth();
  const fields = parseProductFields(formData);

  const existing = await getProduct(id);
  if (!existing) throw new Error("Không tìm thấy sản phẩm.");

  let image = existing.image;
  const newImage = String(formData.get("image") ?? "").trim();
  const removeImage = formData.get("removeImage") === "on";

  if (newImage) {
    await deleteProductImage(image);
    image = newImage;
  } else if (removeImage) {
    await deleteProductImage(image);
    image = null;
  }

  let softwareFile = existing.softwareFile;
  let softwareFileName = existing.softwareFileName;
  let softwareFileSize = existing.softwareFileSize;
  const newSoftwareFile = String(formData.get("softwareFile") ?? "").trim();
  const removeSoftwareFile = formData.get("removeSoftwareFile") === "on";

  if (newSoftwareFile) {
    await deleteProductFile(softwareFile);
    softwareFile = newSoftwareFile;
    softwareFileName = String(formData.get("softwareFileOriginalName") ?? "").trim() || null;
    softwareFileSize = String(formData.get("softwareFileSizeLabel") ?? "").trim() || null;
  } else if (removeSoftwareFile) {
    await deleteProductFile(softwareFile);
    softwareFile = null;
    softwareFileName = null;
    softwareFileSize = null;
  }

  await updateProductRow(id, {
    ...fields,
    image,
    softwareFile,
    softwareFileName,
    softwareFileSize,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/products/${id}`);
  revalidatePublicPages(id);
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");

  const existing = await getProduct(id);
  if (existing) {
    await deleteProductImage(existing.image);
    await deleteProductFile(existing.softwareFile);
    await deleteProductRow(id);
  }

  revalidatePath("/admin");
  revalidatePublicPages(id);
  redirect("/admin");
}

export async function updateSiteContent(formData: FormData) {
  await requireAuth();
  const content = await getSiteContent();

  content.hero = {
    eyebrow: String(formData.get("hero_eyebrow") ?? ""),
    headline: String(formData.get("hero_headline") ?? ""),
    headlineHighlight: String(formData.get("hero_headlineHighlight") ?? ""),
    headlineEnd: String(formData.get("hero_headlineEnd") ?? ""),
    description: String(formData.get("hero_description") ?? ""),
    primaryCta: String(formData.get("hero_primaryCta") ?? ""),
    secondaryCta: String(formData.get("hero_secondaryCta") ?? ""),
  };

  content.contact = {
    eyebrow: String(formData.get("contact_eyebrow") ?? ""),
    headline: String(formData.get("contact_headline") ?? ""),
    description: String(formData.get("contact_description") ?? ""),
    info: [
      { label: "Email", value: String(formData.get("contact_email") ?? "") },
      { label: "Hotline", value: String(formData.get("contact_hotline") ?? "") },
      { label: "Địa chỉ", value: String(formData.get("contact_address") ?? "") },
      { label: "Giờ làm việc", value: String(formData.get("contact_hours") ?? "") },
    ],
  };

  await saveSiteContent(content);

  revalidatePath("/admin");
  revalidatePublicPages();
  redirect("/admin");
}

export async function deleteContact(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");

  await deleteContactSubmission(id);

  revalidatePath("/admin");
  redirect("/admin");
}
