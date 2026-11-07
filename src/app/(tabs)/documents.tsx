import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function DocumentsScreen() {
  return (
    <PlaceholderScreen
      scrId="SCR-003"
      title="書類"
      items={['子ども選択UI', '書類カテゴリ', '書類一覧', '書類登録ボタン']}
      links={[
        {
          label: '書類詳細（SCR-005）を開く',
          href: { pathname: '/documents/[id]', params: { id: 'sample' } },
        },
      ]}
    />
  );
}
