import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useAppTheme } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function createTabIcon(name: IconName) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    // タブバーから渡される ColorValue は null を含み得るが、Ionicons は null を受け付けない。
    return <Ionicons name={name} size={size} color={color ?? undefined} />;
  };
}

// 描画のたびに新しい部品を作らないよう、アイコンはモジュールレベルで1回だけ作る。
const HomeIcon = createTabIcon('home-outline');
const CalendarIcon = createTabIcon('calendar-outline');
const DocumentsIcon = createTabIcon('folder-open-outline');
const AddDocumentIcon = createTabIcon('add-circle-outline');
const FamilyIcon = createTabIcon('people-outline');

// Q-05: ホーム / カレンダー / 書類 / 登録(中央) / 家族・設定
export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      }}>
      <Tabs.Screen name="index" options={{ title: 'ホーム', tabBarIcon: HomeIcon }} />
      <Tabs.Screen name="calendar" options={{ title: 'カレンダー', tabBarIcon: CalendarIcon }} />
      <Tabs.Screen name="documents" options={{ title: '書類', tabBarIcon: DocumentsIcon }} />
      <Tabs.Screen name="add-document" options={{ title: '登録', tabBarIcon: AddDocumentIcon }} />
      <Tabs.Screen name="family" options={{ title: '家族・設定', tabBarIcon: FamilyIcon }} />
    </Tabs>
  );
}
