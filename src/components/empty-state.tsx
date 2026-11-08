import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Spacing } from '@/theme';

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** データがまだない画面の表示（一覧が空のとき等）。次に取る行動を示す。 */
export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="heading" style={styles.centered}>
        {title}
      </AppText>
      {description ? (
        <AppText tone="secondary" style={styles.centered}>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  centered: { textAlign: 'center' },
});
