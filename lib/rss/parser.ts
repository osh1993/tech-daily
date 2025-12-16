import Parser from 'rss-parser';
import { nanoid } from 'nanoid';
import { News, NewsSource, RSSFeedConfig } from '@/lib/types/news';

// RSS 파서 인스턴스 생성
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['content:encoded', 'content:encoded'],
      ['description', 'description'],
    ],
  },
});

/**
 * RSS 피드를 파싱하여 News 배열로 변환
 * @param feedConfig RSS 피드 설정
 * @returns News 배열
 */
export async function parseFeed(feedConfig: RSSFeedConfig): Promise<News[]> {
  try {
    const feed = await parser.parseURL(feedConfig.url);

    if (!feed.items || feed.items.length === 0) {
      console.warn(`No items found in feed: ${feedConfig.name}`);
      return [];
    }

    const newsItems: News[] = feed.items.map((item) => {
      // 썸네일 이미지 추출
      const thumbnail = extractThumbnail(item);

      // 뉴스 소스 정보
      const source: NewsSource = {
        name: feedConfig.name,
        url: feedConfig.url,
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(feedConfig.url).hostname}`,
      };

      // RSS item을 any로 타입 단언 (동적 필드 접근)
      const rssItem = item as any;

      // News 객체 생성
      const news: News = {
        id: nanoid(),
        title: item.title || '제목 없음',
        description: cleanDescription(item.contentSnippet || item.description || ''),
        content: rssItem['content:encoded'] || item.content || item.description,
        link: item.link || '',
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        source,
        thumbnail,
        author: rssItem.creator || rssItem.author || undefined,
        category: item.categories || [feedConfig.category],
      };

      return news;
    });

    return newsItems;
  } catch (error) {
    console.error(`Error parsing feed ${feedConfig.name}:`, error);
    throw new Error(`Failed to parse RSS feed: ${feedConfig.name}`);
  }
}

/**
 * 여러 RSS 피드를 파싱하여 통합된 News 배열 반환
 * @param feedConfigs RSS 피드 설정 배열
 * @returns 통합된 News 배열 (발행일 기준 내림차순 정렬)
 */
export async function parseMultipleFeeds(
  feedConfigs: RSSFeedConfig[]
): Promise<News[]> {
  try {
    // 모든 피드를 병렬로 파싱
    const results = await Promise.allSettled(
      feedConfigs.map((config) => parseFeed(config))
    );

    // 성공한 결과만 추출
    const allNews: News[] = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => (result as PromiseFulfilledResult<News[]>).value);

    // 실패한 피드 로깅
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `Failed to parse feed ${feedConfigs[index].name}:`,
          result.reason
        );
      }
    });

    // 발행일 기준 내림차순 정렬 (최신 뉴스가 먼저)
    return allNews.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
  } catch (error) {
    console.error('Error parsing multiple feeds:', error);
    throw error;
  }
}

/**
 * RSS 아이템에서 썸네일 이미지 URL 추출
 * @param item RSS 아이템
 * @returns 썸네일 URL 또는 undefined
 */
function extractThumbnail(item: any): string | undefined {
  // media:content 확인
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }

  // media:thumbnail 확인
  if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url;
  }

  // enclosure 확인 (일반적인 RSS 2.0)
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  // content에서 첫 번째 이미지 추출
  const content = item['content:encoded'] || item.content || item.description || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  return undefined;
}

/**
 * 설명 텍스트에서 HTML 태그 제거 및 정리
 * @param description 원본 설명
 * @returns 정리된 설명
 */
function cleanDescription(description: string): string {
  // HTML 태그 제거
  let cleaned = description.replace(/<[^>]*>/g, '');

  // HTML 엔티티 디코딩
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // 연속된 공백 제거
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 최대 길이 제한 (300자)
  if (cleaned.length > 300) {
    cleaned = cleaned.substring(0, 297) + '...';
  }

  return cleaned;
}
