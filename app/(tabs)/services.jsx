import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { EmptyState, Screen, ServiceCard } from '../../components/ui';
import { categories } from '../../data/services';
import { useApp } from '../../contexts/AppContext';

const sortOptions = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price', label: 'Lowest price' },
  { id: 'rating', label: 'Top rated' },
];

export default function ServicesScreen() {
  const { theme, services } = useApp();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category;
  const routeCategory = categories.includes(rawCategory) ? rawCategory : 'All';
  const [categorySelection, setCategorySelection] = useState({ routeCategory, value: routeCategory });
  if (categorySelection.routeCategory !== routeCategory) {
    setCategorySelection({ routeCategory, value: routeCategory });
  }
  const category = categorySelection.value;
  const [sort, setSort] = useState('recommended');

  const filteredServices = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    const results = services.filter((service) => {
      const matchesCategory = category === 'All' || service.category === category;
      const matchesSearch = !searchText || `${service.name} ${service.category} ${service.description}`.toLowerCase().includes(searchText);
      return matchesCategory && matchesSearch;
    });
    if (sort === 'price') results.sort((first, second) => first.price - second.price);
    if (sort === 'rating') results.sort((first, second) => {
      const firstScore = first.rating ?? -1;
      const secondScore = second.rating ?? -1;
      return secondScore - firstScore || second.ratingCount - first.ratingCount;
    });
    return results;
  }, [category, query, services, sort]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Service directory</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Search, compare and choose from {services.length} services stored on this device.</Text>

        <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={19} color={theme.muted} />
          <TextInput
            accessibilityLabel="Search local services"
            value={query}
            onChangeText={setQuery}
            placeholder="Try plumbing or cleaning"
            placeholderTextColor={theme.muted}
            returnKeyType="search"
            style={[styles.searchInput, { color: theme.text }]}
          />
          {query ? <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}><Ionicons name="close-circle" size={19} color={theme.muted} /></Pressable> : null}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {categories.map((item) => {
            const active = category === item;
            return (
              <Pressable key={item} onPress={() => setCategorySelection({ routeCategory, value: item })} style={[styles.chip, { backgroundColor: active ? theme.action : theme.surface, borderColor: active ? theme.action : theme.border }]}>
                <Text style={[styles.chipText, { color: active ? '#FFFFFF' : theme.text }]}>{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.resultsHeading}>
          <View>
            <Text style={[styles.label, { color: theme.text }]}>SORT BY</Text>
            <Text style={[styles.resultCount, { color: theme.muted }]}>{filteredServices.length} result{filteredServices.length === 1 ? '' : 's'}</Text>
          </View>
          <View style={styles.sortRow}>
            {sortOptions.slice(1).map((item) => {
              const active = sort === item.id;
              return (
                <Pressable key={item.id} accessibilityRole="button" onPress={() => setSort(active ? 'recommended' : item.id)} style={[styles.sortButton, { borderColor: active ? theme.primary : theme.border, backgroundColor: active ? theme.soft : theme.surface }]}>
                  <Text style={[styles.sortText, { color: active ? theme.primary : theme.muted }]}>{item.label === 'Lowest price' ? 'Price' : 'Rating'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {filteredServices.length ? filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} onPress={() => router.push({ pathname: '/service-details', params: { id: service.id } })} />
        )) : (
          <EmptyState icon="search-outline" title="No matches yet" message="Try another word or select a different category." action={(
            <Pressable onPress={() => { setQuery(''); setCategorySelection({ routeCategory, value: 'All' }); }}><Text style={[styles.resetText, { color: theme.primary }]}>Clear search and filters</Text></Pressable>
          )} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 28 },
  title: { fontSize: 27, fontWeight: '900' },
  subtitle: { fontSize: 12, lineHeight: 19, marginTop: 5, marginBottom: 17 },
  searchBox: { height: 51, borderRadius: 15, borderWidth: 1, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, fontSize: 13, padding: 10 },
  label: { fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  chips: { paddingTop: 9, paddingBottom: 5 },
  chip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 9, marginRight: 7 },
  chipText: { fontSize: 10, fontWeight: '800' },
  resultsHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, marginBottom: 11 },
  resultCount: { fontSize: 10, marginTop: 5 },
  sortRow: { flexDirection: 'row' },
  sortButton: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 7, marginLeft: 6 },
  sortText: { fontSize: 9, fontWeight: '800' },
  resetText: { fontWeight: '800', fontSize: 12 },
});
