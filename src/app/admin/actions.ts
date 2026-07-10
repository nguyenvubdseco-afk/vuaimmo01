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
  deleteContactSubmission,
  deleteProductFile,
  deleteProductImage,
  getProducts,
  getSiteContent,
  saveProductFile,
  saveProductImage,
  saveProducts,
  saveSiteContent,
  type PricingTier,
  type Product,
} from "@/lib/store";

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

  if (!verifyAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logout() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
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

  let image: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    image = await saveProductImage(imageFile);
  }

  let softwareFile: string | null = null;
  let softwareFileName: string | null = null;
  let softwareFileSize: string | null = null;
  const uploadedFile = formData.get("softwareFile");
  if (uploadedFile instanceof File && uploadedFile.size > 0) {
    const saved = await saveProductFile(uploadedFile);
    softwareFile = saved.path;
    softwareFileName = saved.originalName;
    softwareFileSize = saved.size;
  }

  const products = await getProducts();
  const newId = createProductId();
  products.push({
    id: newId,
    ...fields,
    image,
    softwareFile,
    softwareFileName,
    softwareFileSize,
  });
  await saveProducts(products);

  revalidatePath("/admin");
  revalidatePublicPages(newId);
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAuth();
  const fields = parseProductFields(formData);

  const products = await getProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) throw new Error("Không tìm thấy sản phẩm.");

  let image = products[index].image;
  const imageFile = formData.get("image");
  const removeImage = formData.get("removeImage") === "on";

  if (imageFile instanceof File && imageFile.size > 0) {
    await deleteProductImage(image);
    image = await saveProductImage(imageFile);
  } else if (removeImage) {
    await deleteProductImage(image);
    image = null;
  }

  let softwareFile = products[index].softwareFile;
  let softwareFileName = products[index].softwareFileName;
  let softwareFileSize = products[index].softwareFileSize;
  const uploadedFile = formData.get("softwareFile");
  const removeSoftwareFile = formData.get("removeSoftwareFile") === "on";

  if (uploadedFile instanceof File && uploadedFile.size > 0) {
    await deleteProductFile(softwareFile);
    const saved = await saveProductFile(uploadedFile);
    softwareFile = saved.path;
    softwareFileName = saved.originalName;
    softwareFileSize = saved.size;
  } else if (removeSoftwareFile) {
    await deleteProductFile(softwareFile);
    softwareFile = null;
    softwareFileName = null;
    softwareFileSize = null;
  }

  products[index] = {
    ...products[index],
    ...fields,
    image,
    softwareFile,
    softwareFileName,
    softwareFileSize,
  };
  await saveProducts(products);

  revalidatePath("/admin");
  revalidatePath(`/admin/products/${id}`);
  revalidatePublicPages(id);
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");

  const products = await getProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index !== -1) {
    await deleteProductImage(products[index].image);
    await deleteProductFile(products[index].softwareFile);
    products.splice(index, 1);
    await saveProducts(products);
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
