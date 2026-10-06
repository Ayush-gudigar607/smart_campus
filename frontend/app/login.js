import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { apiLogin } from '../src/api/client';
import Button from '../src/components/Button';
import { colors, radii, spacing, typography } from '../src/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('student.demo@campus.local');
  const [password, setPassword] = useState('Student123');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const result = await apiLogin(email.trim(), password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Sign in failed', result.message || 'Unable to sign in.');
      return;
    }
    const role = result.data.user?.role;
    router.replace(role === 'admin' ? '/admin' : role === 'staff' ? '/staff' : '/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.brand}>CampusConnect</Text>
        <Text style={styles.sub}>Sign in to track your campus requests</Text>
        <Text style={styles.label}>Email or USN</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
        <Text style={styles.label}>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <Button title={loading ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={loading} />
        <TouchableOpacity onPress={() => router.push('/register')} accessibilityRole="button" style={styles.registerLink}>
          <Text style={styles.registerText}>New student? Create an account</Text>
        </TouchableOpacity>
        <Text style={styles.help}>Demo: student.demo@campus.local / Student123</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, justifyContent: 'center', padding: spacing.md, backgroundColor: colors.background },
  card: { backgroundColor: colors.surface, borderRadius: radii.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  brand: { fontSize: 28, fontWeight: '800', color: colors.primary },
  sub: { ...typography.bodyMd, marginTop: spacing.xs, marginBottom: spacing.lg },
  label: { ...typography.labelMd, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 12, fontSize: 16, marginBottom: spacing.md, color: colors.textPrimary },
  registerLink: { alignSelf: 'center', padding: spacing.sm, marginTop: spacing.xs },
  registerText: { ...typography.labelMd, color: colors.primary },
  help: { ...typography.caption, textAlign: 'center', marginTop: spacing.md },
});
