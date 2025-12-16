import { NextRequest, NextResponse } from 'next/server';
import { getEnabledSources } from '@/lib/rss/sources';
import { parseMultipleFeeds } from '@/lib/rss/parser';
import { getFromCache, setToCache, getNewsCacheKey, getFeedCacheKey } from '@/lib/rss/cache';

/**
 * GET /api/news/[id]
 * 특정 뉴스의 상세 정보 조회
 *
 * @param params - Promise<{ id: string }> 뉴스 ID (Next.js 16+)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'News ID is required' },
        { status: 400 }
      );
    }

    // 개별 뉴스 캐시 확인
    const newsCacheKey = getNewsCacheKey(id);
    const cachedNews = getFromCache(newsCacheKey);

    if (cachedNews && cachedNews.length > 0) {
      return NextResponse.json({
        success: true,
        data: cachedNews[0],
        cached: true,
      });
    }

    // 전체 피드 캐시에서 찾기
    const feedCacheKey = getFeedCacheKey({ limit: 100, offset: 0, source: 'all' });
    let allNews = getFromCache(feedCacheKey);

    // 캐시에 없으면 RSS 피드 파싱
    if (!allNews) {
      const sources = getEnabledSources();
      allNews = await parseMultipleFeeds(sources);
      setToCache(feedCacheKey, allNews);
    }

    // ID로 뉴스 찾기
    const news = allNews.find((item) => item.id === id);

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    // 개별 뉴스 캐시 저장
    setToCache(newsCacheKey, [news]);

    return NextResponse.json({
      success: true,
      data: news,
      cached: false,
    });
  } catch (error) {
    console.error('Error in /api/news/[id]:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
