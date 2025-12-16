import { RSSFeedConfig } from '@/lib/types/news';

export const RSS_SOURCES: RSSFeedConfig[] = [
  // 한국 기술 뉴스
  {
    id: 'geeknews',
    name: 'GeekNews',
    url: 'https://news.hada.io/rss',
    language: 'ko',
    category: '기술',
    enabled: true,
  },
  {
    id: '44bits',
    name: '44BITS',
    url: 'https://www.44bits.io/ko/blog/rss',
    language: 'ko',
    category: 'DevOps',
    enabled: true,
  },
  {
    id: 'bloter',
    name: '블로터',
    url: 'https://www.bloter.net/feed/',
    language: 'ko',
    category: 'IT뉴스',
    enabled: true,
  },

  // 글로벌 기술 뉴스
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    language: 'en',
    category: '스타트업',
    enabled: true,
  },
  {
    id: 'theverge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    language: 'en',
    category: '기술',
    enabled: true,
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    language: 'en',
    category: '과학기술',
    enabled: true,
  },
  {
    id: 'wired',
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    language: 'en',
    category: '기술',
    enabled: true,
  },
];

// 활성화된 RSS 소스만 반환
export function getEnabledSources(): RSSFeedConfig[] {
  return RSS_SOURCES.filter(source => source.enabled);
}

// ID로 RSS 소스 찾기
export function getSourceById(id: string): RSSFeedConfig | undefined {
  return RSS_SOURCES.find(source => source.id === id);
}

// 언어별 RSS 소스 필터링
export function getSourcesByLanguage(language: 'ko' | 'en'): RSSFeedConfig[] {
  return RSS_SOURCES.filter(source => source.language === language && source.enabled);
}
