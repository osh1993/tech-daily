# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 16 기반의 TypeScript 프로젝트입니다. App Router 패턴을 사용하며, Tailwind CSS 4와 shadcn/ui로 구성되어 있습니다.

## 주요 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# shadcn/ui 컴포넌트 추가
npx shadcn-ui@latest add [component-name]
```

## 코드 아키텍처

### 라우팅 패턴
- **App Router** 사용 (Next.js 13+의 폴더 기반 라우팅)
- 새 페이지 생성: `app/[route]/page.tsx`
- API 엔드포인트: `app/api/[route]/route.ts`
- 레이아웃 시스템: `app/layout.tsx`가 모든 페이지를 감쌈

### 컴포넌트 구조
- **React Server Components가 기본값**입니다
- 클라이언트 컴포넌트가 필요한 경우 `'use client'` 지시어 사용
- shadcn/ui 컴포넌트는 `components/ui/` 디렉토리에 저장됨

### 스타일링
- **Tailwind CSS 4** 사용 (PostCSS 플러그인 방식)
- `app/globals.css`의 CSS 변수로 디자인 토큰 관리
- `.dark` 클래스로 다크 모드 지원
- `lib/utils.ts`의 `cn()` 함수로 조건부 클래스명 병합

### 경로 별칭
TypeScript 경로 별칭 (`@/*`)이 설정되어 있습니다:
```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCustomHook } from '@/hooks/useCustomHook'
```

## 주요 기술 스택

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19.2.1
- **Styling**: Tailwind CSS 4
- **Component Library**: shadcn/ui (New York 스타일)
- **Icons**: lucide-react
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## shadcn/ui 설정

`components.json`에 다음과 같이 구성되어 있습니다:
- 스타일: "new-york"
- RSC (React Server Components) 활성화
- 컴포넌트 경로: `@/components/ui`
- 유틸리티 경로: `@/lib/utils`

## 개발 시 참고사항

### Server Actions 사용
폼 처리나 데이터 변경 시 Server Actions 활용:
```typescript
'use server'

export async function createItem(formData: FormData) {
  // 서버 측 로직
}
```

### 테마 커스터마이징
`app/globals.css`의 CSS 변수를 수정하여 전역 테마 조정:
- `--background`, `--foreground`: 배경/전경색
- `--primary`, `--secondary`: 주요 색상
- `--radius`: 전역 border-radius

### 유틸리티 함수
`lib/utils.ts`의 `cn()` 함수는 클래스명을 스마트하게 병합합니다:
```typescript
cn('text-base', condition && 'text-lg', 'font-bold')
```
