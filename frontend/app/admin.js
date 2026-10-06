import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiAssignRequest, apiAutoAssignRequest, apiGetAdminDashboard, apiGetAvailableStaff, getCurrentUser } from '../src/api/client';
import HeaderBar from '../src/components/HeaderBar';
import StatCard from '../src/components/StatCard';
import StatusBadge from '../src/components/StatusBadge';
import PriorityDot from '../src/components/PriorityDot';
import Button from '../src/components/Button';
import { colors, radii, shadows, spacing, typography } from '../src/theme';

const isAssignable = (request) => !['completed', 'cancelled'].includes(request.status);

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [assigningStaffId, setAssigningStaffId] = useState(null);
  const [autoAssigningCode, setAutoAssigningCode] = useState(null);

  const loadDashboard = useCallback(async () => {
    const result = await apiGetAdminDashboard();
    if (result.success) setDashboard(result.data);
    else Alert.alert('Dashboard unavailable', result.message);
    setLoading(false);
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const openStaffPicker = async (request) => {
    setSelectedRequest(request);
    setStaff([]);
    setStaffLoading(true);
    const result = await apiGetAvailableStaff(request.departmentId);
    if (result.success) setStaff(result.data);
    else Alert.alert('Staff unavailable', result.message);
    setStaffLoading(false);
  };

  const assignStaff = async (member) => {
    if (!selectedRequest) return;
    setAssigningStaffId(member.id);
    const result = await apiAssignRequest(selectedRequest.requestCode, member.id);
    setAssigningStaffId(null);
    if (!result.success) return Alert.alert('Assignment failed', result.message);
    setSelectedRequest(null);
    setLoading(true);
    await loadDashboard();
  };

  const autoAssignRequest = async (request) => {
    setAutoAssigningCode(request.requestCode);
    const result = await apiAutoAssignRequest(request.requestCode);
    setAutoAssigningCode(null);
    if (!result.success) return Alert.alert('Auto-assign failed', result.message);
    setLoading(true);
    await loadDashboard();
  };

  const overview = dashboard?.overview || {};
  const requests = dashboard?.recentRequests || [];
  const departmentBreakdown = dashboard?.departmentBreakdown || [];

  return <SafeAreaView style={styles.safeArea} edges={['top']}>
    <HeaderBar title="Admin Dashboard" subtitle={`${getCurrentUser().name || 'Administrator'} • Campus operations`} />
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); loadDashboard(); }} colors={[colors.primary]} />}>
      {loading && !dashboard ? <ActivityIndicator size="large" color={colors.primary} style={styles.loader} /> : <>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}><Ionicons name="people-outline" size={24} color={colors.primary} /></View>
          <View style={styles.heroText}><Text style={styles.heroTitle}>Campus request control</Text><Text style={styles.heroSubtitle}>Review every request and route it to the right department staff.</Text></View>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Overall request statistics</Text><Text style={styles.sectionSubtitle}>{overview.total || 0} total</Text></View>
        <View style={styles.statsRow}>
          <StatCard label="Pending" count={overview.pending || 0} color={colors.status.pending.fg} icon={<Ionicons name="time-outline" size={18} color={colors.status.pending.fg} />} />
          <View style={styles.gap} />
          <StatCard label="Assigned" count={overview.assigned || 0} color={colors.status.assigned.fg} icon={<Ionicons name="person-outline" size={18} color={colors.status.assigned.fg} />} />
          <View style={styles.gap} />
          <StatCard label="In Progress" count={overview.inProgress || 0} color={colors.status.in_progress.fg} icon={<Ionicons name="construct-outline" size={18} color={colors.status.in_progress.fg} />} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Completed" count={overview.completed || 0} color={colors.secondary} icon={<Ionicons name="checkmark-done-outline" size={18} color={colors.secondary} />} />
          <View style={styles.gap} />
          <StatCard label="Unassigned" count={overview.unassigned || 0} color={colors.status.cancelled.fg} icon={<Ionicons name="alert-circle-outline" size={18} color={colors.status.cancelled.fg} />} />
          <View style={styles.gap} />
          <View style={styles.averageCard}><Text style={styles.averageLabel}>Avg. resolution</Text><Text style={styles.averageValue}>{overview.avgResolutionHours ?? '—'}h</Text></View>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Department workload</Text><Text style={styles.sectionSubtitle}>Open requests</Text></View>
        <View style={styles.workloadCard}>{departmentBreakdown.map((department) => <View key={department.name} style={styles.workloadRow}><View><Text style={styles.workloadName}>{department.name}</Text><Text style={styles.muted}>{department.staffCount || 0} staff members</Text></View><Text style={styles.workloadCount}>{department.open || 0}</Text></View>)}</View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>All requests</Text><Text style={styles.sectionSubtitle}>{requests.length} requests</Text></View>
        {requests.length ? requests.map((request) => <View key={request.requestCode} style={styles.requestCard}>
          <View style={styles.ticketTop}><View style={styles.ticketHeading}><Text style={styles.requestCode}>{request.requestCode}</Text><Text style={styles.requestTitle}>{request.title}</Text></View><StatusBadge status={request.status} /></View>
          <View style={styles.metaRow}><PriorityDot priority={request.priority} /><Text style={styles.metaText}>{request.serviceName} · {request.departmentName}</Text></View>
          <Text style={styles.metaText}>Staff: {request.assignedStaffName || 'Not assigned'}{request.location ? ` · ${request.location}` : ''}</Text>
          <Text style={styles.metaText}>Submitted: {request.createdAt ? new Date(request.createdAt).toLocaleString() : '—'}</Text>
          {isAssignable(request) ? <View style={styles.actionRow}>
            {request.status === 'pending' ? <Button title="Auto-assign" size="sm" loading={autoAssigningCode === request.requestCode} onPress={() => autoAssignRequest(request)} style={[styles.actionButton, styles.actionButtonGap]} /> : null}
            <Button title={request.status === 'pending' ? 'Assign staff' : 'Reassign staff'} variant={request.status === 'pending' ? 'outline' : 'primary'} size="sm" onPress={() => openStaffPicker(request)} style={styles.actionButton} />
          </View> : null}
        </View>) : <View style={styles.empty}><Ionicons name="document-text-outline" size={44} color={colors.textMuted} /><Text style={styles.emptyTitle}>No requests yet</Text><Text style={styles.muted}>Student service requests will appear here.</Text></View>}
        <Button title="Sign out" variant="outline" onPress={() => router.replace('/login')} style={styles.signOut} />
      </>}
    </ScrollView>
    <Modal visible={Boolean(selectedRequest)} transparent animationType="fade" onRequestClose={() => setSelectedRequest(null)}>
      <View style={styles.modalBackdrop}><Pressable style={styles.modalDismissArea} onPress={() => !assigningStaffId && setSelectedRequest(null)} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{selectedRequest?.status === 'pending' ? 'Assign staff' : 'Reassign staff'}</Text>
          <Text style={styles.modalSubtitle}>{selectedRequest?.requestCode} · {selectedRequest?.departmentName}</Text>
          {staffLoading ? <ActivityIndicator color={colors.primary} style={styles.staffLoader} /> : staff.length ? staff.map((member) => <TouchableOpacity key={member.id} style={styles.staffRow} onPress={() => assignStaff(member)} disabled={Boolean(assigningStaffId)}><View style={styles.staffDetails}><Text style={styles.staffName}>{member.name}</Text><Text style={styles.muted}>{member.email}</Text></View>{assigningStaffId === member.id ? <ActivityIndicator color={colors.primary} /> : <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}</TouchableOpacity>) : <Text style={styles.muted}>No active staff are available in this department.</Text>}
          <Button title="Cancel" variant="outline" onPress={() => setSelectedRequest(null)} style={styles.cancelButton} />
        </View>
      </View>
    </Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface }, container: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md, paddingBottom: spacing.xxl }, loader: { marginTop: spacing.xxl }, heroCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, padding: spacing.md, marginBottom: spacing.lg, flexDirection: 'row', ...shadows.elevated }, heroIcon: { height: 48, width: 48, borderRadius: radii.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }, heroText: { flex: 1 }, heroTitle: { fontSize: typography.headlineMd.fontSize, fontWeight: '700', color: colors.textPrimary }, heroSubtitle: { fontSize: typography.bodyMd.fontSize, color: colors.textMuted, marginTop: 2 }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.sm, marginTop: spacing.xs }, sectionTitle: { fontSize: typography.headlineSm.fontSize, fontWeight: '700', color: colors.textPrimary }, sectionSubtitle: { fontSize: typography.caption.fontSize, color: colors.textMuted }, statsRow: { flexDirection: 'row', marginBottom: spacing.sm }, gap: { width: spacing.sm }, averageCard: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.sm, minHeight: 82, justifyContent: 'center', ...shadows.card }, averageLabel: { fontSize: typography.labelSm.fontSize, color: colors.textMuted }, averageValue: { fontSize: typography.headlineMd.fontSize, fontWeight: '700', color: colors.primary, marginTop: 2 }, workloadCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, paddingHorizontal: spacing.md, marginBottom: spacing.lg, ...shadows.card }, workloadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.surfaceMuted }, workloadName: { fontSize: typography.labelLg.fontSize, fontWeight: '700', color: colors.textPrimary }, workloadCount: { fontSize: typography.headlineSm.fontSize, fontWeight: '700', color: colors.primary }, requestCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, padding: spacing.md, marginBottom: spacing.sm, ...shadows.card }, ticketTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, ticketHeading: { flex: 1, paddingRight: spacing.sm }, requestCode: { fontSize: typography.labelSm.fontSize, fontWeight: '700', color: colors.primary }, requestTitle: { fontSize: typography.headlineSm.fontSize, fontWeight: '700', color: colors.textPrimary, marginTop: 2 }, metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }, metaText: { flex: 1, fontSize: typography.caption.fontSize, color: colors.textMuted, marginTop: spacing.xs }, actionRow: { flexDirection: 'row', marginTop: spacing.md }, actionButton: { flex: 1 }, actionButtonGap: { marginRight: spacing.sm }, empty: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, padding: spacing.xl, alignItems: 'center' }, emptyTitle: { fontSize: typography.headlineSm.fontSize, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.sm }, muted: { fontSize: typography.caption.fontSize, color: colors.textMuted, marginTop: 2 }, modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'center', padding: spacing.md }, modalDismissArea: { ...StyleSheet.absoluteFillObject }, modalCard: { backgroundColor: colors.surface, borderRadius: radii.xl, padding: spacing.lg, maxHeight: '80%' }, modalTitle: { fontSize: typography.headlineMd.fontSize, fontWeight: '700', color: colors.textPrimary }, modalSubtitle: { fontSize: typography.caption.fontSize, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md }, staffLoader: { marginVertical: spacing.lg }, staffRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.surfaceMuted }, staffDetails: { flex: 1, paddingRight: spacing.sm }, staffName: { fontSize: typography.labelLg.fontSize, fontWeight: '700', color: colors.textPrimary }, cancelButton: { marginTop: spacing.lg }, signOut: { marginTop: spacing.lg },
});
