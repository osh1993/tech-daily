'use client';

import { useState, useEffect } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { NewsGrid } from '@/components/news/NewsGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { News } from '@/lib/types/news';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2 } from 'lucide-react';
import { clearAllBookmarks } from '@/lib/storage/bookmarks';

export default function BookmarksPage() {
  const { bookmarks, bookmarkedIds, isLoading } = useBookmarks();
  const [news, setNews] = useState<News[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // 북마크된 뉴스 불러오기
  useEffect(() => {
    const fetchBookmarkedNews = async () => {
      if (bookmarkedIds.length === 0) {
        setNews([]);
        return;
      }

      setIsLoadingNews(true);

      try {
        // 모든 뉴스를 가져온 후 북마크된 것만 필터링
        const response = await fetch('/api/feeds?limit=100');
        if (!response.ok) throw new Error('뉴스 불러오기 실패');

        const data = await response.json();
        if (data.success) {
          const allNews = data.data.map((item: any) => ({
            ...item,
            pubDate: new Date(item.pubDate),
          }));

          // 북마크된 뉴스만 필터링
          const bookmarkedNews = allNews.filter((item: News) =>
            bookmarkedIds.includes(item.id)
          );

          setNews(bookmarkedNews);
        }
      } catch (error) {
        console.error('북마크 뉴스 불러오기 실패:', error);
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchBookmarkedNews();
  }, [bookmarkedIds]);

  // 정렬된 뉴스
  const sortedNews = [...news].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    } else {
      return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
    }
  });

  const handleClearAll = () => {
    if (confirm('모든 북마크를 삭제하시겠습니까?')) {
      clearAllBookmarks();
      setNews([]);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 타이틀 */}
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Bookmark className="h-8 w-8" />
            북마크
          </h2>
          <p className="mt-2 text-muted-foreground">
            저장한 뉴스를 확인하세요
          </p>
        </div>

        {/* 컨트롤 */}
        {news.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                총 <span className="font-semibold">{news.length}</span>개의 북마크
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* 정렬 버튼 */}
              <div className="flex rounded-lg border">
                <Button
                  variant={sortOrder === 'newest' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortOrder('newest')}
                  className="rounded-r-none"
                >
                  최신순
                </Button>
                <Button
                  variant={sortOrder === 'oldest' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortOrder('oldest')}
                  className="rounded-l-none"
                >
                  오래된순
                </Button>
              </div>

              {/* 전체 삭제 버튼 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                전체 삭제
              </Button>
            </div>
          </div>
        )}

        {/* 콘텐츠 */}
        {isLoading || isLoadingNews ? (
          <LoadingSpinner />
        ) : news.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-muted p-6">
                  <Bookmark className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <p className="text-lg font-medium">북마크된 뉴스가 없습니다</p>
              <p className="mt-2 text-sm text-muted-foreground">
                관심있는 뉴스를 북마크에 저장해보세요
              </p>
              <Button asChild className="mt-6">
                <a href="/">뉴스 둘러보기</a>
              </Button>
            </div>
          </div>
        ) : (
          <NewsGrid news={sortedNews} />
        )}
      </main>

      <Footer />
    </div>
  );
}
