import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

export function Screen({ children, style, edges = ['top'] }) {
  const { theme } = useApp();
  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: theme.background }, style]}>
      {children}
    </SafeAreaView>
  );
}

export function PageHeading({ title, subtitle, trailing }) {
  const { theme } = useApp();
  return (
    <View style={styles.headingRow}>
      <View style={styles.headingCopy}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.pageSubtitle, { color: theme.muted }]}>{subtitle}</Text> : null}
      </View>
      {trailing || null}
    </View>
  );
}

export function PrimaryButton({ title, onPress, icon, style, disabled = false }) {
  const { theme } = useApp();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.action, opacity: disabled ? 0.5 : pressed ? 0.84 : 1 }, style]}
    >
      {icon ? <Ionicons name={icon} size={18} color="#FFFFFF" style={styles.buttonIcon} /> : null}
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

export function ServiceCard({ service, onPress }) {
  const { theme, favouriteIds, toggleFavourite } = useApp();
  const isFavourite = favouriteIds.includes(service.id);
  const ratingLabel = service.ratingCount
    ? `★ ${service.rating.toFixed(1)} · ${service.ratingCount}`
    : '☆ Not rated';
  return (
    <View style={[styles.serviceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${service.name}, from Rs. ${service.price}${service.ratingCount ? `, rated ${service.rating.toFixed(1)} out of 5` : ', not rated yet'}`}
        onPress={onPress}
        style={({ pressed }) => [styles.serviceMain, { opacity: pressed ? 0.78 : 1 }]}
      >
        <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
          <Ionicons name={service.icon} size={24} color="#326B91" />
        </View>
        <View style={styles.serviceCopy}>
          <Text style={[styles.serviceName, { color: theme.text }]} numberOfLines={1}>{service.name}</Text>
          <Text style={[styles.serviceMeta, { color: theme.muted }]}>{service.category} · {service.duration}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.servicePrice, { color: theme.primary }]} numberOfLines={1}>From Rs. {service.price.toLocaleString()}</Text>
            <Text style={[styles.rating, { color: theme.muted }]}>{ratingLabel}</Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isFavourite ? `Remove ${service.name} from favourites` : `Save ${service.name} to favourites`}
        hitSlop={10}
        onPress={() => toggleFavourite(service.id)}
        style={styles.heartButton}
      >
        <Ionicons name={isFavourite ? 'heart' : 'heart-outline'} size={22} color={isFavourite ? '#D95261' : theme.muted} />
      </Pressable>
    </View>
  );
}

export function EmptyState({ icon = 'file-tray-outline', title, message, action }) {
  const { theme } = useApp();
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.soft }]}>
        <Ionicons name={icon} size={30} color={theme.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyMessage, { color: theme.muted }]}>{message}</Text>
      {action || null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headingCopy: { flex: 1, paddingRight: 12 },
  pageTitle: { fontSize: 27, fontWeight: '800', letterSpacing: -0.4 },
  pageSubtitle: { fontSize: 13, lineHeight: 19, marginTop: 5 },
  primaryButton: { minHeight: 50, paddingHorizontal: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  buttonIcon: { marginRight: 8 },
  serviceCard: { borderWidth: 1, borderRadius: 18, padding: 13, marginBottom: 11, flexDirection: 'row', alignItems: 'center' },
  serviceMain: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center' },
  serviceIcon: { width: 52, height: 52, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  serviceCopy: { flex: 1, marginLeft: 12, minWidth: 0 },
  serviceName: { fontSize: 15, fontWeight: '800' },
  serviceMeta: { fontSize: 11, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  servicePrice: { fontSize: 12, fontWeight: '800', flexShrink: 1 },
  rating: { fontSize: 11, marginLeft: 8 },
  heartButton: { padding: 8, marginLeft: 3 },
  emptyState: { alignItems: 'center', paddingHorizontal: 25, paddingVertical: 36 },
  emptyIcon: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyMessage: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 7, marginBottom: 18 },
});
