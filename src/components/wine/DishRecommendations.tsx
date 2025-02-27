"use client";

import { WineCard } from "./WineCard";

interface WinePairing {
  wine_recommendation: string;
  relevance: number;
  type: string;
  country: string;
  color: string;
}

interface RecommendationWrapper {
  original_dish: string;
  translated_dish: string;
  recommendations: {
    top_wine_pairings: WinePairing[];
  };
}

interface DishRecommendationsProps {
  recommendations: RecommendationWrapper[];
}

export function DishRecommendations({
  recommendations,
}: DishRecommendationsProps) {
  return (
    <div className="space-y-8">
      {recommendations.map((rec, index) => (
        <div key={index} className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xl font-medium">{rec.original_dish}</h3>
            {rec.translated_dish !== rec.original_dish && (
              <p className="text-sm text-muted-foreground">
                {rec.translated_dish}
              </p>
            )}
          </div>
          <div className="grid gap-4">
            {rec.recommendations.top_wine_pairings.map((wine, wineIndex) => (
              <WineCard key={wineIndex} wine={wine} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
