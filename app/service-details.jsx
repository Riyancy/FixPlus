import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { PrimaryButton, Screen } from '../components/ui';
import { useApp } from '../contexts/AppContext';

export default function ServiceDetailsScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { theme, services } = useApp();
  const service = services.find((item) => item.id === id);

  if (!service) {
    return (
      <Screen edges={['top', 'bottom']} style={styles.screen}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
        </Pressable>
        <View style={styles.missing}>
          <Ionicons name="construct-outline" size={42} color={theme.muted} />
          <Text style={[styles.title, { color: theme.text }]}>Service not found</Text>
          <Text style={[styles.body, { color: theme.muted }]}>This service may have been removed from the local directory.</Text>
          <PrimaryButton title="Browse services" onPress={() => router.replace('/(tabs)/services')} style={styles.missingButton} />
        </View>
      </Screen>
    );
  }


  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text }]}>Services</Text>
        </Pressable>

        <View style={[styles.hero, { backgroundColor: service.color }]}>
          <View style={styles.heroCircle}><Ionicons name={service.icon} size={54} color="#245A83" /></View>
          <View style={styles.heroCaption}>
            <Text style={styles.heroEyebrow}>FIXPLUS LOCAL DIRECTORY</Text>
            <Text style={styles.heroTag}>{service.category}</Text>
          </View>
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={[styles.title, { color: theme.text }]}>{service.name}</Text>
            <Text style={[styles.meta, { color: theme.muted }]}>{service.duration} · Offline maintenance directory</Text>
          </View>
        </View>


        <Text style={[styles.sectionTitle, { color: theme.text }]}>About this service</Text>
        <Text style={[styles.body, { color: theme.muted }]}>{service.description}</Text>

        <Text style={[styles.sectionTitle, styles.includedHeading, { color: theme.text }]}>What’s included</Text>
        {service.included.map((item) => (
          <View key={item} style={styles.includedRow}>
            <Ionicons name="checkmark-circle" size={19} color={theme.primary} />
            <Text style={[styles.includedText, { color: theme.text }]}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20 },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 30 },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 7, marginBottom: 12 },
  backText: { fontWeight: '800', fontSize: 13, marginLeft: 7 },
  hero: { minHeight: 182, borderRadius: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, overflow: 'hidden' },
  heroCircle: { width: 100, height: 100, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.55)', justifyContent: 'center', alignItems: 'center' },
  heroCaption: { alignItems: 'flex-end' },
  heroEyebrow: { fontSize: 8, color: '#3A6280', fontWeight: '900', letterSpacing: 1 },
  heroTag: { fontSize: 17, fontWeight: '900', color: '#245A83', marginTop: 6, textAlign: 'right', maxWidth: 105 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  titleCopy: { flex: 1, paddingRight: 10 },
  title: { fontSize: 24, lineHeight: 29, fontWeight: '900' },
  meta: { fontSize: 11, marginTop: 5 },
  saveButton: { width: 45, height: 45, borderWidth: 1, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  facts: { borderWidth: 1, borderRadius: 17, padding: 16, marginTop: 18, flexDirection: 'row', alignItems: 'center' },
  fact: { flex: 1 },
  factDivider: { width: 1, height: 35, marginHorizontal: 12 },
  factLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  factValue: { fontSize: 14, fontWeight: '900', marginTop: 7 },
  factCaption: { fontSize: 9, lineHeight: 14, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '900', marginTop: 23, marginBottom: 8 },
  body: { fontSize: 13, lineHeight: 21 },
  includedHeading: { marginTop: 21 },
  includedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  includedText: { fontSize: 13, marginLeft: 9 },
  reviewsHeading: { marginTop: 23 },
  reviewCard: { borderWidth: 1, borderRadius: 13, padding: 12, marginTop: 8 },
  reviewStars: { fontSize: 15, fontWeight: '900' },
  reviewScore: { fontSize: 10 },
  reviewComment: { fontSize: 11, lineHeight: 16, marginTop: 6 },
  bookButton: { marginTop: 16 },
  missing: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 26 },
  missingButton: { alignSelf: 'stretch', marginTop: 20 },
});
