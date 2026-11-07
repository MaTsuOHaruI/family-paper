import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <PlaceholderScreen
      scrId="SCR-006"
      title={`予定詳細（id: ${id}）`}
      items={['予定タイトル', '日付', '時刻', '対象の子ども', '説明', '関連書類', '編集・削除操作']}
    />
  );
}
