# ARCHITECTURE.md — Family Paper システム構成

- Status: Draft 0.2（優先度A決定を反映 / 2026-11-08）
- 基準: `docs/REQUIREMENTS.md` v1.0
- 本書の「未決事項（§11）」は、ユーザーの決定後に更新する。決定前に依存する実装は行わない。

## 1. 全体構成

```
┌────────────────────────────────────────────┐
│ Mobile App (Expo / React Native / TS)      │
│                                            │
│  Presentation   src/app/ (Expo Router), UI │
│        │                                   │
│  Application    hooks, ビジネスロジック      │
│        │          TanStack Query / Zustand  │
│  Data           repository, Supabase client│
│        │                                   │
│  Services       OcrService / Extraction... │ ← Sprint 3 以降（インターフェースのみ先行可）
└────────┼───────────────────────────────────┘
         │ HTTPS（公開 anon key + ユーザーJWT）
┌────────▼───────────────────────────────────┐
│ Supabase                                   │
│  Auth / PostgreSQL(RLS) / Storage(private) │
│  Edge Functions（アカウント削除・OCR/AI     │
│   ・孤立ファイル掃除: service_role はここだけ）│
└────────────────────────────────────────────┘
```

原則: クライアントは信頼しない。アクセス制御は RLS / Storage ポリシーで担保する（SEC-001〜003）。`service_role` は Edge Function 内のみ。

## 2. 技術スタック

| 領域 | 採用 | 備考 |
|---|---|---|
| Framework | Expo SDK 58 + React Native | expo ~58.0.23 / react-native 0.88.1 / react 19.3.0。版は `package-lock.json` で固定（2026-11-08 時点） |
| Language | TypeScript (strict) | typescript ~6.0.3、`tsconfig` は `strict: true`、パスエイリアス `@/*` → `src/*` |
| Routing | Expo Router | expo-router ~58.0.30。ルートは `src/app/`。ファイルベース |
| Server state | TanStack Query | キャッシュ・再取得・二重送信抑止 |
| UI state | Zustand | 選択中の子ども等のみ |
| Backend | Supabase | Postgres / Auth / Storage / Edge Functions |
| Test | Jest + jest-expo（SDK 58 は Jest 30 必須）。React Native Testing Library は最初のコンポーネントテストのタスクで導入 | 承認済（Q-16） |
| Lint/Format | ESLint（eslint-config-expo）+ Prettier（eslint-plugin-prettier で lint に統合） | 承認済（Q-16） |

開発環境: Node v24.12.0 / npm 11.6.2（Windows）。テンプレート初期導入の依存（`@expo/ui`、`expo-glass-effect`、`expo-symbols` など）のうち不要なものの整理は S0-02 以降で提案する。

追加ライブラリ（カレンダーUI、画像ピッカー、セッション保存等）は必要になったタスクで提案し、承認を得てから導入する。

## 3. ディレクトリ構成（案）

```
src/
  app/                       # Expo Router のルート（薄く保つ。SDK 58 テンプレートの標準位置）
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx              # SCR-001 ホーム
      calendar.tsx           # SCR-002
      documents.tsx          # SCR-003
      add-document.tsx       # SCR-004（Q-05: 中央タブ）
      family.tsx             # SCR-007
    documents/[id].tsx       # SCR-005
    events/[id].tsx          # SCR-006
  components/                # 共通UI
  features/
    auth/ children/ documents/ events/ extraction/
      components/  hooks/  repository/  types.ts
  lib/
    supabase.ts              # Supabaseクライアント（唯一の生成場所）
    queryClient.ts
  services/
    ocr/  extraction/        # インターフェース + 実装（Sprint 3）
  store/                     # Zustand
  theme/                     # 色・余白・タイポグラフィ
  types/                     # 共通型 / DB生成型
  utils/
  dev/                       # サンプルデータ（本番と隔離）
supabase/
  migrations/                # スキーマ・RLS・Storageポリシーは全てここ
  functions/                 # Edge Functions
  seed.sql                   # 開発用のみ
docs/
  REQUIREMENTS.md  ARCHITECTURE.md  SPRINT_BACKLOG.md
```

### 3.1 作成状況（S0-03 時点）

- 作成済み（空ディレクトリは `.gitkeep` で保持。中身を置いたら該当の `.gitkeep` は削除してよい）:
  `src/features/{auth,children,documents,events,extraction}/{components,hooks,repository}`、`src/lib`、`src/services/{ocr,extraction}`、`src/store`、`src/utils`、`src/dev`、`src/types`
