'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { X, Calendar as CalendarIcon, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { RSS_SOURCES } from '@/lib/rss/sources';

export interface NewsFiltersState {
  sources: string[];
  dateFrom?: Date;
  dateTo?: Date;
  language?: 'ko' | 'en' | 'all';
}

interface NewsFiltersProps {
  onFilterChange: (filters: NewsFiltersState) => void;
  initialFilters?: Partial<NewsFiltersState>;
}

export function NewsFilters({
  onFilterChange,
  initialFilters,
}: NewsFiltersProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(
    initialFilters?.sources || []
  );
  const [dateFrom, setDateFrom] = useState<Date | undefined>(initialFilters?.dateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(initialFilters?.dateTo);
  const [language, setLanguage] = useState<'ko' | 'en' | 'all'>(
    initialFilters?.language || 'all'
  );
  const [showFilters, setShowFilters] = useState(false);

  // 필터 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onFilterChange({
      sources: selectedSources,
      dateFrom,
      dateTo,
      language,
    });
  }, [selectedSources, dateFrom, dateTo, language, onFilterChange]);

  const handleReset = () => {
    setSelectedSources([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setLanguage('all');
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const removeSource = (sourceId: string) => {
    setSelectedSources((prev) => prev.filter((id) => id !== sourceId));
  };

  const hasActiveFilters =
    selectedSources.length > 0 ||
    dateFrom !== undefined ||
    dateTo !== undefined ||
    language !== 'all';

  const activeFilterCount =
    selectedSources.length +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (language !== 'all' ? 1 : 0);

  // 언어별로 필터링된 소스
  const filteredSources =
    language === 'all'
      ? RSS_SOURCES
      : RSS_SOURCES.filter((source) => source.language === language);

  return (
    <div className="space-y-4">
      {/* 필터 토글 버튼 */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          필터
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showFilters ? 'rotate-180' : ''
            }`}
          />
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            전체 초기화
          </Button>
        )}
      </div>

      {/* 활성 필터 뱃지 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {language !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              언어: {language === 'ko' ? '한국어' : 'English'}
              <button
                onClick={() => setLanguage('all')}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label="언어 필터 제거"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedSources.map((sourceId) => {
            const source = RSS_SOURCES.find((s) => s.id === sourceId);
            return (
              <Badge key={sourceId} variant="secondary" className="gap-1">
                {source?.name || sourceId}
                <button
                  onClick={() => removeSource(sourceId)}
                  className="ml-1 rounded-full hover:bg-muted"
                  aria-label={`${source?.name} 필터 제거`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {dateFrom && (
            <Badge variant="secondary" className="gap-1">
              시작: {format(dateFrom, 'PP', { locale: ko })}
              <button
                onClick={() => setDateFrom(undefined)}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label="시작 날짜 제거"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {dateTo && (
            <Badge variant="secondary" className="gap-1">
              종료: {format(dateTo, 'PP', { locale: ko })}
              <button
                onClick={() => setDateTo(undefined)}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label="종료 날짜 제거"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* 필터 패널 */}
      {showFilters && (
        <div className="animate-slide-down rounded-lg border bg-muted/50 p-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* 언어 필터 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">언어</label>
              <div className="flex gap-2">
                <Button
                  variant={language === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('all')}
                  className="flex-1"
                >
                  전체
                </Button>
                <Button
                  variant={language === 'ko' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('ko')}
                  className="flex-1"
                >
                  한국어
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className="flex-1"
                >
                  English
                </Button>
              </div>
            </div>

            {/* 출처 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                출처 {selectedSources.length > 0 && `(${selectedSources.length})`}
              </label>
              <div className="custom-scrollbar max-h-48 space-y-2 overflow-y-auto rounded-md border bg-background p-2">
                {filteredSources.length === 0 ? (
                  <p className="p-2 text-sm text-muted-foreground">
                    선택한 언어에 해당하는 출처가 없습니다
                  </p>
                ) : (
                  filteredSources.map((source) => (
                    <label
                      key={source.id}
                      className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={() => toggleSource(source.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="flex-1 text-sm">{source.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {source.category}
                      </Badge>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* 날짜 범위 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">날짜 범위</label>
              <div className="space-y-2">
                {/* 빠른 선택 */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setDateFrom(today);
                      setDateTo(undefined);
                    }}
                  >
                    오늘
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const weekAgo = new Date(today);
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      setDateFrom(weekAgo);
                      setDateTo(today);
                    }}
                  >
                    이번 주
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const monthAgo = new Date(today);
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      setDateFrom(monthAgo);
                      setDateTo(today);
                    }}
                  >
                    이번 달
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDateFrom(undefined);
                      setDateTo(undefined);
                    }}
                  >
                    전체
                  </Button>
                </div>

                {/* 시작 날짜 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? (
                        format(dateFrom, 'PPP', { locale: ko })
                      ) : (
                        <span className="text-muted-foreground">시작 날짜</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>

                {/* 종료 날짜 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? (
                        format(dateTo, 'PPP', { locale: ko })
                      ) : (
                        <span className="text-muted-foreground">종료 날짜</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      locale={ko}
                      disabled={(date) => (dateFrom ? date < dateFrom : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
