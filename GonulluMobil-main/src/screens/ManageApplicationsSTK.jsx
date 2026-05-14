import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import api from '../../services/api';

const ManageApplicationsSTK = ({ route, navigation }) => {
  const { eventId, eventName } = route.params; 
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Application/event/${eventId}`);
      setApplications(res.data || []);
    } catch (err) {
      Alert.alert("Hata", "Başvurular çekilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.post(`/Application/update-status/${appId}`, `"${newStatus}"`, {
        headers: { 'Content-Type': 'application/json' }
      });
      Alert.alert("Başarılı", "Durum güncellendi.");
      fetchApplications();
    } catch (err) {
      Alert.alert("Hata", "İşlem başarısız.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{item.volunteer?.firstName} {item.volunteer?.lastName}</Text>
          <Text style={styles.userEmail}>{item.volunteer?.email}</Text>
        </View>
        <Text style={styles.statusBadge}>{item.status}</Text>
      </View>
      
      {item.status === 'Pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={() => handleUpdateStatus(item.id, 'Rejected')}>
            <Text style={{color: '#dc3545'}}>Reddet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.approveBtn]} onPress={() => handleUpdateStatus(item.id, 'Accepted')}>
            <Text style={{color: '#fff'}}>Onayla</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backBtn}>‹</Text></TouchableOpacity>
        <View style={{alignItems: 'center'}}>
            <Text style={styles.headerTitle}>Başvurular</Text>
            <Text style={styles.headerSub}>{eventName}</Text>
        </View>
        <View style={{width: 20}} />
      </View>

      {loading ? <ActivityIndicator size="large" color="#0d6efd" style={{marginTop: 50}} /> : (
        <FlatList 
          data={applications} 
          renderItem={renderItem} 
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{padding: 15}}
          ListEmptyComponent={<Text style={styles.empty}>Henüz başvuru yok.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  blueHeader: { backgroundColor: '#0d6efd', padding: 20, paddingTop: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  backBtn: { color: '#fff', fontSize: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#e0e0e0', fontSize: 12 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userEmail: { fontSize: 12, color: '#666' },
  statusBadge: { backgroundColor: '#f0f0f0', padding: 5, borderRadius: 5, fontSize: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  btn: { flex: 0.48, padding: 10, borderRadius: 8, alignItems: 'center' },
  approveBtn: { backgroundColor: '#198754' },
  rejectBtn: { borderWidth: 1, borderColor: '#dc3545' },
  empty: { textAlign: 'center', marginTop: 100, color: '#999' }
});

export default ManageApplicationsSTK;