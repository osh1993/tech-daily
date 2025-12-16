'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getBookmarks,
  addBookmark as addBookmarkToStorage,
  removeBookmark as removeBookmarkFromStorage,
  isBookmarked as checkIsBookmarked,
  getBookmarkedIds,
} from '@/lib/storage/bookmarks';
import { Bookmark } from '@/lib/types/news';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 북마크 목록 로드
  useEffect(() => {
    const loadBookmarks = () => {
      const stored = getBookmarks();
      setBookmarks(stored);
      setBookmarkedIds(stored.map((b) => b.newsId));
      setIsLoading(false);
    };

    loadBookmarks();
  }, []);

  // 북마크 추가
  const addBookmark = useCallback((newsId: string) => {
    addBookmarkToStorage(newsId);
    const updated = getBookmarks();
    setBookmarks(updated);
    setBookmarkedIds(updated.map((b) => b.newsId));
  }, []);

  // 북마크 제거
  const removeBookmark = useCallback((newsId: string) => {
    removeBookmarkFromStorage(newsId);
    const updated = getBookmarks();
    setBookmarks(updated);
    setBookmarkedIds(updated.map((b) => b.newsId));
  }, []);

  // 북마크 토글
  const toggleBookmark = useCallback(
    (newsId: string) => {
      if (bookmarkedIds.includes(newsId)) {
        removeBookmark(newsId);
      } else {
        addBookmark(newsId);
      }
    },
    [bookmarkedIds, addBookmark, removeBookmark]
  );

  // 북마크 여부 확인
  const isBookmarked = useCallback(
    (newsId: string) => {
      return bookmarkedIds.includes(newsId);
    },
    [bookmarkedIds]
  );

  return {
    bookmarks,
    bookmarkedIds,
    isLoading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
  };
}
