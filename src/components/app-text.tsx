import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontSize, useAppTheme } from '@/theme';

type Variant = 'title' | 'heading' | 'body' | 'caption';
type Tone = 'default' | 'secondary' | 'danger';

type Props = TextProps & {
  variant?: Variant;
  tone?: Tone;
};

export function AppText({ variant = 'body', tone = 'default', style, ...rest }: Props) {
  const { colors } = useAppTheme();
  const color =
    tone === 'secondary' ? colors.textSecondary : tone === 'danger' ? colors.danger : colors.text;

  return (
    <Text
      accessibilityRole={variant === 'title' || variant === 'heading' ? 'header' : undefined}
      style={[styles[variant], { color }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: FontSize.title, fontWeight: '700' },
  heading: { fontSize: FontSize.heading, fontWeight: '600' },
  body: { fontSize: FontSize.body },
  caption: { fontSize: FontSize.caption },
});
