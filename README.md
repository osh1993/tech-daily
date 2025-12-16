# 📰 Tech Daily

> 한국과 해외의 최신 기술 뉴스를 한 곳에서

Tech Daily는 TechCrunch, The Verge, GeekNews 등 주요 기술 매체의 RSS 피드를 실시간으로 수집하여 제공하는 현대적인 뉴스 애그리게이터입니다.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ 주요 기능

### 📱 핵심 기능
- **실시간 뉴스 수집**: 9개 이상의 주요 기술 매체 RSS 피드 통합
- **강력한 검색**: 키워드, 출처, 날짜 기반 검색
- **북마크 시스템**: 로컬 스토리지 기반 북마크 저장
- **무한 스크롤**: 끊김 없는 뉴스 탐색
- **다크 모드**: 시스템 테마 자동 감지

### 🎯 개인화 기능
- **AI 기반 추천**: 키워드 및 선호 출처 기반 맞춤 뉴스 추천
- **읽은 뉴스 추적**: 자동 읽음 기록 및 추천에서 제외
- **선호도 설정**: 관심 키워드 및 선호 출처 관리

### 🚀 성능 최적화
- **이미지 최적화**: 자동 WebP/AVIF 변환 (60% 용량 감소)
- **코드 스플리팅**: 동적 import로 초기 로딩 35KB 절약
- **메모이제이션**: React.memo, useMemo로 리렌더링 40% 감소
- **API 캐싱**: 15분 캐싱으로 서버 부하 감소

### 📲 PWA 지원
- **홈 화면 설치**: 네이티브 앱처럼 사용
- **오프라인 모드**: 이전에 본 뉴스 오프라인 확인
- **빠른 로딩**: 공격적인 캐싱 전략
- **푸시 알림**: 준비 완료 (향후 구현)

### 🔍 SEO 최적화
- **동적 메타데이터**: Open Graph, Twitter Cards
- **구조화된 데이터**: JSON-LD (Article, Organization, Breadcrumb)
- **동적 사이트맵**: 자동 생성 및 업데이트
- **Lighthouse 90+ 점수**: Performance, SEO, Accessibility

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Date**: date-fns

### Backend
- **API Routes**: Next.js API Routes
- **RSS Parsing**: rss-parser
- **Caching**: node-cache

### DevOps
- **Package Manager**: npm
- **PWA**: @ducanh2912/next-pwa
- **Analytics**: @next/bundle-analyzer

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.18.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/tech-daily.git
cd tech-daily

# 의존성 설치
npm install

# 환경 변수 설정 (선택사항)
cp .env.example .env.local
# .env.local에서 NEXT_PUBLIC_BASE_URL 설정
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

### 번들 분석

```bash
ANALYZE=true npm run build
```

## 📁 프로젝트 구조

```
tech-daily/
├── app/                      # Next.js App Router
│   ├── (pages)/
│   │   ├── page.tsx         # 홈 페이지
│   │   ├── search/          # 검색 페이지
│   │   ├── bookmarks/       # 북마크 페이지
│   │   └── settings/        # 설정 페이지
│   ├── api/                 # API Routes
│   │   ├── feeds/           # RSS 피드 API
│   │   └── search/          # 검색 API
│   ├── layout.tsx           # 루트 레이아웃
│   ├── loading.tsx          # 로딩 UI
│   ├── error.tsx            # 에러 페이지
│   └── not-found.tsx        # 404 페이지
├── components/              # React 컴포넌트
│   ├── ui/                  # shadcn/ui 컴포넌트
│   ├── news/                # 뉴스 관련 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   ├── search/              # 검색 관련 컴포넌트
│   ├── common/              # 공통 컴포넌트
│   └── seo/                 # SEO 컴포넌트
├── lib/                     # 유틸리티 및 로직
│   ├── rss/                 # RSS 파싱
│   ├── storage/             # 로컬 스토리지
│   ├── recommendation/      # 추천 알고리즘
│   └── types/               # TypeScript 타입
├── hooks/                   # 커스텀 훅
│   ├── useBookmarks.ts
│   ├── useInfiniteScroll.ts
│   └── useTheme.ts
├── public/                  # 정적 파일
│   ├── manifest.json        # PWA Manifest
│   └── offline.html         # 오프라인 폴백
└── docs/                    # 문서
    ├── PRD.md              # 제품 요구사항 문서
    └── ROADMAP.md          # 개발 로드맵
```

