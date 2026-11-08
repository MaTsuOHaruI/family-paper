import { Pressable, StyleSheet, Text } from 'react-native';

import { FontSize, MIN_TOUCH_TARGET, Radius, Spacing, useAppTheme } from '@/theme';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityHint,
}: Props) {
  const { colors } = useAppTheme();
  const palette = {
    primary: { background: colors.primary, text: colors.onPrimary, border: colors.primary },
    secondary: { background: colors.surface, text: colors.text, border: colors.border },
    danger: { background: colors.danger, text: colors.onDanger, border: colors.danger },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.background, borderColor: palette.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: FontSize.body, fontWeight: '600' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
