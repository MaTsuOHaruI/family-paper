import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useState } from 'react';

import { createQueryClient } from '@/lib/query-client';
import { useAppTheme } from '@/theme';

export default function RootLayout() {
  const { scheme, colors } = useAppTheme();
  // 再レンダリングで QueryClient が作り直されてキャッシュが消えないよう、state で 1 回だけ生成する。
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="documents/[id]" options={{ title: '書類詳細' }} />
          <Stack.Screen name="events/[id]" options={{ title: '予定詳細' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
