import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';

const StkStatistics = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalVolunteers: 0,
    totalHours: 0,
    activeApplications: 0
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalEvents: 12,
        totalVolunteers: 156,
        totalHours: 480,
        activeApplications: 24
      });
      setLoading(false);
    }, 800);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d6efd" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnWrapper}>
          <Text style={styles.backBtn}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>📊 İstatistikler</Text>
        </View>
        <View style={styles.ghostBox} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0d6efd" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Kurum Özeti</Text>
            <Text style={styles.summaryDesc}>Bugüne kadar platformda yarattığınız sosyal etki.</Text>
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.icon}>📅</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalEvents}</Text>
              <Text style={styles.statLabel}>Toplam Etkinlik</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.icon}>👥</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalVolunteers}</Text>
              <Text style={styles.statLabel}>Gönüllü Katılımı</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.icon}>⏳</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalHours}s</Text>
              <Text style={styles.statLabel}>Gönüllülük Saati</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: '#FCE4EC' }]}>
                <Text style={styles.icon}>📩</Text>
              </View>
              <Text style={styles.statValue}>{stats.activeApplications}</Text>
              <Text style={styles.statLabel}>Bekleyen Başvuru</Text>
            </View>
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { backgroundColor: '#0d6efd', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, zIndex: 999 },
  backBtnWrapper: { width: 50, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backBtn: { color: '#ffffff', fontSize: 38, fontWeight: 'bold' },
  titleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  ghostBox: { width: 50 },
  content: { padding: 15, paddingTop: 20 },
  summaryCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 5 },
  summaryDesc: { fontSize: 14, color: '#666' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  icon: { fontSize: 24 },
  statValue: { fontSize: 24, fontWeight: '900', color: '#1C1C1E' },
  statLabel: { fontSize: 13, color: '#8E8E93', marginTop: 5, fontWeight: '500', textAlign: 'center' }
});

export default StkStatistics;