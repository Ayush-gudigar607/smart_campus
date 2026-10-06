import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, radii, spacing } from '../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'destructive'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  accessibilityLabel,
}) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'destructive':
        return styles.destructiveContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'destructive':
        return styles.destructiveText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        getContainerStyle(),
        size === 'sm' && styles.buttonSm,
        disabled && styles.disabledContainer,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' ? colors.primary : colors.textInverse}
        />
      ) : (
        <>
          {icon ? icon : null}
          <Text
            style={[
              styles.textBase,
              getTextStyle(),
              icon ? { marginLeft: spacing.xs + 2 } : null,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 48,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  buttonSm: {
    height: 38,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm + 4,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.primaryLight,
  },
  outlineContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  destructiveContainer: {
    backgroundColor: colors.status.cancelled.fg,
  },
  disabledContainer: {
    backgroundColor: colors.border,
    borderColor: colors.border,
    opacity: 0.6,
  },
  textBase: {
    fontSize: typography.labelLg.fontSize,
    lineHeight: typography.labelLg.lineHeight,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.textPrimary,
  },
  destructiveText: {
    color: colors.textInverse,
  },
  disabledText: {
    color: colors.textMuted,
  },
});
