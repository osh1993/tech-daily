import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';

export default function NewsNotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          뉴스를 찾을 수 없습니다
        </h1>

        <p className="mb-8 text-muted-foreground">
          요청하신 뉴스가 존재하지 않거나 삭제되었습니다.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/search">검색하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
