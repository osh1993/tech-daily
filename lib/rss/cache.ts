import NodeCache from 'node-cache';
import { News } from '@/lib/types/news';

// 캐시 인스턴스 생성 (TTL: 15분 = 900초)
const cache = new NodeCache({
  stdTTL: 900, // 15분
  checkperiod: 120, // 2분마다 만료된 키 확인
  useClones: false, // 성능 향상을 위해 복제 비활성화
});

/**
 * 캐시 키 생성
 * @param prefix 접두사
 * @param params 파라미터
 * @returns 캐시 키
 */
function generateCacheKey(prefix: string, params?: Record<string, any>): string {
  if (!params) {
    return prefix;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join('|');

  return `${prefix}:${sortedParams}`;
}

/**
 * 캐시에서 뉴스 데이터 조회
 * @param key 캐시 키
 * @returns 캐시된 뉴스 배열 또는 undefined
 */
export function getFromCache(key: string): News[] | undefined {
  try {
    const cached = cache.get<News[]>(key);
    if (cached) {
      console.log(`Cache hit: ${key}`);
      return cached;
    }
    console.log(`Cache miss: ${key}`);
    return undefined;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return undefined;
  }
}

/**
 * 뉴스 데이터를 캐시에 저장
 * @param key 캐시 키
 * @param data 저장할 뉴스 배열
 * @param ttl 유효기간 (초, 선택사항)
 * @returns 저장 성공 여부
 */
export function setToCache(key: string, data: News[], ttl?: number): boolean {
  try {
    const success = cache.set(key, data, ttl || 900);
    if (success) {
      console.log(`Cache set: ${key} (${data.length} items)`);
    }
    return success;
  } catch (error) {
    console.error('Error writing to cache:', error);
    return false;
  }
}

/**
 * 캐시에서 특정 키 삭제
 * @param key 삭제할 캐시 키
 * @returns 삭제된 항목 개수
 */
export function deleteFromCache(key: string): number {
  try {
    const deleted = cache.del(key);
    if (deleted > 0) {
      console.log(`Cache deleted: ${key}`);
    }
    return deleted;
  } catch (error) {
    console.error('Error deleting from cache:', error);
    return 0;
  }
}

/**
 * 전체 캐시 초기화
 */
export function clearCache(): void {
  try {
    cache.flushAll();
    console.log('Cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * 캐시 통계 정보 조회
 * @returns 캐시 통계
 */
export function getCacheStats() {
  return cache.getStats();
}

/**
 * RSS 피드 전체를 위한 캐시 키 생성
 * @param params 쿼리 파라미터
 * @returns 캐시 키
 */
export function getFeedCacheKey(params?: {
  limit?: number;
  offset?: number;
  source?: string;
}): string {
  return generateCacheKey('feeds', params);
}

/**
 * 특정 뉴스를 위한 캐시 키 생성
 * @param newsId 뉴스 ID
 * @returns 캐시 키
 */
export function getNewsCacheKey(newsId: string): string {
  return `news:${newsId}`;
}

/**
 * 검색 결과를 위한 캐시 키 생성
 * @param query 검색 쿼리
 * @param params 추가 파라미터
 * @returns 캐시 키
 */
export function getSearchCacheKey(
  query: string,
  params?: Record<string, any>
): string {
  return generateCacheKey('search', { q: query, ...params });
}