- `types.ts`（各 feature）は、型が必要になったタスクで追加する（空ファイルは作らない）。
- 未作成（担当タスクで作る）: `src/theme/`（S0-05）、`supabase/`（S0-06）。
- テンプレート由来で ARCHITECTURE §3 の構成にないもの: `src/constants/theme.ts`、`src/hooks/`（use-color-scheme / use-theme）、`src/components/themed-text.tsx` / `themed-view.tsx`、`src/global.css`。`src/theme/` との統合・整理は S0-05 で提案する（それまで移動・削除しない）。

## 4. レイヤー規約

- 画面・コンポーネント → hooks → repository → Supabase。逆方向・飛び越しは禁止。
- repository は Supabase の行型をアプリのドメイン型へ変換して返す（UIにDB形状を漏らさない）。
- 外部サービス（OCR/AI）は `src/services/*` のインターフェースに依存し、実装は差し替え可能にする（NFR-004）。
- 「Use Case」クラスは作らず、ロジックが複数 repository にまたがる場合のみ hooks / 関数として切り出す（過剰設計を避ける方針案）。

## 5. ナビゲーション

要件書は「5つの主要タブ」と7画面を定義している。タブ数とSCRの対応が未定義のため、次を暫定案とする（Q-05）。

| タブ | 画面 |
|---|---|
| ホーム | SCR-001 |
| カレンダー | SCR-002 |
| 書類 | SCR-003 |
| 登録（中央） | SCR-004 |
| 家族・設定 | SCR-007 |

SCR-005 / SCR-006 はスタック遷移の詳細画面。要件書に画面定義がない補助画面（認証、子どもフォーム、予定フォーム、書類編集）は Q-04 で扱う。

## 6. データモデル（要件書 §6 準拠 + 設計上の補足）

要件書のテーブル: profiles / children / documents / document_images / events / event_children / event_documents / document_extractions。

設計上の補足（承認後にマイグレーションへ反映。要件書との差分は Q 番号付き）:

- 主キー: event_children = (event_id, child_id)、event_documents = (event_id, document_id)。
- document_images: UNIQUE(document_id, page_order)。サムネイル用パス列を追加（Q-06）。
- 日付制約: `end_date >= start_date`、`is_all_day = true` のとき時刻は NULL（CHECK）。
- カテゴリ: 当面 text + CHECK 制約（Q-09）。
- profiles: auth.users 作成時のトリガで自動作成。
- 所有者検証: 子テーブルの RLS を結合に頼らず高速かつ単純にするため、所有者列（`parent_id`）の非正規化を検討（Q-07）。
- 整合性: event_children / event_documents の追加時に、event と child/document が同一所有者であることを DB 側で保証する（複合FKまたはトリガ）。
- FK の削除挙動（Q-02, Q-08）:
  - documents 削除 → event_documents / document_images の行のみ連鎖削除。**events は削除しない**（FR-029, FR-053）。
  - children 削除 → 書類が残っている間は RESTRICT（アプリで確認のうえ書類を先に処理）。event_children は連鎖削除、events は残す。
- document_extractions（Sprint 3）: status を CHECK（pending/processing/completed/failed/reviewed）、エラー内容列、プロバイダ/モデル識別列を追加検討。

## 7. Storage 設計

- Bucket: `document-images`（private）。
- パス: `{user_id}/{document_id}/{page_order}-{uuid}.{ext}`。先頭が `auth.uid()` であることを Storage ポリシーで検証（SEC-003）。
- 取得: 署名付きURL（短寿命）。TanStack Query のキャッシュ寿命と署名URL寿命を整合させ、期限切れ時は再取得する。
- 元画像: アプリ側でリサイズ・再圧縮しない（Q-06 で「元画像」の定義を確定）。表示用はサムネイルを別オブジェクトとして保存し、元画像を置き換えない（FR-023, AT-005）。

## 8. 書類登録・削除のフロー（Q-08 の推奨案）

登録:
1. クライアントで document_id（UUID）を生成（二重登録防止の冪等キー, NFR-003）。
2. 画像を Storage にアップロード（パスに document_id を含む）。
3. DB に documents + document_images を1トランザクション（RPC）で登録。
4. 失敗時: アップロード済みファイルを削除。それも失敗した場合に備え、孤立ファイル検出・掃除ジョブ（Edge Function）を用意する（SEC-005）。

削除:
1. 確認画面（FR-029）。
2. DB 行を削除（event_documents も連鎖。events は残す）。
3. Storage の画像を削除。失敗時はリトライ可能な状態（削除待ちキュー or 掃除ジョブ対象）にする。

