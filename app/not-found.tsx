import { Button } from '@/components/ui/button';
import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        {/* 404 아이콘 */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>

        {/* 404 메시지 */}
        <h1 className="mb-2 text-6xl font-bold tracking-tight">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
        <p className="mb-8 text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="gap-2">
            <Link href="/search">
              <Search className="h-4 w-4" />
              뉴스 검색
            </Link>
          </Button>
        </div>

        {/* 추천 링크 */}
        <div className="mt-12 rounded-lg border bg-muted/50 p-6">
          <h3 className="mb-4 text-sm font-medium">다음 페이지를 방문해보세요:</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Link
              href="/"
              className="text-primary hover:underline"
            >
              → 최신 기술 뉴스
            </Link>
            <Link
              href="/bookmarks"
              className="text-primary hover:underline"
            >
              → 북마크한 뉴스
            </Link>
            <Link
              href="/settings"
              className="text-primary hover:underline"
            >
              → 설정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
