import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii, spacing, shadows } from '../theme';

export default function StatCard({ label, count, color = colors.primary, icon }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={[styles.count, { color }]}>{count}</Text>
        {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 96,
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  count: {
    fontSize: typography.headlineLg.fontSize,
    lineHeight: typography.headlineLg.lineHeight,
    fontWeight: '700',
  },
  iconWrapper: {
    opacity: 0.85,
  },
  label: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
