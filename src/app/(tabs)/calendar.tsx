import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function CalendarScreen() {
  return (
    <PlaceholderScreen
      scrId="SCR-002"
      title="カレンダー"
      items={[
        '月間カレンダー',
        '日付ごとの予定表示',
        '選択日の予定一覧',
        '予定登録ボタン',
        '子ども別フィルター',
      ]}
      links={[
        {
          label: '予定詳細（SCR-006）を開く',
          href: { pathname: '/events/[id]', params: { id: 'sample' } },
        },
      ]}
    />
  );
}
