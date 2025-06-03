"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Dish {
  name: string;
  price: number | null;
}

interface Category {
  name: string;
  dishes: Dish[];
}

interface MenuListProps {
  categories: Category[];
  isLoading?: boolean;
}

export function MenuList({ categories, isLoading }: MenuListProps) {
  if (isLoading) {
    return <MenuListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <Badge className="mb-3" variant="secondary">
            {category.name}
          </Badge>
          <div className="grid gap-2">
            {category.dishes.map((dish, dishIndex) => (
              <Card
                key={`${categoryIndex}-${dishIndex}`}
                className="bg-muted/50"
              >
                <CardContent className="flex justify-between items-center p-3">
                  <span>{dish.name}</span>
                  {dish.price !== null && (
                    <span className="text-muted-foreground">
                      €{dish.price.toFixed(2)}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MenuListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((category) => (
        <div key={category}>
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="space-y-2">
            {[1, 2, 3].map((dish) => (
              <Card key={dish}>
                <CardContent className="flex justify-between items-center p-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
