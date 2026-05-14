import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, StatusBar, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import api from '../../services/api';

const AdminPanel = ({ navigation }) => {
  const [pendingCount, setPendingApps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Admin/pending-organizations');
      
      if (res.data) {
        setPendingApps(res.data.length);
      }
    } catch (err) {
      console.log("Veri çekme hatası:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log("Çıkış butonuna basıldı!");

    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.setItem('userRole', 'User'); 
      
      console.log("Hafıza temizlendi, yönlendiriliyor...");

      navigation.navigate('Login'); 

    } catch (err) {
      console.error("Logout Error:", err);
      navigation.navigate('Login');
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" /> 

      <View style={styles.darkHeader}>
        <Text style={styles.headerTitle}>Süper Admin</Text>
        <Text style={styles.headerSubtitle}>Platform Yönetim Merkezi</Text>
      </View>

      <View style={styles.mainStatCard}>
        {loading ? (
          <ActivityIndicator color="#007AFF" />
        ) : (
          <>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Onay Bekleyen Kurum Kaydı</Text>
          </>
        )}
      </View>

      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Yönetim İşlemleri</Text>

        <TouchableOpacity 
          style={styles.menuCard} 
          onPress={() => navigation.navigate('ManageApplications')} 
        >
          <View style={[styles.iconWrapper, { backgroundColor: '#FFF4E5' }]}>
            <Text style={styles.menuIcon}>🏢</Text>
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>STK Kayıtlarını Onayla</Text>
            <Text style={styles.menuSubText}>Yeni kurum başvurularını incele ve yetki ver</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('ManageUsers')}>
          <View style={[styles.iconWrapper, { backgroundColor: '#E8F9ED' }]}>
            <Text style={styles.menuIcon}>👥</Text>
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Sistemdeki Kullanıcılar</Text>
            <Text style={styles.menuSubText}>Tüm gönüllü ve yöneticileri görüntüle</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuCard, {marginTop: 20}]} onPress={handleLogout}>
          <View style={[styles.iconWrapper, { backgroundColor: '#FFEBEE' }]}>
            <Text style={styles.menuIcon}>🚪</Text>
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuText, {color: '#e74c3c'}]}>Çıkış Yap</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  darkHeader: { backgroundColor: '#1C1C1E', paddingTop: 60, paddingBottom: 60, paddingHorizontal: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { color: '#8E8E93', fontSize: 14, marginTop: 5 },
  mainStatCard: { backgroundColor: '#fff', marginHorizontal: 25, marginTop: -30, padding: 25, borderRadius: 20, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  statNumber: { fontSize: 42, fontWeight: '900', color: '#FF9500' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5, fontWeight: '600' },
  menuScroll: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 15, marginTop: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
  menuCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 15, alignItems: 'center', elevation: 2 },
  iconWrapper: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuIcon: { fontSize: 24 },
  menuTextContainer: { flex: 1 },
  menuText: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  menuSubText: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  badge: { backgroundColor: '#FF9500', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});

export default AdminPanel;