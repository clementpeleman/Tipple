import Features from "@/components/features-horizontal";
import Section from "@/components/section";
import { BarChart3, Brain, FileText, LineChart } from "lucide-react";

const data = [
  {
    id: 1,
    title: "AI-Powered Wine Pairing",
    content:
      "Leverage our partners advanced kNN algorithm to recommend the perfect wine pairings for your menu or individual dishes.",
    image: "/dashboard.png",
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
  {
    id: 2,
    title: "Personalized Recommendations",
    content:
      "Get wine suggestions tailored to your preferences and menu for a unique pairing experience.",
    image: "/showcase.png",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
  },
  {
    id: 3,
    title: "Streamlined Wine Selection",
    content:
      "Easily browse curated wine recommendations and confidently select the best options for your meals.",
    image: "/dashboard.png",
    icon: <LineChart className="h-6 w-6 text-primary" />,
  },
  {
    id: 4,
    title: "Dashboard and Ordering",
    content:
      "Track your selected wines on a user-friendly dashboard and place orders directly from the platform.",
    image: "/showcase_2.png",
    icon: <FileText className="h-6 w-6 text-primary" />,
  },
];

export default function Component() {
  return (
    <Section title="Features" subtitle="User Flows and Navigational Structures">
      <Features collapseDelay={5000} linePosition="bottom" data={data} />
    </Section>
  );
}