アカウント削除（FR-004）: クライアントから auth.users を削除できないため Edge Function（service_role）で、Storage → DB → Auth の順に実行する。

## 9. セキュリティモデル

- RLS: 全テーブル有効。基本は `parent_id = auth.uid()`。関連テーブルは親の所有者を検証。
- 秘密情報: クライアントは公開 anon key のみ。`.env` は Git 管理外、`.env.example` のみコミット（SEC-004）。
- セッション保存: Supabase セッションは端末の安全な保存先へ（`expo-secure-store` はサイズ制限があるため、保存方式は S1 の認証タスクで決定）。
- テスト: AT-010 を自動化（2ユーザーで相互アクセス不可を検証）することを Sprint 1 の完了条件に含める。
- 個人情報: ログ・テストデータに実データを含めない。

## 10. 開発環境の制約と検証方針

- Claude Code Browser 上では実機/シミュレータ/カメラを使えない前提で計画する。
- Claude Code が確認できるもの: `tsc` / lint / 単体テスト / `expo export` 等のバンドルビルド / マイグレーションとRLSのテスト（Supabase CLI が使える場合）。
- ユーザー確認が必要なもの: Expo Go または dev build による実機の起動・画面遷移・カメラ・画像選択。
- 各タスク報告で「自動確認済み」と「ユーザー実機確認待ち」を分けて記載する。

## 11. 未決事項・要件レビュー結果（Open Questions）

### 決定記録（2026-11-08 ユーザー承認）

優先度A（Q-04, 05, 06, 07, 11, 15, 16）は、下表の「推奨案」どおりに決定した。S0-09（CI）も追加を承認済み。

| ID | 決定 | 残る作業・未確定事項 |
|---|---|---|
| Q-04 | 認証はメール+パスワード、メール確認あり。ソーシャルログインは対象外。補助画面を SCR-008〜011 として追加 | 画面の割当案: 008=認証（ログイン/登録/再設定）、009=子どもフォーム、010=予定フォーム、011=書類編集。実装は該当Sprint（Sprint 0 では作らない）。要件書 §5 への追記は別途確認 |
| Q-05 | 5タブ = ホーム / カレンダー / 書類 / 登録(中央) / 家族・設定 | — |
| Q-06 | 元画像＝ピッカーが返したファイルを再圧縮・リサイズせず保存。サムネイルは別オブジェクト | 1ページ上限サイズ・1書類の最大ページ数は未確定（S1B-01 着手前に決定） |
| Q-07 | 所有者列の非正規化＋複合FK/トリガで同一所有者を保証。AT-010 を自動テスト化 | S1A-01 / S1A-06 / S1B-01 で具体化 |
| Q-11 | Sprint 0 完了条件を「自動確認」と「ユーザー実機/Expo Go確認」に分離 | 各タスク報告で両者を区別して記載 |
| Q-15 | ローカル Supabase CLI＋開発用クラウドプロジェクト1つ。本番は別プロジェクト | 開発用プロジェクトの作成はユーザー作業（S1A-01 前まで） |
| Q-16 | Jest + jest-expo / ESLint / Prettier、UIは日本語のみ（文言は定数に集約） | カレンダーUI等のライブラリは Sprint 2 前に提案 |

### 未決事項一覧

優先度: A=Sprint 0 完了までに決定が望ましい / B=該当Sprint着手前 / C=設計で吸収可（異議なければ推奨案で進める）。

