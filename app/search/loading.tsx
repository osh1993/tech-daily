import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsGridSkeleton } from '@/components/common/NewsCardSkeleton';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 타이틀 스켈레톤 */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* 검색 필터 스켈레톤 */}
        <div className="mb-8 rounded-lg border p-6">
          <div className="mb-4 flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* 검색 결과 안내 */}
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
            <Skeleton className="mx-auto mb-2 h-6 w-48" />
            <Skeleton className="mx-auto h-4 w-64" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
