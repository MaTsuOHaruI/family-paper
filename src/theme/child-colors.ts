import type { ColorScheme } from './colors';

// FR-010 / FR-047: 子どもの表示色。色だけで区別させないため、必ず文字ラベル（label）を併用する。
// children.color にはキー（例: 'blue'）を保存し、実際の色値はここで解決する（提案。S1A-03 で確定）。
export const CHILD_COLOR_KEYS = ['red', 'orange', 'green', 'blue', 'purple', 'pink'] as const;

export type ChildColorKey = (typeof CHILD_COLOR_KEYS)[number];

type ChildColorDefinition = { label: string; light: string; dark: string };

export const ChildColors: Record<ChildColorKey, ChildColorDefinition> = {
  red: { label: '赤', light: '#D64545', dark: '#FF8A8A' },
  orange: { label: 'オレンジ', light: '#C96A00', dark: '#FFB04D' },
  green: { label: '緑', light: '#2E8B57', dark: '#5BD08A' },
  blue: { label: '青', light: '#1F7AE0', dark: '#6BB2FF' },
  purple: { label: '紫', light: '#8E4FD6', dark: '#B88CFF' },
  pink: { label: 'ピンク', light: '#D6458F', dark: '#FF8CBF' },
};

/** 色が未設定（任意項目）の子ども、または未知のキーに使う色 */
export const UnsetChildColor: ChildColorDefinition = {
  label: '色なし',
  light: '#7A808A',
  dark: '#9AA1AB',
};

export function isChildColorKey(value: unknown): value is ChildColorKey {
  return typeof value === 'string' && (CHILD_COLOR_KEYS as readonly string[]).includes(value);
}

export type ResolvedChildColor = {
  key: ChildColorKey | null;
  label: string;
  color: string;
};

export function resolveChildColor(
  key: string | null | undefined,
  scheme: ColorScheme,
): ResolvedChildColor {
  if (isChildColorKey(key)) {
    const definition = ChildColors[key];
    return { key, label: definition.label, color: definition[scheme] };
  }
  return { key: null, label: UnsetChildColor.label, color: UnsetChildColor[scheme] };
}
