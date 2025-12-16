import { Skeleton } from '@/components/ui/skeleton';

export default function NewsDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-3xl">
        {/* 썸네일 스켈레톤 */}
        <Skeleton className="mb-8 aspect-video w-full rounded-lg" />

        {/* 헤더 */}
        <header className="mb-6">
          {/* 카테고리 뱃지 스켈레톤 */}
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* 제목 스켈레톤 - 2줄 */}
          <div className="mb-4 space-y-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-4/5" />
          </div>

          {/* 메타 정보 스켈레톤 */}
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </header>

        {/* 구분선 */}
        <Skeleton className="my-6 h-px w-full" />

        {/* 본문 스켈레톤 - 8줄 */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* 구분선 */}
        <Skeleton className="my-6 h-px w-full" />

        {/* 액션 버튼 스켈레톤 */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </article>
    </div>
  );
}
