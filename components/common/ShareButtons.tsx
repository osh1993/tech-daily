'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Share2,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: 'button' | 'menu';
}

/**
 * 소셜 공유 버튼 컴포넌트
 *
 * @param url - 공유할 URL
 * @param title - 공유할 제목
 * @param variant - 'button': 공유 버튼 + 드롭다운, 'menu': 메뉴 항목만
 */
export function ShareButtons({ url, title, variant = 'button' }: ShareButtonsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // 트위터 또는 페이스북 공유
  const handleShare = (platform: 'twitter' | 'facebook') => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(title);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  // 링크 복사
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast.success('링크가 클립보드에 복사되었습니다');

      setTimeout(() => {
        setLinkCopied(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (error) {
      console.error('링크 복사 실패:', error);
      toast.error('링크 복사에 실패했습니다');
    }
  };

  // 메뉴만 렌더링 (드롭다운 내부용)
  if (variant === 'menu') {
    return (
      <div className="flex min-w-[200px] flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('twitter')}
          className="justify-start gap-2"
        >
          <Twitter className="h-4 w-4" />
          트위터
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('facebook')}
          className="justify-start gap-2"
        >
          <Facebook className="h-4 w-4" />
          페이스북
        </Button>
        <Separator className="my-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="justify-start gap-2"
        >
          {linkCopied ? (
            <>
              <Check className="h-4 w-4" />
              복사됨!
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4" />
              링크 복사
            </>
          )}
        </Button>
      </div>
    );
  }

  // 버튼 + 드롭다운 렌더링
  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          공유
        </Button>

        {/* 공유 메뉴 */}
        {showShareMenu && (
          <div className="animate-scale-in absolute right-0 top-full z-10 mt-2 rounded-lg border bg-background p-2 shadow-lg">
            <ShareButtons url={url} title={title} variant="menu" />
          </div>
        )}
      </div>

      {/* 배경 클릭으로 메뉴 닫기 */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </>
  );
}
