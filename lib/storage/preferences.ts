import { UserPreference } from '@/lib/types/news';

const STORAGE_KEY = 'tech-daily-preferences';

// 기본 선호도 값
const DEFAULT_PREFERENCES: UserPreference = {
  favoriteSource: [],
  keywords: [],
  readNews: [],
  theme: 'light',
};

/**
 * 모든 사용자 선호도 조회
 */
export function getPreferences(): UserPreference {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;

    const preferences = JSON.parse(stored);
    return {
      ...DEFAULT_PREFERENCES,
      ...preferences,
    };
  } catch (error) {
    console.error('선호도 조회 실패:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * 선호도 전체 저장
 */
export function setPreferences(preferences: Partial<UserPreference>): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getPreferences();
    const updated = {
      ...current,
      ...preferences,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('선호도 저장 실패:', error);
  }
}

/**
 * 관심 키워드 설정
 */
export function setKeywords(keywords: string[]): void {
  setPreferences({ keywords });
}

/**
 * 키워드 추가
 */
export function addKeyword(keyword: string): void {
  const prefs = getPreferences();
  if (!prefs.keywords.includes(keyword)) {
    setKeywords([...prefs.keywords, keyword]);
  }
}

/**
 * 키워드 제거
 */
export function removeKeyword(keyword: string): void {
  const prefs = getPreferences();
  setKeywords(prefs.keywords.filter((k) => k !== keyword));
}

/**
 * 선호 출처 설정
 */
export function setFavoriteSources(sources: string[]): void {
  setPreferences({ favoriteSource: sources });
}

/**
 * 선호 출처 추가
 */
export function addFavoriteSource(sourceId: string): void {
  const prefs = getPreferences();
  if (!prefs.favoriteSource.includes(sourceId)) {
    setFavoriteSources([...prefs.favoriteSource, sourceId]);
  }
}

/**
 * 선호 출처 제거
 */
export function removeFavoriteSource(sourceId: string): void {
  const prefs = getPreferences();
  setFavoriteSources(prefs.favoriteSource.filter((s) => s !== sourceId));
}

/**
 * 읽은 뉴스 추가
 */
export function addReadNews(newsId: string): void {
  const prefs = getPreferences();

  // 이미 읽은 뉴스면 중복 방지
  if (prefs.readNews.includes(newsId)) return;

  // 최대 500개까지만 저장 (성능 고려)
  const updatedReadNews = [newsId, ...prefs.readNews].slice(0, 500);

  setPreferences({ readNews: updatedReadNews });
}

/**
 * 특정 뉴스를 읽었는지 확인
 */
export function isNewsRead(newsId: string): boolean {
  const prefs = getPreferences();
  return prefs.readNews.includes(newsId);
}

/**
 * 읽은 뉴스 기록 초기화
 */
export function clearReadNews(): void {
  setPreferences({ readNews: [] });
}

/**
 * 모든 선호도 초기화
 */
export function clearAllPreferences(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('선호도 초기화 실패:', error);
  }
}

/**
 * 선호도 통계
 */
export function getPreferencesStats() {
  const prefs = getPreferences();

  return {
    keywordsCount: prefs.keywords.length,
    favoriteSourcesCount: prefs.favoriteSource.length,
    readNewsCount: prefs.readNews.length,
    hasPreferences: prefs.keywords.length > 0 || prefs.favoriteSource.length > 0,
  };
}
