"use client";

import Drawer from "@/components/drawer";
import { Icons } from "@/components/icons";
import { ArrowRight } from "lucide-react";
import Menu from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";

const supabase = createClient();

export default function Header() {
  const [addBorder, setAddBorder] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setAddBorder(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUsername(data.user.user_metadata?.first_name || "User");
      }
      console.log(data)
    };
    fetchUser();

  }, []);
  

  return (
    <header className={"sticky top-0 z-50 py-2 bg-background/60 backdrop-blur"}>
      <div className="flex justify-between items-center container">
        <Link href="/" title="brand-logo" className="relative mr-6 flex items-center space-x-2">
          <span className="font-medium text-xl">{siteConfig.name}</span>
        </Link>

        <div className="hidden lg:block">
          <div className="flex items-center">
            <nav className="mr-10">
              <Menu />
            </nav>

            <div className="gap-2 flex">
              {username ? (
                <Link href="/dashboard/overview" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto text-foreground flex gap-2")}>
                  {username}&apos;s Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto text-background flex gap-2")}
                  >
                    Get Started for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 cursor-pointer block lg:hidden">
          <Drawer />
        </div>
      </div>
      <hr
        className={cn(
          "absolute w-full bottom-0 transition-opacity duration-300 ease-in-out",
          addBorder ? "opacity-100" : "opacity-0"
        )}
      />
    </header>
  );
}
