'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { NewsGrid } from './NewsGrid';
import { NewsFiltersState } from './NewsFilters';
import { News } from '@/lib/types/news';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Settings, Loader2 } from 'lucide-react';
import { getTopRecommendations, ScoredNews } from '@/lib/recommendation/recommend';
import { getPreferencesStats } from '@/lib/storage/preferences';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import Link from 'next/link';

// 동적 import로 필터 컴포넌트 로드
const NewsFilters = dynamic(
  () => import('./NewsFilters').then(mod => ({ default: mod.NewsFilters })),
  {
    loading: () => (
      <div className="h-12 animate-pulse rounded-lg bg-muted" />
    ),
    ssr: false,
  }
);

const ITEMS_PER_PAGE = 30;

export function FilteredNewsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState<'latest' | 'recommended'>('latest');

  // URL에서 초기 필터 상태 읽기
  const getInitialFilters = useCallback((): NewsFiltersState => {
    const sources = searchParams.get('sources')?.split(',').filter(Boolean) || [];
    const dateFromStr = searchParams.get('from');
    const dateToStr = searchParams.get('to');
    const language = (searchParams.get('lang') as 'ko' | 'en' | 'all') || 'all';

    return {
      sources,
      dateFrom: dateFromStr ? new Date(dateFromStr) : undefined,
      dateTo: dateToStr ? new Date(dateToStr) : undefined,
      language,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<NewsFiltersState>(getInitialFilters());

  // 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/feeds?limit=100');
        if (!response.ok) throw new Error('뉴스 불러오기 실패');

        const data = await response.json();
        if (data.success) {
          const newsData = data.data.map((item: any) => ({
            ...item,
            pubDate: new Date(item.pubDate),
          }));
          setNews(newsData);
        }
      } catch (error) {
        console.error('뉴스 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 필터 적용
  useEffect(() => {
    let filtered = [...news];

    // 출처 필터
    if (filters.sources.length > 0) {
      filtered = filtered.filter((item) =>
        filters.sources.includes(item.source.name.toLowerCase().replace(/\s+/g, '-'))
      );
    }

    // 날짜 필터
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.pubDate);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.pubDate);
        return itemDate <= toDate;
      });
    }

    // 언어 필터 (RSS 소스 기반)
    if (filters.language !== 'all') {
      // 언어별 출처 매핑 (간단한 버전)
      const koreanSources = ['geeknews', '44bits', 'bloter', 'itdonga'];
      const englishSources = ['techcrunch', 'theverge', 'hackernews', 'arstechnica', 'wired'];

      filtered = filtered.filter((item) => {
        const sourceId = item.source.name.toLowerCase().replace(/\s+/g, '-');
        if (filters.language === 'ko') {
          return koreanSources.some((s) => sourceId.includes(s));
        } else {
          return englishSources.some((s) => sourceId.includes(s));
        }
      });
    }

    setFilteredNews(filtered);
  }, [news, filters]);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (newFilters: NewsFiltersState) => {
      setFilters(newFilters);

      // URL 쿼리 파라미터 업데이트
      const params = new URLSearchParams();

      if (newFilters.sources.length > 0) {
        params.set('sources', newFilters.sources.join(','));
      }

      if (newFilters.dateFrom) {
        params.set('from', newFilters.dateFrom.toISOString().split('T')[0]);
      }

      if (newFilters.dateTo) {
        params.set('to', newFilters.dateTo.toISOString().split('T')[0]);
      }

      if (newFilters.language && newFilters.language !== 'all') {
        params.set('lang', newFilters.language);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `/?${queryString}` : '/';

      // URL 업데이트 (페이지 새로고침 없이)
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

  // 추천 뉴스 계산 (메모이제이션)
  const recommendedNews = useMemo(() => {
    if (activeTab !== 'recommended') return [];
    return getTopRecommendations(filteredNews, 30);
  }, [filteredNews, activeTab]);

  // 선호도 통계
  const preferencesStats = useMemo(() => getPreferencesStats(), [activeTab]);

  // 표시할 뉴스 결정
  const allDisplayNews = activeTab === 'recommended' ? recommendedNews : filteredNews;
  const displayNews = allDisplayNews.slice(0, displayedCount);
  const hasMore = displayedCount < allDisplayNews.length;

  // 다음 페이지 로드
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // 부드러운 로딩을 위한 딜레이
    setTimeout(() => {
      setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore]);

  // 무한 스크롤 훅
  const { observerRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    isLoading: isLoadingMore,
    hasMore,
  });

  // 탭이나 필터가 변경되면 표시 개수 초기화
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [activeTab, filteredNews]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* 탭 */}
      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border p-1">
          <Button
            variant={activeTab === 'latest' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('latest')}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            최신
          </Button>
          <Button
            variant={activeTab === 'recommended' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('recommended')}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            추천
            {preferencesStats.hasPreferences && activeTab !== 'recommended' && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {recommendedNews.length}
              </Badge>
            )}
          </Button>
        </div>

        {activeTab === 'recommended' && !preferencesStats.hasPreferences && (
          <Link href="/settings">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              선호도 설정
            </Button>
          </Link>
        )}
      </div>

      {/* 필터 (최신 탭에서만 표시) */}
      {activeTab === 'latest' && (
        <NewsFilters
          onFilterChange={handleFilterChange}
          initialFilters={getInitialFilters()}
        />
      )}

      {/* 결과 개수 */}
      <div className="flex items-center justify-between border-b pb-4">
        <p className="text-sm text-muted-foreground">
          {activeTab === 'recommended' ? '추천' : '전체'}{' '}
          <span className="font-semibold text-foreground">{displayNews.length}</span>
          개의 뉴스
          {allDisplayNews.length > displayNews.length && (
            <span className="ml-2 text-muted-foreground">
              (총 {allDisplayNews.length}개 중)
            </span>
          )}
        </p>
      </div>

      {/* 뉴스 그리드 */}
      {displayNews.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            {activeTab === 'recommended' && !preferencesStats.hasPreferences ? (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-muted p-6">
                    <Sparkles className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-lg font-medium">추천을 시작하려면 설정이 필요해요</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  관심 키워드와 선호 출처를 설정하면<br />
                  맞춤 뉴스를 추천해드립니다
                </p>
                <Link href="/settings">
                  <Button className="mt-6 gap-2">
                    <Settings className="h-4 w-4" />
                    설정하러 가기
                  </Button>
                </Link>
              </>
            ) : activeTab === 'recommended' ? (
              <>
                <p className="text-lg text-muted-foreground">
                  현재 조건에 맞는 추천 뉴스가 없습니다
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  설정을 조정하거나 최신 뉴스를 확인해보세요
                </p>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground">
                  필터 조건에 맞는 뉴스가 없습니다
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  다른 필터를 시도해보세요
                </p>
              </>
            )}
          </div>
        </div>
      ) : activeTab === 'recommended' ? (
        // 추천 뉴스 그리드 (추천 이유 포함)
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(displayNews as ScoredNews[]).map((item) => (
            <div key={item.id} className="relative">
              {item.reasons.length > 0 && (
                <div className="absolute -top-2 left-2 z-10 flex gap-1">
                  {item.reasons.slice(0, 2).map((reason, idx) => (
                    <Badge
                      key={idx}
                      variant="default"
                      className="bg-primary/90 text-xs shadow-sm"
                    >
                      {reason}
                    </Badge>
                  ))}
                </div>
              )}
              <NewsGrid news={[item]} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <NewsGrid news={displayNews} />

          {/* 무한 스크롤 트리거 & 로딩 인디케이터 */}
          {hasMore && (
            <div ref={observerRef} className="flex justify-center py-8">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>더 많은 뉴스를 불러오는 중...</span>
                </div>
              )}
            </div>
          )}

          {/* 마지막 페이지 메시지 */}
          {!hasMore && displayNews.length > 0 && (
            <div className="flex justify-center py-8 text-sm text-muted-foreground">
              모든 뉴스를 불러왔습니다
            </div>
          )}
        </>
      )}
    </div>
  );
}
