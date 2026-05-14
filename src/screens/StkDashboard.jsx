import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, SafeAreaView, Alert, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

const StkDashboard = ({ navigation }) => {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyAdverts();
    }, [])
  );


  const fetchMyAdverts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/Event/my-events'); 
      setAdverts(response.data || []);
    } catch (err) {
      console.log("İlanları çekerken hata:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>STK Yönetim Paneli</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcome}>Hoş Geldiniz! 🏢</Text>
        <Text style={styles.subtitle}>Kurumunuzun faaliyetlerini buradan yönetebilirsiniz.</Text>

        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('CreateAdvert')}
          >
            <Text style={styles.cardIcon}>📢</Text>
            <Text style={styles.cardTitle}>Yeni İlan Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity 
  style={styles.card} 
  onPress={() => navigation.navigate('StkEvents')} 
>
   <Text style={styles.cardIcon}>📩</Text>
            <Text style={styles.cardTitle}>Başvurular</Text>
</TouchableOpacity>


          <TouchableOpacity style={styles.card}  onPress={() => navigation.navigate('StkStatistics')} 
>
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>İstatistikler</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StkProfile')}>
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={styles.cardTitle}>Kurum Profili</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.advertsSection}>
          <Text style={styles.sectionTitle}>Son İlanlarım</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 20}} />
          ) : adverts.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Henüz hiç ilan vermediniz. 🤷‍♂️</Text>
            </View>
          ) : (
            adverts.map((ilan, index) => (
              <View key={index} style={styles.advertCard}>
                <View style={styles.advertHeader}>
                  <Text style={styles.advertTitle}>{ilan.title || "Başlıksız İlan"}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{ilan.status === 'Active' ? 'Aktif' : 'Pasif'}</Text>
                  </View>
                </View>
                <Text style={styles.advertLocation}>📍 {ilan.location || "Konum belirtilmemiş"}</Text>
                <Text style={styles.advertDesc} numberOfLines={2}>{ilan.description}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E' },
  logoutText: { color: '#FF3B30', fontWeight: 'bold' },
  content: { padding: 20 },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#1C1C1E' },
  subtitle: { fontSize: 14, color: '#8E8E93', marginTop: 5, marginBottom: 25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardIcon: { fontSize: 35, marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#3A3A3C', textAlign: 'center' },
  
  advertsSection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 15 },
  emptyBox: { padding: 20, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderStyle: 'dashed' },
  emptyText: { color: '#8E8E93', fontSize: 15 },
  advertCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E5E5EA' },
  advertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  advertTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E', flex: 1, marginRight: 10 },
  statusBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
  advertLocation: { fontSize: 13, color: '#34C759', fontWeight: '600', marginBottom: 5 },
  advertDesc: { fontSize: 14, color: '#666', lineHeight: 20 }
});

export default StkDashboard;