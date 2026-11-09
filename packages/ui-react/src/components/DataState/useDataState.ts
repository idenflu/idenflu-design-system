import * as React from 'react';

export type DataStatus = 'loading' | 'error' | 'empty' | 'no-results' | 'success';
export interface DataStateOptions<T> {
  load: (signal: AbortSignal) => Promise<readonly T[]>;
  matches: (item: T, query: string) => boolean;
  initialItems?: readonly T[];
}

/** Coordinates requests, retry and filtering without retaining obsolete results. */
export function useDataState<T>({ load, matches, initialItems = [] }: DataStateOptions<T>) {
  const [items, setItems] = React.useState<readonly T[]>(initialItems);
  const [query, setQuery] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const request = React.useRef<AbortController | null>(null);
  React.useEffect(() => () => request.current?.abort(), []);
  const reload = React.useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setPending(true); setError(null);
    try {
      const next = await load(controller.signal);
      if (!controller.signal.aborted) setItems([...next]);
    } catch (reason) {
      if (!controller.signal.aborted) setError(reason ?? new Error('목록을 불러오지 못했습니다.'));
    } finally {
      if (!controller.signal.aborted) { setPending(false); request.current = null; }
    }
  }, [load]);
  const visible = React.useMemo(() => items.filter(item => !query.trim() || matches(item, query.trim())), [items, query, matches]);
  const status: DataStatus = pending ? 'loading' : error !== null ? 'error' : !items.length ? 'empty' : !visible.length ? 'no-results' : 'success';
  return { status, items, visibleItems: visible, query, setQuery, error, reload };
}
