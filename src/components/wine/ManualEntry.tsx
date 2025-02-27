"use client";

import { SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ManualEntryProps {
  onAdd: (dishes: string[]) => void;
}

export function ManualEntry({ onAdd }: ManualEntryProps) {
  const [dishes, setDishes] = useState("");

  const handleAdd = () => {
    if (dishes.trim()) {
      const dishList = dishes
        .split("\n")
        .map((dish) => dish.trim())
        .filter(Boolean);

      onAdd(dishList);
      setDishes("");
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        className="min-h-[200px] resize-none whitespace-pre-line"
        placeholder={`Grilled Salmon\nBeef Tenderloin\nMushroom Risotto`}
        value={dishes}
        onChange={(e) => setDishes(e.target.value)}
      />
      <Button className="w-full text-white" onClick={handleAdd}>
        Add Dishes
      </Button>
    </div>
  );
}
