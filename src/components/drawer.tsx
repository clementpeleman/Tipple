import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { IoMenuSharp } from "react-icons/io5";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Icons } from "@/components/icons";

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
      {/* Mobiel: Toon Dashboard als ingelogd, anders hamburgermenu */}
      {username ? (
        <Link
          href="/dashboard/overview"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full sm:w-auto text-foreground flex gap-2"
          )}
        >
          Dashboard &rarr;
        </Link>
      ) : (
        <Drawer>
          <DrawerTrigger>
            <IoMenuSharp className="text-2xl" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="px-6">
              <div>
                <Link
                  href="/"
                  title="brand-logo"
                  className="relative flex items-center space-x-2"
                >
                  <Icons.logo className="w-auto h-[40px]" />
                  <span className="font-bold text-xl">{siteConfig.name}</span>
                </Link>
              </div>
              <nav>
                <ul className="mt-7 text-left">
                  {siteConfig.header.map((item, index) => (
                    <li key={index} className="my-3">
                      {item.trigger ? (
                        <span className="font-semibold">{item.trigger}</span>
                      ) : (
                        <Link href={item.href || ""} className="font-semibold">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </DrawerHeader>
            <DrawerFooter>
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
                <Icons.logo className="h-6 w-6" />
                Get Started for Free
              </Link>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Desktop: Standaard navigatie blijft zichtbaar */}
      <div className="hidden sm:flex items-center space-x-4">
        {siteConfig.header.map((item, index) => (
          <Link key={index} href={item.href || ""} className="font-semibold">
            {item.label}
          </Link>
        ))}
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
