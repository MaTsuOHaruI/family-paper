import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function AddDocumentScreen() {
  return (
    <PlaceholderScreen
      scrId="SCR-004"
      title="書類登録"
      items={[
        '対象の子ども選択',
        'カメラ撮影ボタン',
        '画像選択ボタン',
        '単一画像登録',
        '複数画像登録',
        '書類タイトル',
        'カテゴリ選択',
        'メモ入力',
        '保存ボタン',
      ]}
    />
  );
}
