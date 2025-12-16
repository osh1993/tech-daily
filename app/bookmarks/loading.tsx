import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsGridSkeleton } from '@/components/common/NewsCardSkeleton';

export default function BookmarksLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 타이틀 스켈레톤 */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* 정렬 옵션 스켈레톤 */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* 북마크 그리드 스켈레톤 */}
        <NewsGridSkeleton count={6} />
      </main>

      <Footer />
    </div>
  );
}
