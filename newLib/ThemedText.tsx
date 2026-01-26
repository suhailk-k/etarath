import { useMemo, type FC, type ReactNode } from 'react';

import type { TextProps as RNTextProps } from 'react-native';
import { Text as RNText } from 'react-native';

import { useTheme } from '@/newLib/theme/hooks/useTheme';
import { useTranslation } from '@/newLib/translations/hooks/useTranslation';
import { ThemeColors } from '@/theme/colors';
import { TYPOGRAPHY, TypographyVariant } from '@/theme/fonts';
import { TxKeyPath } from '@/theme/translations/en';

export interface ThemedTextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: keyof ThemeColors;
  children?: ReactNode;
  tx?: TxKeyPath;
  txOptions?: Record<string, any>;
}

export const ThemedText: FC<ThemedTextProps> = ({
  variant = 'subheading01',
  color = 'white',
  style,
  children,
  tx,
  txOptions,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const computedStyle = useMemo(
    () => [variant && TYPOGRAPHY[variant], { color: theme[color as keyof ThemeColors] }, style],
    [variant, color, style, theme]
  );

  const content = tx ? String(t(tx, txOptions)) : children;

  return (
    <RNText style={computedStyle} {...rest}>
      {content}
    </RNText>
  );
};
