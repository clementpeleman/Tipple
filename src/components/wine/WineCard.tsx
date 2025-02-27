"use client";

import { Wine } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WinePairing {
  wine_recommendation: string;
  relevance: number;
  type: string;
  country: string;
  color: string;
}

interface WineCardProps {
  wine: WinePairing;
}

export function WineCard({ wine }: WineCardProps) {
  const wineColorClass =
    {
      Red: "text-red-600 dark:text-red-400",
      White: "text-yellow-600 dark:text-yellow-400",
      Rose: "text-pink-600 dark:text-pink-400",
      Default: "text-gray-600 dark:text-gray-400",
    }[wine.color] || "text-gray-600 dark:text-gray-400";

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow bg-muted/50">
      <div className="flex items-start space-x-4">
        <div className={cn("mt-1", wineColorClass)}>
          <Wine className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-medium leading-tight">
            {wine.wine_recommendation}
          </h4>
          <div className="flex font-thin flex-wrap gap-2">
            <Badge variant="outline">{wine.type}</Badge>
            <Badge variant="outline">{wine.color}</Badge>
            <Badge variant="outline">{wine.country}</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
