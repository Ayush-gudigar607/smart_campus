import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiGetStaffQueue, apiUpdateRequestStatus, getCurrentUser } from '../src/api/client';
import HeaderBar from '../src/components/HeaderBar';
import Button from '../src/components/Button';
import PriorityDot from '../src/components/PriorityDot';
import { colors, radii, shadows, spacing, typography } from '../src/theme';

export default function StaffDashboard() {
  const router = useRouter();
  const [queue, setQueue] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingCode, setUpdatingCode] = useState(null);

  const loadQueue = useCallback(async () => {
    const result = await apiGetStaffQueue();
    if (result.success) {
      setQueue(result.data.items || []);
      setCounts(result.data.counts || {});
    } else Alert.alert('Work queue unavailable', result.message);
    setLoading(false);
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  const updateStatus = async (request, status) => {
    setUpdatingCode(request.requestCode);
    const result = await apiUpdateRequestStatus(request.requestCode, status, status === 'completed' ? 'Completed by assigned staff.' : undefined);
    setUpdatingCode(null);
    if (!result.success) return Alert.alert('Update failed', result.message);
    await loadQueue();
  };

  return <SafeAreaView style={styles.safeArea} edges={['top']}>
    <HeaderBar title="Staff Work Queue" subtitle={`${getCurrentUser().name || 'Staff member'} • Assigned requests`} />
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); loadQueue(); }} colors={[colors.primary]} />}>
      {loading && !queue.length ? <ActivityIndicator size="large" color={colors.primary} style={styles.loader} /> : <>
        <View style={styles.summary}><Text style={styles.summaryText}>{counts.assigned || 0} assigned · {counts.in_progress || 0} in progress</Text><Text style={styles.overdue}>{counts.overdue || 0} overdue</Text></View>
        {queue.length ? queue.map((request) => <View key={request.requestCode} style={styles.card}>
          <View style={styles.cardHeader}><View style={styles.cardText}><Text style={styles.code}>{request.requestCode}</Text><Text style={styles.title}>{request.title}</Text></View><PriorityDot priority={request.priority} /></View>
          <Text style={styles.meta}>{request.serviceName} · {request.location || 'Campus location not specified'}</Text>
          <Text style={styles.meta}>Due: {request.dueAt ? new Date(request.dueAt).toLocaleString() : 'Not set'}</Text>
          <Button title={request.status === 'assigned' ? 'Start work' : 'Mark completed'} size="sm" loading={updatingCode === request.requestCode} onPress={() => updateStatus(request, request.status === 'assigned' ? 'in_progress' : 'completed')} style={styles.action} />
        </View>) : <View style={styles.empty}><Text style={styles.emptyTitle}>No assigned requests</Text><Text style={styles.meta}>New work assigned to you will appear here.</Text></View>}
        <Button title="Sign out" variant="outline" onPress={() => router.replace('/login')} style={styles.signOut} />
      </>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface }, container: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md, paddingBottom: spacing.xxl }, loader: { marginTop: spacing.xxl }, summary: { backgroundColor: colors.primaryLight, borderRadius: radii.lg, padding: spacing.md, flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }, summaryText: { color: colors.primary, fontWeight: '700' }, overdue: { color: colors.status.cancelled.fg, fontWeight: '700' }, card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, padding: spacing.md, marginBottom: spacing.md, ...shadows.card }, cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, cardText: { flex: 1, paddingRight: spacing.sm }, code: { fontSize: typography.labelSm.fontSize, color: colors.primary, fontWeight: '700' }, title: { fontSize: typography.headlineSm.fontSize, color: colors.textPrimary, fontWeight: '700', marginTop: 2 }, meta: { fontSize: typography.caption.fontSize, color: colors.textMuted, marginTop: spacing.xs }, action: { marginTop: spacing.md }, empty: { backgroundColor: colors.surface, borderRadius: radii.xl, padding: spacing.xl, alignItems: 'center' }, emptyTitle: { fontSize: typography.headlineSm.fontSize, color: colors.textPrimary, fontWeight: '700' }, signOut: { marginTop: spacing.lg },
});
