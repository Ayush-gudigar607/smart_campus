import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii, spacing, shadows } from '../../src/theme';
import HeaderBar from '../../src/components/HeaderBar';
import StatCard from '../../src/components/StatCard';
import TicketCard from '../../src/components/TicketCard';
import Button from '../../src/components/Button';
import { useAuth } from '../../src/hooks/useAuth';
import { useRequests } from '../../src/hooks/useRequests';
import { useServices } from '../../src/hooks/useServices';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { requests, summary, loading, refreshing, refresh, isLive } = useRequests();
  const { services } = useServices();

  const activeTickets = requests.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar
        title="CampusConnect"
        subtitle={`${user.name} • ${user.department || 'Student'}`}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Backend Connectivity Status Banner */}
        <View style={[styles.statusBanner, isLive ? styles.bannerLive : styles.bannerOffline]}>
          <Ionicons
            name={isLive ? 'checkmark-circle' : 'cloud-offline-outline'}
            size={18}
            color={isLive ? colors.secondary : colors.status.pending.fg}
          />
          <Text style={styles.statusBannerText}>
            {isLive
              ? 'Connected to Campus Express API (:5000)'
              : 'Offline preview mode (ready to connect to backend)'}
          </Text>
        </View>

        {/* Hero Quick Action Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Need Campus Assistance?</Text>
            <Text style={styles.heroSubtitle}>
              Submit maintenance, Wi-Fi, lab, or hostel requests with real-time staff tracking.
            </Text>
            <View style={styles.heroActions}>
              <Button
                title="+ New Service Request"
                variant="primary"
                onPress={() => router.push('/new-request')}
                accessibilityLabel="Create a new service request"
                style={styles.heroButton}
              />
            </View>
          </View>
        </View>

        {/* Operational Overview Metrics */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <TouchableOpacity onPress={() => router.push('/requests')}>
            <Text style={styles.seeAllText}>Manage All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="In Progress"
            count={summary?.in_progress || 0}
            color={colors.status.in_progress.fg}
            icon={<Ionicons name="construct-outline" size={18} color={colors.status.in_progress.fg} />}
          />
          <View style={styles.statGap} />
          <StatCard
            label="Assigned"
            count={summary?.assigned || 0}
            color={colors.status.assigned.fg}
            icon={<Ionicons name="person-outline" size={18} color={colors.status.assigned.fg} />}
          />
          <View style={styles.statGap} />
          <StatCard
            label="Pending"
            count={summary?.pending || 0}
            color={colors.status.pending.fg}
            icon={<Ionicons name="time-outline" size={18} color={colors.status.pending.fg} />}
          />
        </View>

        {/* Services Taxonomy Quick Links */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campus Services</Text>
          <Text style={styles.sectionSubtitle}>Select category to report</Text>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceItem}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/new-request',
                  params: { serviceId: service.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Select ${service.name}`}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons
                  name={
                    service.icon === 'wifi'
                      ? 'wifi-outline'
                      : service.icon === 'flash'
                      ? 'flash-outline'
                      : service.icon === 'water'
                      ? 'water-outline'
                      : service.icon === 'thermometer'
                      ? 'thermometer-outline'
                      : service.icon === 'desktop'
                      ? 'hardware-chip-outline'
                      : 'business-outline'
                  }
                  size={22}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.serviceName} numberOfLines={2}>
                {service.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Service Requests Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Tickets</Text>
          <TouchableOpacity onPress={() => router.push('/requests')}>
            <Text style={styles.seeAllText}>View all ({requests.length})</Text>
          </TouchableOpacity>
        </View>

        {activeTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={44} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No open tickets</Text>
            <Text style={styles.emptySubtitle}>All campus requests are resolved and up to date.</Text>
          </View>
        ) : (
          activeTickets.map((ticket) => (
            <TicketCard
              key={ticket.code || ticket.id}
              ticket={ticket}
              onPress={() => router.push(`/request/${ticket.code}`)}
            />
          ))
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  bannerLive: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
  },
  bannerOffline: {
    backgroundColor: colors.status.pending.bg,
    borderColor: colors.status.pending.border,
  },
  statusBannerText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textPrimary,
    fontWeight: '500',
    marginLeft: spacing.xs + 2,
    flex: 1,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.elevated,
  },
  heroContent: {
    flexDirection: 'column',
  },
  heroTitle: {
    fontSize: typography.headlineMd.fontSize,
    lineHeight: typography.headlineMd.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  heroActions: {
    flexDirection: 'row',
  },
  heroButton: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm + 4,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
  },
  seeAllText: {
    fontSize: typography.labelMd.fontSize,
    lineHeight: typography.labelMd.lineHeight,
    fontWeight: '600',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  statGap: {
    width: spacing.sm,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  serviceItem: {
    width: '31%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
    minHeight: 90,
    justifyContent: 'center',
    ...shadows.card,
  },
  serviceIconContainer: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  serviceName: {
    fontSize: typography.labelSm.fontSize,
    lineHeight: typography.labelSm.lineHeight,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
