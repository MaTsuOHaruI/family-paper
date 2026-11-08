import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { readSupabaseConfig } from '@/lib/supabase-config';

let client: SupabaseClient | null = null;

/**
 * Supabase クライアントを返す（アプリ内でここだけが生成する）。
 * 初めて使われたときに作るため、環境変数が未設定でも、Supabase を使わない画面は動く。
 * 画面・部品から直接呼ばず、repository 経由で使うこと（CLAUDE.md §5）。
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  // Expo は process.env.EXPO_PUBLIC_* をビルド時に置換する。process.env[name] のような動的参照は置換されない。
  const config = readSupabaseConfig({
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  });

  client = createClient(config.url, config.anonKey, {
    auth: {
      // セッションの保存方式（端末の安全な保存先）は S1A-02（認証）で決める。それまでは保存しない。
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  return client;
}
