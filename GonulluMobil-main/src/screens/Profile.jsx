import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, StatusBar, ActivityIndicator, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

const Profile = () => {
  // Backend'den gelecek veriler
  const [userData, setUserData] = useState({ fullName: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  
  // Yerel hafızadan (AsyncStorage) gelecek istatistikler
  const [userStats, setUserStats] = useState({ hours: 0, events: 0, badges: 0 }); 
  
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserProfile();
      fetchUserStats(); // 🌟 İstatistikleri yerel hafızadan çekiyoruz
    });
    return unsubscribe;
  }, [navigation]);

  // 1. Kullanıcı Bilgilerini (Ad, E-posta, Rol) Veritabanından Çek
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Auth/profile'); 
      
      const ad = res.data.firstName || '';
      const soyad = res.data.lastName || '';
      const tamIsim = `${ad} ${soyad}`.trim() || 'İsimsiz Kahraman';

      setUserData({
        fullName: tamIsim,
        email: res.data.email,
        role: res.data.role
      });
    } catch (err) {
      console.log("Profil çekme hatası:", err);
      setUserData({ fullName: 'Misafir', email: 'E-posta alınamadı', role: 'Gönüllü' });
    } finally {
      setLoading(false);
    }
  };

  // 2. İstatistikleri (Saat, Etkinlik, Rozet) Cihaz Hafızasından Çek
  const fetchUserStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('userStats');
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      } else {
        // Eğer cihazda henüz kayıtlı bir istatistik yoksa varsayılan olarak 0 görünür
        setUserStats({ hours: 0, events: 0, badges: 0 });
      }
    } catch (error) {
      console.log("İstatistik çekme hatası:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Çıkış", "Hesabınızdan çıkış yapmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { 
        text: "Çıkış Yap", 
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
    ]);
  };

  const progressPercent = ((userStats.hours || 0) % 20) * 5; 
  const currentLevel = Math.floor((userStats.hours || 0) / 20) + 1;

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarLetter}>
            {userData.fullName !== 'Misafir' ? userData.fullName.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{userData.fullName}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userRole}>
          {userData.role === 'StkAdmin' ? 'Kurum Yöneticisi 👑' : 'Gönüllü Kahraman 🌟'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userStats.events}</Text>
          <Text style={styles.statLabel}>Etkinlik</Text>
        </View>
        <View style={[styles.statBox, styles.statBorder]}>
          <Text style={styles.statNumber}>{userStats.hours}</Text>
          <Text style={styles.statLabel}>Saat</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userStats.badges}</Text>
          <Text style={styles.statLabel}>Rozet</Text>
        </View>
      </View>

      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>Gönüllülük Seviyesi: {currentLevel}</Text>
          <Text style={styles.levelPercent}>%{progressPercent}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.levelFooter}>Bir sonraki seviyeye {20 - ((userStats.hours || 0) % 20)} saat kaldı!</Text>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Hesap Ayarları</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.menuItemText}>👤 Profil Düzenle</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.menuItemText}>🔔 Bildirim Tercihleri</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* 🌟 Başvurularım kaldırıldı, Gizlilik sayfası senin kodundaki gibi geri eklendi */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.menuItemText}>🛡️ Gizlilik ve Güvenlik</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={handleLogout}>
          <Text style={[styles.menuItemText, {color: '#FF3B30'}]}>🚪 Güvenli Çıkış</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerHeader: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 40, alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 8, marginBottom: 10 },
  avatarLetter: { fontSize: 35, fontWeight: 'bold', color: '#007AFF' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  userEmail: { fontSize: 13, color: '#E0E0E0', marginTop: 2 },
  userRole: { fontSize: 12, color: '#FFF', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 8 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, marginTop: -25, borderRadius: 15, padding: 15, elevation: 4 },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EEE' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 11, color: '#777' },
  levelContainer: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 20, padding: 15, borderRadius: 15, elevation: 3 },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  levelTitle: { fontWeight: 'bold', color: '#333', fontSize: 13 },
  levelPercent: { color: '#007AFF', fontWeight: 'bold', fontSize: 13 },
  progressBarBg: { height: 8, backgroundColor: '#E9ECEF', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#007AFF' },
  levelFooter: { fontSize: 10, color: '#777', marginTop: 8, textAlign: 'center' },
  menuSection: { marginTop: 25, paddingHorizontal: 20, paddingBottom: 30 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#555', marginBottom: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 8, elevation: 1 },
  menuItemText: { fontSize: 14, color: '#333', fontWeight: '500' },
  arrow: { fontSize: 18, color: '#CCC' },
  logoutBtn: { marginTop: 10, borderLeftWidth: 4, borderLeftColor: '#FF3B30' }
});

export default Profile;