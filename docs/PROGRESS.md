# PROGRESS.md — 引き継ぎ・進捗ログ

作業の再開時は、まず `CLAUDE.md` → 本ファイル → `docs/SPRINT_BACKLOG.md` の順に読む。
状態の正はリポジトリ（本ファイルとバックログ）であり、チャットの記憶ではない。

- 最終更新: 2026-11-08（S0-06 完了時）
- 運用: GitHub への反映はユーザーが行う。Claude はチャット上でファイルを作成・更新して渡す。
- 制約: Claude のチャット環境ではパッケージ導入・`tsc`・`expo` が実行できない（ネットワーク無効）。確認コマンドはユーザーのローカルまたは CI（S0-09）で実行し、出力を Claude に貼る。

## 現在地

- フェーズ: Sprint 0（開発基盤）
- 現在のタスク: **S0-07**（QueryClient と Zustand）— ファイル作成済み（`s0-07.zip`）。ライブラリ導入と `npm run check` はユーザーのローカルで実行（結果待ち。導入承認済み）
- 次のタスク: S0-07（QueryClient と Zustand。TanStack Query / Zustand の導入承認が必要）→ S0-09（CI）→ S0-08（README 等）→ S0-10（Sprint 0 レビュー）

## 完了済み

| 日付 | タスク | 内容 |
|---|---|---|
| 2026-11-08 | S0-00 | 要件レビュー、Q-04/05/06/07/11/15/16 を推奨案で決定、S0-09（CI）追加を承認 |
| 2026-11-08 | S0-01 | Expo SDK 58 + TS(strict) を直下に配置、expo-doctor 20/20、Metro 起動と Web 表示（Welcome to Expo）を確認、`.nvmrc`(24) 追加 |
| 2026-11-08 | S0-02 | 5タブ + 詳細画面のスケルトン。`tsc` エラー 0 件、Web で表示確認（ユーザー報告）。Expo Go 実機は未確認 |
| 2026-11-08 | S0-03 | 基本フォルダ構成。`tsc` 0 件、Web で全タブ表示、コミット `[S0-03] Add base folder structure` |
| 2026-11-08 | S0-04 | `npm run check`（typecheck / lint / test）成功。型・整形・テストの失敗確認済み。ESLint + Prettier（lint 統合）/ Jest 30 + jest-expo / `.gitattributes`（LF）。コミット d607981, 646b7bb ほか |
| 2026-11-08 | S0-05 | `src/theme/`（色・余白・文字・子ども 6 色 + 色なし）、`Screen` / `AppText` / `Button` / `EmptyState`、タブアイコン（Ionicons）、コントラスト比のテスト。`npm run check` 成功（23 tests）。Web でアイコン・選択色・ダークモード・詳細画面への遷移を確認 |
| 2026-11-08 | S0-06 | `src/lib/supabase.ts`（遅延生成の `getSupabaseClient()`）、`supabase-config.ts`（環境変数検証。`service_role` / `sb_secret_` を通信前に拒否）、`.env.example`、`supabase/`、`.gitignore` 追記。`npm run check` 成功（40 tests）。`git check-ignore` で `.env` / `.env.local` は除外、`.env.example` は追跡を確認。コミット 4ce91f9, f4b5363 |
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

- S0-05 の判断（ユーザー承認済み）: テーマ統合・`@expo/vector-icons` 導入・配色は中立色基調（ブランドカラー未定）。ブランドカラーの指定があれば `src/theme/colors.ts` を変更する
- S0-06 の判断（ユーザー承認済み）: ライブラリは `@supabase/supabase-js` のみ。セッション保存は S1A-02 で決定
- Q-06: 1ページ上限サイズ・1書類の最大ページ数（S1B-01 前に決定）
- Q-04: SCR-008〜011 を要件書 §5 に追記してよいか
- Q-15: 開発用 Supabase クラウドプロジェクトの作成（ユーザー作業、S1A-01 前まで）
- S0-01: 画面表示は確認済み（Welcome to Expo）。実機（Expo Go）で見たかは未確認
- テンプレート由来の依存（`@expo/ui`、`expo-glass-effect` 等）の整理は S0-02 以降で提案
- `npm audit`: 全体 31 件（開発ツール由来）、実行時依存（`--omit=dev`）は 5 件 moderate（`glob` / `minimatch` が `@expo/cli` / `@expo/fingerprint` 経由）。開発・ビルド用 CLI の依存と判断。`--force`（expo@52 へのダウングレード）は実行しない。S4-04 または SDK 更新時に再評価
- テンプレート由来の `AGENTS.md` と `.claude/settings.json` が追跡されている。`CLAUDE.md` との関係（内容の重複・矛盾）を S0-08 で確認する
- 設計への反映: Expo Router のルートは `src/app/`（ARCHITECTURE §3 と CLAUDE.md を修正済み）

