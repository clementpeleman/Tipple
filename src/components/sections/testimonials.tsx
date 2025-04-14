"use client";

import Marquee from "@/components/magicui/marquee";
import Section from "@/components/section";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-primary/20 p-1 py-0.5 font-bold text-primary dark:bg-primary/20 dark:text-primary",
        className
      )}
    >
      {children}
    </span>
  );
};

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      // light styles
      " border border-neutral-200 bg-white",
      // dark styles
      "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    {...props} // Spread the rest of the props here
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      <div className="flex flex-row py-1">
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      <Image
        width={40}
        height={40}
        src={img || ""}
        alt={name}
        className="h-10 w-10 rounded-full ring-1 ring-border ring-offset-4"
      />

      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    name: "Chef Emily Carter",
    role: "Head Chef at The Gilded Grape",
    img: "https://randomuser.me/api/portraits/women/83.jpg",
    description: (
      <p>
        Tipple has completely transformed our wine pairing process.{" "}
        <Highlight>
          Our customers are raving about the expertly curated selections!
        </Highlight>{" "}
        It&apos;s a game-changer for our restaurant.
      </p>
    ),
  },
  {
    name: "Sommelier James O'Connell",
    role: "Wine Director at Vinoteca",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    description: (
      <p>
        As a sommelier, I&apos;m always looking for innovative tools. Tipple&apos;s AI
        is surprisingly accurate and helps me{" "}
        <Highlight>discover pairings I wouldn&apos;t have considered!</Highlight>
      </p>
    ),
  },
  {
    name: "Restaurateur Maria Rodriguez",
    role: "Owner of Casa Vino",
    img: "https://randomuser.me/api/portraits/women/56.jpg",
    description: (
      <p>
        Tipple has streamlined our wine ordering and reduced waste.{" "}
        <Highlight>Our profits are up, and our customers are happier!</Highlight>
      </p>
    ),
  },
  {
    name: "Wine Enthusiast David Lee",
    role: "Home Chef",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
    description: (
      <p>
        I used to be intimidated by wine pairing. Now, with Tipple, I can{" "}
        <Highlight>confidently create amazing food and wine experiences</Highlight>{" "}
        at home.
      </p>
    ),
  },
];

export default function Testimonials() {
  const repeatedTestimonials = Array(3)
    .fill(testimonials)
    .flat(); // Dus: [1,2,3,4,1,2,3,4,1,2,3,4]

  return (
    <Section
      title="Testimonials"
      subtitle="What our customers are saying"
      className="max-w-8xl"
    >
      <div className="relative mt-6 max-h-[60vh] overflow-hidden">
        <div className="gap-4 md:columns-2 xl:columns-3">
          {[0, 1, 2].map((i) => (
            <Marquee
              vertical
              key={i}
              className={cn({
                "[--duration:62s]": i === 0,
                "[--duration:85s]": i === 1,
                "[--duration:78s]": i === 2,
              })}
            >
              {repeatedTestimonials.map((card, idx) => (
                <motion.div
                  key={`${i}-${idx}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: Math.random() * 0.8,
                    duration: 1.2,
                  }}
                >
                  <TestimonialCard {...card} />
                </motion.div>
              ))}
            </Marquee>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-background from-20%"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-background from-20%"></div>
      </div>
    </Section>
  );
}


