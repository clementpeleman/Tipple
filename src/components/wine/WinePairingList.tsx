import { useState, useEffect } from 'react';
import { Wine as WineIcon, Trash2, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { PairingWithDetails } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

const supabase = createClient();

export function WinePairingList() {
  const [pairings, setPairings] = useState<PairingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPairings = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error('You must be logged in to view your wine pairings.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/wine?userId=${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch wine pairings');
        }
        
        const data = await response.json();
        setPairings(data);
      } catch (error) {
        console.error('Error fetching wine pairings:', error);
        toast.error('Failed to load your wine pairings');
      } finally {
        setLoading(false);
      }
    };

    fetchPairings();
  }, []);

  const toggleFavorite = async (pairingId: string, currentValue: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update favorites.');
        return;
      }

      const response = await fetch(`/api/wine/${pairingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_favorite: !currentValue
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      // Update local state
      setPairings(pairings.map(pairing => 
        pairing.id === pairingId 
          ? { ...pairing, is_favorite: !currentValue } 
          : pairing
      ));

      toast.success(currentValue ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const deletePairing = async (pairingId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to delete a pairing.');
        return;
      }

      const response = await fetch(`/api/wine/${pairingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete wine pairing');
      }

      // Update local state
      setPairings(pairings.filter(pairing => pairing.id !== pairingId));
      toast.success('Wine pairing deleted successfully');
    } catch (error) {
      console.error('Error deleting wine pairing:', error);
      toast.error('Failed to delete wine pairing');
    }
  };

  if (loading) {
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

  if (pairings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-medium">My Wine Pairings</h2>
          <p className="text-sm text-muted-foreground">
            You haven't added any wine pairings yet
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <WineIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Start by adding wine recommendations from the menu scanner
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-medium">My Wine Pairings</h2>
        <p className="text-sm text-muted-foreground">
          Your saved wine and dish pairings
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {pairings.map((pairing) => (
          <Card key={pairing.id} className="bg-muted/50 hover:bg-muted/70 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "mt-1",
                    pairing.wines?.color === "Red"
                      ? "text-red-500"
                      : pairing.wines?.color === "White"
                        ? "text-yellow-500"
                        : pairing.wines?.color === "Rose"
                          ? "text-pink-500"
                          : "text-gray-500",
                  )}
                >
                  <WineIcon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium leading-snug">{pairing.wines?.name}</p>
                    {pairing.is_favorite && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Paired with: <span className="font-medium">{pairing.dishes?.name}</span>
                    {pairing.dishes?.dish_type && ` (${pairing.dishes.dish_type})`}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        pairing.wines?.color === "Red"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : pairing.wines?.color === "White"
                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                            : pairing.wines?.color === "Rose"
                              ? "border-pink-200 bg-pink-50 text-pink-700"
                              : "",
                      )}
                      variant="outline"
                    >
                      {pairing.wines?.color}
                    </Badge>
                    {pairing.wines?.type && (
                      <Badge className="text-xs" variant="outline">
                        {pairing.wines.type}
                      </Badge>
                    )}
                    {pairing.wines?.country && (
                      <Badge className="text-xs" variant="outline">
                        {pairing.wines.country}
                      </Badge>
                    )}
                    {pairing.relevance_score && (
                      <Badge className="text-xs" variant="outline">
                        Match: {Math.round(pairing.relevance_score * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(pairing.id, pairing.is_favorite)}
                    title={pairing.is_favorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart 
                      className={cn(
                        "h-5 w-5", 
                        pairing.is_favorite && "fill-red-500 text-red-500"
                      )} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePairing(pairing.id)}
                    title="Delete pairing"
                  >
                    <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}