import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <PlaceholderScreen
      scrId="SCR-005"
      title={`書類詳細（id: ${id}）`}
      items={[
        '書類タイトル',
        '対象の子ども',
        'カテゴリ',
        '登録日',
        '元画像',
        'ページ切り替え',
        '関連予定',
        '編集・削除操作',
      ]}
    />
  );
}
