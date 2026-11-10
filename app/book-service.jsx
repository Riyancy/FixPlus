import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { PrimaryButton, Screen } from '../components/ui';
import { useApp } from '../contexts/AppContext';

const timeSlots = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toISODate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatISODate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function Field({ label, theme, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.text }]}>{label}</Text>
      <TextInput {...inputProps} placeholderTextColor={theme.muted} style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]} />
    </View>
  );
}

function CalendarPicker({ visible, onClose, onSelect, initialDate, today, theme }) {
  const [month, setMonth] = useState(initialDate.month);
  const [year, setYear] = useState(initialDate.year);
  const cells = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, index) => {
      const day = index - firstDayOffset + 1;
      return day > 0 && day <= daysInMonth ? day : null;
    });
  }, [month, year]);

  const shiftMonth = (amount) => {
    const next = new Date(year, month + amount, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  };
  const shiftYear = (amount) => setYear((current) => Math.max(today.year, Math.min(today.year + 10, current + amount)));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close calendar" onPress={onClose} style={styles.modalDismiss} />
        <View style={[styles.calendarCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.calendarTitleRow}>
            <Text style={[styles.calendarTitle, { color: theme.text }]}>Select a date</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close calendar" onPress={onClose} style={styles.calendarClose}>
              <Ionicons name="close" size={22} color={theme.muted} />
            </Pressable>
          </View>

          <View style={styles.monthYearRow}>
            <View style={[styles.monthChooser, { backgroundColor: theme.soft }]}>
              <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => shiftMonth(-1)} style={styles.arrowButton}>
                <Ionicons name="chevron-back" size={19} color={theme.primary} />
              </Pressable>
              <Text style={[styles.monthLabel, { color: theme.text }]}>{monthNames[month]}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Next month" onPress={() => shiftMonth(1)} style={styles.arrowButton}>
                <Ionicons name="chevron-forward" size={19} color={theme.primary} />
              </Pressable>
            </View>
            <View style={[styles.yearChooser, { backgroundColor: theme.soft }]}>
              <Pressable accessibilityRole="button" accessibilityLabel="Previous year" disabled={year <= today.year} onPress={() => shiftYear(-1)} style={styles.arrowButton}>
                <Ionicons name="remove" size={19} color={year <= today.year ? theme.border : theme.primary} />
              </Pressable>
              <Text style={[styles.yearLabel, { color: theme.text }]}>{year}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Next year" onPress={() => shiftYear(1)} style={styles.arrowButton}>
                <Ionicons name="add" size={19} color={theme.primary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.weekdayRow}>
            {weekdays.map((weekday) => <Text key={weekday} style={[styles.weekday, { color: theme.muted }]}>{weekday}</Text>)}
          </View>
          <View style={styles.calendarGrid}>
            {cells.map((day, index) => {
              if (day === null) return <View key={`blank-${index}`} style={styles.calendarCell} />;
              const dateValue = toISODate(year, month, day);
              const disabled = dateValue < today.iso;
              const isToday = dateValue === today.iso;
              return (
                <Pressable
                  key={dateValue}
                  accessibilityRole="button"
                  accessibilityLabel={formatISODate(dateValue)}
                  disabled={disabled}
                  onPress={() => onSelect(dateValue)}
                  style={[styles.calendarCell, styles.dayCell, { backgroundColor: isToday ? theme.soft : 'transparent', opacity: disabled ? 0.28 : 1 }]}
                >
                  <Text style={[styles.dayText, { color: isToday ? theme.primary : theme.text, fontWeight: isToday ? '900' : '600' }]}>{day}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.calendarFooter, { borderTopColor: theme.border }]}>
            <Text style={[styles.calendarHint, { color: theme.muted }]}>Choose a day · Month · Year</Text>
            <Pressable accessibilityRole="button" onPress={() => { setMonth(today.month); setYear(today.year); onSelect(today.iso); }}>
              <Text style={[styles.todayLink, { color: theme.primary }]}>Today</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function BookServiceScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { theme, services, bookings, addBooking } = useApp();
  const service = services.find((item) => item.id === id);
  const today = useMemo(() => {
    const current = new Date();
    return {
      year: current.getFullYear(),
      month: current.getMonth(),
      day: current.getDate(),
      iso: toISODate(current.getFullYear(), current.getMonth(), current.getDate()),
    };
  }, []);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [problem, setProblem] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [error, setError] = useState('');
  const [savedBooking, setSavedBooking] = useState(null);

  if (!service) {
    return (
      <Screen edges={['top', 'bottom']} style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={42} color={theme.muted} />
        <Text style={[styles.heading, { color: theme.text, marginTop: 14 }]}>Choose a valid service first</Text>
        <PrimaryButton title="Browse services" onPress={() => router.replace('/(tabs)/services')} style={styles.invalidButton} />
      </Screen>
    );
  }

  const submit = () => {
    const digits = phone.replace(/\D/g, '');
    if (name.trim().length < 2) return setError('Enter your name (at least 2 characters).');
    if (digits.length < 7 || digits.length > 15) return setError('Enter a valid phone number with 7–15 digits.');
    if (address.trim().length < 5) return setError('Enter a complete service address.');
    if (!selectedDate) return setError('Choose an appointment date.');
    if (!selectedTime) return setError('Choose an appointment time.');

    const booking = {
      id: `FXP-${String(bookings.length + 1).padStart(4, '0')}`,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      date: selectedDate,
      time: selectedTime,
      problem: problem.trim(),
      status: 'Pending',
    };
    addBooking(booking);
    setError('');
    setSavedBooking(booking);
  };

  if (savedBooking) {
    return (
      <Screen edges={['top', 'bottom']} style={styles.successScreen}>
        <View style={[styles.successIcon, { backgroundColor: theme.soft }]}><Ionicons name="checkmark" size={42} color={theme.primary} /></View>
        <Text style={[styles.successTitle, { color: theme.text }]}>Request saved</Text>
        <Text style={[styles.successText, { color: theme.muted }]}>{service.name}</Text>
        <View style={[styles.confirmationCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.confirmLabel, { color: theme.muted }]}>BOOKING REFERENCE</Text>
          <Text selectable style={[styles.confirmId, { color: theme.primary }]}>{savedBooking.id}</Text>
          <Text style={[styles.confirmDetail, { color: theme.text }]}>{formatISODate(selectedDate)} · {selectedTime}</Text>
        </View>
        <PrimaryButton title="View my bookings" icon="calendar-outline" onPress={() => router.replace('/(tabs)/bookings')} style={styles.successButton} />
        <Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)')} style={styles.homeLink}>
          <Text style={[styles.homeLinkText, { color: theme.primary }]}>Back to FixPlus home</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={theme.text} />
            <Text style={[styles.backText, { color: theme.text }]}>Service details</Text>
          </Pressable>
          <Text style={[styles.heading, { color: theme.text }]}>Book a service</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>Share your details and choose a visit time.</Text>

          <View style={[styles.serviceSummary, { backgroundColor: theme.soft }]}>
            <View style={[styles.summaryIcon, { backgroundColor: service.color }]}><Ionicons name={service.icon} size={21} color="#245A83" /></View>
            <View style={styles.summaryText}>
              <Text style={[styles.summaryLabel, { color: theme.muted }]}>SELECTED SERVICE</Text>
              <Text style={[styles.summaryName, { color: theme.text }]}>{service.name}</Text>
            </View>
            <Text style={[styles.summaryPrice, { color: theme.primary }]}>Rs. {service.price.toLocaleString()}</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your details</Text>
          <Field label="Full name *" value={name} onChangeText={(value) => { setName(value); setError(''); }} placeholder="Enter your name" theme={theme} autoCapitalize="words" />
          <Field label="Phone number *" value={phone} onChangeText={(value) => { setPhone(value); setError(''); }} placeholder="Enter a contact number" theme={theme} keyboardType="phone-pad" />
          <Field label="Service address *" value={address} onChangeText={(value) => { setAddress(value); setError(''); }} placeholder="House, street and area" theme={theme} />

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose a date *</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={selectedDate ? `Selected date ${formatISODate(selectedDate)}. Change date` : 'Choose booking date'}
            onPress={() => setCalendarVisible(true)}
            style={[styles.dateButton, { backgroundColor: theme.surface, borderColor: selectedDate ? theme.action : theme.border }]}
          >
            <View style={[styles.dateButtonIcon, { backgroundColor: theme.soft }]}><Ionicons name="calendar-outline" size={19} color={theme.primary} /></View>
            <View style={styles.dateButtonCopy}>
              <Text style={[styles.dateButtonLabel, { color: theme.muted }]}>{selectedDate ? 'SELECTED DATE' : 'DATE · MONTH · YEAR'}</Text>
              <Text style={[styles.dateButtonValue, { color: selectedDate ? theme.text : theme.muted }]}>{selectedDate ? formatISODate(selectedDate) : 'Select a date'}</Text>
            </View>
            <Ionicons name="chevron-down" size={19} color={theme.primary} />
          </Pressable>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose a time *</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => {
              const active = time === selectedTime;
              return (
                <Pressable key={time} onPress={() => { setSelectedTime(time); setError(''); }} style={[styles.timeChoice, { backgroundColor: active ? theme.soft : theme.surface, borderColor: active ? theme.primary : theme.border }]}>
                  <Ionicons name="time-outline" size={15} color={active ? theme.primary : theme.muted} />
                  <Text style={[styles.timeText, { color: active ? theme.primary : theme.text }]}>{time}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.fieldLabel, { color: theme.text }]}>Describe the issue (optional)</Text>
          <TextInput
            value={problem}
            onChangeText={setProblem}
            placeholder="A short note about the issue"
            placeholderTextColor={theme.muted}
            multiline
            textAlignVertical="top"
            style={[styles.textArea, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
          />
          {error ? (
            <View accessibilityRole="alert" style={[styles.errorBox, { backgroundColor: `${theme.danger}18` }]}>
              <Ionicons name="alert-circle-outline" size={18} color={theme.danger} />
              <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
            </View>
          ) : null}
          <PrimaryButton title="Save booking" icon="checkmark-circle-outline" onPress={submit} style={styles.submitButton} />
        </ScrollView>
      </KeyboardAvoidingView>
      <CalendarPicker
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelect={(value) => { setSelectedDate(value); setCalendarVisible(false); setError(''); }}
        initialDate={today}
        today={today}
        theme={theme}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 35 },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6, marginBottom: 10 },
  backText: { fontSize: 12, fontWeight: '800', marginLeft: 7 },
  heading: { fontSize: 26, fontWeight: '900' },
  subtitle: { fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 16 },
  serviceSummary: { borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  summaryIcon: { width: 40, height: 40, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  summaryText: { flex: 1, marginLeft: 10 },
  summaryLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  summaryName: { fontSize: 12, fontWeight: '800', marginTop: 4 },
  summaryPrice: { fontSize: 11, fontWeight: '900', marginLeft: 5 },
  sectionTitle: { fontSize: 15, fontWeight: '900', marginTop: 19, marginBottom: 11 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 11, fontWeight: '800', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, minHeight: 46, paddingHorizontal: 12, fontSize: 13 },
  dateButton: { minHeight: 62, borderWidth: 1, borderRadius: 14, padding: 10, flexDirection: 'row', alignItems: 'center' },
  dateButtonIcon: { width: 39, height: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dateButtonCopy: { flex: 1, marginLeft: 10 },
  dateButtonLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  dateButtonValue: { fontSize: 12, fontWeight: '800', marginTop: 5 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeChoice: { width: '48%', borderWidth: 1, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timeText: { fontSize: 10, fontWeight: '800', marginLeft: 7 },
  textArea: { borderWidth: 1, borderRadius: 12, minHeight: 75, padding: 12, fontSize: 12 },
  errorBox: { borderRadius: 11, padding: 11, marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  errorText: { flex: 1, marginLeft: 8, fontSize: 11, fontWeight: '700' },
  submitButton: { marginTop: 17 },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  invalidButton: { alignSelf: 'stretch', marginTop: 18 },
  successScreen: { justifyContent: 'center', paddingHorizontal: 25 },
  successIcon: { width: 82, height: 82, borderRadius: 28, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  successTitle: { textAlign: 'center', fontSize: 28, fontWeight: '900', marginTop: 20 },
  successText: { textAlign: 'center', fontSize: 13, lineHeight: 21, marginTop: 8 },
  confirmationCard: { borderWidth: 1, borderRadius: 17, padding: 17, marginTop: 22 },
  confirmLabel: { fontSize: 8, letterSpacing: 1, fontWeight: '900' },
  confirmId: { fontSize: 18, fontWeight: '900', marginTop: 7 },
  confirmDetail: { fontSize: 12, fontWeight: '700', marginTop: 8 },
  successButton: { marginTop: 18 },
  homeLink: { alignSelf: 'center', padding: 13 },
  homeLinkText: { fontWeight: '800', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(10, 20, 30, 0.46)', justifyContent: 'center', alignItems: 'center', padding: 18 },
  modalDismiss: { ...StyleSheet.absoluteFillObject },
  calendarCard: { width: '100%', maxWidth: 390, borderWidth: 1, borderRadius: 22, padding: 18, elevation: 12 },
  calendarTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  calendarTitle: { fontSize: 18, fontWeight: '900' },
  calendarClose: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  monthYearRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  monthChooser: { flex: 1, borderRadius: 13, minHeight: 46, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 8 },
  yearChooser: { borderRadius: 13, minHeight: 46, minWidth: 115, paddingHorizontal: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrowButton: { width: 34, height: 38, alignItems: 'center', justifyContent: 'center' },
  monthLabel: { fontSize: 12, fontWeight: '900' },
  yearLabel: { fontSize: 12, fontWeight: '900' },
  weekdayRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 },
  weekday: { width: '13.5%', textAlign: 'center', fontSize: 10, fontWeight: '800', paddingVertical: 6 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarCell: { width: '14.285%', height: 42, alignItems: 'center', justifyContent: 'center' },
  dayCell: { borderRadius: 21 },
  dayText: { fontSize: 12 },
  calendarFooter: { borderTopWidth: 1, marginTop: 12, paddingTop: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calendarHint: { fontSize: 10 },
  todayLink: { fontSize: 11, fontWeight: '900', padding: 5 },
});
