import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii, spacing, shadows } from '../../src/theme';
import HeaderBar from '../../src/components/HeaderBar';
import Button from '../../src/components/Button';
import { useAuth } from '../../src/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [roleMode, setRoleMode] = useState('student');

  const handleSupportCall = () => {
    Alert.alert(
      'Campus Security & Operations Helpdesk',
      'Contact: +91 80 2345 6789\nEmergency Campus Dispatch: Ext 911',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar title="Profile & Account" subtitle="Student verification & settings" />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentFrame}>
          {/* User Profile Card */}
          <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {user.name ? user.name.split(' ').map((n) => n[0]).join('') : 'AP'}
              </Text>
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>
                {user.usn} • {user.department || 'CSE'}
              </Text>
              <View style={styles.activePill}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active Student ID</Text>
              </View>
            </View>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>{user.department || 'CSE'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Current Year</Text>
              <Text style={styles.detailValue}>Year {user.currentYear || 2}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mobile</Text>
              <Text style={styles.detailValue}>{user.mobileNumber || '+91 9876543210'}</Text>
            </View>
          </View>
          </View>

          {/* Quick Help & Emergency Support */}
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>Campus Assistance</Text>

          <TouchableOpacity style={styles.settingRow} onPress={handleSupportCall} activeOpacity={0.7}>
            <View style={styles.settingIconBox}>
              <Ionicons name="call-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Operations & Security Hotline</Text>
              <Text style={styles.settingDesc}>24/7 campus dispatch and facility desk</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert('Campus Guidelines', 'Maintenance SLAs:\n• Urgent: 4 hours\n• High: 8 hours\n• Normal: 24 hours')
            }
            activeOpacity={0.7}
          >
            <View style={styles.settingIconBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>SLA Policies & Facility Guidelines</Text>
              <Text style={styles.settingDesc}>Service resolution standards</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          </View>

          {/* Action Button */}
          <Button
            title="Sign Out / Switch Persona"
            variant="outline"
            onPress={() => router.push('/login')}
            style={styles.logoutButton}
          />
        </View>
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
    flexGrow: 1,
  },
  contentFrame: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.elevated,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textInverse,
  },
  profileMeta: {
    flex: 1,
  },
  userName: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userRole: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textMuted,
    marginTop: 2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
    marginTop: spacing.xs,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
    marginRight: spacing.xs,
  },
  activeText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: '600',
    color: colors.secondary,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  detailItem: {
    width: '50%',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: typography.labelMd.fontSize,
    lineHeight: typography.labelMd.lineHeight,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  groupTitle: {
    fontSize: typography.headlineSm.fontSize,
    lineHeight: typography.headlineSm.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm + 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.labelLg.fontSize,
    lineHeight: typography.labelLg.lineHeight,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingDesc: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: spacing.xs,
  },
});
