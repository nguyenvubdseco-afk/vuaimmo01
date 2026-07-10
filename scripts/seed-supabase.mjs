// Chạy 1 lần sau khi đã tạo project Supabase + chạy supabase/schema.sql + điền
// SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY vào .env.local:
//
//   node scripts/seed-supabase.mjs
//
// Script sẽ: tải 2 ảnh sản phẩm hiện có (p01, p02) lên Supabase Storage, rồi chèn
// toàn bộ 12 sản phẩm + nội dung trang chủ/liên hệ từ file JSON cũ vào Supabase.
// An toàn để chạy lại — sẽ báo lỗi "duplicate key" nếu dữ liệu đã tồn tại, bỏ qua được.

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const PRODUCT_IMAGES_BUCKET = "product-images";

async function ensureBuckets() {
  const buckets = ["product-images", "software-files"];
  for (const bucket of buckets) {
    const { data: existing } = await supabase.storage.getBucket(bucket);
    if (!existing) {
      const { error } = await supabase.storage.createBucket(bucket, { public: true });
      if (error) throw error;
      console.log(`Đã tạo bucket "${bucket}"`);
    }
  }
}

async function uploadLocalImage(localPath) {
  // localPath dạng "/uploads/products/xxx.png" — file thật nằm ở public/uploads/products/xxx.png
  const fullPath = path.join(process.cwd(), "public", localPath);
  if (!existsSync(fullPath)) {
    console.warn(`  Bỏ qua — không tìm thấy file cục bộ: ${fullPath}`);
    return null;
  }
  const buffer = readFileSync(fullPath);
  const filename = path.basename(localPath);
  const contentType = filename.endsWith(".png") ? "image/png" : "image/jpeg";

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filename, buffer, { contentType, upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

function productToRow(p) {
  return {
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    price: p.price,
    rating: p.rating,
    image: p.image,
    description: p.description,
    features: p.features,
    usage_steps: p.usageSteps,
    pricing_tiers: p.pricingTiers,
    software_file: p.softwareFile,
    software_file_name: p.softwareFileName,
    software_file_size: p.softwareFileSize,
    external_download_url: p.externalDownloadUrl,
    is_new: p.isNew,
    trial_days: p.trialDays,
    version: p.version,
    guide_url: p.guideUrl,
  };
}

async function seedProducts() {
  const products = JSON.parse(
    readFileSync(path.join(process.cwd(), "src/data/store/products.json"), "utf-8"),
  );

  for (const product of products) {
    if (product.image && product.image.startsWith("/uploads/")) {
      console.log(`Tải ảnh cho ${product.id}...`);
      const publicUrl = await uploadLocalImage(product.image);
      product.image = publicUrl;
    }

    const { error } = await supabase.from("products").upsert(productToRow(product));
    if (error) {
      console.error(`  Lỗi khi chèn ${product.id}:`, error.message);
    } else {
      console.log(`  OK: ${product.id} — ${product.name}`);
    }
  }
}

async function seedSiteContent() {
  const site = JSON.parse(
    readFileSync(path.join(process.cwd(), "src/data/store/site.json"), "utf-8"),
  );
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: 1, hero: site.hero, contact: site.contact });
  if (error) throw error;
  console.log("OK: nội dung trang chủ/liên hệ");
}

async function main() {
  console.log("1. Kiểm tra/tạo bucket lưu trữ...");
  await ensureBuckets();

  console.log("\n2. Nạp sản phẩm...");
  await seedProducts();

  console.log("\n3. Nạp nội dung trang chủ/liên hệ...");
  await seedSiteContent();

  console.log("\nHoàn tất! Kiểm tra lại trong Supabase Dashboard → Table Editor.");
}

main().catch((err) => {
  console.error("Lỗi:", err);
  process.exit(1);
});
