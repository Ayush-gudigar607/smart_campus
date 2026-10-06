import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

export default function PriorityDot({ priority = 'medium', showLabel = true, style }) {
  const normPriority = (priority || 'medium').toLowerCase();
  const token = colors.priority[normPriority] || colors.priority.medium;

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="text"
      accessibilityLabel={`Priority: ${token.label}`}
    >
      <View style={[styles.dot, { backgroundColor: token.color }]} />
      {showLabel && (
        <Text style={[styles.label, { color: token.color }]}>
          {token.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: spacing.xs + 2,
  },
  label: {
    fontSize: typography.labelSm.fontSize,
    lineHeight: typography.labelSm.lineHeight,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
