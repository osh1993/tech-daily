'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { SearchFiltersState } from '@/components/search/SearchFilters';
import { NewsGrid } from '@/components/news/NewsGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { News } from '@/lib/types/news';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

// 동적 import로 코드 스플리팅
const SearchFilters = dynamic(
  () => import('@/components/search/SearchFilters').then(mod => ({ default: mod.SearchFilters })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    ),
    ssr: false,
  }
);

export default function SearchPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersState | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  const handleSearch = async (filters: SearchFiltersState) => {
    if (!filters.query.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentFilters(filters);

    try {
      const params = new URLSearchParams({
        q: filters.query,
        limit: String(pagination.limit),
        offset: '0',
      });

      if (filters.sources.length > 0) {
        params.set('source', filters.sources.join(','));
      }

      if (filters.dateFrom) {
        params.set('from', filters.dateFrom.toISOString());
      }

      if (filters.dateTo) {
        params.set('to', filters.dateTo.toISOString());
      }

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('검색에 실패했습니다');
      }

      const data = await response.json();

      if (data.success) {
        // Date 객체로 변환
        const newsData = data.data.map((item: any) => ({
          ...item,
          pubDate: new Date(item.pubDate),
        }));
        setNews(newsData);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || '검색에 실패했습니다');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다');
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!currentFilters || !currentFilters.query.trim() || !pagination.hasMore || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const params = new URLSearchParams({
        q: currentFilters.query,
        limit: String(pagination.limit),
        offset: String(pagination.offset + pagination.limit),
      });

      if (currentFilters.sources.length > 0) {
        params.set('source', currentFilters.sources.join(','));
      }

      if (currentFilters.dateFrom) {
        params.set('from', currentFilters.dateFrom.toISOString());
      }

      if (currentFilters.dateTo) {
        params.set('to', currentFilters.dateTo.toISOString());
      }

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('더 보기에 실패했습니다');
      }

      const data = await response.json();

      if (data.success) {
        const newsData = data.data.map((item: any) => ({
          ...item,
          pubDate: new Date(item.pubDate),
        }));
        setNews((prev) => [...prev, ...newsData]);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Load more error:', err);
      setError(err instanceof Error ? err.message : '더 보기 중 오류가 발생했습니다');
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentFilters, pagination.hasMore, pagination.limit, pagination.offset, isLoadingMore]);

  // 무한 스크롤 훅
  const { observerRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    isLoading: isLoadingMore,
    hasMore: pagination.hasMore,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 타이틀 */}
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <SearchIcon className="h-8 w-8" />
            뉴스 검색
          </h2>
          <p className="mt-2 text-muted-foreground">
            키워드, 출처, 날짜로 뉴스를 검색하세요
          </p>
        </div>

        {/* 검색 필터 */}
        <SearchFilters onSearch={handleSearch} isLoading={isLoading} />

        {/* 검색 결과 */}
        <div className="mt-8">
          {isLoading && !news.length ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-destructive">{error}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  다시 시도해주세요
                </p>
              </div>
            </div>
          ) : !hasSearched ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-muted p-6">
                    <SearchIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-lg font-medium">검색어를 입력해주세요</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  관심있는 기술 뉴스를 찾아보세요
                </p>
              </div>
            </div>
          ) : news.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-muted-foreground">
                  검색 결과가 없습니다
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  다른 키워드로 검색해보세요
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* 검색 결과 헤더 */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  총 <span className="font-semibold">{pagination.total}</span>개의 뉴스
                </p>
              </div>

              {/* 뉴스 그리드 */}
              <NewsGrid news={news} />

              {/* 무한 스크롤 트리거 & 로딩 인디케이터 */}
              {pagination.hasMore && (
                <div ref={observerRef} className="mt-8 flex justify-center py-8">
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>더 많은 검색 결과를 불러오는 중...</span>
                    </div>
                  )}
                </div>
              )}

              {/* 마지막 페이지 메시지 */}
              {!pagination.hasMore && news.length > 0 && (
                <div className="mt-8 flex justify-center py-8 text-sm text-muted-foreground">
                  모든 검색 결과를 불러왔습니다
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
