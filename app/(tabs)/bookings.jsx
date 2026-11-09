import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';

export default function BookingsScreen() {
  const { theme } = useApp();
  return <Screen style={{ padding: 20 }}><Text style={{ color: theme.text, fontSize: 24, fontWeight: '800' }}>Bookings</Text></Screen>;
}
