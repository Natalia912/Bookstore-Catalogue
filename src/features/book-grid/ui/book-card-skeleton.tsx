import { Card, CardContent, Skeleton } from '@/src/shared/components';

function BookCardSkeleton() {
  return (
    <Card size="sm" className="gap-0 overflow-hidden p-0" aria-hidden="true">
      <Skeleton className="aspect-2/3 max-h-70 w-full rounded-none" />
      <CardContent className="space-y-2 p-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-2 md:pt-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export { BookCardSkeleton };
