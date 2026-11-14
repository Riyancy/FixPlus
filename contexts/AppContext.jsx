import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { services as catalogue } from '../data/services';
import { themes } from '../constants/theme';

const AppContext = createContext(null);
// On the web, browser storage is used directly; on Android/iOS use AsyncStorage.
// Every storage operation is guarded so a disabled storage provider never blanks the app.
const storage = {
  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      }
      return await AsyncStorage.getItem(key);
    } catch { return null; }
  },
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch { /* Keep the UI usable if storage is blocked. */ }
  },
};
const STORAGE = {
  favourites: '@fixplus/favourites',
  bookings: '@fixplus/bookings',
  ratings: '@fixplus/ratings',
  theme: '@fixplus/theme',
  repairs: '@fixplus/repairs',
};

function parseArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isBookingRecord(value) {
  return value !== null
    && typeof value === 'object'
    && typeof value.id === 'string'
    && typeof value.serviceId === 'string'
    && catalogue.some((service) => service.id === value.serviceId)
    && typeof value.serviceName === 'string'
    && typeof value.date === 'string'
    && typeof value.time === 'string'
    && typeof value.address === 'string'
    && (value.status === 'Pending' || value.status === 'Completed');
}

function isRatingRecord(value, bookingById) {
  if (!value || typeof value !== 'object') return false;
  const booking = bookingById.get(value.bookingId);
  return Boolean(
    booking
    && booking.status === 'Completed'
    && value.serviceId === booking.serviceId
    && Number.isInteger(value.stars)
    && value.stars >= 1
    && value.stars <= 5
    && (typeof value.comment === 'string' || value.comment === ''),
  );
}

export function AppProvider({ children }) {
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [scheme, setScheme] = useState('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadSavedState() {
      try {
        const [savedFavourites, savedBookings, savedRatings, savedTheme, savedRepairs] = await Promise.race([Promise.all([
          storage.getItem(STORAGE.favourites),
          storage.getItem(STORAGE.bookings),
          storage.getItem(STORAGE.ratings),
          storage.getItem(STORAGE.theme),
          storage.getItem(STORAGE.repairs),
        ]), new Promise((resolve) => setTimeout(() => resolve([null, null, null, null, null]), 2500))]);
        if (!active) return;
        const validBookings = parseArray(savedBookings).filter(isBookingRecord);
        const bookingById = new Map(validBookings.map((booking) => [booking.id, booking]));
        const validRatings = parseArray(savedRatings)
          .filter((rating) => isRatingRecord(rating, bookingById))
          .filter((rating, index, items) => items.findIndex((item) => item.bookingId === rating.bookingId) === index);
        setFavouriteIds(parseArray(savedFavourites).filter((id) => catalogue.some((service) => service.id === id)));
        setBookings(validBookings);
        setRatings(validRatings);
        setRepairs(parseArray(savedRepairs).filter((r) => r && typeof r.id === "string" && typeof r.repair === "string"));
        if (savedTheme === 'light' || savedTheme === 'dark') setScheme(savedTheme);
      } catch {
        // The app stays usable with its in-memory defaults if device storage is unavailable.
      } finally {
        if (active) setReady(true);
      }
    }
    loadSavedState();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (ready) storage.setItem(STORAGE.favourites, JSON.stringify(favouriteIds)).catch(() => {});
  }, [favouriteIds, ready]);

  useEffect(() => {
    if (ready) storage.setItem(STORAGE.bookings, JSON.stringify(bookings)).catch(() => {});
  }, [bookings, ready]);

  useEffect(() => {
    if (ready) storage.setItem(STORAGE.ratings, JSON.stringify(ratings)).catch(() => {});
  }, [ratings, ready]);

  useEffect(() => {
    if (ready) storage.setItem(STORAGE.theme, scheme).catch(() => {});
  }, [scheme, ready]);

  useEffect(() => {
    if (ready) storage.setItem(STORAGE.repairs, JSON.stringify(repairs)).catch(() => {});
  }, [repairs, ready]);

  const saveRepair = (record) => setRepairs((current) => record.id && current.some((r) => r.id === record.id)
    ? current.map((r) => r.id === record.id ? { ...r, ...record, updatedAt: new Date().toISOString() } : r)
    : [{ ...record, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() }, ...current]);
  const deleteRepair = (id) => setRepairs((current) => current.filter((r) => r.id !== id));

  const toggleFavourite = (serviceId) => {
    setFavouriteIds((current) => current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId]);
  };

  const addBooking = (booking) => setBookings((current) => [booking, ...current]);

  const markBookingCompleted = (bookingId) => {
    setBookings((current) => current.map((booking) => (
      booking.id === bookingId && booking.status !== 'Completed'
        ? { ...booking, status: 'Completed' }
        : booking
    )));
  };

  const addRating = (bookingId, stars, comment = '') => {
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) return false;
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking || booking.status !== 'Completed' || ratings.some((item) => item.bookingId === bookingId)) return false;
    setRatings((current) => current.some((item) => item.bookingId === bookingId)
      ? current
      : [...current, {
        bookingId,
        serviceId: booking.serviceId,
        stars,
        comment: comment.trim(),
      }]);
    return true;
  };

  const services = useMemo(() => catalogue.map((service) => {
    const serviceRatings = ratings.filter((rating) => rating.serviceId === service.id);
    const average = serviceRatings.length
      ? serviceRatings.reduce((total, rating) => total + rating.stars, 0) / serviceRatings.length
      : null;
    return {
      ...service,
      rating: average === null ? null : Number(average.toFixed(1)),
      ratingCount: serviceRatings.length,
      reviews: serviceRatings,
    };
  }), [ratings]);

  const theme = themes[scheme];
  const favouriteServices = useMemo(
    () => services.filter((service) => favouriteIds.includes(service.id)),
    [favouriteIds, services],
  );

  const value = {
    services,
    bookings,
    repairs,
    saveRepair,
    deleteRepair,
    ratings,
    favouriteIds,
    favouriteServices,
    theme,
    scheme,
    ready,
    toggleTheme: () => setScheme((current) => current === 'light' ? 'dark' : 'light'),
    toggleFavourite,
    addBooking,
    markBookingCompleted,
    addRating,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider.');
  return context;
}
