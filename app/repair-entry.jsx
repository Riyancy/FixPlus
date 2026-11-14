import React, { useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '../components/ui';
import { useApp } from '../contexts/AppContext';
const statuses=['Pending','In Progress','Completed'];
const showMessage = (title, message) => {
 if (Platform.OS === 'web' && typeof window !== 'undefined') window.alert(`${title}: ${message}`);
 else Alert.alert(title, message);
};
function normalizeDate(value) {
 const raw = String(value || '').trim();
 const iso = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(raw);
 const local = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(raw);
 const parts = iso ? [iso[1], iso[2], iso[3]] : local ? [local[3], local[2], local[1]] : null;
 if (!parts) return null;
 const [y,m,d] = parts.map(Number);
 const date = new Date(y,m-1,d);
 if (date.getFullYear() !== y || date.getMonth() !== m-1 || date.getDate() !== d) return null;
 return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export default function RepairEntry(){
 const {id,serviceId}=useLocalSearchParams(); const {theme,repairs,saveRepair,services}=useApp();const old=repairs.find(r=>r.id===id);
 const [methodId,setMethodId]=useState(old?.serviceId || (typeof serviceId === 'string' ? serviceId : ''));
 const [methodOpen,setMethodOpen]=useState(false); 
 const [organization,setOrganization]=useState(old?.organization||'');const [asset,setAsset]=useState(old?.asset||'');
 const [repair,setRepair]=useState(old?.repair||'');const [description,setDescription]=useState(old?.description||'');
 const [date,setDate]=useState(old?.date||today());const [amount,setAmount]=useState(old?.amount?.toString()||'');
 const [paidAmount,setPaidAmount]=useState(old?.paidAmount?.toString()||'');const [status,setStatus]=useState(old?.status||'Pending');
 const [notes,setNotes]=useState(old?.notes||'');
 const field=(label,value,setValue,placeholder,multiline=false,keyboardType='default')=><View style={styles.field}><Text style={[styles.label,{color:theme.text}]}>{label}</Text><TextInput value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor={theme.muted} multiline={multiline} keyboardType={keyboardType} style={[styles.input,{backgroundColor:theme.surface,color:theme.text,borderColor:theme.border},multiline&&{minHeight:86,textAlignVertical:'top'}]}/></View>;
 const save=()=>{
   const cost=Number(amount),paid=Number(paidAmount||'0');
   if(!organization.trim()||!repair.trim()||!date.trim()||amount.trim()===''){showMessage('Missing details','Enter organization, repair, date and actual repair cost.');return;}
   const normalizedDate = normalizeDate(date);
   if (!normalizedDate) {showMessage('Invalid date','Use YYYY-MM-DD or DD/MM/YYYY, e.g. 2026-11-14 or 14/11/2026.');return;}
   if(!Number.isFinite(cost)||cost<0||!Number.isFinite(paid)||paid<0||paid>cost){showMessage('Invalid amount','Enter valid non-negative amounts. Paid amount cannot exceed cost.');return;}
   saveRepair({id:old?.id,serviceId:methodId,method:services.find(s=>s.id===methodId)?.name || 'Other repair',organization:organization.trim(),asset:asset.trim(),repair:repair.trim(),description:description.trim(),date:normalizedDate,amount:cost,paidAmount:paid,status,paymentStatus:paid===0?'Unpaid':paid===cost?'Paid':'Partially Paid',notes:notes.trim()});router.replace('/(tabs)/bookings');
 };
 return <Screen><ScrollView contentContainerStyle={styles.page}><Pressable onPress={()=>router.back()}><Text style={{color:theme.primary,fontWeight:'800'}}>‹ Back to history</Text></Pressable><Text style={[styles.title,{color:theme.text}]}>{old?'Edit repair':'Add repair record'}</Text><Text style={{color:theme.muted,marginBottom:18}}>Enter actual breakdown and payment details. No preset prices.</Text>
 <Text style={[styles.label,{color:theme.text}]}>Repair method / service type</Text>
 <Pressable accessibilityRole="button" accessibilityLabel="Choose repair method" onPress={()=>setMethodOpen(true)} style={[styles.input,{backgroundColor:theme.surface,borderColor:theme.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:15}]}>
   <Text style={{color:methodId?theme.text:theme.muted,flex:1}}>{services.find(s=>s.id===methodId)?.name || 'Select repair method'}</Text>
   <Text style={{color:theme.primary,fontWeight:'900',fontSize:18}}>⌄</Text>
 </Pressable>
 <Modal transparent visible={methodOpen} animationType="fade" onRequestClose={()=>setMethodOpen(false)}>
   <View style={styles.modalOverlay}>
     <View style={[styles.modalPanel,{backgroundColor:theme.surface,borderColor:theme.border}]}>
       <View style={styles.modalHeader}><Text style={{color:theme.text,fontSize:18,fontWeight:'900'}}>Select repair method</Text><Pressable onPress={()=>setMethodOpen(false)}><Text style={{color:theme.primary,fontWeight:'800'}}>Close</Text></Pressable></View>
       <ScrollView keyboardShouldPersistTaps="handled">
         {services.map(s=><Pressable key={s.id} onPress={()=>{setMethodId(s.id);setMethodOpen(false);}} style={[styles.modalOption,{borderBottomColor:theme.border}]}><Text style={{color:theme.text,fontWeight:methodId===s.id?'900':'500'}}>{s.name}</Text>{methodId===s.id&&<Text style={{color:theme.primary}}>✓</Text>}</Pressable>)}
       </ScrollView>
     </View>
   </View>
 </Modal>
 {field('Organization / department *',organization,setOrganization,'e.g. Office / Workshop')}
 {field('Equipment / asset',asset,setAsset,'e.g. AC unit 04, Generator')}
 {field('Exact repair / breakdown *',repair,setRepair,'e.g. Replace compressor')}
 {field('Description of work',description,setDescription,'What happened? What was repaired?',true)}
 {field('Repair date * (YYYY-MM-DD or DD/MM/YYYY)',date,setDate,'YYYY-MM-DD')}<Pressable onPress={()=>setDate(today())} style={{marginTop:-8,marginBottom:14}}><Text style={{color:theme.primary,fontWeight:'800'}}>Use today's date</Text></Pressable>
 {field('Actual repair cost (Rs.) *',amount,setAmount,'Enter actual cost',false, 'decimal-pad')}
 {field('Amount paid (Rs.)',paidAmount,setPaidAmount,'Enter amount paid',false, 'decimal-pad')}
 <Text style={[styles.label,{color:theme.text}]}>Repair status</Text><View style={styles.options}>{statuses.map(v=><Pressable key={v} onPress={()=>setStatus(v)} style={[styles.chip,{backgroundColor:status===v?theme.primary:theme.surface,borderColor:theme.border}]}><Text style={{color:status===v?'#fff':theme.text,fontWeight:'700'}}>{v}</Text></Pressable>)}</View>
 <Text style={{color:theme.muted,marginBottom:16}}>Payment status is calculated from cost and amount paid.</Text>
 {field('Additional notes',notes,setNotes,'Invoice number, technician, remarks...',true)}
 <Pressable onPress={save} style={[styles.save,{backgroundColor:theme.primary}]}><Text style={styles.saveText}>{old?'Save changes':'Save repair record'}</Text></Pressable>
 </ScrollView></Screen>;
}
const styles=StyleSheet.create({modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.48)',justifyContent:'center',padding:20},modalPanel:{maxHeight:'75%',borderWidth:1,borderRadius:18,padding:16},modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12},modalOption:{paddingVertical:14,borderBottomWidth:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},page:{padding:20,paddingBottom:55},title:{fontSize:25,fontWeight:'900',marginTop:16,marginBottom:5},field:{marginBottom:14},label:{fontSize:13,fontWeight:'800',marginBottom:7},input:{borderWidth:1,borderRadius:12,padding:13,fontSize:14},options:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:15},chip:{paddingHorizontal:12,paddingVertical:10,borderRadius:12,borderWidth:1},save:{padding:16,alignItems:'center',borderRadius:13,marginTop:10},saveText:{color:'#fff',fontWeight:'900',fontSize:15}});
