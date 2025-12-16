'use client';

import { useState, useEffect } from 'react';
import { News } from '@/lib/types/news';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { addReadNews } from '@/lib/storage/preferences';
import { ShareButtons } from '@/components/common/ShareButtons';
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';

interface NewsDetailProps {
  news: News;
}

export function NewsDetail({ news }: NewsDetailProps) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [bookmarked, setBookmarked] = useState(false);

  // 북마크 상태 동기화
  useEffect(() => {
    setBookmarked(isBookmarked(news.id));
  }, [news.id, isBookmarked]);

  // 읽은 뉴스로 기록 (페이지 로드 시 1회)
  useEffect(() => {
    // 3초 후에 읽은 것으로 간주 (빠른 이탈 제외)
    const timer = setTimeout(() => {
      addReadNews(news.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [news.id]);

  const handleBookmark = () => {
    toggleBookmark(news.id);
    setBookmarked(!bookmarked);
  };

  return (
    <article className="mx-auto max-w-3xl">
      {/* 썸네일 이미지 */}
      {news.thumbnail && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
          />
        </div>
      )}

      {/* 헤더 */}
      <header className="mb-6">
        {/* 카테고리 뱃지 */}
        {news.category && news.category.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {news.category.map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* 제목 */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {news.title}
        </h1>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {/* 출처 */}
          <div className="flex items-center gap-2">
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
          </div>

          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={news.pubDate.toISOString()}>
              {format(news.pubDate, 'PPP', { locale: ko })}
            </time>
          </div>

          {/* 작성자 */}
          {news.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{news.author}</span>
            </div>
          )}
        </div>
      </header>

      <Separator className="my-6" />

      {/* 본문 */}
      <div className="prose prose-neutral dark:prose-invert mb-8 max-w-none">
        {news.content ? (
          <div dangerouslySetInnerHTML={{ __html: news.content }} />
        ) : (
          <p className="whitespace-pre-wrap text-base leading-relaxed">
            {news.description}
          </p>
        )}
      </div>

      <Separator className="my-6" />

      {/* 액션 버튼 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 왼쪽: 원문 보기 */}
        <Button asChild size="lg" className="gap-2">
          <a href={news.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            원문 보기
          </a>
        </Button>

        {/* 오른쪽: 북마크 & 공유 */}
        <div className="flex items-center gap-2">
          {/* 북마크 버튼 */}
          <Button
            variant={bookmarked ? 'default' : 'outline'}
            size="lg"
            onClick={handleBookmark}
            className="gap-2"
          >
            {bookmarked ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                북마크됨
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                북마크
              </>
            )}
          </Button>

          {/* 공유 버튼 */}
          <ShareButtons url={news.link} title={news.title} />
        </div>
      </div>

    </article>
  );
}
