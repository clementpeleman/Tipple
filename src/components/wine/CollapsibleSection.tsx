"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  description,
  defaultOpen = true,
  className,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={className}>
      <button
        className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen} // Optional: Indicates the state of the collapsible section
        type="button" // Ensures the button behaves correctly
      >
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        )}
      </button>
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          isOpen ? "block" : "hidden",
        )}
      >
        {children}
      </div>
    </Card>
  );
}
