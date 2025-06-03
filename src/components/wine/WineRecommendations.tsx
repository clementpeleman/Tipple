import { Wine as WineIcon, Check, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  dishCategoryMap: Map<string, string>;
}

export function WineRecommendations({
  recommendations,
  dishCategoryMap,
}: WineRecommendationsProps) {
  const [addedWines, setAddedWines] = useState<Set<string>>(new Set());
  const [loadingWines, setLoadingWines] = useState<Set<string>>(new Set());

  const getWineKey = (wine: WinePairing, dish: string) => 
    `${wine.wine_recommendation}-${dish}`;

  const handleAddWine = async (wine: WinePairing, dish: string) => {
    const wineKey = getWineKey(wine, dish);
    
    if (addedWines.has(wineKey)) return; // Already added
    
    setLoadingWines(prev => new Set(prev).add(wineKey));

    try {
      // Check if the user is logged in using Supabase
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error('You must be logged in to add a wine.');
        return;
      }

      // Find the original dish name if we have a translated dish
      const dishEntry = recommendations.find(rec => rec.translated_dish === dish);
      const originalDishName = dishEntry ? dishEntry.original_dish : dish;
      
      // Get the dish category from our map
      const dish_type = dishCategoryMap.get(originalDishName) || "Other";

      // Use Supabase RPC instead of API endpoint
      const { data, error: rpcError } = await supabase.rpc('add_wine_with_pairing', {
        user_id: user.id,
        wine_data: {
          name: wine.wine_recommendation,
          description: `A ${wine.color} wine from ${wine.country}.`,
          color: wine.color,
          type: wine.type,
          country: wine.country,
          region: null,
          price: 0,
          photo_url: 'https://www.crombewines.com/cdn/shop/files/3.038.150-1-voorkant_label_7738679d-46a3-43a6-a7a6-e727cfa34342.png'
        },
        dish_data: {
          name: originalDishName,
          translated_name: dish !== originalDishName ? dish : null,
          dish_type: dish_type,
          cuisine: null
        },
        pairing_data: {
          relevance_score: wine.relevance,
          is_favorite: false,
          notes: null
        }
      });

      if (rpcError) {
        throw new Error(rpcError.message || 'Failed to add wine to the database.');
      }

      // Mark as added and show success state
      setAddedWines(prev => new Set(prev).add(wineKey));
      toast.success('Wine pairing added to your collection!');
    } catch (error: any) {
      console.error('Error adding wine:', error);
      toast.error(error.message || 'Failed to add wine to the database.');
    } finally {
      setLoadingWines(prev => {
        const newSet = new Set(prev);
        newSet.delete(wineKey);
        return newSet;
      });
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <h2 className="text-2xl font-medium">Wine Recommendations</h2>
        <p className="text-sm text-muted-foreground">
          Pairings for your menu
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
              {dishCategoryMap.get(rec.original_dish) && (
                <Badge variant="outline" className="mt-1">
                  {dishCategoryMap.get(rec.original_dish)}
                </Badge>
              )}
            </div>

            <div className="grid gap-3">
              {rec.recommendations.top_wine_pairings.slice(0, 3).map((wine, wineIndex) => {
                const wineKey = getWineKey(wine, rec.translated_dish);
                const isLoading = loadingWines.has(wineKey);
                const isAdded = addedWines.has(wineKey);

                return (
                  <motion.div
                    key={wineIndex}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: 20 }}
                    transition={{ delay: (index * 2 + wineIndex) * 0.1 }}
                  >
                    <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
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
                            <WineIcon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 flex justify-between items-center">
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
                                {wine.relevance && (
                                  <Badge className="text-xs" variant="outline">
                                    Match: {Math.round(wine.relevance)}%
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <Button 
                              variant={isAdded ? "default" : "outline"}
                              onClick={() => handleAddWine(wine, rec.translated_dish)}
                              disabled={isLoading || isAdded}
                              className={cn(
                                "transition-all duration-300",
                                isAdded && "bg-green-600 hover:bg-green-700 text-white"
                              )}
                            >
                              {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                              ) : isAdded ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add to List
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}