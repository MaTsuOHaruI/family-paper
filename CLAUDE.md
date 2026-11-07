# CLAUDE.md — Family Paper 開発ルール

このファイルは Claude Code が毎回最初に読む開発ルールである。迷ったらここと `docs/REQUIREMENTS.md` に従う。

## 1. プロジェクト概要

Family Paper は、小中学生の保護者向けに「学校書類（子ども別）」と「家族・学校の予定（カレンダー）」を一元管理するモバイルアプリ（iOS / Android）。

- 基本仕様（唯一の正）: `docs/REQUIREMENTS.md`
- システム構成・未決事項: `docs/ARCHITECTURE.md`
- 作業計画: `docs/SPRINT_BACKLOG.md`

仕様の優先順位: `REQUIREMENTS.md` > `ARCHITECTURE.md` > `SPRINT_BACKLOG.md` > 本ファイル以外の記述。
矛盾を見つけたら独断で解消せず、問題点と推奨案を報告する。

## 2. 技術スタック

Expo / React Native / TypeScript（strict）/ Expo Router / Supabase（PostgreSQL・Auth・Storage）/ Zustand（UI状態）/ TanStack Query（サーバー状態）。
SDK・主要ライブラリのバージョンは Sprint 0 で固定し、`docs/ARCHITECTURE.md` に記録する。無断でメジャー更新しない。

## 3. 作業の進め方（1タスク1サイクル）

1. 着手前に、関連する要件ID（FR-xxx / SEC-xxx / NFR-xxx / AT-xxx / SCR-xxx）を `REQUIREMENTS.md` で確認し、宣言する。
2. 大きな機能は小さなタスクに分割する。1回の作業は1タスク（`SPRINT_BACKLOG.md` のタスクID単位）。
3. 実装 → 型チェック・lint・テスト → 報告 → ユーザーレビュー。承認なしに次のタスクへ進まない。
4. 要件にない機能・ライブラリ・画面を勝手に追加しない。必要だと考えたら「提案」として報告し、承認を待つ。
5. 重要な仕様変更・未決事項（`ARCHITECTURE.md` の Q-xx）に関わる実装は、決定を得てから行う。
6. 実装済みと未実装を明確に区別して報告する。スタブ・モックは必ずそうと明記する。
7. エラー・警告・失敗テストを無視して「完了」としない。解決できない場合は未解決の問題として報告する。
8. 作業開始時に `docs/PROGRESS.md` と `docs/SPRINT_BACKLOG.md` を読み、現在のタスクと未解決事項を確認する。作業終了時に `docs/PROGRESS.md` を更新する（完了/未完了、決定事項、次の一手、ユーザーの確認結果）。

## 4. 完了報告フォーマット（毎タスク必須）

- 実装した要件ID
- 変更したファイル
- 実装内容
- テスト結果（実行したコマンドと結果。実行できなかったものは理由付きで明記）
- 未解決の問題
- 次に推奨するタスク
- （該当時）セキュリティに関係する変更の説明

## 5. アーキテクチャ規約

- レイヤー: Presentation（`app/`・コンポーネント）→ Application（hooks・ビジネスロジック）→ Data（repository・Supabaseクライアント）→ External Services。依存は上から下の一方向。
- **UIコンポーネント・画面から Supabase を直接呼ばない。** 必ず repository 経由（hooks から呼ぶ）。
- OCR・AI は `src/services/` のインターフェース経由で利用し、プロバイダー固有コードを漏らさない（Sprint 3 まで実装しない）。
- サーバー状態は TanStack Query、UI状態（選択中の子ども等）のみ Zustand。サーバーデータを Zustand に複製しない。
- `app/` 配下のルートファイルは薄く保ち、ロジックは `src/features/` に置く。
- 共通UIは `src/components/` に集約し、再利用する。色だけで情報を区別しない（文字・アイコンを併用）。
- 日付は日付文字列（`YYYY-MM-DD`）と時刻を分けて扱い、タイムゾーン変換による日付ずれを起こさない。

## 6. データベース・Supabase 規約