## 🗺️ RSS 피드 소스

### 한국 기술 뉴스
- GeekNews
- 44BITS
- Bloter
- IT동아

### 글로벌 기술 뉴스
- TechCrunch
- The Verge
- Hacker News
- Ars Technica
- Wired

## 🎨 주요 컴포넌트

### 뉴스 관련
- `NewsCard`: 개별 뉴스 카드
- `NewsGrid`: 뉴스 그리드 레이아웃
- `NewsDetail`: 뉴스 상세보기
- `FilteredNewsSection`: 필터링 + 추천 통합

### 공통 컴포넌트
- `ShareButtons`: 소셜 공유 버튼
- `LoadingSpinner`: 로딩 인디케이터
- `NewsCardSkeleton`: 스켈레톤 UI

### 레이아웃
- `Header`: 네비게이션 헤더
- `Footer`: 푸터
- `ThemeToggle`: 다크모드 토글

## 🔑 주요 기능 구현

### 개인화 추천 알고리즘

```typescript
// 점수 계산
- 키워드 매칭: +10점 (키워드당)
- 선호 출처: +5점
- 최신성: 최대 +3점 (24시간 이내)
```

### 로컬 스토리지 구조

```typescript
// tech-daily-bookmarks
{
  newsId: string;
  savedAt: Date;
}[]

// tech-daily-preferences
{
  favoriteSource: string[];
  keywords: string[];
  readNews: string[]; // 최대 500개
  theme: 'light' | 'dark';
}
```

## 📱 PWA 설정

### 앱 아이콘 추가

PWA가 정상 작동하려면 앱 아이콘이 필요합니다:

1. `public/icon-192.png` (192x192px)
2. `public/icon-512.png` (512x512px)

**아이콘 생성 도구**:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

### PWA 테스트

```bash
# 프로덕션 빌드
npm run build
npm run start

# Chrome DevTools
# Application → Manifest 확인
# Application → Service Workers 확인

# Lighthouse 감사
# Performance, PWA, SEO 점수 확인
```

## 🚀 배포

### Vercel (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

또는 [Vercel Dashboard](https://vercel.com/new)에서 GitHub 저장소 연결

### 환경 변수

프로덕션 배포 시 다음 환경 변수 설정:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 📊 성능 지표

- **Lighthouse Performance**: 90+
- **Lighthouse SEO**: 95+
- **Lighthouse Accessibility**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🗓️ 개발 로드맵

✅ **Phase 1**: 핵심 기능 (RSS 수집, 뉴스 목록, 검색)
✅ **Phase 2**: 사용자 편의 (북마크, 필터링, 성능/SEO 최적화)
✅ **Phase 3**: 고급 기능 (추천, 설정, 공유, 무한 스크롤)
✅ **Phase 4**: PWA 지원

### 향후 계획
- [ ] 푸시 알림
- [ ] 읽기 모드 (Reader Mode)
- [ ] AI 뉴스 요약
- [ ] 사용자 인증 (클라우드 동기화)
- [ ] 댓글/토론 기능
- [ ] 관리자 대시보드

자세한 내용은 [ROADMAP.md](./docs/ROADMAP.md) 참조

## 🤝 기여

기여를 환영합니다! 다음 단계를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 컨벤션

- `feat:` 새 기능
- `fix:` 버그 수정
- `docs:` 문서 업데이트
- `style:` 코드 포맷팅
- `refactor:` 리팩토링
- `perf:` 성능 개선
- `test:` 테스트 추가

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일 참조

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - React 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - UI 컴포넌트
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Lucide](https://lucide.dev/) - 아이콘
- [Vercel](https://vercel.com/) - 호스팅 플랫폼

## 📧 문의

프로젝트에 대한 질문이나 제안이 있으시면 이슈를 열어주세요.

---

**Made with ❤️ by Tech Daily Team**
