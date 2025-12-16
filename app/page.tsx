import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FilteredNewsSection } from '@/components/news/FilteredNewsSection';
import { OrganizationSchema, WebSiteSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Tech Daily - 기술 뉴스 애그리게이터',
  description: '한국과 해외의 최신 기술 뉴스를 한 곳에서 확인하세요',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD 구조화된 데이터 */}
      <OrganizationSchema />
      <WebSiteSchema />

      <Header />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 타이틀 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">최신 기술 뉴스</h1>
          <p className="mt-2 text-muted-foreground">
            국내외 주요 기술 매체의 최신 소식을 확인하세요
          </p>
        </div>

        {/* 필터링 가능한 뉴스 섹션 */}
        <FilteredNewsSection />
      </main>

      <Footer />
    </div>
  );
}
