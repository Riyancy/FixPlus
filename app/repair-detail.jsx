import React from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '../components/ui';
import { useApp } from '../contexts/AppContext';

export default function RepairDetail() {
  const { id } = useLocalSearchParams();
  const { repairs, deleteRepair, theme } = useApp();
  const record = repairs.find((item) => item.id === id);
  const confirmDelete = () => {
    if (!record) return;
    const remove = () => { deleteRepair(record.id); router.replace('/(tabs)/bookings'); };
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm('Permanently delete this repair record?')) remove();
    } else {
      Alert.alert('Delete repair?', 'This cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: remove },
      ]);
    }
  };
  const row = (label, value) => <View style={[styles.row, { borderBottomColor: theme.border }]} key={label}>
    <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
    <Text style={[styles.value, { color: theme.text }]}>{String(value ?? '—')}</Text>
  </View>;
  return <Screen><ScrollView contentContainerStyle={styles.page}>
    <Pressable onPress={() => router.replace('/(tabs)/bookings')}><Text style={{ color: theme.primary, fontWeight: '800' }}>‹ Repair history</Text></Pressable>
    <Text style={[styles.title, { color: theme.text }]}>Repair details</Text>
    {!record ? <Text style={{ color: theme.muted }}>Record not found. It may have been deleted.</Text> : <>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {row('Organization / department', record.organization)}
        {row('Equipment / asset', record.asset)}
        {row('Repair method', record.method)}
        {row('Exact repair', record.repair)}
        {row('Work description', record.description)}
        {row('Repair date', record.date)}
        {row('Repair status', record.status)}
        {row('Actual repair cost (Rs.)', Number(record.amount || 0).toLocaleString())}
        {row('Amount paid (Rs.)', Number(record.paidAmount || 0).toLocaleString())}
        {row('Balance (Rs.)', Math.max(0, Number(record.amount || 0) - Number(record.paidAmount || 0)).toLocaleString())}
        {row('Payment status', record.paymentStatus)}
        {row('Notes', record.notes)}
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => router.push({ pathname: '/repair-entry', params: { id: record.id } })}><Text style={styles.buttonText}>Edit / Update</Text></Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#b53b38' }]} onPress={confirmDelete}><Text style={styles.buttonText}>Delete</Text></Pressable>
      </View>
    </>}
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({page:{padding:20,paddingBottom:50},title:{fontSize:26,fontWeight:'900',marginTop:18,marginBottom:18},card:{borderWidth:1,borderRadius:16,padding:15},row:{paddingVertical:11,borderBottomWidth:1},label:{fontSize:12,fontWeight:'700'},value:{fontSize:15,fontWeight:'600',marginTop:5},actions:{flexDirection:'row',gap:10,marginTop:18},button:{flex:1,alignItems:'center',padding:14,borderRadius:12},buttonText:{color:'#fff',fontWeight:'800'}});
