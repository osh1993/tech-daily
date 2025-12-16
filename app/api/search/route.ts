import { NextRequest, NextResponse } from 'next/server';
import { getEnabledSources } from '@/lib/rss/sources';
import { parseMultipleFeeds } from '@/lib/rss/parser';
import { getFromCache, setToCache, getSearchCacheKey, getFeedCacheKey } from '@/lib/rss/cache';
import { News } from '@/lib/types/news';

// Next.js 캐싱 설정 (5분 - 검색은 더 짧게)
export const revalidate = 300;
export const dynamic = 'force-dynamic';

/**
 * GET /api/search
 * 뉴스 검색 API
 *
 * Query Parameters:
 * - q: 검색 키워드 (필수)
 * - source: 출처 필터 (선택, 쉼표로 구분된 소스 ID)
 * - from: 시작 날짜 (선택, ISO 8601 형식)
 * - to: 종료 날짜 (선택, ISO 8601 형식)
 * - limit: 페이지당 항목 수 (기본값: 20)
 * - offset: 시작 위치 (기본값: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const sourceFilter = searchParams.get('source');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // 검색 키워드는 필수
    if (!query || query.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // 검색 캐시 확인
    const cacheKey = getSearchCacheKey(query, {
      source: sourceFilter || undefined,
      from: fromDate || undefined,
      to: toDate || undefined,
      limit,
      offset,
    });
    const cachedResults = getFromCache(cacheKey);

    if (cachedResults) {
      return NextResponse.json({
        success: true,
        data: cachedResults.slice(offset, offset + limit),
        pagination: {
          total: cachedResults.length,
          limit,
          offset,
          hasMore: offset + limit < cachedResults.length,
        },
        cached: true,
      });
    }

    // 전체 피드 가져오기 (캐시 또는 새로 파싱)
    const feedCacheKey = getFeedCacheKey({ limit: 100, offset: 0, source: 'all' });
    let allNews = getFromCache(feedCacheKey);

    if (!allNews) {
      const sources = getEnabledSources();
      allNews = await parseMultipleFeeds(sources);
      setToCache(feedCacheKey, allNews);
    }

    // 검색 필터링
    let filteredNews = allNews;

    // 1. 키워드 검색 (대소문자 무시, 제목 및 설명에서 검색)
    const searchQuery = query.toLowerCase();
    filteredNews = filteredNews.filter((news) => {
      const titleMatch = news.title.toLowerCase().includes(searchQuery);
      const descriptionMatch = news.description.toLowerCase().includes(searchQuery);
      const contentMatch = news.content?.toLowerCase().includes(searchQuery) || false;
      return titleMatch || descriptionMatch || contentMatch;
    });

    // 2. 출처 필터 (쉼표로 구분된 소스 ID)
    if (sourceFilter) {
      const sourceIds = sourceFilter.split(',').map((id) => id.trim());
      filteredNews = filteredNews.filter((news) =>
        sourceIds.some((id) => news.source.name.toLowerCase().includes(id.toLowerCase()))
      );
    }

    // 3. 날짜 범위 필터
    if (fromDate) {
      const from = new Date(fromDate);
      filteredNews = filteredNews.filter((news) => new Date(news.pubDate) >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // 종료일의 끝까지 포함
      filteredNews = filteredNews.filter((news) => new Date(news.pubDate) <= to);
    }

    // 검색 결과 캐시 저장 (5분)
    setToCache(cacheKey, filteredNews, 300);

    // 페이지네이션 적용
    const paginatedResults = filteredNews.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      pagination: {
        total: filteredNews.length,
        limit,
        offset,
        hasMore: offset + limit < filteredNews.length,
      },
      cached: false,
    });
  } catch (error) {
    console.error('Error in /api/search:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search news',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
