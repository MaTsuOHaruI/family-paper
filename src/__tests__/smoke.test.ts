import { describe, expect, it } from '@jest/globals';

// S0-04: テスト基盤の動作確認用スモークテスト。
// グローバル型（@types/jest）に依存しないよう、@jest/globals から明示的に import する。
describe('テスト基盤', () => {
  it('Jest が実行できる', () => {
    expect(1 + 1).toBe(2);
  });
});
