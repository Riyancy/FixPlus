import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

export function Screen({ children, style, edges = ['top'] }) {
  const { theme } = useApp();
  return <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: theme.background }, style]}>{children}</SafeAreaView>;
}

export function ServiceCard({ service, onPress }) {
  const { theme } = useApp();
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.iconBox, { backgroundColor: service.color }]}>
        <Ionicons name={service.icon} size={24} color="#326B91" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>{service.name}</Text>
        <Text style={{ color: theme.muted, fontSize: 11, marginTop: 4 }}>{service.category} · {service.duration}</Text>
        <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '800', marginTop: 7 }}>From Rs. {service.price.toLocaleString()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  card: { borderWidth: 1, borderRadius: 18, padding: 13, marginBottom: 11, flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 52, height: 52, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
});
