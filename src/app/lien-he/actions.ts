"use server";

import { addContactSubmission } from "@/lib/store";

export type ContactFormState = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { success: false, error: "Vui lòng điền đầy đủ họ tên, email và nội dung." };
  }

  await addContactSubmission({ name, email, phone, message });

  return { success: true };
}
