'use client';

import { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { News } from '@/lib/types/news';
import { Bookmark, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  news: News;
  onBookmark?: (newsId: string) => void;
  isBookmarked?: boolean;
}

function NewsCardComponent({ news, onBookmark, isBookmarked = false }: NewsCardProps) {
  // 상대적 시간 포맷 (메모이제이션)
  const timeAgo = useMemo(
    () =>
      formatDistanceToNow(new Date(news.pubDate), {
        addSuffix: true,
        locale: ko,
      }),
    [news.pubDate]
  );

  // 북마크 핸들러 (메모이제이션)
  const handleBookmarkClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onBookmark?.(news.id);
    },
    [news.id, onBookmark]
  );

  return (
    <Card className="group animate-fade-in overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
      {/* 썸네일 이미지 */}
      {news.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
          />
        </div>
      )}

      <CardHeader className="space-y-2 pb-3">
        {/* 카테고리 뱃지 */}
        {news.category && news.category.length > 0 && (
          <div className="flex gap-2">
            {news.category.slice(0, 2).map((cat, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* 제목 - 최대 2줄 */}
        <Link
          href={`/news/${news.id}`}
          className="group/title"
          aria-label={`${news.title} - 상세보기`}
        >
          <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight transition-colors group-hover/title:text-primary">
            {news.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="pb-3">
        {/* 요약 - 최대 3줄 */}
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {news.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-3">
        {/* 출처 및 발행일 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {news.source.favicon && (
            <Image
              src={news.source.favicon}
              alt={news.source.name}
              width={16}
              height={16}
              className="rounded"
              loading="lazy"
            />
          )}
          <span className="font-medium">{news.source.name}</span>
          <span>•</span>
          <time dateTime={news.pubDate.toString()}>{timeAgo}</time>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2">
          {/* 북마크 버튼 */}
          <button
            onClick={handleBookmarkClick}
            className="rounded-full p-2 transition-colors hover:bg-muted"
            aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
          >
            <Bookmark
              className={`h-4 w-4 ${
                isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'
              }`}
            />
          </button>

          {/* 원문 링크 */}
          <Link
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition-colors hover:bg-muted"
            aria-label="원문 보기"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

// React.memo로 최적화 (props가 변경될 때만 리렌더링)
export const NewsCard = memo(NewsCardComponent, (prevProps, nextProps) => {
  // 뉴스 ID, 북마크 상태가 같으면 리렌더링 방지
  return (
    prevProps.news.id === nextProps.news.id &&
    prevProps.isBookmarked === nextProps.isBookmarked &&
    prevProps.onBookmark === nextProps.onBookmark
  );
});
