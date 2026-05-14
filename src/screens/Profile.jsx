import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Animated, ActivityIndicator, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

const Profile = () => {
  const [userData, setUserData] = useState({ fullName: '', email: '', role: '' });
  const [userStats, setUserStats] = useState({ hours: 0, events: 0, badges: 0 }); 
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserProfile();
      fetchUserStats();
    });
    return unsubscribe;
  }, [navigation]);

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
      setUserData({ fullName: 'Misafir Kullanıcı', email: 'E-posta bulunamadı', role: 'Gönüllü' });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('userStats');
      let stats = { hours: 0, events: 0, badges: 0 };
      
      if (savedStats) {
        stats = JSON.parse(savedStats);
        setUserStats(stats);
      } else {
        setUserStats(stats);
      }

      const percent = ((stats.hours || 0) % 20) * 5;
      Animated.timing(progressAnim, {
        toValue: percent,
        duration: 1500,
        useNativeDriver: false,
      }).start();

    } catch (error) {
      console.log("İstatistik çekme hatası:", error);
    }
  };

  const handleLogout = async () => {
    console.log("🚪 Çıkış işlemi başlatıldı...");
    
    try {
      
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      console.log("🧹 Hafıza temizlendi.");

      navigation.replace('Login'); 
      
    } catch (err) {
      console.log("❌ Çıkış yaparken hata oluştu:", err);
      navigation.navigate('Login');
    }
  };

  const progressPercent = ((userStats.hours || 0) % 20) * 5; 
  const currentLevel = Math.floor((userStats.hours || 0) / 20) + 1;
  const initialLetter = userData.fullName !== 'Misafir Kullanıcı' ? userData.fullName.charAt(0).toUpperCase() : 'M';
  
  const roleTitle = userData.role === 'Admin' || userData.role === 'SuperAdmin' ? 'Sistem Yöneticisi 👑' : 
                    userData.role === 'StkAdmin' ? 'Kurum Yöneticisi 🏢' : 'Gönüllü Kahraman 🌟';

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#0056b3" />
        <Text style={{ marginTop: 10, color: '#666' }}>Profiliniz yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0056b3" />
      
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initialLetter}</Text>
        </View>
        <Text style={styles.userName}>{userData.fullName}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userRole}>{roleTitle}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>🤝</Text>
          <Text style={styles.statNumber}>{userStats.events}</Text>
          <Text style={styles.statLabel}>Etkinlik</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>⏳</Text>
          <Text style={[styles.statNumber, {color: '#4CD964'}]}>{userStats.hours}s</Text>
          <Text style={styles.statLabel}>Zaman</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>🏆</Text>
          <Text style={[styles.statNumber, {color: '#FF9500'}]}>{userStats.badges}</Text>
          <Text style={styles.statLabel}>Rozet</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Seviye {currentLevel}</Text>
            <Text style={styles.cardSubtitle}>%{progressPercent}</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, { 
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              }) 
            }]} />
          </View>
          <Text style={styles.progressHint}>Seviye {currentLevel + 1}'e ulaşmak için {20 - ((userStats.hours || 0) % 20)} saat daha gönüllülük yap!</Text>
        </View>

        <Text style={styles.sectionTitle}>Hesap Ayarları</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.menuItemText}>👤 Profil Düzenle</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.menuItemText}>🔔 Bildirim Tercihleri</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.menuItemText}>🛡️ Gizlilik ve Güvenlik</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={handleLogout} 
        >
          <Text style={styles.logoutText}>🚪 Güvenli Çıkış</Text>
        </TouchableOpacity>
        
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: '#0056b3', 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingBottom: 60, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  avatarContainer: { 
    width: 90, height: 90, 
    backgroundColor: '#fff', 
    borderRadius: 45, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#0056b3' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  userEmail: { fontSize: 13, color: '#E3F2FD', marginTop: 2 },
  userRole: { fontSize: 12, color: '#FFF', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginTop: 10 },
  
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    marginTop: -40, 
    paddingHorizontal: 15 
  },
  statBox: { 
    backgroundColor: '#fff', 
    width: '30%', 
    paddingVertical: 15, 
    borderRadius: 15, 
    alignItems: 'center', 
    elevation: 4,
    shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 5
  },
  statIcon: { fontSize: 24, marginBottom: 5 },
  statNumber: { fontSize: 20, fontWeight: '900', color: '#0056b3' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2, fontWeight: '500' },
  
  content: { padding: 20, marginTop: 10 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 20, 
    marginBottom: 20, 
    elevation: 2 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 16, fontWeight: 'bold', color: '#0056b3' },
  progressBarBackground: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0056b3', borderRadius: 5 },
  progressHint: { fontSize: 12, color: '#888', marginTop: 10, fontStyle: 'italic', textAlign: 'center' },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 10, marginTop: 5 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 1 },
  menuItemText: { fontSize: 15, color: '#333', fontWeight: '500' },
  arrow: { fontSize: 18, color: '#CCC' },
  
  logoutBtn: { 
    backgroundColor: '#FFEBEE', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFCDD2'
  },
  logoutText: { color: '#D32F2F', fontSize: 16, fontWeight: 'bold' }
});

export default Profile;