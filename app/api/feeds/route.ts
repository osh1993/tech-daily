import { NextRequest, NextResponse } from 'next/server';
import { getEnabledSources, getSourceById } from '@/lib/rss/sources';
import { parseMultipleFeeds, parseFeed } from '@/lib/rss/parser';
import { getFromCache, setToCache, getFeedCacheKey } from '@/lib/rss/cache';
import { News } from '@/lib/types/news';

// Next.js 캐싱 설정 (15분)
export const revalidate = 900;
export const dynamic = 'force-dynamic'; // 항상 최신 데이터

/**
 * GET /api/feeds
 * 모든 RSS 피드 또는 특정 소스의 피드 조회
 *
 * Query Parameters:
 * - limit: 반환할 뉴스 개수 (기본값: 30)
 * - offset: 페이지네이션 오프셋 (기본값: 0)
 * - source: 특정 RSS 소스 ID (선택사항)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 파싱
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const sourceId = searchParams.get('source');

    // 유효성 검사
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { success: false, error: 'Offset must be non-negative' },
        { status: 400 }
      );
    }

    // 캐시 키 생성
    const cacheKey = getFeedCacheKey({ limit, offset, source: sourceId || 'all' });

    // 캐시 확인
    const cachedNews = getFromCache(cacheKey);
    if (cachedNews) {
      const paginatedNews = cachedNews.slice(offset, offset + limit);
      return NextResponse.json({
        success: true,
        data: paginatedNews,
        pagination: {
          total: cachedNews.length,
          limit,
          offset,
          hasMore: offset + limit < cachedNews.length,
        },
        cached: true,
      });
    }

    // RSS 피드 파싱
    let allNews: News[];

    if (sourceId) {
      // 특정 소스만 조회
      const source = getSourceById(sourceId);
      if (!source) {
        return NextResponse.json(
          { success: false, error: `Source not found: ${sourceId}` },
          { status: 404 }
        );
      }

      if (!source.enabled) {
        return NextResponse.json(
          { success: false, error: `Source is disabled: ${sourceId}` },
          { status: 400 }
        );
      }

      allNews = await parseFeed(source);
    } else {
      // 모든 활성화된 소스 조회
      const sources = getEnabledSources();
      if (sources.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No enabled RSS sources found' },
          { status: 500 }
        );
      }

      allNews = await parseMultipleFeeds(sources);
    }

    // 캐시에 저장
    setToCache(cacheKey, allNews);

    // 페이지네이션 적용
    const paginatedNews = allNews.slice(offset, offset + limit);

    // 응답
    return NextResponse.json({
      success: true,
      data: paginatedNews,
      pagination: {
        total: allNews.length,
        limit,
        offset,
        hasMore: offset + limit < allNews.length,
      },
      cached: false,
    });
  } catch (error) {
    console.error('Error in /api/feeds:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch RSS feeds',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
