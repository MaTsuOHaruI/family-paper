import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function HomeScreen() {
  return (
    <PlaceholderScreen
      scrId="SCR-001"
      title="ホーム"
      items={[
        'Family Paper ロゴ・タイトル',
        '今日の日付',
        '今日の予定',
        '近日中の予定',
        '最近登録した書類',
        '書類登録への導線',
        'カレンダーへの導線',
      ]}
      links={[
        { label: '書類を登録する', href: '/add-document' },
        { label: 'カレンダーを開く', href: '/calendar' },
      ]}
    />
  );
}
