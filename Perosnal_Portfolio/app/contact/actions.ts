"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

import { getContactPageContent } from "@/lib/content-loader";

export async function submitContact(prevState: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const content = await getContactPageContent();

  if (!name || !email || !message) {
    return { status: "error", message: content.errorMessage };
  }

  // In a real deployment this could forward to an email service.
  console.log("Contact submission", { name, email, message });

  return { status: "success", message: content.successMessage };
}
