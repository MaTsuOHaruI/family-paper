import { Tabs } from 'expo-router';

// Q-05: ホーム / カレンダー / 書類 / 登録(中央) / 家族・設定。
// タブアイコンは S0-05（共通UI）で追加する。それまではラベルのみ。
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarIcon: () => null }}>
      <Tabs.Screen name="index" options={{ title: 'ホーム' }} />
      <Tabs.Screen name="calendar" options={{ title: 'カレンダー' }} />
      <Tabs.Screen name="documents" options={{ title: '書類' }} />
      <Tabs.Screen name="add-document" options={{ title: '登録' }} />
      <Tabs.Screen name="family" options={{ title: '家族・設定' }} />
    </Tabs>
  );
}
