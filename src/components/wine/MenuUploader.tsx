"use client";

import { useState } from "react";
import { Loader, Upload } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface MenuUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function MenuUploader({ onUpload, isLoading }: MenuUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setSelectedFile(file);
      onUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center transition-colors hover:border-muted-foreground/50">
        <input
          accept="image/*"
          className="hidden"
          disabled={isLoading}
          id="menu-image"
          type="file"
          onChange={handleFileChange}
        />
        <label className="cursor-pointer block" htmlFor="menu-image">
          {selectedFile ? (
            <div className="relative w-full max-w-md mx-auto aspect-[4/3]">
              <Image
                fill
                alt="Selected menu"
                className="rounded-lg object-cover"
                src={URL.createObjectURL(selectedFile)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload menu image</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to select
                </p>
              </div>
            </div>
          )}
        </label>
      </div>

      {selectedFile && (
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Menu...
            </>
          ) : (
            "Upload Another Image"
          )}
        </Button>
      )}
    </div>
  );
}
