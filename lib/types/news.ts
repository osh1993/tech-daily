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
