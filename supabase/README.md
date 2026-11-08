# supabase/

- `migrations/` — DB スキーマ・RLS・Storage ポリシーはここのマイグレーションだけで変更する（ダッシュボードでの手動変更は禁止）。最初のマイグレーションは S1A-01。
- `functions/` — Edge Function（アカウント削除・OCR/AI・孤立ファイルの掃除など）。`service_role` を使ってよいのはここだけ。
- `config.toml` は Supabase CLI の `supabase init` で S1A-01 に作成する（Q-15: ローカル CLI + 開発用クラウドプロジェクト 1 つ）。

`functions/` に Deno のコードを置くときは、ESLint / TypeScript の対象から外す設定を追加する。
