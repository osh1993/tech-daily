import { MetadataRoute } from 'next';

/**
 * 동적 사이트맵 생성
 *
 * Next.js가 자동으로 /sitemap.xml로 제공합니다
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // 동적 뉴스 페이지 (최근 100개)
  try {
    const response = await fetch(`${baseUrl}/api/feeds?limit=100`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      const newsPages: MetadataRoute.Sitemap = data.data.map((news: any) => ({
        url: `${baseUrl}/news/${news.id}`,
        lastModified: new Date(news.pubDate),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

      return [...staticPages, ...newsPages];
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // 뉴스를 가져오지 못한 경우 정적 페이지만 반환
  return staticPages;
}
