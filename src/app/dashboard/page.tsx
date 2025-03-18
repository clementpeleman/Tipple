"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard/overview after component mounts
    router.push('/dashboard/overview');
    
    // Alternatively, you can add a small delay if needed
    // setTimeout(() => {
    //   router.push('/dashboard/overview');
    // }, 500);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Skeleton className="w-16 h-16 rounded-full" />
      <p className="mt-4 text-muted-foreground">Redirecting to overview...</p>
    </div>
  );
}