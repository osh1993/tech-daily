import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        {/* 썸네일 스켈레톤 */}
        <Skeleton className="aspect-video w-full" />
      </CardHeader>
      <CardContent className="p-4">
        {/* 제목 스켈레톤 (2줄) */}
        <Skeleton className="mb-2 h-5 w-full" />
        <Skeleton className="mb-3 h-5 w-3/4" />

        {/* 설명 스켈레톤 (3줄) */}
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-3 h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        {/* 출처 & 날짜 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        {/* 북마크 버튼 */}
        <Skeleton className="h-9 w-9 rounded" />
      </CardFooter>
    </Card>
  );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
