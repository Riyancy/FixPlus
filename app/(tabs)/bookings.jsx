import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';

export default function RepairHistory() {
  const { theme, repairs, deleteRepair } = useApp();
  const confirmDelete = (record) => {
    const remove = () => deleteRepair(record.id);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(`Delete repair record: ${record.repair}? This cannot be undone.`)) remove();
    } else {
      Alert.alert('Delete repair?', `Delete ${record.repair}? This cannot be undone.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: remove },
      ]);
    }
  };
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const shown = useMemo(() => repairs.filter((r) =>
    (filter === 'All' || r.status === filter) &&
    [r.organization, r.repair, r.description, r.date, r.asset, r.method].map((x) => String(x ?? '')).join(' ').toLowerCase().includes(query.toLowerCase())
  ).sort((a,b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))), [repairs, query, filter]);
  const total = repairs.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const paid = repairs.reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0);
  return <Screen><ScrollView contentContainerStyle={styles.page}>
    <View style={styles.top}><View><Text style={[styles.title,{color:theme.text}]}>Repair history</Text><Text style={{color:theme.muted}}>Track breakdowns, costs and work status</Text></View>
      <Pressable onPress={() => router.push('/repair-entry')} style={[styles.add,{backgroundColor:theme.primary}]}><Ionicons name="add" size={18} color="#fff"/><Text style={styles.addText}>Add</Text></Pressable></View>
    <View style={[styles.summary,{backgroundColor:theme.surface,borderColor:theme.border}]}><Text style={{color:theme.text,fontWeight:'800'}}>{repairs.length} repair records</Text><Text style={{color:theme.muted,marginTop:5}}>Total cost: Rs. {total.toLocaleString()}   |   Paid: Rs. {paid.toLocaleString()}</Text></View>
    <TextInput placeholder="Search organization, repair, date..." placeholderTextColor={theme.muted} value={query} onChangeText={setQuery} style={[styles.input,{backgroundColor:theme.surface,borderColor:theme.border,color:theme.text}]}/>
    <View style={styles.filters}>{['All','Pending','In Progress','Completed'].map(f=><Pressable key={f} onPress={()=>setFilter(f)} style={[styles.filter,{backgroundColor:filter===f?theme.primary:theme.surface,borderColor:theme.border}]}><Text style={{color:filter===f?'#fff':theme.text,fontSize:12,fontWeight:'700'}}>{f}</Text></Pressable>)}</View>
    {shown.length===0?<View style={styles.empty}><Ionicons name="document-text-outline" size={42} color={theme.muted}/><Text style={{color:theme.muted,marginTop:12,textAlign:'center'}}>No repair records yet. Tap Add to save your first breakdown.</Text></View>:shown.map(r=><View key={r.id} style={[styles.card,{backgroundColor:theme.surface,borderColor:theme.border}]}>
      <View style={styles.top}><Text style={[styles.repair,{color:theme.text}]}>{r.repair}</Text><Text style={{color:theme.primary,fontWeight:'800'}}>{r.status}</Text></View>
      <Text style={{color:theme.muted,marginTop:5}}>{r.organization || 'Organization not specified'} · {r.date}</Text>
      <Text style={{color:theme.primary,marginTop:5,fontWeight:'700'}}>Method: {r.method || 'Other repair'}</Text>
      {!!r.asset&&<Text style={{color:theme.text,marginTop:8}}>Equipment: {r.asset}</Text>}
      {!!r.description&&<Text style={{color:theme.text,marginTop:8}}>{r.description}</Text>}
      <Text style={{color:theme.text,marginTop:10}}>Cost: Rs. {Number(r.amount||0).toLocaleString()}  |  Paid: Rs. {Number(r.paidAmount||0).toLocaleString()}</Text>
      <Text style={{color:theme.muted,marginTop:4}}>Payment: {r.paymentStatus || 'Not specified'}</Text>
      <View style={[styles.actions,{borderTopColor:theme.border}]}>
        <Pressable accessibilityRole="button" onPress={()=>router.push({pathname:'/repair-detail',params:{id:r.id}})}><Text style={{color:theme.primary,fontWeight:'800'}}>View details</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={()=>router.push({pathname:'/repair-entry',params:{id:r.id}})}><Text style={{color:theme.primary,fontWeight:'800'}}>Edit</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={()=>confirmDelete(r)}><Text style={{color:'#c0392b',fontWeight:'800'}}>Delete</Text></Pressable>
      </View>
    </View>)}
  </ScrollView></Screen>;
}
const styles=StyleSheet.create({page:{padding:18,paddingBottom:42},top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10},title:{fontSize:26,fontWeight:'900',marginBottom:4},add:{paddingHorizontal:16,paddingVertical:12,borderRadius:12,flexDirection:'row',alignItems:'center',gap:5},addText:{color:'#fff',fontWeight:'800'},summary:{padding:16,borderRadius:16,borderWidth:1,marginTop:20},input:{marginTop:16,borderWidth:1,borderRadius:12,padding:13},filters:{flexDirection:'row',flexWrap:'wrap',gap:7,marginVertical:14},filter:{paddingHorizontal:10,paddingVertical:9,borderWidth:1,borderRadius:18},empty:{alignItems:'center',padding:35},card:{borderWidth:1,borderRadius:16,padding:15,marginBottom:12},repair:{fontSize:17,fontWeight:'900',flex:1},actions:{borderTopWidth:1,marginTop:14,paddingTop:12,flexDirection:'row',justifyContent:'space-between'}});
