'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Sparkles,
  Trash2,
  RefreshCcw,
  X,
  Plus,
} from 'lucide-react';
import {
  getPreferences,
  setKeywords,
  setFavoriteSources,
  clearAllPreferences,
  clearReadNews,
} from '@/lib/storage/preferences';
import { clearAllBookmarks } from '@/lib/storage/bookmarks';
import { toast } from 'sonner';

// RSS 소스 목록 (FilteredNewsSection과 동일)
const AVAILABLE_SOURCES = [
  { id: 'geeknews', name: 'GeekNews', language: 'ko' },
  { id: '44bits', name: '44BITS', language: 'ko' },
  { id: 'bloter', name: 'Bloter', language: 'ko' },
  { id: 'itdonga', name: 'IT동아', language: 'ko' },
  { id: 'techcrunch', name: 'TechCrunch', language: 'en' },
  { id: 'theverge', name: 'The Verge', language: 'en' },
  { id: 'hackernews', name: 'Hacker News', language: 'en' },
  { id: 'arstechnica', name: 'Ars Technica', language: 'en' },
  { id: 'wired', name: 'Wired', language: 'en' },
];

export default function SettingsPage() {
  // 관심 키워드 상태
  const [keywords, setKeywordsState] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  // 선호 출처 상태
  const [favoriteSources, setFavoriteSourcesState] = useState<string[]>([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    const prefs = getPreferences();
    setKeywordsState(prefs.keywords);
    setFavoriteSourcesState(prefs.favoriteSource);
    setIsLoading(false);
  }, []);

  // 키워드 추가
  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (!trimmed) {
      toast.error('키워드를 입력해주세요');
      return;
    }

    if (keywords.includes(trimmed)) {
      toast.error('이미 추가된 키워드입니다');
      return;
    }

    const newKeywords = [...keywords, trimmed];
    setKeywordsState(newKeywords);
    setKeywords(newKeywords);
    setKeywordInput('');
    toast.success(`"${trimmed}" 키워드가 추가되었습니다`);
  };

  // 키워드 제거
  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter((k) => k !== keyword);
    setKeywordsState(newKeywords);
    setKeywords(newKeywords);
    toast.success(`"${keyword}" 키워드가 제거되었습니다`);
  };

  // 출처 토글
  const handleToggleSource = (sourceId: string) => {
    const newSources = favoriteSources.includes(sourceId)
      ? favoriteSources.filter((s) => s !== sourceId)
      : [...favoriteSources, sourceId];

    setFavoriteSourcesState(newSources);
    setFavoriteSources(newSources);
    toast.success('선호 출처가 업데이트되었습니다');
  };

  // 전체 선택/해제
  const handleToggleAllSources = () => {
    if (favoriteSources.length === AVAILABLE_SOURCES.length) {
      // 전체 해제
      setFavoriteSourcesState([]);
      setFavoriteSources([]);
      toast.success('모든 출처가 해제되었습니다');
    } else {
      // 전체 선택
      const allIds = AVAILABLE_SOURCES.map((s) => s.id);
      setFavoriteSourcesState(allIds);
      setFavoriteSources(allIds);
      toast.success('모든 출처가 선택되었습니다');
    }
  };

  // 북마크 전체 삭제
  const handleClearBookmarks = () => {
    if (!confirm('모든 북마크를 삭제하시겠습니까?')) return;
    clearAllBookmarks();
    toast.success('모든 북마크가 삭제되었습니다');
  };

  // 읽은 뉴스 기록 삭제
  const handleClearReadNews = () => {
    if (!confirm('읽은 뉴스 기록을 삭제하시겠습니까?')) return;
    clearReadNews();
    toast.success('읽은 뉴스 기록이 삭제되었습니다');
  };

  // 설정 전체 초기화
  const handleResetSettings = () => {
    if (!confirm('모든 설정을 초기화하시겠습니까? (북마크, 키워드, 선호 출처, 읽은 뉴스 기록이 모두 삭제됩니다)')) return;
    clearAllPreferences();
    clearAllBookmarks();
    setKeywordsState([]);
    setFavoriteSourcesState([]);
    toast.success('모든 설정이 초기화되었습니다');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold">설정</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          개인화 추천을 위한 선호도를 설정하세요
        </p>
      </div>

      {/* 1. 관심 키워드 */}
      <section className="mb-8 rounded-lg border p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">관심 키워드</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          관심 있는 기술이나 주제를 추가하면 관련 뉴스를 추천해드립니다
        </p>

        {/* 키워드 입력 */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="예: React, AI, TypeScript..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
            />
          </div>
          <Button onClick={handleAddKeyword} className="gap-2">
            <Plus className="h-4 w-4" />
            추가
          </Button>
        </div>

        {/* 키워드 목록 */}
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="gap-1 px-3 py-1.5 text-sm"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            아직 추가된 키워드가 없습니다
          </div>
        )}
      </section>

      <Separator className="my-8" />

      {/* 2. 선호 출처 */}
      <section className="mb-8 rounded-lg border p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">선호 출처</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAllSources}
          >
            {favoriteSources.length === AVAILABLE_SOURCES.length
              ? '전체 해제'
              : '전체 선택'}
          </Button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          선호하는 뉴스 출처를 선택하면 해당 출처의 뉴스를 더 많이 추천합니다
        </p>

        {/* 한국어 출처 */}
        <div className="mb-6">
          <Label className="mb-3 block text-sm font-medium">
            한국어 뉴스
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {AVAILABLE_SOURCES.filter((s) => s.language === 'ko').map(
              (source) => (
                <div
                  key={source.id}
                  className="flex items-center space-x-2 rounded-lg border p-3"
                >
                  <Checkbox
                    id={source.id}
                    checked={favoriteSources.includes(source.id)}
                    onCheckedChange={() => handleToggleSource(source.id)}
                  />
                  <label
                    htmlFor={source.id}
                    className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {source.name}
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        {/* 영어 출처 */}
        <div>
          <Label className="mb-3 block text-sm font-medium">
            English News
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {AVAILABLE_SOURCES.filter((s) => s.language === 'en').map(
              (source) => (
                <div
                  key={source.id}
                  className="flex items-center space-x-2 rounded-lg border p-3"
                >
                  <Checkbox
                    id={source.id}
                    checked={favoriteSources.includes(source.id)}
                    onCheckedChange={() => handleToggleSource(source.id)}
                  />
                  <label
                    htmlFor={source.id}
                    className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {source.name}
                  </label>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* 3. 데이터 관리 */}
      <section className="mb-8 rounded-lg border border-destructive/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-destructive" />
          <h2 className="text-xl font-semibold">데이터 관리</h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          저장된 데이터를 삭제하거나 설정을 초기화할 수 있습니다
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">북마크 전체 삭제</p>
              <p className="text-sm text-muted-foreground">
                저장한 모든 북마크가 삭제됩니다
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearBookmarks}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">읽은 뉴스 기록 삭제</p>
              <p className="text-sm text-muted-foreground">
                읽은 뉴스 기록이 모두 삭제됩니다
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearReadNews}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-destructive p-4">
            <div>
              <p className="font-medium text-destructive">설정 전체 초기화</p>
              <p className="text-sm text-muted-foreground">
                모든 설정과 데이터가 초기화됩니다 (복구 불가)
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetSettings}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              초기화
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
