import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  title: {
    default: "Tech Daily - 기술 뉴스 애그리게이터",
    template: "%s - Tech Daily",
  },
  description: "한국과 해외의 최신 기술 뉴스를 한 곳에서 확인하세요. TechCrunch, The Verge, GeekNews 등 주요 기술 매체의 RSS 피드를 실시간으로 수집합니다.",
  keywords: [
    "기술 뉴스",
    "IT 뉴스",
    "테크 뉴스",
    "개발자 뉴스",
    "프로그래밍",
    "스타트업",
    "Tech News",
    "RSS 피드",
    "뉴스 애그리게이터",
  ],
  authors: [{ name: "Tech Daily" }],
  creator: "Tech Daily",
  publisher: "Tech Daily",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: "Tech Daily - 기술 뉴스 애그리게이터",
    description: "한국과 해외의 최신 기술 뉴스를 한 곳에서 확인하세요",
    siteName: "Tech Daily",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Daily - 기술 뉴스 애그리게이터",
    description: "한국과 해외의 최신 기술 뉴스를 한 곳에서 확인하세요",
    creator: "@techdaily",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console 인증 코드 (나중에 추가)
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
