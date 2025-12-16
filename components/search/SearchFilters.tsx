'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Search, X, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { RSS_SOURCES } from '@/lib/rss/sources';

export interface SearchFiltersState {
  query: string;
  sources: string[];
  dateFrom?: Date;
  dateTo?: Date;
}

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersState) => void;
  initialFilters?: Partial<SearchFiltersState>;
  isLoading?: boolean;
}

export function SearchFilters({
  onSearch,
  initialFilters,
  isLoading = false,
}: SearchFiltersProps) {
  const [query, setQuery] = useState(initialFilters?.query || '');
  const [selectedSources, setSelectedSources] = useState<string[]>(
    initialFilters?.sources || []
  );
  const [dateFrom, setDateFrom] = useState<Date | undefined>(initialFilters?.dateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(initialFilters?.dateTo);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({
      query,
      sources: selectedSources,
      dateFrom,
      dateTo,
    });
  };

  const handleReset = () => {
    setQuery('');
    setSelectedSources([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    onSearch({
      query: '',
      sources: [],
      dateFrom: undefined,
      dateTo: undefined,
    });
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
    selectedSources.length > 0 || dateFrom !== undefined || dateTo !== undefined;

  return (
    <div className="space-y-4">
      {/* 검색 입력 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            뉴스 검색
          </label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-input"
            type="text"
            placeholder="뉴스 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="pl-10"
            aria-label="뉴스 검색 입력"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
          검색
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          필터
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 px-1">
              {selectedSources.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* 활성 필터 뱃지 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedSources.map((sourceId) => {
            const source = RSS_SOURCES.find((s) => s.id === sourceId);
            return (
              <Badge key={sourceId} variant="secondary" className="gap-1">
                {source?.name || sourceId}
                <button
                  onClick={() => removeSource(sourceId)}
                  className="ml-1 rounded-full hover:bg-muted"
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
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset}>
            전체 초기화
          </Button>
        </div>
      )}

      {/* 필터 패널 */}
      {showFilters && (
        <div className="animate-slide-down rounded-lg border bg-muted/50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* 출처 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">출처</label>
              <div className="custom-scrollbar max-h-48 space-y-2 overflow-y-auto rounded-md border bg-background p-2">
                {RSS_SOURCES.map((source) => (
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
                    <span className="text-sm">{source.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {source.language === 'ko' ? '한국어' : 'English'}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* 날짜 범위 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">날짜 범위</label>
              <div className="space-y-2">
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
                      disabled={(date) =>
                        dateFrom ? date < dateFrom : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* 필터 적용 버튼 */}
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              필터 적용
            </Button>
            <Button variant="outline" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
