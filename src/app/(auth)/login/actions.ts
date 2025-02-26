"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // Retrieve email and password from formData
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const { error } = await (await supabase).auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}