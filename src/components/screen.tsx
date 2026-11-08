import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { MAX_CONTENT_WIDTH, Spacing, useAppTheme } from '@/theme';

type Props = {
  children: ReactNode;
  /** false にすると ScrollView を使わない（内部で独自にスクロールする画面向け） */
  scroll?: boolean;
};

/** すべての画面の土台。背景色・余白・広い画面での最大幅を共通化する。 */
export function Screen({ children, scroll = true }: Props) {
  const { colors } = useAppTheme();
  const content = <View style={styles.inner}>{children}</View>;

  if (!scroll) {
    return <View style={[styles.root, { backgroundColor: colors.background }]}>{content}</View>;
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
});
