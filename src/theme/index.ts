import { Colors, type ColorScheme, type ThemeColors } from './colors';
import { useColorScheme } from './use-color-scheme';

export { Colors, type ColorScheme, type ThemeColors } from './colors';
export {
  ChildColors,
  CHILD_COLOR_KEYS,
  UnsetChildColor,
  isChildColorKey,
  resolveChildColor,
  type ChildColorKey,
  type ResolvedChildColor,
} from './child-colors';
export { FontSize, MAX_CONTENT_WIDTH, MIN_TOUCH_TARGET, Radius, Spacing } from './tokens';
export { useColorScheme } from './use-color-scheme';

export type AppTheme = { scheme: ColorScheme; colors: ThemeColors };

/** 現在の配色（ライト/ダーク）に対応した色トークンを返す */
export function useAppTheme(): AppTheme {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: Colors[scheme] };
}
