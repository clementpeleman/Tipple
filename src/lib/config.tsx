import { Icons } from "@/components/icons";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Tipple",
  description: "Automate your wine pairing with AI",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: ["Wine Pairing", "AI", "Next.js", "React", "Tailwind CSS"],
  links: {
    email: "support@tipple.ai",
    twitter: "https://twitter.com/tippleai",
    discord: "https://discord.gg/tippleai",
    github: "https://github.com/tippleai",
    instagram: "https://instagram.com/tippleai/",
  },
  header: [
    {
      trigger: "Features",
      content: {
        main: {
          icon: <Icons.logo className="h-6 w-6" />,
          title: "AI-Powered Wine Pairing",
          description: "Streamline your wine selection with intelligent AI recommendations.",
          href: "#",
        },
        items: [
          {
            href: "#",
            title: "Menu Upload",
            description: "Easily upload your menu or input individual dishes.",
          },
          {
            href: "#",
            title: "Wine Recommendations",
            description: "Get AI-powered wine pairings tailored to your dishes.",
          },
          {
            href: "#",
            title: "Personalized Suggestions",
            description: "Receive recommendations based on your preferences.",
          },
        ],
      },
    },
    {
      trigger: "Solutions",
      content: {
        items: [
          {
            title: "For Restaurants",
            href: "#",
            description: "Enhance your menu with perfect wine pairings.",
          },
          {
            title: "For Wine Enthusiasts",
            href: "#",
            description: "Discover wines that complement your meals.",
          },
          {
            title: "For Retailers",
            href: "#",
            description: "Offer curated wine suggestions to your customers.",
          },
          {
            title: "For Events",
            href: "#",
            description: "Simplify wine selection for special occasions.",
          },
        ],
      },
    },
    {
      href: "/blog",
      label: "Blog",
    },
  ],
  pricing: [
    {
      name: "BASIC",
      href: "#",
      price: "€9",
      period: "month",
      yearlyPrice: "€99",
      features: [
        "1 Menu Limit",
        "2 Additional Wine Pairings/month",
        "No Sommelier Support",
        "Basic Wine Ordering",
        "Multi-Page Menu Upload",
      ],
      description: "Perfect for individuals exploring wine pairing.",
      buttonText: "Subscribe",
      isPopular: false,
    },
    {
      name: "PRO",
      href: "#",
      price: "€25",
      period: "month",
      yearlyPrice: "249",
      features: [
        "5 Menu Limit",
        "10 Additional Wine Pairings/month",
        "Custom Sommelier Support",
        "Advanced Wine Ordering",
        "Multi-Page Menu Upload",
      ],
      description: "Ideal for small-medium sized restaurants",
      buttonText: "Subscribe",
      isPopular: true,
    },
    {
      name: "ENTERPRISE",
      href: "#",
      price: "49",
      period: "month",
      yearlyPrice: "€549",
      features: [
        "Unlimited Menu",
        "Unlimited Wine Pairings",
        "Additional Wine Expertise",
        "Advanced Sommelier Support",
        "Advanced Wine Ordering",
        "Analytics Platform",
      ],
      description: "For large-scale operations and businesses.",
      buttonText: "Contact Us",
      isPopular: false,
    },
  ],
  faqs: [
    {
      question: "What is Tipple?",
      answer: (
        <span>
          Tipple is an AI-powered platform that helps you pair wines with your menu or individual dishes, making wine selection effortless and enjoyable.
          On top of that, it keeps track of your wines and allows you to order them directly from the platform.
        </span>
      ),
    },
    {
      question: "How does Tipple work?",
      answer: (
        <span>
          Simply upload your menu or input individual dishes, and our AI will recommend the perfect wine pairings tailored to your preferences.
        </span>
      ),
    },
    {
      question: "Can I order wines directly through Tipple?",
      answer: (
        <span>
          Yes, you can save your selected wines to your dashboard and place orders directly from the platform.
        </span>
      ),
    },
    {
      question: "Is Tipple suitable for restaurants?",
      answer: (
        <span>
          Absolutely! Tipple is designed to help restaurants enhance their menus with expertly paired wines, improving the dining experience for customers.
        </span>
      ),
    },
    {
      question: "What kind of support does Tipple provide?",
      answer: (
        <span>
          Tipple offers comprehensive support, including documentation, tutorials, and customer service. Premium support is available for enterprise users.
        </span>
      ),
    },
  ],
  footer: [
    {
      title: "Product",
      links: [
        { href: "#", text: "Features", icon: null },
        { href: "#", text: "Pricing", icon: null },
        { href: "#", text: "Documentation", icon: null },
        { href: "#", text: "API", icon: null },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "#", text: "About Us", icon: null },
        { href: "#", text: "Careers", icon: null },
        { href: "#", text: "Blog", icon: null },
        { href: "#", text: "Press", icon: null },
        { href: "#", text: "Partners", icon: null },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "#", text: "Community", icon: null },
        { href: "#", text: "Contact", icon: null },
        { href: "#", text: "Support", icon: null },
        { href: "#", text: "Status", icon: null },
      ],
    },
    {
      title: "Social",
      links: [
        // {
        //   href: "#",
        //   text: "Twitter",
        //   icon: <FaTwitter />,
        // },
        {
          href: "#",
          text: "Instagram",
          icon: <RiInstagramFill />,
        },
        // {
        //   href: "#",
        //   text: "Youtube",
        //   icon: <FaYoutube />,
        // },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
