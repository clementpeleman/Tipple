"use client";

import { Loader } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Dish {
  name: string;
  price: number | null;
}

interface Category {
  name: string;
  dishes: Dish[];
}

interface MenuDisplayProps {
  categories: Category[];
  onReset: () => void;
  onGetRecommendations: () => void;
  isLoading: boolean;
  hasRecommendations: boolean;
}

export function MenuDisplay({
  categories,
  onReset,
  onGetRecommendations,
  isLoading,
  hasRecommendations,
}: MenuDisplayProps) {
  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium">Your Menu</h2>
            <p className="text-sm text-muted-foreground">
              {categories.reduce((total, cat) => total + cat.dishes.length, 0)}{" "}
              dishes added
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={onReset}>
            Clear Menu
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Badge className="mb-3" variant="secondary">
              {category.name}
            </Badge>
            <div className="space-y-2">
              {category.dishes.map((dish, dishIndex) => (
                <motion.div
                  key={`${category.name}-${dishIndex}`}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -20 }}
                  transition={{
                    delay: (index * category.dishes.length + dishIndex) * 0.05,
                  }}
                >
                  <Card className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{dish.name}</span>
                        {dish.price && (
                          <span className="text-sm text-muted-foreground">
                            ${dish.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {!hasRecommendations && (
          <Button
            className="w-full text-white mt-4"
            disabled={isLoading}
            onClick={onGetRecommendations}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Finding Perfect Pairings...
              </>
            ) : (
              "Get Wine Recommendations"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
