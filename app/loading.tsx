import { NewsGridSkeleton } from '@/components/common/NewsCardSkeleton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 탭 스켈레톤 */}
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>

        {/* 필터 스켈레톤 */}
        <div className="mb-6 rounded-lg border p-4">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* 결과 개수 스켈레톤 */}
        <div className="mb-6 border-b pb-4">
          <Skeleton className="h-4 w-32" />
        </div>

        {/* 뉴스 그리드 스켈레톤 */}
        <NewsGridSkeleton count={9} />
      </main>

      <Footer />
    </div>
  );
}
