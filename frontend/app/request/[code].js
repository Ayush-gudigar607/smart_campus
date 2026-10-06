import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii, spacing, shadows } from '../../src/theme';
import HeaderBar from '../../src/components/HeaderBar';
import StatusBadge from '../../src/components/StatusBadge';
import PriorityDot from '../../src/components/PriorityDot';
import Button from '../../src/components/Button';
import { apiGetRequestDetail, apiCancelRequest } from '../../src/api/client';

const TIMELINE_STEPS = [
  { key: 'pending', title: 'Submitted', desc: 'Logged & queued for triage' },
  { key: 'assigned', title: 'Assigned', desc: 'Routed to department technician' },
  { key: 'in_progress', title: 'In Progress', desc: 'Staff dispatched on-site' },
  { key: 'completed', title: 'Resolved', desc: 'Verified & closed' },
];

export default function TicketDetailScreen() {
  const { code } = useLocalSearchParams();
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const res = await apiGetRequestDetail(code);
      if (isMounted) {
        if (res && res.data) {
          setTicket(res.data);
        }
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Request',
      `Are you sure you want to cancel ticket #${code}?`,
      [
        { text: 'Keep Ticket', style: 'cancel' },
        {
          text: 'Cancel Request',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            const res = await apiCancelRequest(code);
            setCancelling(false);
            if (res.success) {
              setTicket((prev) => ({ ...prev, status: 'cancelled' }));
              Alert.alert('Ticket Cancelled', 'The request has been marked as cancelled.');
            }
          },
        },
      ]
    );
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'completed':
        return 3;
      case 'in_progress':
        return 2;
      case 'assigned':
        return 1;
      case 'pending':
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title={`Ticket #${code}`} showBack={true} />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching ticket details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title="Ticket Not Found" showBack={true} />
        <View style={styles.centerBox}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.status.cancelled.fg} />
          <Text style={styles.notFoundTitle}>Ticket #{code} not found</Text>
          <Button title="Go Back" variant="outline" onPress={() => router.back()} style={styles.backBtn} />
        </View>
      </SafeAreaView>
    );
  }

  const activeStep = getStepIndex(ticket.status);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar
        title={`#${ticket.code || code}`}
        subtitle={ticket.serviceTitle || 'Campus Service Request'}
        showBack={true}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Main Status & Priority Card */}
        <View style={styles.topCard}>
          <View style={styles.badgeRow}>
            <StatusBadge status={ticket.status} />
            <PriorityDot priority={ticket.priority} />
          </View>
          <Text style={styles.ticketTitle}>{ticket.title}</Text>
          <Text style={styles.ticketLocation}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} /> {ticket.location}
          </Text>
        </View>

        {/* Lifecycle Stepper Timeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Progress Timeline</Text>
          <View style={styles.timeline}>
            {TIMELINE_STEPS.map((step, index) => {
              const isPast = index < activeStep;
              const isCurrent = index === activeStep && ticket.status !== 'cancelled';
              const isCancelled = ticket.status === 'cancelled';

              return (
                <View key={step.key} style={styles.timelineRow}>
                  <View style={styles.indicatorCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        isPast && styles.timelineDotCompleted,
                        isCurrent && styles.timelineDotCurrent,
                        isCancelled && index === 0 && styles.timelineDotCancelled,
                      ]}
                    >
                      {isPast ? (
                        <Ionicons name="checkmark" size={12} color={colors.textInverse} />
                      ) : null}
                    </View>
                    {index < TIMELINE_STEPS.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isPast && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepTitle,
                        (isCurrent || isPast) && styles.stepTitleActive,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Detailed Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Issue Description</Text>
          <Text style={styles.descriptionText}>{ticket.description}</Text>
        </View>

        {/* Assignment & Department Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Assignment & Department</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Handling Department:</Text>
            <Text style={styles.infoValue}>{ticket.department || 'Campus Facilities'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Technician:</Text>
            <Text style={styles.infoValue}>{ticket.assignedTo || 'Pending Triage Dispatch'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Logged Time:</Text>
            <Text style={styles.infoValue}>
              {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Recent'}
            </Text>
          </View>
        </View>

        {/* History Log Events */}
        {ticket.history && ticket.history.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeader}>Activity History</Text>
            {ticket.history.map((h, i) => (
              <View key={i} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyStep}>{h.step}</Text>
                  <Text style={styles.historyTime}>{h.time}</Text>
                </View>
                {h.note && <Text style={styles.historyNote}>{h.note}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Cancel Action (Available for pending or assigned tickets) */}
        {ticket.status !== 'completed' && ticket.status !== 'cancelled' && (
          <Button
            title="Cancel Request"
            variant="destructive"
            loading={cancelling}
            onPress={handleCancel}
            style={styles.cancelBtn}
            accessibilityLabel="Cancel Request"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  notFoundTitle: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  backBtn: {
    minWidth: 140,
  },
  topCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.elevated,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ticketTitle: {
    fontSize: typography.headlineMd.fontSize,
    lineHeight: typography.headlineMd.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ticketLocation: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textMuted,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  cardHeader: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm + 4,
  },
  timeline: {
    paddingLeft: spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  indicatorCol: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 20,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  timelineDotCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineDotCancelled: {
    backgroundColor: colors.status.cancelled.fg,
    borderColor: colors.status.cancelled.fg,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
    minHeight: 28,
  },
  timelineLineCompleted: {
    backgroundColor: colors.secondary,
  },
  stepContent: {
    flex: 1,
    paddingTop: 1,
  },
  stepTitle: {
    fontSize: typography.labelLg.fontSize,
    lineHeight: typography.labelLg.lineHeight,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stepTitleActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
    marginTop: 2,
  },
  descriptionText: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  infoLabel: {
    fontSize: typography.bodyMd.fontSize,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: typography.bodyMd.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  historyItem: {
    backgroundColor: colors.surfaceMuted,
    padding: spacing.sm + 2,
    borderRadius: radii.md,
    marginBottom: spacing.xs + 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  historyStep: {
    fontSize: typography.labelSm.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  historyTime: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  historyNote: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: spacing.sm,
  },
});
