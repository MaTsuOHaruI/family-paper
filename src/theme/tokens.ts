export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
} as const;

export const FontSize = {
  caption: 13,
  body: 16,
  heading: 20,
  title: 26,
} as const;

/** タップ領域の最小の高さ（NFR-001: 操作しやすさ） */
export const MIN_TOUCH_TARGET = 48;

/** 広い画面（Web・タブレット）で内容を中央に寄せる最大幅 */
export const MAX_CONTENT_WIDTH = 800;
