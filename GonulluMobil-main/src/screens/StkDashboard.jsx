import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const StkDashboard = ({ navigation }) => {
  const [stkStats, setStkStats] = useState({ myEvents: 0, newApps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStkData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchStkData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Event/my-events'); 
      setStkStats({
        myEvents: res.data.length,
        newApps: res.data.reduce((total, event) => total + (event.pendingCount || 0), 0)
      });
    } catch (err) {
      console.log("STK veri hatası:", err);
      setStkStats({ myEvents: 3, newApps: 5 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0056b3" />
      
      {/* Mavi Kurumsal Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kurum Yönetim Paneli</Text>
        <Text style={styles.headerSubtitle}>Etkinliklerinizi ve başvurularınızı buradan yönetin.</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stkStats.myEvents}</Text>
          <Text style={styles.statLabel}>Etkinliklerim</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, {color: '#FF9500'}]}>{stkStats.newApps}</Text>
          <Text style={styles.statLabel}>Yeni Başvuru</Text>
        </View>
      </View>

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CreateEvent')}>
          <View style={[styles.iconCircle, {backgroundColor: '#E3F2FD'}]}>
            <Text style={styles.menuIcon}>📝</Text>
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuTitle}>Yeni Etkinlik Oluştur</Text>
            <Text style={styles.menuDesc}>Gönüllü ihtiyacını sisteme girin</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ManageApplications')}>
          <View style={[styles.iconCircle, {backgroundColor: '#FFF3E0'}]}>
            <Text style={styles.menuIcon}>👥</Text>
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuTitle}>Gelen Başvurular</Text>
            <Text style={styles.menuDesc}>Gönüllü taleplerini onaylayın</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
          <View style={[styles.iconCircle, {backgroundColor: '#E8F5E9'}]}>
            <Text style={styles.menuIcon}>🏢</Text>
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuTitle}>Kurum Bilgileri</Text>
            <Text style={styles.menuDesc}>Profilinizi ve logonuzu düzenleyin</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* 🌟 HATA DÜZELTİLEN KISIM BURASI */}
        <TouchableOpacity style={[styles.menuItem, {marginTop: 20}]} onPress={handleLogout}>
          <View style={[styles.iconCircle, {backgroundColor: '#FFEBEE'}]}>
            <Text style={styles.menuIcon}>🚪</Text>
          </View>
          <View style={styles.menuTextContent}>
            <Text style={[styles.menuTitle, {color: '#D32F2F'}]}>Oturumu Kapat</Text>
          </View>
        </TouchableOpacity>
        {/* 🌟 -------------------------------- */}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#0056b3', padding: 30, paddingTop: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#E3F2FD', fontSize: 13, marginTop: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: -30, paddingHorizontal: 20 },
  statCard: { backgroundColor: '#fff', width: '45%', padding: 20, borderRadius: 15, alignItems: 'center', elevation: 5 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#0056b3' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  menuList: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 2 },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuIcon: { fontSize: 20 },
  menuTextContent: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  menuDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  arrow: { fontSize: 20, color: '#CCC' }
});

export default StkDashboard;