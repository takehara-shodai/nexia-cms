import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// キャッシュの設定
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // キャッシュの有効期限（5分）
      staleTime: 1000 * 60 * 5,
      // エラー時の再試行回数
      retry: 1,
      // コンポーネントがアンマウントされてもキャッシュは維持
      gcTime: 1000 * 60 * 10,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
