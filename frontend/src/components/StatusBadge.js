import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii, spacing } from '../theme';

export default function StatusBadge({ status = 'pending', style }) {
  const normStatus = (status || 'pending').toLowerCase().replace(' ', '_');
  const token = colors.status[normStatus] || colors.status.pending;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: token.bg, borderColor: token.border },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${token.label}`}
    >
      <Text style={[styles.text, { color: token.fg }]}>{token.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 26,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm + 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.labelSm.fontSize,
    lineHeight: typography.labelSm.lineHeight,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
