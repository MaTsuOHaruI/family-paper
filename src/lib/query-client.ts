import { QueryClient } from '@tanstack/react-query';

// サーバー状態（TanStack Query）の既定値。ここ以外で QueryClient を生成しない。
// - staleTime: 画面を行き来するたびに再取得しないための短いキャッシュ。
// - retry: 1 回だけ再試行。認証エラーなどを何度も叩かない。
// - mutations は再試行しない（二重送信の防止。FR の登録系は repository 側で扱う）。
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
