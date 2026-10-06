import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiRegister } from '../src/api/client';
import Button from '../src/components/Button';
import { colors, radii, spacing, typography } from '../src/theme';

const DEPARTMENTS = ['CSE', 'AIML', 'AIDS', 'CSBS', 'CSDS', 'ECE', 'EEE', 'MECH', 'AUTOMOBILE', 'AERONAUTICAL', 'MARINE', 'Hostel', 'IT', 'Library', 'Maintenance', 'Academics', 'Laboratory', 'Student Affairs'];

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ studentName: '', usn: '', department: 'CSE', currentYear: '1', email: '', mobileNumber: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const update = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!form.studentName.trim() || !form.usn.trim() || !form.email.trim() || !form.mobileNumber.trim() || !form.password) {
      Alert.alert('Missing details', 'Complete every required field to create your account.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Passwords do not match', 'Enter the same password in both fields.');
      return;
    }
    setLoading(true);
    const result = await apiRegister({ ...form, studentName: form.studentName.trim(), usn: form.usn.trim(), email: form.email.trim(), mobileNumber: form.mobileNumber.trim(), currentYear: Number(form.currentYear) });
    setLoading(false);
    if (!result.success) {
      Alert.alert('Registration failed', result.message || 'Unable to create the account.');
      return;
    }
    Alert.alert('Account created', 'Your student account is ready.', [{ text: 'Continue', onPress: () => router.replace('/') }]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>Create student account</Text>
        <Text style={styles.sub}>Register to submit and track campus service requests.</Text>
        <Field label="Full name" value={form.studentName} onChangeText={update('studentName')} />
        <Field label="USN" value={form.usn} onChangeText={update('usn')} autoCapitalize="characters" />
        <Text style={styles.label}>Department</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.departmentList}>
          {DEPARTMENTS.map((department) => <TouchableOpacity key={department} onPress={() => update('department')(department)} style={[styles.department, form.department === department && styles.departmentActive]}><Text style={[styles.departmentText, form.department === department && styles.departmentTextActive]}>{department}</Text></TouchableOpacity>)}
        </ScrollView>
        <Field label="Current year (1–6)" value={form.currentYear} onChangeText={update('currentYear')} keyboardType="number-pad" />
        <Field label="Email" value={form.email} onChangeText={update('email')} autoCapitalize="none" keyboardType="email-address" />
        <Field label="Mobile number" value={form.mobileNumber} onChangeText={update('mobileNumber')} keyboardType="phone-pad" placeholder="9876543210" />
        <Field label="Password" value={form.password} onChangeText={update('password')} secureTextEntry placeholder="At least 8 characters, with a letter and number" />
        <Field label="Confirm password" value={form.confirmPassword} onChangeText={update('confirmPassword')} secureTextEntry />
        <Button title={loading ? 'Creating account…' : 'Create account'} onPress={submit} disabled={loading} />
        <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}><Text style={styles.loginText}>Already have an account? Sign in</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, ...props }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput style={styles.input} placeholderTextColor={colors.textMuted} {...props} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md, paddingBottom: spacing.xxl }, brand: { fontSize: 28, fontWeight: '800', color: colors.primary, marginTop: spacing.md }, sub: { ...typography.bodyMd, marginTop: spacing.xs, marginBottom: spacing.lg }, label: { ...typography.labelMd, marginBottom: spacing.xs, marginTop: spacing.sm }, input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 12, fontSize: 16, color: colors.textPrimary }, departmentList: { paddingBottom: spacing.xs }, department: { paddingHorizontal: spacing.sm + 4, paddingVertical: spacing.sm, marginRight: spacing.xs, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, departmentActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary }, departmentText: { ...typography.labelMd, color: colors.textSecondary }, departmentTextActive: { color: colors.primary }, loginLink: { alignSelf: 'center', padding: spacing.sm, marginTop: spacing.xs }, loginText: { ...typography.labelMd, color: colors.primary },
});
