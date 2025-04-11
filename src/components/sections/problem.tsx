import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Wine, ListTodo, Timer } from "lucide-react";

const problems = [
  {
    title: "Time-Consuming Pairing",
    description:
      "Manually pairing wines with dishes is a tedious and time-consuming process, especially for users unfamiliar with wine pairing principles.",
    icon: Timer,
  },
  {
    title: "Overwhelming Choices",
    description:
      "With countless wines available, users often feel overwhelmed and struggle to make confident decisions about the best pairings for their meals.",
    icon: ListTodo,
  },
  {
    title: "Lack of Personalization",
    description:
      "Generic wine recommendations fail to consider individual preferences, leaving users dissatisfied with their pairing experience.",
    icon: Wine,
  },
];

export default function Component() {
  return (
    <Section
      title="Problem"
      subtitle="Manually pairing quality wine is a hassle"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}
