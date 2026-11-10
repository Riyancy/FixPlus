import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen, ServiceCard } from '../../components/ui';
import { categories } from '../../data/services';
import { useApp } from '../../contexts/AppContext';

const categoryIcons = {
  Electrical: 'flash-outline',
  Plumbing: 'water-outline',
  'AC & Appliance': 'snow-outline',
  Cleaning: 'sparkles-outline',
  Carpentry: 'hammer-outline',
};

export default function HomeScreen() {
  const { theme, services, scheme, toggleTheme } = useApp();
  const mainCategories = categories.filter(category => category !== 'All');

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={[styles.brandMark, { backgroundColor: theme.action }]}>
              <Ionicons name="build-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.brand, { color: theme.text }]}>FixPlus</Text>
          </View>
          <Pressable onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name={scheme === 'light' ? 'moon-outline' : 'sunny-outline'} size={20} color={theme.primary} />
          </Pressable>
        </View>

        <View style={[styles.hero, { backgroundColor: theme.primaryDeep }]}>
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { color: theme.heroMuted }]}>HOME CARE, MADE SIMPLE</Text>
            <Text style={[styles.heroTitle, { color: theme.heroForeground }]}>Your home, in good hands.</Text>
            <Text style={[styles.heroText, { color: theme.heroMuted }]}>Find trusted help for the little fixes and big peace of mind.</Text>
            <Pressable onPress={() => router.push('/(tabs)/services')} style={styles.heroButton}>
              <Text style={[styles.heroButtonText, { color: theme.action }]}>Explore services</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.action} />
            </Pressable>
          </View>
          <View style={[styles.heroIllustration, { backgroundColor: 'rgba(255,255,255,0.65)' }]}>
            <Ionicons name="home" size={36} color={theme.heroForeground} />
          </View>
        </View>

        <Pressable onPress={() => router.push('/(tabs)/services')} style={[styles.searchShortcut, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={19} color={theme.muted} />
          <Text style={[styles.searchText, { color: theme.muted }]}>What needs fixing today?</Text>
          <Ionicons name="arrow-forward-circle" size={22} color={theme.primary} />
        </Pressable>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Browse categories</Text>
            <Text style={[styles.sectionSub, { color: theme.muted }]}>Find the right local specialist</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {mainCategories.map(category => (
            <Pressable key={category} onPress={() => router.push({ pathname: '/(tabs)/services', params: { category } })} style={[styles.categoryTile, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.categoryIcon, { backgroundColor: services.find(service => service.category === category)?.color || theme.soft }]}>
                <Ionicons name={categoryIcons[category]} size={20} color="#245A83" />
              </View>
              <Text style={[styles.categoryText, { color: theme.text }]} numberOfLines={2}>{category}</Text>
              <Text style={[styles.categoryCount, { color: theme.muted }]}>{services.filter(service => service.category === category).length} options</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeading, styles.popularHeading]}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular near you</Text>
            <Text style={[styles.sectionSub, { color: theme.muted }]}>Browse our service list</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/services')}>
            <Text style={[styles.viewAll, { color: theme.primary }]}>View all</Text>
          </Pressable>
        </View>
        {services.slice(0, 3).map(service => (
          <ServiceCard key={service.id} service={service} onPress={() => router.push({ pathname: '/service-details', params: { id: service.id } })} />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 28 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 41, height: 41, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  brand: { fontSize: 21, fontWeight: '900', letterSpacing: -0.5 },
  themeButton: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { borderRadius: 24, padding: 21, flexDirection: 'row', alignItems: 'center', minHeight: 205, overflow: 'hidden' },
  heroCopy: { flex: 1 },
  eyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  heroTitle: { fontSize: 25, lineHeight: 30, fontWeight: '900', marginTop: 9, maxWidth: 220 },
  heroText: { fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 220 },
  heroButton: { backgroundColor: '#FFFFFF', borderRadius: 12, alignSelf: 'flex-start', paddingHorizontal: 13, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  heroButtonText: { fontWeight: '900', fontSize: 11, marginRight: 7 },
  heroIllustration: { width: 62, height: 62, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 7 },
  searchShortcut: { minHeight: 53, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, marginTop: 15, flexDirection: 'row', alignItems: 'center' },
  searchText: { flex: 1, fontSize: 13, marginLeft: 9 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '900' },
  sectionSub: { fontSize: 11, marginTop: 4 },
  categoryRow: { paddingRight: 8 },
  categoryTile: { width: 104, minHeight: 122, borderRadius: 17, borderWidth: 1, padding: 11, marginRight: 9 },
  categoryIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  categoryText: { fontSize: 11, fontWeight: '800', minHeight: 28 },
  categoryCount: { fontSize: 9, marginTop: 4 },
  popularHeading: { marginTop: 26, alignItems: 'center' },
  viewAll: { fontSize: 12, fontWeight: '800', padding: 6 },
});