- スキーマ変更は必ず `supabase/migrations/` のマイグレーションで行う。ダッシュボードでの手動変更は禁止。
- 全ユーザーデータテーブルに RLS を有効化し、ポリシーをマイグレーションに含める。クライアント側の表示制限だけに頼らない（SEC-001/002）。
- 関連テーブル（event_children, event_documents, document_images 等）も所有者を検証する。他ユーザーの child / document を紐付けられないこと。
- 画像は private bucket。パスは所有者IDで始める（例: `{user_id}/{document_id}/{page}`）。Storage ポリシーでも所有者を検証する（SEC-003）。
- DB行とStorageファイルの整合性（孤立ファイルを残さない）を常に意識する（SEC-005）。

## 7. セキュリティ規約（厳守）

- `service_role` key・各種 API Secret をクライアント・リポジトリに含めない。
- `.env*` は Git 管理対象外。コミット可能なのは `.env.example`（ダミー値）のみ。クライアントに置くのは公開用キー（`EXPO_PUBLIC_*` の anon key / URL）だけ。
- AI/OCR の秘密鍵は将来サーバー側（Edge Function 等）で管理する。
- セキュリティに関係する変更（RLS、Storageポリシー、認証、鍵、削除処理）は、完了報告で必ず説明する。
- 個人情報（子どもの名前・学校名・書類画像）をログ・クラッシュレポート・テストデータに出さない。

## 8. 元画像の保護（最優先）

- 登録された元画像を OCR結果・加工画像・サムネイルで置き換えない・上書きしない（FR-023）。
- OCR/AI が失敗しても元画像と書類レコードは保持し、手動入力で続行できること（FR-034, AT-009）。
- AI 抽出結果は保護者が確認するまで予定として自動登録しない（FR-033）。
- 書類を削除しても関連予定を自動削除しない（FR-029, FR-053）。

## 9. コーディング規約

- TypeScript strict。`any` と `@ts-ignore` は原則禁止（使う場合は理由コメントと報告）。
- 外部入力・DB応答は型定義し、境界で検証する。
- ESLint / Prettier の設定に従う。フォーマットだけの変更を機能変更に混ぜない。
- コンポーネントは小さく保ち、ファイル名は役割が分かる名前にする（PascalCase コンポーネント、camelCase hooks/関数）。
- コメントは「なぜ」を書く。要件ID に紐づく重要処理には ID を記載してよい。
- サンプルデータは `src/dev/` または `supabase/seed.sql` に隔離し、本番データと混ぜない。UI上でも判別できるようにする。

## 10. コマンド（Sprint 0 完了時に確定。確定までは未整備）

```
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # jest (jest-expo)
npm run start       # expo start
```

各タスク完了前に `typecheck` / `lint` / `test` を実行する。実行できない環境の場合はその旨と代替確認方法を報告する。

## 11. Git ルール

- ブランチ: `feat/<要件ID>-<短い説明>`、`fix/...`、`chore/...`、`docs/...`
- コミットメッセージ先頭に要件IDまたはタスクIDを付ける（例: `[S0-02] Add Expo Router tab skeleton`）。
- 1コミット1目的。無関係な変更を混ぜない。
- main への直接プッシュはしない（ユーザーの指示がある場合を除く）。
- シークレットをコミットしてしまった場合は、削除コミットで済ませず、直ちに報告してキーの無効化を依頼する。

## 12. 開発環境の制約（Claude Code Browser）

- ブラウザ環境ではiOSシミュレータ・Android エミュレータ・カメラ等のネイティブ機能を動かせない可能性が高い。型チェック・lint・単体テスト・バンドルビルドで確認できる範囲を明示し、実機（Expo Go / dev build）確認が必要な項目は「ユーザー確認待ち」として報告する。
- 動作確認していないものを「動作する」と報告しない。
- コード作成環境でパッケージ導入・`tsc`・`expo` を実行できない場合は、実行コマンドを手順として提示し、ユーザーまたは CI の実行結果を受け取ってからタスクを完了とする。

## 13. 初期開発の対象外（要件書 §12）

学校・教育機関向け管理画面 / 学校システム連携 / 外部カレンダー同期 / 家族間共有 / 高度なAI検索 / 課金 / 高度な通知自動化 / 学校からの自動プリント受信。
これらに関する実装は行わない。

## 14. 現在のフェーズ

Sprint 0（開発基盤）。OCR・AI・実画像アップロード・本番認証処理は実装しない。
