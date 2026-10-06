import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, radii, spacing, shadows } from '../theme';
import StatusBadge from './StatusBadge';
import PriorityDot from './PriorityDot';

export default function TicketCard({ ticket, onPress }) {
  if (!ticket) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Ticket ${ticket.code}, ${ticket.title}, Status: ${ticket.status}`}
    >
      {/* Top row: Ticket ID & Status Pill */}
      <View style={styles.topRow}>
        <Text style={styles.ticketCode}>#{ticket.code}</Text>
        <StatusBadge status={ticket.status} />
      </View>

      {/* Middle row: Service & Description */}
      <View style={styles.middleSection}>
        <Text style={styles.serviceTitle} numberOfLines={1}>
          {ticket.serviceTitle || ticket.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {ticket.description}
        </Text>
      </View>

      {/* Bottom Footer: Priority dot, Building tag, and Time */}
      <View style={styles.footer}>
        <PriorityDot priority={ticket.priority} />

        <View style={styles.buildingTag}>
          <Text style={styles.buildingText} numberOfLines={1}>
            {ticket.location || ticket.department || 'Campus'}
          </Text>
        </View>

        <Text style={styles.timeText}>
          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 4,
  },
  ticketCode: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  middleSection: {
    marginBottom: spacing.sm + 4,
  },
  serviceTitle: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs + 4,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  buildingTag: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.sm,
    maxWidth: '45%',
  },
  buildingText: {
    fontSize: typography.labelSm.fontSize,
    lineHeight: typography.labelSm.lineHeight,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timeText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
  },
});
