"use client";

import { MenuUploader } from "./MenuUploader";
import { ManualEntry } from "./ManualEntry";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuInputProps {
  onUpload: (file: File) => Promise<void>;
  onManualAdd: (dishes: string[]) => void;
  isLoading: boolean;
}

export function MenuInput({
  onUpload,
  onManualAdd,
  isLoading,
}: MenuInputProps) {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/80">
      <Tabs className="p-6" defaultValue="scan">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="scan">Scan Menu</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-0" value="scan">
          <MenuUploader isLoading={isLoading} onUpload={onUpload} />
        </TabsContent>

        <TabsContent className="mt-0" value="manual">
          <ManualEntry onAdd={onManualAdd} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
