import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii, spacing, shadows } from '../src/theme';
import HeaderBar from '../src/components/HeaderBar';
import { useNotifications } from '../src/hooks/useNotifications';

export default function NotificationsScreen() {
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
  } = useNotifications();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
        showBack={true}
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity
              onPress={markAllAsRead}
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
              style={styles.markReadBtn}
            >
              <Text style={styles.markReadText}>Mark read</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchNotifications}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.notificationCard, !item.read && styles.unreadCard]}>
            <View style={styles.iconCol}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      item.type === 'resolved'
                        ? colors.secondaryLight
                        : item.type === 'system_alert'
                        ? colors.status.critical.bg
                        : colors.primaryLight,
                  },
                ]}
              >
                <Ionicons
                  name={
                    item.type === 'resolved'
                      ? 'checkmark-done'
                      : item.type === 'system_alert'
                      ? 'warning-outline'
                      : 'notifications-outline'
                  }
                  size={20}
                  color={
                    item.type === 'resolved'
                      ? colors.secondary
                      : item.type === 'system_alert'
                      ? colors.status.critical.fg
                      : colors.primary
                  }
                />
              </View>
            </View>

            <View style={styles.contentCol}>
              <View style={styles.topRow}>
                <Text style={styles.notifTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifMessage}>{item.message}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up with campus updates.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    padding: spacing.md,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  markReadBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  markReadText: {
    fontSize: typography.labelMd.fontSize,
    color: colors.primary,
    fontWeight: '600',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  unreadCard: {
    borderColor: colors.primaryContainer,
    backgroundColor: colors.canvas,
  },
  iconCol: {
    marginRight: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: typography.labelLg.fontSize,
    lineHeight: typography.labelLg.lineHeight,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  notifMessage: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notifTime: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
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
    marginTop: spacing.xs,
  },
});
