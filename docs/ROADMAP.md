# Tech Daily 개발 로드맵

**프로젝트명**: Tech Daily - 기술 뉴스 애그리게이터
**문서 버전**: 1.0
**최종 업데이트**: 2025-12-15

---

## 📋 목차

1. [전체 일정 개요](#-전체-일정-개요)
2. [0단계: 사전 준비](#-0단계-사전-준비)
3. [1단계: 핵심 기능 개발](#-1단계-핵심-기능-개발-mvp)
4. [2단계: 사용자 편의 기능](#-2단계-사용자-편의-기능)
5. [3단계: 고급 기능](#-3단계-고급-기능)
6. [배포 및 운영](#-배포-및-운영)
7. [향후 개선 계획](#-향후-개선-계획)

---

## 📅 전체 일정 개요

### 개발 기간
- **0단계**: 환경 설정 (1일)
- **1단계**: 핵심 기능 개발 (2주, 10일)
- **2단계**: 사용자 편의 기능 (2주, 10일)
- **3단계**: 고급 기능 (2주, 10일)
- **총 기간**: 약 6주

### 단계별 주요 목표

| 단계 | 목표 | 주요 기능 |
|------|------|----------|
| **0단계** | 개발 환경 구축 | 프로젝트 설정, 의존성 설치 |
| **1단계** | 기본 뉴스 서비스 | RSS 수집, 뉴스 목록, 상세보기, 검색 |
| **2단계** | 사용 편의성 개선 | 북마크, 필터링, 다크모드, 성능 최적화 |
| **3단계** | 개인화 및 고급 기능 | 추천 시스템, 설정, 소셜 공유, 무한 스크롤 |

---

## 🚀 0단계: 사전 준비

**소요 시간**: 1일
**목표**: 개발에 필요한 모든 환경을 준비합니다

### ✅ 할 일 목록

#### 1. 프로젝트 초기 설정
- [x] Next.js 16 프로젝트 생성
- [x] TypeScript 설정 완료
- [x] Tailwind CSS 4 설정
- [x] shadcn/ui 초기화

#### 2. 필수 패키지 설치

**RSS 및 데이터 처리**:
```bash
npm install rss-parser      # RSS 피드 파싱
npm install date-fns        # 날짜 포맷팅
npm install node-cache      # 캐싱
npm install nanoid          # 고유 ID 생성
```

**상태 관리 (선택사항)**:
```bash
npm install zustand         # 가벼운 상태 관리
```

**개발 도구**:
```bash
npm install -D prettier eslint-plugin-prettier
npm install -D @types/node-cache
```

#### 3. 폴더 구조 생성

```
tech-daily/
├── app/                      # Next.js 앱 라우터
│   ├── layout.tsx           # 전체 레이아웃
│   ├── page.tsx             # 홈 페이지
│   ├── news/[id]/           # 뉴스 상세
│   ├── bookmarks/           # 북마크 페이지
│   ├── search/              # 검색 페이지
│   ├── settings/            # 설정 페이지
│   └── api/                 # API 라우트
│       ├── feeds/           # RSS 피드 API
│       ├── news/[id]/       # 뉴스 상세 API
│       └── search/          # 검색 API
│
├── components/              # 재사용 컴포넌트
│   ├── ui/                  # shadcn/ui 컴포넌트
│   ├── news/                # 뉴스 관련 컴포넌트
│   │   ├── NewsCard.tsx
│   │   ├── NewsList.tsx
│   │   ├── NewsDetail.tsx
│   │   └── NewsGrid.tsx
│   ├── layout/              # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── search/              # 검색 관련
│   │   ├── SearchBar.tsx
│   │   └── FilterPanel.tsx
│   └── common/              # 공통 컴포넌트
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       └── EmptyState.tsx
│
├── lib/                     # 유틸리티 및 로직
│   ├── utils.ts
│   ├── rss/                 # RSS 관련
│   │   ├── parser.ts        # RSS 파싱
│   │   ├── sources.ts       # RSS 소스 목록
│   │   └── cache.ts         # 캐싱 로직
│   ├── storage/             # 로컬 스토리지
│   │   ├── bookmarks.ts
│   │   ├── preferences.ts
│   │   └── history.ts
│   └── types/
│       └── news.ts          # 타입 정의
│
├── hooks/                   # 커스텀 훅
│   ├── useBookmarks.ts
│   ├── useNews.ts
│   ├── useSearch.ts
│   └── useTheme.ts
│
└── public/                  # 정적 파일
    └── favicons/
```

#### 4. 타입 정의 작성

**파일**: `lib/types/news.ts`

```typescript
// 뉴스 데이터 타입
export interface News {
  id: string;                    // 고유 ID
  title: string;                 // 제목
  description: string;           // 요약
  content?: string;              // 전체 내용
  link: string;                  // 원문 링크
  pubDate: Date;                 // 발행일
  source: NewsSource;            // 출처 정보
  thumbnail?: string;            // 썸네일 이미지
  author?: string;               // 저자
  category?: string[];           // 카테고리
}

// 뉴스 출처 정보
export interface NewsSource {
  name: string;                  // 출처명 (예: "TechCrunch")
  url: string;                   // 출처 URL
  favicon?: string;              // 파비콘
}

// 북마크 데이터
export interface Bookmark {
  newsId: string;                // 북마크한 뉴스 ID
  savedAt: Date;                 // 저장 시간
}

// 사용자 설정
export interface UserPreference {
  favoriteSource: string[];      // 선호 출처
  keywords: string[];            // 관심 키워드
  readNews: string[];            // 읽은 뉴스 기록
  theme: 'light' | 'dark';       // 테마
}

// RSS 피드 설정
export interface RSSFeedConfig {
  id: string;                    // 피드 ID
  name: string;                  // 피드 이름
  url: string;                   // RSS URL
  language: 'ko' | 'en';         // 언어
  category: string;              // 카테고리
  enabled: boolean;              // 활성화 여부
}
```

---

## 📦 1단계: 핵심 기능 개발 (MVP)

**소요 시간**: 2주 (10일)
**목표**: 사용자가 뉴스를 읽을 수 있는 기본 기능을 완성합니다

### 🎯 1주차: RSS 수집 및 뉴스 목록

#### 1일-3일차: RSS 피드 수집 시스템 구축

**[작업 1] RSS 소스 설정**

파일: `lib/rss/sources.ts`

```typescript
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
];
```

체크리스트:
- [ ] RSS 소스 설정 파일 생성
- [ ] 한국 뉴스 3개 이상 추가
- [ ] 글로벌 뉴스 3개 이상 추가
- [ ] 카테고리 분류 완료

**[작업 2] RSS 파서 구현**

파일: `lib/rss/parser.ts`

체크리스트:
- [ ] `rss-parser` 라이브러리 설정
- [ ] RSS 피드 파싱 함수 작성
- [ ] 파싱 에러 처리
- [ ] News 타입으로 데이터 변환
- [ ] 썸네일 이미지 추출
- [ ] 날짜 포맷팅 (date-fns 사용)

**[작업 3] 캐싱 시스템**

파일: `lib/rss/cache.ts`

체크리스트:
- [ ] node-cache 설정 (유효기간 15분)
- [ ] 캐시 저장 함수
- [ ] 캐시 조회 함수
- [ ] 캐시 무효화 함수

**[작업 4] API 라우트 작성**

파일: `app/api/feeds/route.ts`

기능:
- `GET /api/feeds` - 모든 RSS 피드 조회
- 쿼리 파라미터: `limit`, `offset`, `source`

체크리스트:
- [ ] API 기본 구조 작성
- [ ] 모든 RSS 소스 순회하며 파싱
- [ ] 발행일 기준 정렬
- [ ] 페이지네이션 구현
- [ ] 에러 응답 처리

응답 예시:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1234",
      "title": "Next.js 16 출시",
      "description": "새로운 기능 소개...",
      "link": "https://...",
      "pubDate": "2025-12-15T10:00:00Z",
      "source": {
        "name": "TechCrunch",
        "url": "https://techcrunch.com"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 30,
    "offset": 0
  }
}
```

#### 4일-6일차: 뉴스 목록 화면

**[작업 1] UI 컴포넌트 설치**

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add button
npx shadcn-ui@latest add badge
```

**[작업 2] 뉴스 카드 컴포넌트**

파일: `components/news/NewsCard.tsx`

구현 내용:
- 썸네일 이미지 (Next.js Image 컴포넌트)
- 제목 (최대 2줄, 말줄임표)
- 요약 (최대 3줄, 말줄임표)
- 출처 및 발행일
- 북마크 버튼
- 호버 효과 (그림자, 확대)

체크리스트:
- [ ] 카드 레이아웃 구현
- [ ] 이미지 최적화 적용
- [ ] 텍스트 말줄임 처리
- [ ] 반응형 디자인
- [ ] 접근성 (키보드 네비게이션)

**[작업 3] 뉴스 그리드**

파일: `components/news/NewsGrid.tsx`

체크리스트:
- [ ] CSS Grid 레이아웃
- [ ] 반응형 열 개수 (모바일 1, 태블릿 2, 데스크톱 3)
- [ ] 간격 설정
- [ ] 빈 상태 처리

**[작업 4] 로딩 스켈레톤**

파일: `components/common/LoadingSpinner.tsx`

체크리스트:
- [ ] 스켈레톤 카드 컴포넌트
- [ ] 애니메이션 효과
- [ ] 그리드 배치

**[작업 5] 홈 페이지**

파일: `app/page.tsx`

체크리스트:
- [ ] 서버 컴포넌트로 데이터 페칭
- [ ] 뉴스 그리드 렌더링
- [ ] 로딩 상태 (loading.tsx)
- [ ] 에러 처리
- [ ] 메타데이터 설정

### 🎯 2주차: 상세 페이지 및 검색

#### 7일-8일차: 뉴스 상세 페이지

**[작업 1] 상세 API**

파일: `app/api/news/[id]/route.ts`

체크리스트:
- [ ] ID로 뉴스 조회
- [ ] 캐시 확인
- [ ] 404 에러 처리

**[작업 2] 상세 컴포넌트**

파일: `components/news/NewsDetail.tsx`

구현 내용:
- 상단 썸네일
- 제목 (H1)
- 메타 정보 (출처, 날짜, 저자)
- 본문 내용
- "원문 보기" 버튼
- 북마크 버튼
- 소셜 공유 버튼

체크리스트:
- [ ] 읽기 편한 타이포그래피
- [ ] 본문 너비 제한 (최대 768px)
- [ ] 외부 링크 안전 처리
- [ ] 반응형 디자인

**[작업 3] 상세 페이지**

파일: `app/news/[id]/page.tsx`

체크리스트:
- [ ] 동적 라우팅 처리
- [ ] SSR로 데이터 페칭
- [ ] 동적 메타데이터 (SEO)
- [ ] 관련 뉴스 섹션 (3-5개)

#### 9일-10일차: 검색 기능

**[작업 1] 검색 API**

파일: `app/api/search/route.ts`

쿼리 파라미터:
- `q`: 검색어
- `source`: 출처 필터
- `dateFrom`, `dateTo`: 날짜 범위

체크리스트:
- [ ] 검색어 파라미터 검증
- [ ] 제목/요약에서 키워드 검색
- [ ] 필터 적용
- [ ] 결과 반환

**[작업 2] 검색 바**

파일: `components/search/SearchBar.tsx`

체크리스트:
- [ ] 입력 필드 구현
- [ ] 검색 아이콘
- [ ] 디바운싱 (300ms)
- [ ] 엔터키 처리
- [ ] 자동완성 UI (선택)

**[작업 3] 검색 결과 페이지**

파일: `app/search/page.tsx`

체크리스트:
- [ ] URL 쿼리로 검색어 전달
- [ ] 검색 API 호출
- [ ] 결과를 그리드로 표시
- [ ] 검색 결과 개수 표시
- [ ] 빈 결과 화면

#### 11일-12일차: 반응형 디자인 완성

**브레이크포인트**:
- 모바일: 768px 미만
- 태블릿: 768px - 1024px
- 데스크톱: 1024px 이상

체크리스트:
- [ ] 헤더 네비게이션 반응형
- [ ] 그리드 열 개수 조정
- [ ] 폰트 크기 조정
- [ ] 이미지 반응형
- [ ] 버튼 크기 조정
- [ ] 모바일 메뉴 (선택)

**테스트**:
- [ ] Chrome DevTools 테스트
- [ ] 실제 모바일 기기 테스트
- [ ] 다양한 화면 크기 확인

### ✅ 1단계 완료 기준

**기능 확인**:
- [ ] 뉴스 목록이 표시됩니다
- [ ] 뉴스를 클릭하면 상세 페이지로 이동합니다
- [ ] 검색이 작동합니다
- [ ] 모든 디바이스에서 정상 작동합니다

**성능 확인**:
- [ ] Lighthouse Performance 70점 이상
- [ ] 페이지 로딩 2초 이내
- [ ] 이미지 lazy loading 작동

**배포**:
- [ ] Vercel에 배포
- [ ] 프로덕션 URL 확인

---

## 🎨 2단계: 사용자 편의 기능

**소요 시간**: 2주 (10일)
**목표**: 사용자 경험을 개선하고 성능을 최적화합니다

### 🎯 1주차: 북마크 및 필터링

#### 1일-3일차: 북마크 기능

**[작업 1] 로컬 스토리지 관리**

파일: `lib/storage/bookmarks.ts`

함수 목록:
```typescript
export function getBookmarks(): Bookmark[];           // 북마크 목록 조회
export function addBookmark(newsId: string): void;    // 북마크 추가
export function removeBookmark(newsId: string): void; // 북마크 제거
export function isBookmarked(newsId: string): boolean;// 북마크 여부 확인
```

체크리스트:
- [ ] 로컬 스토리지 CRUD 함수
- [ ] JSON 직렬화/역직렬화
- [ ] 에러 처리
- [ ] 타입 안전성

**[작업 2] 북마크 훅**

파일: `hooks/useBookmarks.ts`

체크리스트:
- [ ] 상태 관리
- [ ] 추가/제거 함수
- [ ] 리렌더링 최적화

**[작업 3] 북마크 UI**

체크리스트:
- [ ] 카드에 북마크 아이콘 추가
- [ ] 상태에 따라 아이콘 변경 (빈 하트 ↔ 꽉 찬 하트)
- [ ] 클릭 애니메이션
- [ ] 토스트 알림 (선택)

**[작업 4] 북마크 페이지**

파일: `app/bookmarks/page.tsx`

체크리스트:
- [ ] 북마크 목록 조회
- [ ] 그리드로 표시
- [ ] 빈 상태 UI
- [ ] 북마크 제거 기능
- [ ] 정렬 옵션

#### 4일-5일차: 필터링 시스템

**[작업 1] UI 컴포넌트 설치**

```bash
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add popover
```

**[작업 2] 필터 패널**

파일: `components/search/FilterPanel.tsx`

필터 종류:
- 출처별 필터 (체크박스)
- 날짜 범위 (오늘, 이번 주, 이번 달, 전체)
- 언어 (한국어, 영어, 전체)

체크리스트:
- [ ] 필터 UI 구현
- [ ] 필터 상태 관리 (URL 쿼리)
- [ ] 필터 리셋 버튼
- [ ] 결과 개수 표시

**[작업 3] UI 통합**

체크리스트:
- [ ] 홈 페이지에 필터 추가
- [ ] 검색 페이지에 필터 추가
- [ ] 모바일: 드로어 (선택)
- [ ] 데스크톱: 사이드바

### 🎯 2주차: 다크모드 및 성능 최적화

#### 6일-7일차: 다크모드

**[작업 1] 테마 시스템**

```bash
npx shadcn-ui@latest add dropdown-menu
npm install next-themes
```

체크리스트:
- [ ] next-themes 설정
- [ ] 테마 프로바이더
- [ ] 로컬 스토리지 저장
- [ ] 시스템 테마 감지

**[작업 2] 컬러 스키마**

파일: `app/globals.css`

체크리스트:
- [ ] 라이트 모드 CSS 변수
- [ ] 다크 모드 CSS 변수
- [ ] 모든 컴포넌트 적용
- [ ] 이미지 다크모드 처리

**[작업 3] 테마 토글**

파일: `components/layout/ThemeToggle.tsx`

체크리스트:
- [ ] 토글 버튼 구현
- [ ] 아이콘 (태양/달)
- [ ] 헤더에 배치
- [ ] 드롭다운 메뉴 (라이트/다크/시스템)

#### 8일-10일차: 성능 최적화

**[작업 1] 이미지 최적화**

체크리스트:
- [ ] Next.js Image 컴포넌트 사용
- [ ] WebP 포맷 지원
- [ ] Lazy loading
- [ ] 적절한 이미지 크기
- [ ] Placeholder blur

**[작업 2] 코드 스플리팅**

체크리스트:
- [ ] 동적 import 적용
- [ ] 번들 크기 분석

**[작업 3] 캐싱**

체크리스트:
- [ ] RSS 피드 캐싱 (15분)
- [ ] API Route 캐싱
- [ ] Next.js 캐싱 설정
- [ ] CDN 캐싱 (Vercel)

**[작업 4] 렌더링 최적화**

체크리스트:
- [ ] Server Components 활용
- [ ] Client Components 최소화
- [ ] memo, useMemo, useCallback 사용
- [ ] 불필요한 리렌더링 방지

**[작업 5] 성능 측정**

체크리스트:
- [ ] Lighthouse 90점 이상
- [ ] Web Vitals 측정
- [ ] 번들 크기 확인

#### 11일-12일차: SEO 최적화

**[작업 1] 메타데이터**

체크리스트:
- [ ] 홈 페이지 메타데이터
- [ ] 상세 페이지 동적 메타데이터
- [ ] Open Graph 태그
- [ ] Twitter Card
- [ ] Favicon

**[작업 2] 구조화된 데이터**

체크리스트:
- [ ] JSON-LD 스키마
- [ ] Article 스키마
- [ ] Organization 스키마
- [ ] BreadcrumbList

**[작업 3] 사이트맵 및 Robots**

파일: `app/sitemap.ts`, `app/robots.ts`

체크리스트:
- [ ] sitemap.xml 생성
- [ ] robots.txt 설정
- [ ] Google Search Console 준비

**[작업 4] 접근성**

체크리스트:
- [ ] 시맨틱 HTML
- [ ] ARIA 레이블
- [ ] 키보드 네비게이션
- [ ] 색상 대비 4.5:1 이상
- [ ] 스크린 리더 테스트

### ✅ 2단계 완료 기준

**기능 확인**:
- [ ] 북마크 저장/조회/삭제 작동
- [ ] 필터링 작동
- [ ] 다크모드 전환 작동
- [ ] 성능 개선 체감

**성능 확인**:
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse SEO 90+
- [ ] Lighthouse Accessibility 90+
- [ ] LCP < 2.5초
- [ ] CLS < 0.1

**배포**:
- [ ] Vercel 재배포
- [ ] 기능 테스트
- [ ] 성능 테스트

---

## 🔥 3단계: 고급 기능

**소요 시간**: 2주 (10일)
**목표**: 개인화 및 사용자 경험을 더욱 향상시킵니다

### 🎯 1주차: 개인화 추천

#### 1일-3일차: 추천 시스템

**[작업 1] 사용자 선호도 저장**

파일: `lib/storage/preferences.ts`

함수:
```typescript
export function getPreferences(): UserPreference;
export function setKeywords(keywords: string[]): void;
export function setFavoriteSources(sources: string[]): void;
export function addReadNews(newsId: string): void;
```

체크리스트:
- [ ] 로컬 스토리지 관리
- [ ] 관심 키워드 저장
- [ ] 선호 출처 저장
- [ ] 읽은 뉴스 기록

**[작업 2] 추천 알고리즘**

파일: `lib/recommendation/recommend.ts`

체크리스트:
- [ ] 키워드 매칭
- [ ] 출처 기반 필터링
- [ ] 읽은 뉴스 제외
- [ ] 점수 계산 및 정렬

**[작업 3] 추천 UI**

체크리스트:
- [ ] "추천" 탭 추가
- [ ] "최신" 탭과 전환
- [ ] 추천 이유 표시 (뱃지)
- [ ] 빈 상태 (설정 페이지 안내)

#### 4일-5일차: 설정 페이지

**[작업 1] UI 컴포넌트**

```bash
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add separator
```

**[작업 2] 설정 페이지**

파일: `app/settings/page.tsx`

섹션:
1. **관심 키워드**
   - 키워드 입력
   - 태그 형식 표시
   - 추가/제거

2. **선호 출처**
   - 체크박스 목록
   - 전체 선택/해제

3. **테마 설정**
   - 라이트/다크/시스템

4. **데이터 관리**
   - 북마크 전체 삭제
   - 읽은 뉴스 기록 삭제
   - 설정 초기화

체크리스트:
- [ ] 레이아웃 구현
- [ ] 각 섹션 완성
- [ ] 저장 버튼
- [ ] 토스트 알림
- [ ] 반응형 디자인

### 🎯 2주차: 소셜 공유 및 무한 스크롤

#### 6일-7일차: 소셜 공유

**[작업 1] 공유 컴포넌트**

파일: `components/common/ShareButtons.tsx`

플랫폼:
- 트위터
- 페이스북
- 링크 복사

체크리스트:
- [ ] 트위터 공유 URL
- [ ] 페이스북 공유 URL
- [ ] 클립보드 복사
- [ ] 복사 완료 토스트
- [ ] 아이콘 버튼

**[작업 2] UI 통합**

체크리스트:
- [ ] 상세 페이지에 추가
- [ ] 카드에 추가 (선택)
- [ ] 모바일 반응형

#### 8일-9일차: 무한 스크롤

**[작업 1] Intersection Observer 훅**

파일: `hooks/useInfiniteScroll.ts`

체크리스트:
- [ ] Intersection Observer 설정
- [ ] 트리거 요소 감지
- [ ] 다음 페이지 로드
- [ ] 로딩 상태 관리

**[작업 2] 무한 스크롤 적용**

체크리스트:
- [ ] 홈 페이지에 적용
- [ ] 검색 페이지에 적용
- [ ] 로딩 인디케이터
- [ ] 마지막 페이지 처리
- [ ] 에러 처리

#### 10일-12일차: 에러 처리 개선

**[작업 1] 에러 페이지**

파일: `app/error.tsx`, `app/not-found.tsx`

체크리스트:
- [ ] 전역 에러 페이지
- [ ] 404 페이지
- [ ] 에러 메시지
- [ ] 홈으로 돌아가기 버튼
- [ ] 재시도 버튼

**[작업 2] 로딩 UI**

체크리스트:
- [ ] 페이지별 loading.tsx
- [ ] 스켈레톤 UI 개선
- [ ] 버튼 로딩 상태

**[작업 3] 에러 바운더리**

체크리스트:
- [ ] API 에러 처리
- [ ] 사용자 친화적 메시지
- [ ] 에러 로깅 (선택: Sentry)

**[작업 4] 토스트 알림**

```bash
npx shadcn-ui@latest add toast
```

체크리스트:
- [ ] Toast 시스템 구현
- [ ] 성공/에러/정보 토스트
- [ ] 북마크 알림
- [ ] 설정 저장 알림
- [ ] 링크 복사 알림

### ✅ 3단계 완료 기준

**기능 확인**:
- [ ] 개인화 추천 표시
- [ ] 설정 페이지 작동
- [ ] 소셜 공유 작동
- [ ] 무한 스크롤 작동
- [ ] 에러 페이지 표시
- [ ] 로딩 UI 개선

**사용자 경험**:
- [ ] UX가 부드럽고 직관적
- [ ] 모든 인터랙션에 피드백
- [ ] 에러 상황 적절한 안내

**배포**:
- [ ] Vercel 최종 배포
- [ ] 전체 기능 테스트
- [ ] 프로덕션 환경 확인

---

## 🚀 배포 및 운영

### 배포 준비

**Vercel 배포**:
- [ ] Vercel 프로젝트 생성
- [ ] GitHub 연동
- [ ] 환경 변수 설정
- [ ] 자동 배포 설정
- [ ] 커스텀 도메인 (선택)

**배포 전 체크리스트**:
- [ ] 프로덕션 빌드 (`npm run build`)
- [ ] 환경 변수 확인
- [ ] API Route 테스트
- [ ] 성능 최종 확인

**배포 후 체크리스트**:
- [ ] URL 접속 확인
- [ ] 모든 페이지 동작 확인
- [ ] RSS 피드 수집 확인
- [ ] 이미지 로딩 확인
- [ ] 모바일 테스트

### 모니터링 (선택사항)

**Google Analytics**:
- [ ] GA4 설정
- [ ] Next.js 통합
- [ ] 이벤트 트래킹

**에러 트래킹**:
- [ ] Sentry 설정 (선택)
- [ ] 에러 알림

**성능 모니터링**:
- [ ] Vercel Analytics
- [ ] Web Vitals 모니터링

---

## 🎯 향후 개선 계획

### 우선순위: 보통 (4단계+)

**추가 기능**:
- [ ] PWA 지원 (오프라인 모드, 앱 설치)
- [ ] 사용자 인증 (클라우드 동기화)
- [ ] 댓글/토론 기능
- [ ] RSS 피드 추가 요청
- [ ] 뉴스 요약 AI (OpenAI API)
- [ ] 읽기 모드
- [ ] 카테고리 자동 분류 (ML)

**관리자 기능**:
- [ ] RSS 피드 관리 대시보드
- [ ] 사용자 통계 대시보드
- [ ] 피드 상태 모니터링

**성능 개선**:
- [ ] 서버 측 데이터베이스 (PostgreSQL, MongoDB)
- [ ] Redis 캐싱
- [ ] GraphQL API (선택)

---

## 📝 개발 가이드

### 개발 원칙

1. **점진적 개선**: 각 단계 완료 후 배포 및 테스트
2. **사용자 중심**: 사용자 경험 최우선
3. **성능 우선**: 기능 추가 시 성능 영향 고려
4. **코드 품질**: 린트, 포맷터, 타입 체크
5. **문서화**: 주요 함수에 주석

### Git 브랜치 전략

```
main (프로덕션)
└── develop (개발)
    ├── feature/phase1-rss-api
    ├── feature/phase1-news-ui
    ├── feature/phase2-bookmarks
    └── ...
```

**커밋 메시지**:
- `feat:` 새 기능
- `fix:` 버그 수정
- `style:` 스타일링
- `refactor:` 리팩토링
- `docs:` 문서
- `test:` 테스트

### 자주 쓰는 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint

# shadcn/ui 컴포넌트 추가
npx shadcn-ui@latest add [component-name]

# 번들 크기 분석
npm run build && npx @next/bundle-analyzer
```

---

**문서 작성 완료**

이 로드맵은 개발 상황에 따라 유연하게 조정될 수 있습니다.
각 단계 완료 후 회고를 통해 다음 단계를 개선하세요!
