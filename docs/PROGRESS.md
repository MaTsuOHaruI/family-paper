# PROGRESS.md — 引き継ぎ・進捗ログ

作業の再開時は、まず `CLAUDE.md` → 本ファイル → `docs/SPRINT_BACKLOG.md` の順に読む。
状態の正はリポジトリ（本ファイルとバックログ）であり、チャットの記憶ではない。

- 最終更新: 2026-11-08
- 運用: GitHub への反映はユーザーが行う。Claude はチャット上でファイルを作成・更新して渡す。
- 制約: Claude のチャット環境ではパッケージ導入・`tsc`・`expo` が実行できない（ネットワーク無効）。確認コマンドはユーザーのローカルまたは CI（S0-09）で実行し、出力を Claude に貼る。

## 現在地

- フェーズ: Sprint 0（開発基盤）
- 現在のタスク: **S0-02**（Expo Router・5タブ骨組み）— ファイル作成済み（`s0-02.zip`）。`tsc` / Web 表示はユーザーのローカル確認待ち（Claude 環境では未実行）
- 次のタスク: S0-02（Expo Router・5タブ骨組み）

## 完了済み

| 日付 | タスク | 内容 |
|---|---|---|
| 2026-11-08 | S0-00 | 要件レビュー、Q-04/05/06/07/11/15/16 を推奨案で決定、S0-09（CI）追加を承認 |
| 2026-11-08 | S0-01 | Expo SDK 58 + TS(strict) を直下に配置、expo-doctor 20/20、Metro 起動と Web 表示（Welcome to Expo）を確認、`.nvmrc`(24) 追加 |
| 2026-11-08 | （S0-08 の一部） | CLAUDE.md / ARCHITECTURE.md / SPRINT_BACKLOG.md / PROGRESS.md のドラフト作成 |

## 決定事項（要点。詳細は ARCHITECTURE.md §11）

- 5タブ: ホーム / カレンダー / 書類 / 登録(中央) / 家族・設定
- 認証: メール+パスワード、メール確認あり、ソーシャルログインなし
- 補助画面の割当案: SCR-008=認証、009=子どもフォーム、010=予定フォーム、011=書類編集（要件書への追記は未確認）
- 元画像: 再圧縮・リサイズなしで保存、サムネイルは別オブジェクト
- RLS: 所有者列の非正規化 + 複合FK/トリガ、AT-010 を自動テスト化
- 環境: ローカル Supabase CLI + 開発用クラウドプロジェクト1つ（本番は別）
- ツール: Jest + jest-expo / ESLint / Prettier、UIは日本語のみ

## 未解決・確認待ち

- Q-06: 1ページ上限サイズ・1書類の最大ページ数（S1B-01 前に決定）
- Q-04: SCR-008〜011 を要件書 §5 に追記してよいか
- Q-15: 開発用 Supabase クラウドプロジェクトの作成（ユーザー作業、S1A-01 前まで）
- S0-01: 画面表示は確認済み（Welcome to Expo）。実機（Expo Go）で見たかは未確認
- テンプレート由来の依存（`@expo/ui`、`expo-glass-effect` 等）の整理は S0-02 以降で提案
- テンプレート由来の `AGENTS.md` と `.claude/settings.json` が追跡されている。`CLAUDE.md` との関係（内容の重複・矛盾）を S0-08 で確認する
- 設計への反映: Expo Router のルートは `src/app/`（ARCHITECTURE §3 と CLAUDE.md を修正済み）

## 次の一手（S0-02 の確認）

S0-02 のファイル一式（`s0-02.zip`）を適用し、ユーザーのローカルで次を実行して結果を Claude に貼る。

1. 不要なテンプレートファイルを `git rm` で削除し、`s0-02.zip` を直下に展開
2. `npx expo start --web`（ルート型が再生成される）→ いったん停止
3. `npx tsc --noEmit`（エラー 0 件が目標）
4. Web で 5 タブの遷移、書類詳細・予定詳細への遷移と戻る操作を確認
5. 可能なら Expo Go でも確認（Q-11: 実機確認はユーザー作業）

受け入れ条件: SPRINT_BACKLOG.md の S0-02 を参照。

## 確認結果ログ（ユーザー実行分を貼る）

- 2026-11-08 `package.json` 確認: expo ~58.0.23 / react-native 0.88.1 / react 19.3.0 / expo-router ~58.0.30 / typescript ~6.0.3。`tsconfig.json` は `strict: true`、`@/*` → `./src/*`。`name` は `app-tmp` のまま。scripts は start / lint(expo lint) など（typecheck・test は S0-04 で追加）
- 2026-11-08 `git status --short`: ` M package-lock.json` と `?? family-paper-docs/` のみ
- 2026-11-08 Expo Go: QR 表示のみで、読み取っても表示されなかった
- 2026-11-08 その後: 画面が表示され「Welcome to Expo」を確認（ユーザー報告。Web か実機かは未確認）
- 2026-11-08 環境: Windows PowerShell、Node v24.12.0 / npm 11.6.2。作業フォルダ名は `Famiry-Paper`（綴りに注意）
- `create-expo-app` 5.0.0、テンプレート `default@sdk-58`。`npm install` 成功（562 packages、moderate 脆弱性5件。`npm audit fix --force` は実行しない。S0-04 で内容確認）
- テンプレートの中身をリポジトリ直下へ移動し `npm install` 成功。`app-tmp` の削除は Windows のパス問題で一部失敗（残骸あり、要再削除）
- `npx expo-doctor`: 20/20 checks passed
- `npx tsc --noEmit`: 3件のエラー（すべてテンプレートのサンプル）
  - `src/components/animated-icon.web.tsx`: `./animated-icon.module.css` の型宣言なし
  - `src/components/app-tabs.web.tsx`: Pressable の ref 型不一致
  - `src/constants/theme.ts`: `@/global.css` の型宣言なし
  - 方針: S0-02 でサンプルを撤去して解消（S0-02 の受け入れ条件に追加済み）
- `npx expo start`: Metro 起動、QR 表示。`src/app` を Expo Router のルートとして認識、React Compiler 有効。Expo Go での表示確認は未報告

## 更新ルール

- 各タスクの終了時に「現在地」「完了済み」「未解決」「次の一手」「確認結果ログ」を更新する。
- 決定事項が増えたら要点を本ファイルに、詳細を ARCHITECTURE.md に記録する。
- 動作確認していないものを「完了」にしない（自動確認済みと実機確認待ちを分けて書く）。
