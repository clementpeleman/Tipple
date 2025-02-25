"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = createClient();

  // Haal de email en wachtwoord op vanuit formData
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const { error } = await (await supabase).auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login error:", error.message);
    redirect("/error");
  }

  redirect("/");
}
