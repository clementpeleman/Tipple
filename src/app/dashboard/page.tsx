"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("Logged out successfully");
      router.push("/"); // Redirect to the main page
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}