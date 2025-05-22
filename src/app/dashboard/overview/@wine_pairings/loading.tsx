import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function WinePairingsLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}