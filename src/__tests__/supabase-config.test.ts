import { describe, expect, it } from '@jest/globals';

import { SupabaseConfigError, readSupabaseConfig } from '@/lib/supabase-config';

const URL = 'https://abcdefghijklmnop.supabase.co';
// 署名はダミー。ペイロードの role だけが検証の対象。
const ANON_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.signature';
const SERVICE_ROLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.signature';
const PUBLISHABLE_KEY = 'sb_publishable_dummyvalue1234567890';
const SECRET_KEY = 'sb_secret_dummyvalue1234567890';

describe('readSupabaseConfig（SEC-004）', () => {
  it('URL と anon キーが正しければ設定を返す（前後の空白は除く）', () => {
    expect(readSupabaseConfig({ url: ` ${URL} `, anonKey: ` ${ANON_JWT} ` })).toEqual({
      url: URL,
      anonKey: ANON_JWT,
    });
  });

  it('publishable キーも受け付ける', () => {
    expect(readSupabaseConfig({ url: URL, anonKey: PUBLISHABLE_KEY }).anonKey).toBe(
      PUBLISHABLE_KEY,
    );
  });

  it('ローカルの Supabase（http）の URL も受け付ける', () => {
    expect(readSupabaseConfig({ url: 'http://127.0.0.1:54321', anonKey: ANON_JWT }).url).toBe(
      'http://127.0.0.1:54321',
    );
  });

  it.each([undefined, '', '   '])('URL が未設定（%p）なら、変数名と対処を示すエラー', (url) => {
    expect(() => readSupabaseConfig({ url, anonKey: ANON_JWT })).toThrow(SupabaseConfigError);
    expect(() => readSupabaseConfig({ url, anonKey: ANON_JWT })).toThrow(
      /EXPO_PUBLIC_SUPABASE_URL.*\.env\.example/,
    );
  });

  it.each([undefined, '', '   '])('キーが未設定（%p）なら、変数名と対処を示すエラー', (anonKey) => {
    expect(() => readSupabaseConfig({ url: URL, anonKey })).toThrow(
      /EXPO_PUBLIC_SUPABASE_ANON_KEY.*\.env\.example/,
    );
  });

  it.each(['not a url', 'ftp://example.com', 'https://', 'supabase.co'])(
    'URL の形式が不正（%s）ならエラー',
    (url) => {
      expect(() => readSupabaseConfig({ url, anonKey: ANON_JWT })).toThrow(
        /形式が正しくありません/,
      );
    },
  );

  it('.env.example のダミー値のままならエラー', () => {
    expect(() =>
      readSupabaseConfig({ url: 'https://YOUR_PROJECT_REF.supabase.co', anonKey: ANON_JWT }),
    ).toThrow(/ダミー値/);
    expect(() => readSupabaseConfig({ url: URL, anonKey: 'YOUR_ANON_KEY' })).toThrow(/ダミー値/);
  });

  it('service_role の JWT キーは拒否する', () => {
    expect(() => readSupabaseConfig({ url: URL, anonKey: SERVICE_ROLE_JWT })).toThrow(
      /service_role/,
    );
  });

  it('sb_secret_ で始まるキーは拒否する', () => {
    expect(() => readSupabaseConfig({ url: URL, anonKey: SECRET_KEY })).toThrow(/service_role/);
  });

  it('エラー文にキーの値を含めない', () => {
    for (const key of [SERVICE_ROLE_JWT, SECRET_KEY]) {
      try {
        readSupabaseConfig({ url: URL, anonKey: key });
        throw new Error('エラーになるはず');
      } catch (error) {
        expect(error).toBeInstanceOf(SupabaseConfigError);
        expect((error as Error).message).not.toContain(key);
      }
    }
  });
});