## 次の一手

1. ユーザーが S0-07 の着手を承認する（`@tanstack/react-query` と `zustand` の導入承認を含む）。
2. S0-07 → S0-09（CI）→ S0-08 → S0-10 の順。S0-10 で Sprint 1A 着手を判断する。
3. Sprint 1A-01 の前に Q-15（開発用 Supabase クラウドプロジェクトの作成）。S1B-01 の前に Q-06。

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

- 2026-11-08 S0-03 確認: `Expand-Archive` で展開、`git status --short`・`npx tsc --noEmit`（0件）・`npx expo start --web`（5タブすべてバンドル成功）。コミット fe5613f（24 files）
- 補足: テンプレート由来の `scripts/reset-project.js` と `reset-project` スクリプトは、実行すると `src/` を退避・初期化するため危険。S0-04 完了後に削除を提案する

- 2026-11-08 S0-04 実行: `npx expo install ...` 成功（768 packages 追加、eslint 9.39.5）。最初の `package.json` は scripts の閉じ括弧後のカンマ漏れで JSON エラー（手動貼り付けのミス）→ 修正して再コミット済み
- コミット: 6bca093 / ac6f111（設定追加）、7459afe（Prettier 整形。`family.tsx` と `placeholder-screen.tsx` のみ変更）
- `npm run typecheck`: エラー 0 件 / `npm run test`: 1 suite・1 test 成功（jest-expo、Node 24）
- `npm run lint`: 1 件のエラー。`src/hooks/use-color-scheme.web.ts` 11:5 `react-hooks/set-state-in-effect`（テンプレート由来の水和パターン）。対応: 理由付きの `eslint-disable-next-line` を追加（`s0-04b.zip`）
- 失敗確認は未完了: コマンドが連結して貼り付けられ `_probe.ts` が作られず、テスト失敗の確認も実行されなかった。また `Set-Content`（既定の文字コード）で日本語を含む `smoke.test.ts` を書き換えた可能性があり、` M src/__tests__/smoke.test.ts` が残った → `git checkout` で戻す。今後、日本語を含むファイルを PowerShell の `Set-Content` で書き換えない
- `npm audit`: 31 件（low 1 / moderate 30）。導入前は 5 件。いずれも開発ツールの依存（jest 系・eslint 系・`@expo/cli` の `glob` / `minimatch` / `deepmerge` など）。提案される `npm audit fix --force` は `expo@52.0.49`（破壊的変更・ダウングレード）なので実行しない
- 方針案: 実行時に端末へ入る依存かどうかを `npm audit --omit=dev` で確認し、開発ツール由来は SDK 更新時に解消する。Sprint 4 のセキュリティ確認（S4-04）で再評価する

- 2026-11-08 `s0-04b.zip` 適用後の `npm run lint`: `smoke.test.ts` のみ 9 件（`prettier/prettier` Delete `␍`）。原因は `git checkout` による CRLF 変換（Windows の autocrlf）。他ファイルはエラーなし（`use-color-scheme.web.ts` の件は解消）。対応: `.gitattributes`（`* text=auto eol=lf`）を追加

- 2026-11-08 S0-04 完了: `.gitattributes` 追加後、`npm run format` → `npm run lint` はエラー 0 件（コミット d607981）。失敗確認: `_probe.ts` で typecheck（TS2322）と lint（prettier/prettier）が失敗、`_fail.test.ts` で jest が失敗（`Expected: 2 / Received: 1`）。一時ファイルは削除済みで `git status` は clean
- 導入バージョン: eslint ^9.39.5 / eslint-config-expo ~58.0.4 / prettier ^3.9.10 / eslint-config-prettier ^10.1.8 / eslint-plugin-prettier ^5.5.7 / jest ~30.5.2 / jest-expo ~58.0.14 / @types/jest 30.0.0。`npx expo install ... "--" --dev` では `dependencies` に入っていたため `npm install --save-dev` で `devDependencies` へ移動（コミット 646b7bb）。`npm run check` は移動後も成功
- `npm audit --omit=dev`: 5 件 moderate（`glob` 9.0.0–14.0.1、`minimatch` 7.0.0–11.0.0。`expo` 内の `@expo/cli`・`@expo/fingerprint` 経由）。修正案は `expo@52.0.49`（破壊的）のため実行しない
- 注意: `eslint@9.39.5` は npm で「サポート終了」の警告が出る。ESLint 10 への移行は `eslint-config-expo` 側の対応を見て、SDK 更新時に検討する
- 注意: ユーザー環境ではコマンドを複数行まとめて貼ると連結されることがあった。手順は 1 行ずつ、または `;` 区切りの 1 行にして渡す

