'use client';

import { memo, useCallback } from 'react';
import { News } from '@/lib/types/news';
import { NewsCard } from './NewsCard';
import { useBookmarks } from '@/hooks/useBookmarks';

interface NewsGridProps {
  news: News[];
}

function NewsGridComponent({ news }: NewsGridProps) {
  const { toggleBookmark, isBookmarked } = useBookmarks();

  // 북마크 토글을 메모이제이션
  const handleToggleBookmark = useCallback(
    (newsId: string) => {
      toggleBookmark(newsId);
    },
    [toggleBookmark]
  );

  if (news.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">뉴스가 없습니다</p>
          <p className="mt-2 text-sm text-muted-foreground">
            잠시 후 다시 시도해주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <NewsCard
          key={item.id}
          news={item}
          onBookmark={handleToggleBookmark}
          isBookmarked={isBookmarked(item.id)}
        />
      ))}
    </div>
  );
}

// React.memo로 최적화
export const NewsGrid = memo(NewsGridComponent);
