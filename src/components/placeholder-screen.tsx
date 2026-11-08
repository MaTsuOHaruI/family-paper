import { Link, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';
import { MIN_TOUCH_TARGET, Radius, Spacing, useAppTheme } from '@/theme';

export type PlaceholderLink = { label: string; href: Href };

type Props = {
  /** 要件書の画面ID（例: SCR-001） */
  scrId: string;
  title: string;
  /** 要件書 §5 の「表示内容」。実装時にこの一覧を実UIへ置き換える */
  items: readonly string[];
  links?: readonly PlaceholderLink[];
};

/**
 * S0-02 用の一時的なスケルトン表示（スタブ）。実データ・実機能は持たない。
 * 各画面の実装タスクで、items の項目を実UIへ置き換えていく。
 */
export function PlaceholderScreen({ scrId, title, items, links }: Props) {
  const { colors } = useAppTheme();

  return (
    <Screen>
      <AppText variant="caption" tone="secondary">
        {scrId}（未実装のプレースホルダ）
      </AppText>
      <AppText variant="title">{title}</AppText>
      <View style={styles.list}>
        {items.map((item) => (
          <AppText key={item} style={[styles.item, { backgroundColor: colors.surface }]}>
            {item}
          </AppText>
        ))}
      </View>
      {links?.map((link) => (
        <Link key={link.label} href={link.href} style={[styles.link, { color: colors.primary }]}>
          {link.label}
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.sm },
  item: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  link: {
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: Spacing.sm,
    textDecorationLine: 'underline',
  },
});
