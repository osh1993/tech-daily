import { News } from '@/lib/types/news';
import { getPreferences } from '@/lib/storage/preferences';

/**
 * 추천 점수가 포함된 뉴스
 */
export interface ScoredNews extends News {
  score: number;
  matchedKeywords: string[];
  reasons: string[];
}

/**
 * 뉴스 추천 알고리즘
 *
 * 점수 계산:
 * - 키워드 매칭: +10점 (키워드당)
 * - 선호 출처: +5점
 * - 최신성: 최대 +3점 (24시간 이내)
 */
export function recommendNews(allNews: News[]): ScoredNews[] {
  const preferences = getPreferences();

  // 선호도가 없으면 빈 배열 반환
  if (!preferences.keywords.length && !preferences.favoriteSource.length) {
    return [];
  }

  // 읽은 뉴스 제외
  const unreadNews = allNews.filter((news) => !preferences.readNews.includes(news.id));

  // 각 뉴스에 점수 부여
  const scoredNews: ScoredNews[] = unreadNews.map((news) => {
    let score = 0;
    const matchedKeywords: string[] = [];
    const reasons: string[] = [];

    // 1. 키워드 매칭 (제목 + 설명)
    const text = `${news.title} ${news.description}`.toLowerCase();

    preferences.keywords.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    });

    if (matchedKeywords.length > 0) {
      reasons.push(`키워드: ${matchedKeywords.join(', ')}`);
    }

    // 2. 선호 출처
    const sourceId = news.source.name.toLowerCase().replace(/\s+/g, '-');
    if (preferences.favoriteSource.includes(sourceId)) {
      score += 5;
      reasons.push('선호 출처');
    }

    // 3. 최신성 (24시간 이내 최대 3점)
    const hoursAgo = (Date.now() - new Date(news.pubDate).getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 24) {
      const freshnessScore = Math.max(0, 3 - hoursAgo / 8);
      score += freshnessScore;

      if (hoursAgo < 6) {
        reasons.push('최신 뉴스');
      }
    }

    return {
      ...news,
      score,
      matchedKeywords,
      reasons,
    };
  });

  // 점수순 정렬 (높은 점수부터)
  return scoredNews
    .filter((news) => news.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * 상위 N개 추천 뉴스
 */
export function getTopRecommendations(allNews: News[], limit: number = 30): ScoredNews[] {
  const recommendations = recommendNews(allNews);
  return recommendations.slice(0, limit);
}

/**
 * 키워드별 추천 뉴스
 */
export function recommendByKeyword(allNews: News[], keyword: string): News[] {
  const preferences = getPreferences();

  return allNews
    .filter((news) => !preferences.readNews.includes(news.id))
    .filter((news) => {
      const text = `${news.title} ${news.description} ${news.content || ''}`.toLowerCase();
      return text.includes(keyword.toLowerCase());
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

/**
 * 출처별 추천 뉴스
 */
export function recommendBySource(allNews: News[], sourceId: string): News[] {
  const preferences = getPreferences();

  return allNews
    .filter((news) => !preferences.readNews.includes(news.id))
    .filter((news) => {
      const newsSourceId = news.source.name.toLowerCase().replace(/\s+/g, '-');
      return newsSourceId === sourceId;
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

/**
 * 유사 뉴스 추천 (현재 읽고 있는 뉴스와 유사한 뉴스)
 */
export function recommendSimilarNews(
  currentNews: News,
  allNews: News[],
  limit: number = 5
): News[] {
  // 현재 뉴스의 키워드 추출 (간단한 버전: 제목의 단어)
  const keywords = currentNews.title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);

  // 유사도 계산
  const scoredNews = allNews
    .filter((news) => news.id !== currentNews.id)
    .map((news) => {
      let similarity = 0;

      // 같은 출처
      if (news.source.name === currentNews.source.name) {
        similarity += 2;
      }

      // 같은 카테고리
      if (news.category && currentNews.category) {
        const commonCategories = news.category.filter((cat) =>
          currentNews.category?.includes(cat)
        );
        similarity += commonCategories.length;
      }

      // 키워드 매칭
      const newsText = `${news.title} ${news.description}`.toLowerCase();
      keywords.forEach((keyword) => {
        if (newsText.includes(keyword)) {
          similarity += 1;
        }
      });

      return { news, similarity };
    })
    .filter((item) => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((item) => item.news);

  return scoredNews;
}
