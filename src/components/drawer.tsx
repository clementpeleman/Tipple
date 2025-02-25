import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const supabase = createClient();

export default function DrawerDemo() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUsername(data.user.user_metadata?.first_name || "User");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {/* Only show "Dashboard ->" link on mobile, hide the rest on desktop */}
      <Link
        href="/dashboard/overview"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full sm:w-auto text-foreground flex gap-2"
        )}
      >
        Dashboard &rarr;
      </Link>

      {/* The rest of the content should be hidden on desktop */}
      <div className="hidden sm:flex items-center space-x-4">
        {username ? (
          <Link
            href="/dashboard/overview"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto text-foreground flex gap-2"
            )}
          >
            {username}&apos;s Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline" })}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full sm:w-auto text-background flex gap-2"
              )}
            >
              Get Started for Free
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
