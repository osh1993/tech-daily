import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsDetail } from '@/components/news/NewsDetail';
import { News } from '@/lib/types/news';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd';

interface NewsPageProps {
  params: {
    id: string;
  };
}

async function getNewsById(id: string): Promise<News | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/news/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      return null;
    }

    // Date 객체로 변환
    return {
      ...result.data,
      pubDate: new Date(result.data.pubDate),
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const news = await getNewsById(params.id);

  if (!news) {
    return {
      title: '뉴스를 찾을 수 없습니다 - Tech Daily',
    };
  }

  return {
    title: `${news.title} - Tech Daily`,
    description: news.description,
    openGraph: {
      title: news.title,
      description: news.description,
      images: news.thumbnail ? [news.thumbnail] : [],
      type: 'article',
      publishedTime: news.pubDate.toISOString(),
      authors: news.author ? [news.author] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.description,
      images: news.thumbnail ? [news.thumbnail] : [],
    },
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const news = await getNewsById(params.id);

  if (!news) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const newsUrl = `${baseUrl}/news/${params.id}`;

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD 구조화된 데이터 */}
      <ArticleSchema
        title={news.title}
        description={news.description}
        image={news.thumbnail}
        datePublished={news.pubDate.toISOString()}
        author={news.author}
        url={newsUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: '홈', url: baseUrl },
          { name: '뉴스', url: `${baseUrl}/` },
          { name: news.title, url: newsUrl },
        ]}
      />

      <Header />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <NewsDetail news={news} />
      </main>

      <Footer />
    </div>
  );
}
