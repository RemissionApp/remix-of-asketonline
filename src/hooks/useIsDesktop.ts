import { useEffect, useState } from 'react';

export function useIsDesktop(query = '(min-width: 1024px)') {
  const [is, setIs] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const m = window.matchMedia(query);
    const fn = (e: MediaQueryListEvent) => setIs(e.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, [query]);
  return is;
}
