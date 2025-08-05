import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const PageLoadingFallback = () => (
  <div className="min-h-screen bg-background">
    {/* Header skeleton */}
    <div className="bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex space-x-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>

    {/* Hero section skeleton */}
    <div className="relative py-20">
      <div className="container mx-auto px-4 text-center">
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>

    {/* Content skeleton */}
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-48 w-full mb-4 rounded" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export const ComponentLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
);