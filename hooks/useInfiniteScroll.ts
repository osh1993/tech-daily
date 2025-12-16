import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /** 다음 페이지를 로드하는 함수 */
  onLoadMore: () => void;
  /** 현재 로딩 중인지 여부 */
  isLoading: boolean;
  /** 더 이상 로드할 데이터가 없는지 여부 */
  hasMore: boolean;
  /** Intersection Observer의 threshold (0~1) */
  threshold?: number;
  /** 트리거 요소와의 거리 (px) */
  rootMargin?: string;
}

/**
 * 무한 스크롤을 위한 커스텀 훅
 *
 * @example
 * ```tsx
 * const { observerRef } = useInfiniteScroll({
 *   onLoadMore: () => fetchNextPage(),
 *   isLoading: loading,
 *   hasMore: hasNextPage,
 * });
 *
 * return (
 *   <>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={observerRef} />
 *   </>
 * );
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;

      // 화면에 트리거 요소가 보이고, 로딩 중이 아니며, 더 로드할 데이터가 있을 때
      if (target.isIntersecting && !isLoading && hasMore) {
        onLoadMore();
      }
    },
    [isLoading, hasMore, onLoadMore]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver, threshold, rootMargin]);

  return { observerRef };
}
