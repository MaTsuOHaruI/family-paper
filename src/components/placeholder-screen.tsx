import { Link, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

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
 * S0-02 用の一時的なスケルトン表示（スタブ）。
 * 実データ・実機能は持たない。S0-05 の共通UIで置き換えを検討する。
 */
export function PlaceholderScreen({ scrId, title, items, links }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}>
      <Text style={[styles.badge, { color: colors.textSecondary }]}>
        {scrId}（未実装のプレースホルダ）
      </Text>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <View style={styles.list}>
        {items.map((item) => (
          <Text
            key={item}
            style={[styles.item, { color: colors.text, backgroundColor: colors.backgroundElement }]}>
            {item}
          </Text>
        ))}
      </View>
      {links?.map((link) => (
        <Link key={link.label} href={link.href} style={[styles.link, { color: colors.text }]}>
          {link.label}
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  badge: {
    fontSize: 13,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  list: {
    gap: Spacing.two,
  },
  item: {
    fontSize: 16,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
    paddingVertical: Spacing.two,
  },
});
