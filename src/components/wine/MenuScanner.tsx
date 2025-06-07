"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";

import { MenuInput } from "./MenuInput";
import { MenuDisplay } from "./MenuDisplay";
import { WineRecommendations } from "./WineRecommendations";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { toast } from "sonner"; // Import toast from sonner

interface Dish {
  name: string;
  price: number | null;
}

interface Category {
  name: string;
  dishes: Dish[];
}

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

export function MenuScanner() {
  const [dishes, setDishes] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<
    RecommendationWrapper[]
  >([]);

  // Create a mapping of dish names to their categories
  const dishCategoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    
    dishes.forEach(category => {
      category.dishes.forEach(dish => {
        map.set(dish.name, category.name);
      });
    });
    
    return map;
  }, [dishes]);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      let uploadFile = file;

      // Alleen afbeeldingen comprimeren
      if (file.type.startsWith("image/")) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 2048,
          useWebWorker: true,
        };
        uploadFile = await imageCompression(file, options);
      }

      const formData = new FormData();
      // Gebruik "file" i.p.v. "image" als key, zodat je backend beide types kan accepteren
      formData.append("file", uploadFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        if (data.categories && Object.keys(data.categories).length > 0) {
          const formattedCategories = Object.keys(data.categories).map(
            (key) => ({
              name: key,
              dishes: data.categories[key] || [],
            }),
          );

          setDishes(formattedCategories);
          toast.success("Menu uploaded successfully. Your menu has been processed and is ready for wine pairing.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error uploading menu. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualAdd = (newDishes: string[]) => {
    if (newDishes.length === 0) {
      setDishes([]);
      setRecommendations([]);

      return;
    }

    const newDishEntries = newDishes.map((dish) => ({
      name: dish,
      price: null,
    }));

    const updatedDishes = [...dishes];
    const manualCategoryIndex = dishes.findIndex(
      (category) => category.name === "Manual Entry",
    );

    if (manualCategoryIndex >= 0) {
      updatedDishes[manualCategoryIndex].dishes.push(...newDishEntries);
    } else {
      updatedDishes.push({
        name: "Manual Entry",
        dishes: newDishEntries,
      });
    }

    setDishes(updatedDishes);
    toast.success("Dishes added successfully. Your menu has been updated.");
  };

  const handleGetRecommendations = async () => {
    if (dishes.length === 0) return;

    setIsLoading(true);
    try {
      const allDishNames = dishes.flatMap((category) =>
        category.dishes.map((dish) => dish.name),
      );

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dishes: allDishNames }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      
      // Log the data to see what's being returned
      // console.log("Wine recommendations data:", data);
      
      // Handle different possible response formats
      if (Array.isArray(data) && data.length > 0) {
        // Direct array format
        setRecommendations(data);
        toast.success("Wine recommendations ready. Discover pairings for your menu.");
      } else if (data.successful_recommendations && Array.isArray(data.successful_recommendations) && data.successful_recommendations.length > 0) {
        // Object with successful_recommendations array
        setRecommendations(data.successful_recommendations);
        toast.success("Wine recommendations ready. Discover pairings for your menu.");
        
        // Log any failed recommendations
        if (data.failed_recommendations && data.failed_recommendations.length > 0) {
          console.warn("Some dishes couldn't be paired:", data.failed_recommendations);
          toast.warning(`${data.failed_recommendations.length} dishes couldn't be paired with wine.`);
        }
      } else {
        console.error("Received empty or invalid recommendations data:", data);
        toast.error("No wine recommendations found for your menu items.");
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("Error getting recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDishes([]);
    setRecommendations([]);
    toast.success("Menu cleared. Start fresh with a new menu.");
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {dishes.length === 0 ? (
          <motion.div
            key="input"
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <MenuInput
              isLoading={isLoading}
              onManualAdd={handleManualAdd}
              onUpload={handleUpload}
            />
          </motion.div>
        ) : (
          <motion.div
            key="display"
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-8 md:grid-cols-2"
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <div className="space-y-8">
              <MenuDisplay
                categories={dishes}
                hasRecommendations={recommendations.length > 0}
                isLoading={isLoading}
                onGetRecommendations={handleGetRecommendations}
                onReset={handleReset}
              />
            </div>
            {recommendations && recommendations.length > 0 && (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="md:sticky md:top-24 h-fit"
                initial={{ opacity: 0, x: 20 }}
              >
                <WineRecommendations 
                  recommendations={recommendations} 
                  dishCategoryMap={dishCategoryMap} 
                />
              </motion.div>
            )}
            {isLoading && recommendations.length === 0 && (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 20 }}
                className="md:sticky md:top-24 h-fit"
              >
                <Card className="backdrop-blur-sm bg-card/80 border border-neutral-200 dark:border-neutral-800 shadow-md rounded-xl">
                  <CardHeader>
                    <h2 className="text-2xl font-medium">Wine Recommendations</h2>
                    <p className="text-sm text-muted-foreground">
                      Pairings for your menu
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mr-4" />
                      <p className="text-muted-foreground dark:text-neutral-200">
                        Loading wine recommendations...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}