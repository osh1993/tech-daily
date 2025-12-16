import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* 헤더 스켈레톤 */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-32" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* 관심 키워드 섹션 스켈레톤 */}
        <div className="mb-8 rounded-lg border p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-4 h-5 w-full" />
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>

        <Skeleton className="my-8 h-px w-full" />

        {/* 선호 출처 섹션 스켈레톤 */}
        <div className="mb-8 rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="mb-4 h-5 w-full" />

          {/* 체크박스 스켈레톤 */}
          <div className="mb-6">
            <Skeleton className="mb-3 h-5 w-24" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="mb-3 h-5 w-32" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        <Skeleton className="my-8 h-px w-full" />

        {/* 데이터 관리 섹션 스켈레톤 */}
        <div className="mb-8 rounded-lg border p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-6 h-5 w-full" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
