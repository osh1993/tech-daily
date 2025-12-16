'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 Sentry 등 사용)
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        {/* 에러 아이콘 */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* 에러 메시지 */}
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          오류가 발생했습니다
        </h1>
        <p className="mb-2 text-muted-foreground">
          죄송합니다. 페이지를 로드하는 중에 문제가 발생했습니다.
        </p>

        {/* 개발 환경에서만 에러 상세 정보 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 mt-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-left">
            <p className="mb-1 text-sm font-medium text-destructive">
              개발 모드 에러 정보:
            </p>
            <p className="text-xs text-muted-foreground">{error.message}</p>
            {error.digest && (
              <p className="mt-1 text-xs text-muted-foreground">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="gap-2" size="lg">
            <RefreshCcw className="h-4 w-4" />
            다시 시도
          </Button>
          <Button variant="outline" asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>

        {/* 추가 도움말 */}
        <p className="mt-8 text-sm text-muted-foreground">
          문제가 계속되면 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
        </p>
      </div>
    </div>
  );
}