| ID | 優先 | 問題 | 推奨案 | 関連 |
|---|---|---|---|---|
| Q-01 | B | 書類は1人の子どもにしか属せないが、予定は複数の子どもを持てる。兄弟共通のプリントの扱いが不明 | MVP は `documents.child_id` 単一。共通プリントは子どもごとに登録。将来 N:M 化の余地を明記 | FR-024, FR-026, AT-002 |
| Q-02 | B | 子ども削除時の書類・予定の扱いが未定義 | DBは RESTRICT。アプリで「書類◯件も一緒に削除」を確認する2段階。予定は残し、子ども関連のみ解除 | FR-012 |
| Q-03 | B | アカウント削除は Edge Function が必須。また App Store は提供時にアプリ内削除を求めるため P1 のままだと申請に間に合わない恐れ | ストア申請前の必須扱い（Sprint 4 に確実に配置）へ格上げ | FR-004, SEC-005 |
| Q-04 | A | 認証画面（ログイン/登録/パスワード再設定）、初回の子ども登録導線、子ども・予定フォーム、書類編集画面が画面要件にない。認証方式（メール+パスワードのみか）・メール確認も未定義 | 画面を SCR-008〜011 として追加。認証はメール+パスワード、メール確認あり。ソーシャルログインは対象外（導入すると Apple ログイン要件が生じる） | FR-001, FR-002, SCR |
| Q-05 | A | 「5つの主要タブ」と7画面の対応が不明 | §5 の暫定案（中央に書類登録タブ） | §14, SCR-001〜007 |
| Q-06 | A | 「元画像を保存」と「サムネイル利用」「画像加工」の関係、HEIC、サイズ上限が未定義。ピッカー経由で再エンコードされ得るため「元」の厳密な定義が必要 | 「元画像＝ピッカーが返したファイルを再圧縮・リサイズせず保存」と定義。サムネイルは別オブジェクト（列追加）。1ページ上限サイズと1書類の最大ページ数を決める | FR-023, NFR-002, AT-005 |
| Q-07 | A | 関連テーブルに所有者列がなく、RLS・Storage の検証と他人のデータ紐付け防止が曖昧 | 所有者列の非正規化 + 複合FK/トリガで同一所有者を保証。AT-010 を自動テスト化 | SEC-001〜003 |
| Q-08 | B | 画像アップロードとDB登録は原子的でない。二重登録・孤立ファイル・削除途中失敗への対処が未定義 | §8 のフロー（冪等キー、RPC、掃除ジョブ） | NFR-003, SEC-005 |
| Q-09 | C | カテゴリ「将来追加できる構造」と text カラム。書類カテゴリと予定カテゴリが別々 | MVP は text + CHECK。ユーザー定義カテゴリが必要になった時点でテーブル化 | FR-025, FR-046 |
| Q-10 | C | 終了日は P0 の予定登録項目だが、複数日予定の表示は P1 | 終了日の保存は P0、複数日の見せ方は Sprint 2 の P1 で対応 | FR-042, FR-049 |
| Q-11 | A | Sprint 0 の完了条件「アプリが起動する」が、ブラウザ開発環境では実機確認できない | 完了条件を「バンドル成功 + typecheck/lint/test 成功 + ユーザー実機/Expo Go 確認」に分離（§10） | §10 |
| Q-12 | B | 課題の中心「提出期限を忘れる」に対し、通知・リマインダーは対象外。カレンダーを見に行かない限り解決しない | 基本のローカル通知（期限前日など）を P1 として追加検討。高度な自動化は対象外のまま | §1.2, §12 |
| Q-13 | B | OCR/AIのプロバイダー・実行場所未定。子どもの学校書類を外部AIへ送るためプライバシーポリシー・同意・データ取り扱いが必要 | Sprint 3 着手前に決定。呼び出しは Edge Function 経由 | FR-030〜036, SEC-004 |
| Q-14 | C | 書類の検索が要件にない（「あとから見つけにくい」が課題） | 書類タイトル/メモの簡易検索を P1 として追加検討（高度なAI検索は対象外のまま） | §1.2 |
| Q-15 | A | Supabase 環境（ローカル CLI / 開発用クラウドプロジェクト）とマイグレーション運用が未定 | ローカル Supabase CLI + 開発用プロジェクト1つ。本番は別プロジェクト | 規則9, SEC-004 |
| Q-16 | A | テスト・lint・日付処理・UI言語（日本語のみか）・主要ライブラリ（カレンダーUI等）が未選定 | Jest+jest-expo / ESLint / Prettier、UIは日本語のみ（文言は定数に集約）。カレンダーUI等は Sprint 2 着手前に提案 | 規則7, NFR-004 |

追加の軽微な指摘（推奨案で進める）:
- 予定に子どもが0人の場合は「家庭共通」として扱い、子どもフィルタ時も表示するか要確認（FR-045, 推奨: 表示する）。
- 複数の子どもが関連する予定の表示色の優先ルール（FR-047, 推奨: 最初の子どもの色 + 文字ラベルで全員を表示）。
- 「学年」は自由入力か選択式か（推奨: 選択式 + その他）。進級時は手動更新。
- 書類の「登録日」は created_at とし、プリントの「配布日」（FR-032）とは別概念として扱う。
- 書類削除は物理削除（確認画面あり）。復元機能は対象外。
- FR-054（書類に複数予定）は P1 だが、event_documents は最初から N:M で作る。
- Supabase 無料枠の制限（ファイルサイズ・ストレージ容量・無操作時の停止）に注意。
