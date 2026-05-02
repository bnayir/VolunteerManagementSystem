import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, StatusBar 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [userStats, setUserStats] = useState({ hours: 0, events: 0, level: 1, badges: 0 });
  const navigation = useNavigation();

  useEffect(() => {
    // Verileri çekiyoruz
    const getProfileData = async () => {
      const savedEmail = await AsyncStorage.getItem('userEmail');
      const savedStats = await AsyncStorage.getItem('userStats');
      
      if (savedEmail) setEmail(savedEmail);
      if (savedStats) setUserStats(JSON.parse(savedStats));
    };
    
    getProfileData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const progressPercent = (userStats.hours % 20) * 5; 

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarLetter}>{email.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{email.split('@')[0]}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      {/* 🌟 Dinamik İstatistik Kartları */}
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

      {/* 🌟 Dinamik İlerleme Çubuğu */}
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>Gönüllülük Seviyesi: {Math.floor(userStats.hours / 20) + 1}</Text>
          <Text style={styles.levelPercent}>%{progressPercent}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.levelFooter}>Bir sonraki seviyeye {20 - (userStats.hours % 20)} saat kaldı!</Text>
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
  userEmail: { fontSize: 13, color: '#E0E0E0' },
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
  menuSection: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#555', marginBottom: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 8, elevation: 1 },
  menuItemText: { fontSize: 14, color: '#333' },
  arrow: { fontSize: 18, color: '#CCC' },
  logoutBtn: { marginTop: 10, borderLeftWidth: 4, borderLeftColor: '#FF3B30' },
  versionText: { textAlign: 'center', color: '#AAA', fontSize: 10, marginVertical: 20 }
});

export default Profile;