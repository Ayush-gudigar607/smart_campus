import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii, spacing, shadows } from '../../src/theme';
import HeaderBar from '../../src/components/HeaderBar';
import TicketCard from '../../src/components/TicketCard';
import Button from '../../src/components/Button';
import { useRequests } from '../../src/hooks/useRequests';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

export default function RequestsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const {
    requests,
    statusFilter,
    setStatusFilter,
    loading,
    refreshing,
    refresh,
  } = useRequests('all');

  const filteredRequests = requests.filter((req) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      req.code?.toLowerCase().includes(q) ||
      req.title?.toLowerCase().includes(q) ||
      req.serviceTitle?.toLowerCase().includes(q) ||
      req.location?.toLowerCase().includes(q)
    );
  }).sort((left, right) => {
    if (sortBy === 'due') return new Date(left.dueAt || 0) - new Date(right.dueAt || 0);
    const difference = new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
    return sortBy === 'oldest' ? -difference : difference;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar
        title="Service Requests"
        subtitle="Track & manage campus tickets"
        rightAction={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/new-request')}
            accessibilityRole="button"
            accessibilityLabel="Create request"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={colors.textInverse} />
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by #SR code, title, or room..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search requests"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Chips Horizontal Track */}
        <View style={styles.filterTrack}>
          <FlatList
            data={STATUS_FILTERS}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => {
              const isActive = statusFilter === item.id;
              return (
                <TouchableOpacity
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setStatusFilter(item.id)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${item.label}`}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort:</Text>
          {[
            { id: 'newest', label: 'Newest' },
            { id: 'oldest', label: 'Oldest' },
            { id: 'due', label: 'Due date' },
          ].map((option) => <TouchableOpacity key={option.id} onPress={() => setSortBy(option.id)} style={[styles.sortChip, sortBy === option.id && styles.sortChipActive]} accessibilityRole="button" accessibilityLabel={`Sort by ${option.label}`}><Text style={[styles.sortChipText, sortBy === option.id && styles.sortChipTextActive]}>{option.label}</Text></TouchableOpacity>)}
        </View>

        {/* Tickets List */}
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.code || String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <TicketCard
              ticket={item}
              onPress={() => router.push(`/request/${item.code}`)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="filter-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No requests found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? 'No tickets match your search criteria.'
                  : `You have no tickets currently under '${statusFilter}'.`}
              </Text>
              <Button
                title="Create New Request"
                variant="primary"
                onPress={() => router.push('/new-request')}
                style={styles.emptyButton}
              />
            </View>
          }
        />
      </View>
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
  addButton: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    height: 48,
    ...shadows.card,
  },
  searchIcon: {
    marginRight: spacing.xs + 2,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.bodyMd.fontSize,
    color: colors.textPrimary,
  },
  clearSearch: {
    padding: spacing.xs,
  },
  filterTrack: {
    marginVertical: spacing.xs,
  },
  filterList: {
    paddingHorizontal: spacing.md,
  },
  sortRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.xs },
  sortLabel: { fontSize: typography.labelSm.fontSize, color: colors.textMuted, marginRight: spacing.xs },
  sortChip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.pill, marginRight: spacing.xs, backgroundColor: colors.surfaceMuted },
  sortChipActive: { backgroundColor: colors.primaryLight },
  sortChipText: { fontSize: typography.labelSm.fontSize, color: colors.textSecondary },
  sortChipTextActive: { color: colors.primary, fontWeight: '700' },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.labelMd.fontSize,
    lineHeight: typography.labelMd.lineHeight,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.textInverse,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
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
    marginVertical: spacing.sm,
  },
  emptyButton: {
    marginTop: spacing.sm,
    minWidth: 180,
  },
});
