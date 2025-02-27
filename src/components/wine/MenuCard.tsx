"use client";

import { Loader } from "lucide-react";

import { MenuUploader } from "./MenuUploader";
import { ManualEntry } from "./ManualEntry";
import { MenuList } from "./MenuList";
import { DishRecommendations } from "./DishRecommendations";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

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

interface MenuCardProps {
  dishes: Category[];
  isLoading: boolean;
  recommendations: RecommendationWrapper[];
  onUpload: (file: File) => Promise<void>;
  onManualAdd: (dishes: string[]) => void;
  onGetRecommendations: () => void;
}

export function MenuCard({
  dishes,
  isLoading,
  recommendations,
  onUpload,
  onManualAdd,
  onGetRecommendations,
}: MenuCardProps) {
  return (
    <Card className="bg-card">
      <div className="border-b">
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Your Menu</h2>
          <p className="text-muted-foreground">
            {dishes.length === 0
              ? "Upload a menu image or enter dishes manually to get started"
              : "Review your menu items and get wine recommendations"}
          </p>
        </div>
        {dishes.length === 0 && (
          <CardContent className="border-t">
            <Tabs className="space-y-6" defaultValue="scan">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan">Scan Menu</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="scan">
                <MenuUploader isLoading={isLoading} onUpload={onUpload} />
              </TabsContent>

              <TabsContent value="manual">
                <ManualEntry onAdd={onManualAdd} />
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </div>

      {dishes.length > 0 && (
        <>
          <div className="p-6 space-y-6">
            <MenuList categories={dishes} isLoading={isLoading} />
            <div className="flex gap-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => onManualAdd([])}
              >
                Start Over
              </Button>
              {recommendations.length === 0 && (
                <Button
                  className="flex-1 text-white"
                  disabled={isLoading}
                  onClick={onGetRecommendations}
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Wine Recommendations"
                  )}
                </Button>
              )}
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="border-t">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">
                  Wine Recommendations
                </h2>
                <p className="text-muted-foreground">
                  Selected wine pairings for your menu
                </p>
              </div>
              <CardContent>
                <DishRecommendations recommendations={recommendations} />
              </CardContent>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
