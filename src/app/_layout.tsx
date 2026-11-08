import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import { useAppTheme } from '@/theme';

export default function RootLayout() {
  const { scheme, colors } = useAppTheme();

  return (
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
  );
}
