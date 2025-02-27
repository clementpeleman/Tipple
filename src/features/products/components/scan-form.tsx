"use client";

import React from "react";

import { MenuScanner } from "@/components/wine/MenuScanner";
import { Heading } from '@/components/ui/heading';
import PageContainer from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";

export default function Scanner() {
  return (
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex flex-col items-start '>
            <Heading
            title='Add wines'
            description='Manage new wines'
            />
        </div>
        <Separator />
        <div className="w-[80vw] pt-4 max-w-4xl">
            <MenuScanner />
        </div>
      </div>
  );
}
