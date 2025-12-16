import { Bookmark } from '@/lib/types/news';

const STORAGE_KEY = 'tech-daily-bookmarks';

/**
 * 모든 북마크 조회
 */
export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const bookmarks = JSON.parse(stored);

    // Date 객체로 변환
    return bookmarks.map((bookmark: any) => ({
      ...bookmark,
      savedAt: new Date(bookmark.savedAt),
    }));
  } catch (error) {
    console.error('북마크 조회 실패:', error);
    return [];
  }
}

/**
 * 북마크 추가
 */
export function addBookmark(newsId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const bookmarks = getBookmarks();

    // 이미 북마크된 경우 무시
    if (bookmarks.some((b) => b.newsId === newsId)) {
      return;
    }

    const newBookmark: Bookmark = {
      newsId,
      savedAt: new Date(),
    };

    bookmarks.push(newBookmark);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('북마크 추가 실패:', error);
  }
}

/**
 * 북마크 제거
 */
export function removeBookmark(newsId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter((b) => b.newsId !== newsId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('북마크 제거 실패:', error);
  }
}

/**
 * 북마크 여부 확인
 */
export function isBookmarked(newsId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const bookmarks = getBookmarks();
    return bookmarks.some((b) => b.newsId === newsId);
  } catch (error) {
    console.error('북마크 확인 실패:', error);
    return false;
  }
}

/**
 * 북마크된 뉴스 ID 목록 조회
 */
export function getBookmarkedIds(): string[] {
  return getBookmarks().map((b) => b.newsId);
}

/**
 * 모든 북마크 삭제
 */
export function clearAllBookmarks(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('북마크 전체 삭제 실패:', error);
  }
}
