export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  /** カード・リスト項目などの面 */
  surface: string;
  surfaceSelected: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  /** primary の上に載せる文字色 */
  onPrimary: string;
  danger: string;
  /** danger の上に載せる文字色 */
  onDanger: string;
};

// 配色は中立色を基調にした仮のもの。ブランドカラーが決まったらこのファイルだけを変更する。
// 文字と背景の組み合わせは WCAG AA（4.5:1）以上を src/__tests__/theme.test.ts で検証している。
export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    surface: '#F2F3F5',
    surfaceSelected: '#E3E5E9',
    text: '#111418',
    textSecondary: '#5B616B',
    border: '#D5D8DD',
    primary: '#2F6FED',
    onPrimary: '#FFFFFF',
    danger: '#C62828',
    onDanger: '#FFFFFF',
  },
  dark: {
    background: '#0E1013',
    surface: '#1B1E23',
    surfaceSelected: '#2A2E35',
    text: '#F2F4F7',
    textSecondary: '#A8AFBA',
    border: '#343942',
    primary: '#7FA8FF',
    onPrimary: '#0B1220',
    danger: '#FF8A80',
    onDanger: '#1A0000',
  },
};
