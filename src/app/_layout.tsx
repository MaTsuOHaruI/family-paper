import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="documents/[id]" options={{ title: '書類詳細' }} />
        <Stack.Screen name="events/[id]" options={{ title: '予定詳細' }} />
      </Stack>
    </ThemeProvider>
  );
}
