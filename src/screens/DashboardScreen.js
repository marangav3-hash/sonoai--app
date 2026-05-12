import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/sonoai';
export default function DashboardScreen({ navigation }) {
  const { token, logout } = useAuth();
  const [health, setHealth] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = async () => {
    try {
      const h = await api.health();
      const sc = await api.listScans(token);
      setHealth(h); setScans(sc.slice(0,5));
    } catch(e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { load(); }, []);
  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1D9E75" /></View>;
  return (
    <ScrollView style={s.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#1D9E75" />}>
      <View style={s.statusBar}>
        <View style={[s.dot, { backgroundColor: health && health.status === 'ok' ? '#1D9E75' : '#E24B4A' }]} />
        <Text style={s.statusText}>{health && health.status === 'ok' ? 'System online' : 'System offline'}</Text>
        <Text style={s.statusSub}>Models: {health && health.models_loaded ? 'loaded' : 'untrained'}</Text>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>QUICK ACTIONS</Text>
        <TouchableOpacity style={s.primaryCard} onPress={() => navigation.navigate('Scan')}>
          <View style={s.cardIcon}><Text style={s.cardIconText}>+</Text></View>
          <View><Text style={s.cardTitle}>New scan</Text><Text style={s.cardSub}>Upload DICOM for AI analysis</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryCard} onPress={() => navigation.navigate('History')}>
          <View style={[s.cardIcon, { backgroundColor: '#E1F5EE' }]}><Text style={[s.cardIconText, { color: '#085041' }]}>=</Text></View>
          <View><Text style={[s.cardTitle, { color: '#085041' }]}>Scan history</Text><Text style={[s.cardSub, { color: '#555' }]}>View all previous scans</Text></View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={s.logoutBtn} onPress={logout}><Text style={s.logoutText}>Sign out</Text></TouchableOpacity>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statusBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#085041', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: '#E1F5EE', fontSize: 13, fontWeight: '600', flex: 1 },
  statusSub: { color: '#5DCAA5', fontSize: 12 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 2, marginBottom: 12 },
  primaryCard: { backgroundColor: '#085041', borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 10 },
  secondaryCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: '#ddd' },
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1D9E75', alignItems: 'center', justifyContent: 'center' },
  cardIconText: { color: '#fff', fontSize: 26 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#E1F5EE' },
  cardSub: { fontSize: 13, color: '#9FE1CB', marginTop: 2 },
  logoutBtn: { margin: 24, padding: 14, alignItems: 'center' },
  logoutText: { color: '#888', fontSize: 14 },
});
