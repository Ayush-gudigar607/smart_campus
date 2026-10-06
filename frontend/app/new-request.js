import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii, spacing, shadows } from '../src/theme';
import HeaderBar from '../src/components/HeaderBar';
import Button from '../src/components/Button';
import { useRequests } from '../src/hooks/useRequests';
import { useServices } from '../src/hooks/useServices';

const PRIORITIES = [
  { id: 'low', label: 'Low', color: colors.priority.low.color },
  { id: 'medium', label: 'Medium', color: colors.priority.medium.color },
  { id: 'high', label: 'High', color: colors.priority.high.color },
  { id: 'urgent', label: 'Urgent', color: colors.priority.urgent.color },
];

export default function NewRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestedServiceId = params.serviceId ? Number(params.serviceId) : null;

  const [selectedServiceId, setSelectedServiceId] = useState(requestedServiceId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  const { createRequest } = useRequests();
  const { services, loading: servicesLoading, isLive: servicesAreLive } = useServices();

  useEffect(() => {
    if (!services.length) return;
    const requestedServiceExists = services.some((service) => service.id === requestedServiceId);
    const selectedServiceExists = services.some((service) => service.id === selectedServiceId);
    if (!selectedServiceExists) setSelectedServiceId(requestedServiceExists ? requestedServiceId : services[0].id);
  }, [requestedServiceId, selectedServiceId, services]);

  const handleSubmit = async () => {
    if (!title.trim() || title.trim().length < 5) {
      Alert.alert('Validation Error', 'Title must be at least 5 characters long.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description for the issue.');
      return;
    }
    if (!selectedServiceId) {
      Alert.alert('Service unavailable', 'Wait for the service categories to load, then try again.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createRequest({
        serviceId: selectedServiceId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || 'Campus Grounds',
        priority,
      });

      setSubmitting(false);
      if (res.success) {
        Alert.alert(
          'Request Submitted!',
          `Ticket #${res.data?.code || 'Created'} has been logged. Our facility team has received your report.`,
          [
            {
              text: 'View Ticket',
              onPress: () => router.replace(`/request/${res.data?.code}`),
            },
          ]
        );
      } else {
        Alert.alert('Submission Error', res.message || 'Could not log request.');
      }
    } catch (err) {
      setSubmitting(false);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar
        title="Report Campus Issue"
        subtitle="Submit maintenance or facility ticket"
        showBack={true}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Service Category Selection */}
        <Text style={styles.inputLabel}>Select Service Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.servicePicker}
          contentContainerStyle={styles.servicePickerContent}
        >
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceOption, isSelected && styles.serviceOptionSelected]}
                onPress={() => setSelectedServiceId(service.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={service.name}
              >
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
                  size={20}
                  color={isSelected ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[styles.serviceOptionText, isSelected && styles.serviceOptionTextSelected]}
                  numberOfLines={1}
                >
                  {service.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Title Input */}
        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Brief summary (e.g., Turing Lab AC not working)"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          accessibilityLabel="Request Title"
        />

        {/* Location Input */}
        <Text style={styles.inputLabel}>Campus Location / Room</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Turing Block, 3rd Floor, Room 302"
          placeholderTextColor={colors.textMuted}
          value={location}
          onChangeText={setLocation}
          accessibilityLabel="Location or Room number"
        />

        {/* Priority Selector */}
        <Text style={styles.inputLabel}>Priority Level</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => {
            const isSelected = priority === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.priorityButton,
                  isSelected && {
                    borderColor: p.color,
                    backgroundColor: colors.primaryLight,
                  },
                ]}
                onPress={() => setPriority(p.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Priority ${p.label}`}
              >
                <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                <Text
                  style={[
                    styles.priorityLabel,
                    isSelected && { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detailed Description */}
        <Text style={styles.inputLabel}>Detailed Description</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Describe the issue, symptoms, equipment tag, or urgency..."
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Issue description"
        />

        {/* Submit Button */}
        <Button
          title={submitting ? 'Submitting Request...' : servicesLoading ? 'Loading Services...' : 'Submit Service Ticket'}
          variant="primary"
          loading={submitting || servicesLoading}
          onPress={handleSubmit}
          disabled={!selectedServiceId}
          style={styles.submitBtn}
          accessibilityLabel="Submit Service Ticket"
        />
        {!servicesAreLive && !servicesLoading && (
          <Text style={styles.connectionHint}>Offline preview: sign in with the running backend to submit a live request.</Text>
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
  inputLabel: {
    fontSize: typography.labelLg.fontSize,
    lineHeight: typography.labelLg.lineHeight,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  servicePicker: {
    marginBottom: spacing.xs,
  },
  servicePickerContent: {
    paddingRight: spacing.md,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    ...shadows.card,
  },
  serviceOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  serviceOptionText: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: spacing.xs + 2,
  },
  serviceOptionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  textInput: {
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    fontSize: typography.bodyMd.fontSize,
    color: colors.textPrimary,
    ...shadows.card,
  },
  textArea: {
    height: 110,
    paddingVertical: spacing.sm + 4,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  priorityButton: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    marginHorizontal: 3,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  priorityLabel: {
    fontSize: typography.labelSm.fontSize,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: spacing.xl,
  },
  connectionHint: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
