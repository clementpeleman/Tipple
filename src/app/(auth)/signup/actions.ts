"use server";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = createClient();

  if (!supabase || !(await supabase).auth) {
    throw new Error("Supabase client not initialized correctly.");
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  if (!email || !password || !firstName || !lastName) {
    throw new Error("All fields are required.");
  }

  const { error } = await (await supabase).auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error("Signup error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}