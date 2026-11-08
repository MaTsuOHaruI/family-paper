import { describe, expect, it } from '@jest/globals';

import {
  CHILD_COLOR_KEYS,
  ChildColors,
  UnsetChildColor,
  isChildColorKey,
  resolveChildColor,
} from '@/theme/child-colors';
import { Colors, type ColorScheme, type ThemeColors } from '@/theme/colors';

function luminance(hex: string): number {
  const channel = (start: number) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** WCAG 2.x のコントラスト比 */
function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const schemes: ColorScheme[] = ['light', 'dark'];

// 文字色と、その文字を載せる背景色の組み合わせ（実際に画面で使うもの）
const textPairs: [keyof ThemeColors, keyof ThemeColors][] = [
  ['text', 'background'],
  ['text', 'surface'],
  ['textSecondary', 'background'],
  ['textSecondary', 'surface'],
  ['onPrimary', 'primary'],
  ['onDanger', 'danger'],
  ['primary', 'background'],
  ['danger', 'background'],
];

for (const scheme of schemes) {
  describe(`配色（${scheme}）`, () => {
    const c = Colors[scheme];

    for (const [foreground, background] of textPairs) {
      it(`${foreground} と ${background} のコントラスト比が 4.5 以上（NFR-001）`, () => {
        expect(contrast(c[foreground], c[background])).toBeGreaterThanOrEqual(4.5);
      });
    }

    it('子どもの表示色は背景に対して 3:1 以上（色以外の手がかりも併用する前提の下限）', () => {
      for (const key of CHILD_COLOR_KEYS) {
        expect(contrast(ChildColors[key][scheme], c.background)).toBeGreaterThanOrEqual(3);
      }
      expect(contrast(UnsetChildColor[scheme], c.background)).toBeGreaterThanOrEqual(3);
    });
  });
}

describe('子どもの表示色（FR-010 / FR-047）', () => {
  it('6色すべてに文字ラベルがあり、ラベルも色値も重複しない', () => {
    const labels = CHILD_COLOR_KEYS.map((key) => ChildColors[key].label);
    expect(labels.every((label) => label.length > 0)).toBe(true);
    expect(new Set(labels).size).toBe(CHILD_COLOR_KEYS.length);
    for (const scheme of schemes) {
      const values = CHILD_COLOR_KEYS.map((key) => ChildColors[key][scheme]);
      expect(new Set(values).size).toBe(CHILD_COLOR_KEYS.length);
    }
  });

  it('キーから色値とラベルを解決できる', () => {
    expect(resolveChildColor('blue', 'light')).toEqual({
      key: 'blue',
      label: '青',
      color: ChildColors.blue.light,
    });
    expect(resolveChildColor('blue', 'dark').color).toBe(ChildColors.blue.dark);
  });

  it('未設定・未知のキーは「色なし」にフォールバックする', () => {
    for (const key of [undefined, null, '', 'unknown']) {
      expect(resolveChildColor(key, 'light')).toEqual({
        key: null,
        label: UnsetChildColor.label,
        color: UnsetChildColor.light,
      });
    }
  });

  it('isChildColorKey は定義済みのキーだけを受け付ける', () => {
    expect(isChildColorKey('red')).toBe(true);
    expect(isChildColorKey('gray')).toBe(false);
    expect(isChildColorKey(1)).toBe(false);
  });
});
