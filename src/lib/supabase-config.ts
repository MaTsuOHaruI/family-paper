// SEC-004: クライアントには「公開用キー」だけを設定する。
// service_role / secret キーが混入していたら、通信を始める前に止める。

export type SupabaseConfig = { url: string; anonKey: string };

export type SupabaseEnv = {
  url: string | undefined;
  anonKey: string | undefined;
};

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupabaseConfigError';
  }
}

const URL_VAR = 'EXPO_PUBLIC_SUPABASE_URL';
const KEY_VAR = 'EXPO_PUBLIC_SUPABASE_ANON_KEY';
const SETUP_HINT =
  '.env.example を .env にコピーして値を設定し、開発サーバーを再起動してください。';

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// atob などのグローバルに依存しないよう、base64url を自前でデコードする（JWT のペイロードは ASCII の JSON）。
function decodeBase64Url(input: string): string | null {
  const clean = input.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  let output = '';
  for (const char of clean) {
    const index = BASE64_CHARS.indexOf(char);
    if (index === -1) return null;
    value = (value << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((value >> bits) & 0xff);
      value &= (1 << bits) - 1;
    }
  }
  return output;
}

/** JWT 形式のキーから role を取り出す。JWT でなければ null。 */
function jwtRole(key: string): string | null {
  const parts = key.split('.');
  if (parts.length !== 3) return null;
  const payload = decodeBase64Url(parts[1] ?? '');
  if (payload === null) return null;
  try {
    const parsed: unknown = JSON.parse(payload);
    if (typeof parsed === 'object' && parsed !== null && 'role' in parsed) {
      const role = (parsed as { role: unknown }).role;
      return typeof role === 'string' ? role : null;
    }
  } catch {
    // JSON でなければ JWT ではないものとして扱う
  }
  return null;
}

function requireValue(name: string, raw: string | undefined): string {
  const value = raw?.trim() ?? '';
  if (value === '') {
    throw new SupabaseConfigError(
      `Supabase の設定がありません: ${name} が未設定です。${SETUP_HINT}`,
    );
  }
  if (value.includes('YOUR_')) {
    throw new SupabaseConfigError(
      `${name} に .env.example のダミー値が入ったままです。実際の値を設定してください。`,
    );
  }
  return value;
}

/**
 * 環境変数から Supabase の接続設定を取り出して検証する。
 * 不正な場合は SupabaseConfigError を投げる。エラー文にキーの値は含めない。
 */
export function readSupabaseConfig(env: SupabaseEnv): SupabaseConfig {
  const url = requireValue(URL_VAR, env.url);
  const anonKey = requireValue(KEY_VAR, env.anonKey);

  if (!/^https?:\/\/[^\s/?#]+(\/\S*)?$/i.test(url)) {
    throw new SupabaseConfigError(
      `${URL_VAR} の形式が正しくありません。https://<プロジェクト>.supabase.co の形で指定してください。`,
    );
  }

  if (anonKey.startsWith('sb_secret_') || jwtRole(anonKey) === 'service_role') {
    throw new SupabaseConfigError(
      `${KEY_VAR} に service_role（secret）キーが設定されています。クライアントには公開用キー（anon / publishable）だけを設定してください。` +
        '該当のキーを使った場合は、Supabase のダッシュボードでキーを再発行してください。',
    );
  }

  return { url, anonKey };
}
