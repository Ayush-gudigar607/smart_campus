import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii, spacing, shadows } from '../../src/theme';
import HeaderBar from '../../src/components/HeaderBar';
import { mockShuttles, mockFacilities } from '../../src/data/mockData';

export default function MobilityScreen() {
  const [selectedRoute, setSelectedRoute] = useState(mockShuttles[0].id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar
        title="Campus Mobility"
        subtitle="Shuttle tracking & facility access"
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Banner Section */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconBox}>
              <Ionicons name="bus" size={26} color={colors.primary} />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Smart Shuttle Network</Text>
              <Text style={styles.bannerSubtitle}>
                Live GPS telemetry across North & South campus loops
              </Text>
            </View>
          </View>
        </View>

        {/* Live Shuttle Fleet Tracker */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Shuttles</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE GPS</Text>
          </View>
        </View>

        {mockShuttles.map((shuttle) => {
          const isSelected = selectedRoute === shuttle.id;
          return (
            <TouchableOpacity
              key={shuttle.id}
              activeOpacity={0.88}
              onPress={() => setSelectedRoute(shuttle.id)}
              style={[styles.shuttleCard, isSelected && styles.shuttleCardSelected]}
              accessibilityRole="button"
              accessibilityLabel={`${shuttle.route}, Next in ${shuttle.nextArrival}`}
            >
              <View style={styles.shuttleHeader}>
                <View style={styles.routeBox}>
                  <Text style={styles.routeName}>{shuttle.route}</Text>
                  <Text style={styles.currentStop}>Approaching: {shuttle.currentStop}</Text>
                </View>
                <View style={styles.arrivalBadge}>
                  <Text style={styles.arrivalCountdown}>{shuttle.nextArrival}</Text>
                  <Text style={styles.arrivalLabel}>{shuttle.status}</Text>
                </View>
              </View>

              {/* Occupancy Indicator */}
              <View style={styles.capacityRow}>
                <View style={styles.capacityLabelRow}>
                  <Text style={styles.capacityLabel}>Onboard Capacity</Text>
                  <Text style={styles.capacityValue}>{shuttle.capacity}</Text>
                </View>
                <View style={styles.capacityTrack}>
                  <View
                    style={[
                      styles.capacityFill,
                      {
                        width: shuttle.capacity,
                        backgroundColor:
                          parseInt(shuttle.capacity) > 80
                            ? colors.status.critical.fg
                            : colors.secondary,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Stops list when selected */}
              {isSelected && (
                <View style={styles.stopsContainer}>
                  <Text style={styles.stopsTitle}>Route Stops</Text>
                  <View style={styles.stopsTimeline}>
                    {shuttle.stops.map((stop, index) => {
                      const isCurrent = stop === shuttle.currentStop;
                      return (
                        <View key={index} style={styles.stopItem}>
                          <View
                            style={[
                              styles.stopDot,
                              isCurrent && styles.stopDotCurrent,
                            ]}
                          />
                          <Text
                            style={[
                              styles.stopName,
                              isCurrent && styles.stopNameCurrent,
                            ]}
                          >
                            {stop} {isCurrent ? '• Next' : ''}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Campus Facilities Occupancy Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Facility Availability</Text>
          <Text style={styles.sectionSubtitle}>Real-time sensor occupancy</Text>
        </View>

        {mockFacilities.map((fac) => (
          <View key={fac.id} style={styles.facilityCard}>
            <View style={styles.facilityTop}>
              <View style={styles.facilityInfo}>
                <Text style={styles.facilityName}>{fac.name}</Text>
                <Text style={styles.facilityBuilding}>{fac.building}</Text>
              </View>
              <View
                style={[
                  styles.facilityStatusBadge,
                  {
                    backgroundColor:
                      fac.availableCount > 0 ? colors.secondaryLight : colors.status.cancelled.bg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.facilityStatusText,
                    {
                      color:
                        fac.availableCount > 0 ? colors.secondary : colors.status.cancelled.fg,
                    },
                  ]}
                >
                  {fac.status}
                </Text>
              </View>
            </View>

            <View style={styles.facilityCapacity}>
              <Text style={styles.facilityCountText}>
                <Text style={styles.facilityAvailableHighlight}>
                  {fac.availableCount}
                </Text>{' '}
                of {fac.totalCount} spaces free
              </Text>
            </View>
          </View>
        ))}
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
  bannerCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm + 4,
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
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
    marginRight: spacing.xs,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  shuttleCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  shuttleCardSelected: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  shuttleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm + 4,
  },
  routeBox: {
    flex: 1,
    marginRight: spacing.sm,
  },
  routeName: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  currentStop: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textMuted,
    marginTop: 2,
  },
  arrivalBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  arrivalCountdown: {
    fontSize: typography.labelLg.fontSize,
    lineHeight: typography.labelLg.lineHeight,
    fontWeight: '700',
    color: colors.primary,
  },
  arrivalLabel: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  capacityRow: {
    marginBottom: spacing.xs,
  },
  capacityLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  capacityLabel: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
  },
  capacityValue: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  capacityTrack: {
    height: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 3,
  },
  stopsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm + 4,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  stopsTitle: {
    fontSize: typography.labelMd.fontSize,
    lineHeight: typography.labelMd.lineHeight,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  stopsTimeline: {
    paddingLeft: spacing.xs,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  stopDotCurrent: {
    backgroundColor: colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stopName: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textSecondary,
  },
  stopNameCurrent: {
    fontWeight: '700',
    color: colors.primary,
  },
  facilityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    ...shadows.card,
  },
  facilityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 4,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: typography.labelLg.fontSize,
    lineHeight: typography.labelLg.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  facilityBuilding: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
  },
  facilityStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  facilityStatusText: {
    fontSize: typography.labelSm.fontSize,
    fontWeight: '600',
  },
  facilityCapacity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityCountText: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textSecondary,
  },
  facilityAvailableHighlight: {
    fontWeight: '700',
    color: colors.primary,
  },
});
