import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function FamilyScreen() {
  return (
    <PlaceholderScreen
      scrId="SCR-007"
      title="家族・設定"
      items={['保護者プロフィール', '子ども一覧', '子ども登録・編集', 'アカウント設定', 'ログアウト']}
    />
  );
}