- 2026-11-08 S0-05: `git rm`（テンプレート由来 8 ファイル）、`s0-05.zip` 展開、コミット 5462962。`npm run format` は `src/app/(tabs)/_layout.tsx` のみ変更 → コミット f06635d
- `npm run check`: `typecheck` で 5 件のエラー（すべて `src/app/(tabs)/_layout.tsx`、`tabBarIcon` に渡した関数の引数 `color: string` が React Navigation の `ColorValue` と不一致）。lint・test は未実行（typecheck で停止）。対応: 引数の型を `ColorValue`（react-native）に変更
- `npx expo start --web`: 全タブ・書類詳細のバンドル成功（エラーなし）。アイコン表示とダークモードの見た目は未報告

- 2026-11-08 S0-05 完了: 型エラーはタブアイコンの `color`（`ColorValue` が `number` / `null` を含み `Ionicons` と不一致）を、`focused` とテーマのトークンから色を決める形に変更して解消（コミット e2799b6 の後、`s0-05d.zip`）。`npm run check`: typecheck 0 件、lint 警告 1 件（`@typescript-eslint/array-type`、theme.test.ts:30）→ `T[]` 形式へ修正、test 23 件成功。Web: 5 タブのアイコン、選択中のタブのみ青系、ダークモード切替、書類・カレンダーから詳細画面へ遷移して戻れることをユーザーが確認
- 未確認: Expo Go（実機）での表示。Q-11 に従いユーザー確認待ちとして残す

- 2026-11-08 S0-05 のコミット 2be43eb 後、`npm run check` は警告 0・エラー 0・23 tests 成功
- S0-06 作成: 検証ロジック（`readSupabaseConfig`）は Claude 側で Node 22 により、テストと同じ 19 ケースを直接実行して確認済み（Jest 実行・`tsc` は未実施）。クライアント生成（`createClient`）は未テスト（S1A-02 で確認）
- 2026-11-08 S0-06 完了: `npx expo install @supabase/supabase-js` 成功（9 packages 追加。バージョン番号は未記録。`package.json` で確認）。`npm audit` は 31 件（low 1 / moderate 30）で導入前と同数。`.gitignore` へ `.env` / `.env.*` / `!.env.example` を追記、`git check-ignore -v` で `.env` と `.env.local` が除外、`.env.example` は対象外（追跡）。コミット 4ce91f9（14 files）、`npm run format` で `supabase-config.ts` と同テストのみ整形 → f4b5363。`npm run check`: typecheck 0 件、lint 0 件、3 suites・40 tests 成功
- S0-06 で未確認: `createClient` の実行時動作（環境変数を設定した状態での起動）、React Native での URL polyfill の要否 → S1A-02 で確認
- 注意: `.gitignore` の LF/CRLF 警告（`CRLF will be replaced by LF`）は `.gitattributes` により無害

- 2026-11-08 S0-07: `npx expo install @tanstack/react-query zustand` 成功（3 packages。`@tanstack/react-query` ^5.107.1 / `zustand` ^5.1.0）。コミット af2ee06。`npm run format` は変更なし。`npm run check` の `typecheck` で 17 件のエラー（新規 2 テストの `describe` / `it` / `expect` / `beforeEach` が未定義）。原因: 既存テストと同じ `import … from '@jest/globals'` を書き忘れた（Claude のミス）。対応: 2 ファイルに import を追加（`s0-07b.zip`）。`npx expo start --web`: 全タブ・予定詳細のバンドル成功、エラーなし（画面の目視は未報告）

## 更新ルール

- 各タスクの終了時に「現在地」「完了済み」「未解決」「次の一手」「確認結果ログ」を更新する。
- 決定事項が増えたら要点を本ファイルに、詳細を ARCHITECTURE.md に記録する。
- 動作確認していないものを「完了」にしない（自動確認済みと実機確認待ちを分けて書く）。
