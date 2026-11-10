import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { EmptyState, PrimaryButton, Screen } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';

function StarSelector({ value, onChange, theme }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          accessibilityRole="button"
          accessibilityLabel={`${star} ${star === 1 ? 'star' : 'stars'}`}
          accessibilityState={{ selected: value === star }}
          onPress={() => onChange(star)}
          hitSlop={5}
          style={styles.starButton}
        >
          <Ionicons name={star <= value ? 'star' : 'star-outline'} size={30} color={star <= value ? theme.star : theme.muted} />
        </Pressable>
      ))}
    </View>
  );
}

function BookingCard({ booking, theme, rating, onMarkReceived, onSubmitRating }) {
  const [selectedStars, setSelectedStars] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const date = booking.date
    ? new Date(`${booking.date}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';
  const isCompleted = booking.status === 'Completed';

  const submitRating = () => {
    if (selectedStars < 1 || selectedStars > 5) {
      setError('Choose 1 to 5 stars before submitting.');
      return;
    }
    const accepted = onSubmitRating(booking.id, selectedStars, comment);
    if (!accepted) setError('This booking is not ready for rating.');
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.bookingIcon, { backgroundColor: theme.soft }]}><Ionicons name="construct-outline" size={19} color={theme.primary} /></View>
        <View style={styles.cardTitleWrap}>
          <Text style={[styles.serviceName, { color: theme.text }]}>{booking.serviceName}</Text>
          <Text style={[styles.reference, { color: theme.muted }]}>{booking.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isCompleted ? `${theme.success}1A` : theme.soft }]}>
          <Text style={[styles.statusText, { color: isCompleted ? theme.success : theme.primary }]}>{isCompleted ? 'Completed' : 'Pending'}</Text>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.detailRow}><Ionicons name="calendar-outline" size={15} color={theme.muted} /><Text style={[styles.detailText, { color: theme.text }]}>{date} · {booking.time}</Text></View>
      <View style={styles.detailRow}><Ionicons name="location-outline" size={15} color={theme.muted} /><Text style={[styles.detailText, { color: theme.muted }]} numberOfLines={2}>{booking.address}</Text></View>
      {booking.problem ? <Text style={[styles.problem, { color: theme.muted }]} numberOfLines={2}>Note: {booking.problem}</Text> : null}
      {booking.price ? <Text style={[styles.price, { color: theme.primary }]}>From Rs. {booking.price.toLocaleString()}</Text> : null}

      {!isCompleted ? (
        <View style={[styles.receivePanel, { backgroundColor: theme.soft }]}>
          <Text style={[styles.receiveHint, { color: theme.muted }]}>After the service has been delivered, confirm receipt to complete this booking.</Text>
          <Pressable accessibilityRole="button" onPress={() => onMarkReceived(booking.id)} style={[styles.receiveButton, { backgroundColor: theme.action }]}>
            <Ionicons name="checkmark-circle-outline" size={17} color="#FFFFFF" />
            <Text style={styles.receiveButtonText}>Service received · Mark completed</Text>
          </Pressable>
        </View>
      ) : rating ? (
        <View style={[styles.ratedPanel, { backgroundColor: theme.soft }]}>
          <View style={styles.ratedHeading}>
            <Ionicons name="checkmark-circle" size={18} color={theme.success} />
            <Text style={[styles.ratedTitle, { color: theme.text }]}>Thanks for your rating</Text>
          </View>
          <Text style={[styles.savedStars, { color: theme.star }]}>{'★'.repeat(rating.stars)}{'☆'.repeat(5 - rating.stars)} <Text style={[styles.ratedValue, { color: theme.text }]}>{rating.stars}/5</Text></Text>
          {rating.comment ? <Text style={[styles.savedComment, { color: theme.muted }]}>{rating.comment}</Text> : null}
        </View>
      ) : (
        <View style={[styles.ratingPanel, { backgroundColor: theme.soft }]}>
          <Text style={[styles.ratingTitle, { color: theme.text }]}>Rate this service</Text>
          <Text style={[styles.ratingHelp, { color: theme.muted }]}>You received this service. How was it?</Text>
          <StarSelector value={selectedStars} onChange={(value) => { setSelectedStars(value); setError(''); }} theme={theme} />
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Share a comment (optional)"
            placeholderTextColor={theme.muted}
            maxLength={240}
            multiline
            textAlignVertical="top"
            style={[styles.commentInput, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
          />
          {error ? <Text accessibilityRole="alert" style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}
          <Pressable accessibilityRole="button" disabled={selectedStars < 1} onPress={submitRating} style={[styles.submitRating, { backgroundColor: theme.action, opacity: selectedStars < 1 ? 0.55 : 1 }]}>
            <Text style={styles.submitRatingText}>Submit rating</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function BookingsScreen() {
  const { theme, bookings, ratings, markBookingCompleted, addRating } = useApp();
  const [query, setQuery] = useState('');
  const filteredBookings = useMemo(() => {
    const search = query.trim().toLowerCase();
    return bookings.filter((booking) => !search || `${booking.serviceName} ${booking.id} ${booking.address}`.toLowerCase().includes(search));
  }, [bookings, query]);
  const ratingByBooking = useMemo(() => new Map(ratings.map((rating) => [rating.bookingId, rating])), [ratings]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>My bookings</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Track each request and review the service after it is completed.</Text>

        {bookings.length ? (
          <>
            <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="search-outline" size={17} color={theme.muted} />
              <TextInput value={query} onChangeText={setQuery} placeholder="Search bookings" placeholderTextColor={theme.muted} style={[styles.searchInput, { color: theme.text }]} />
            </View>
            <Text style={[styles.count, { color: theme.muted }]}>{filteredBookings.length} of {bookings.length} request{bookings.length === 1 ? '' : 's'}</Text>
            {filteredBookings.length ? filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                theme={theme}
                rating={ratingByBooking.get(booking.id)}
                onMarkReceived={markBookingCompleted}
                onSubmitRating={addRating}
              />
            )) : (
              <EmptyState icon="search-outline" title="No matching bookings" message="Try searching with another service name or booking reference." />
            )}
          </>
        ) : (
          <EmptyState icon="calendar-outline" title="No bookings yet" message="Book a service to see its request, status and review option here." action={(
            <PrimaryButton title="Explore services" icon="arrow-forward" onPress={() => router.push('/(tabs)/services')} />
          )} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 15, paddingBottom: 28 },
  title: { fontSize: 27, fontWeight: '900' },
  subtitle: { fontSize: 12, lineHeight: 19, marginTop: 5, marginBottom: 17 },
  searchBox: { height: 47, borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, padding: 9, fontSize: 12 },
  count: { fontSize: 10, fontWeight: '700', marginTop: 12, marginBottom: 9 },
  card: { borderWidth: 1, borderRadius: 17, padding: 14, marginBottom: 11 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  bookingIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  cardTitleWrap: { flex: 1, marginLeft: 10 },
  serviceName: { fontSize: 13, fontWeight: '900' },
  reference: { fontSize: 9, marginTop: 4 },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 9, fontWeight: '900' },
  divider: { height: 1, marginVertical: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  detailText: { fontSize: 11, lineHeight: 16, marginLeft: 8, flex: 1 },
  problem: { fontSize: 10, lineHeight: 15, marginTop: 3 },
  price: { fontSize: 11, fontWeight: '900', marginTop: 9 },
  receivePanel: { borderRadius: 13, padding: 11, marginTop: 12 },
  receiveHint: { fontSize: 10, lineHeight: 15, marginBottom: 9 },
  receiveButton: { minHeight: 42, borderRadius: 11, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  receiveButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', marginLeft: 7, textAlign: 'center' },
  ratingPanel: { borderRadius: 13, padding: 12, marginTop: 12 },
  ratingTitle: { fontSize: 13, fontWeight: '900' },
  ratingHelp: { fontSize: 10, marginTop: 4 },
  starRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 9 },
  starButton: { paddingHorizontal: 7, paddingVertical: 4 },
  commentInput: { borderWidth: 1, borderRadius: 10, minHeight: 58, padding: 10, fontSize: 11 },
  errorText: { fontSize: 10, fontWeight: '700', marginTop: 7 },
  submitRating: { minHeight: 41, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginTop: 9 },
  submitRatingText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  ratedPanel: { borderRadius: 13, padding: 12, marginTop: 12 },
  ratedHeading: { flexDirection: 'row', alignItems: 'center' },
  ratedTitle: { fontSize: 12, fontWeight: '900', marginLeft: 7 },
  savedStars: { fontSize: 17, marginTop: 8 },
  ratedValue: { fontSize: 11, fontWeight: '900' },
  savedComment: { fontSize: 11, lineHeight: 16, marginTop: 5 },
});
