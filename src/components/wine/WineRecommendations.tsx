"use client";

import { Wine } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Import toast from sonner
import { wineService } from '@/constants/wineItem-service'; // Import your service to interact with the database
import { createClient } from '@/utils/supabase/client';
import { Button } from "../ui/button";

const supabase = createClient();

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

interface WineRecommendationsProps {
  recommendations: RecommendationWrapper[];
}

export function WineRecommendations({
  recommendations,
}: WineRecommendationsProps) {
  const handleAddWine = async (wine: WinePairing) => {
    try {
      const { data, error } = await supabase.auth.getUser();
  
      if (error || !data?.user) {
        toast.error('You must be logged in to add a wine.');
        return;
      }
  
      const userId = data.user.id; // Correcte destructurering
  
      await wineService.addWine({
        name: wine.wine_recommendation,
        description: `A ${wine.color} wine from ${wine.country}.`,
        category: wine.type,
        user_id: userId, // Correcte user_id
        price: 0,
        photo_url: 'https://www.crombewines.com/cdn/shop/files/3.038.150-1-voorkant_label_7738679d-46a3-43a6-a7a6-e727cfa34342.png',
      });
  
      toast.success('Wine added to the database successfully!');
    } catch (error) {
      console.error('Error adding wine:', error);
      toast.error('Failed to add wine to the database.');
    }
  };
  

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <h2 className="text-2xl font-medium">Wine Recommendations</h2>
        <p className="text-sm text-muted-foreground">
          Perfect pairings for your menu
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.1 }}
          >
            <div>
              <h3 className="text-lg font-medium">{rec.original_dish}</h3>
              {rec.translated_dish !== rec.original_dish && (
                <p className="text-sm text-muted-foreground italic">
                  {rec.translated_dish}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              {rec.recommendations.top_wine_pairings.slice(0,3).map((wine, wineIndex) => (
                <motion.div
                  key={wineIndex}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 20 }}
                  transition={{ delay: (index * 2 + wineIndex) * 0.1 }}
                >
                  <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Wijnicoon */}
                        <div
                          className={cn(
                            "mt-1",
                            wine.color === "Red"
                              ? "text-red-500"
                              : wine.color === "White"
                                ? "text-yellow-500"
                                : wine.color === "Rose"
                                  ? "text-pink-500"
                                  : "text-gray-500",
                          )}
                        >
                          <Wine className="h-5 w-5" />
                        </div>

                        {/* Wijninformatie + knop in één rij */}
                        <div className="flex-1 flex justify-between items-center">
                          {/* Wijnnaam + Badges */}
                          <div>
                            <p className="font-medium leading-snug">{wine.wine_recommendation}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge
                                className={cn(
                                  "text-xs",
                                  wine.color === "Red"
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : wine.color === "White"
                                      ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                      : wine.color === "Rose"
                                        ? "border-pink-200 bg-pink-50 text-pink-700"
                                        : "",
                                )}
                                variant="outline"
                              >
                                {wine.color}
                              </Badge>
                              <Badge className="text-xs" variant="outline">
                                {wine.type}
                              </Badge>
                              <Badge className="text-xs" variant="outline">
                                {wine.country}
                              </Badge>
                            </div>
                          </div>

                          {/* Knop rechts */}
                          <Button variant="outline" className="" onClick={() => handleAddWine(wine)}>
                            Add to List
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}