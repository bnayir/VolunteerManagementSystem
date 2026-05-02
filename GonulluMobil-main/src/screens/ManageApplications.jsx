import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';

const ManageApplications = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => { fetchAllApplications(); }, []);

  const fetchAllApplications = async () => {
    try {
      const res = await api.get('/Admin/all-applications'); 
      setApps(res.data);
    } catch (err) {
      setApps([
        { id: 1, userName: 'ali@test.com', eventName: 'Sahil Temizliği', status: 'Pending' },
        { id: 2, userName: 'ayse@test.com', eventName: 'Kütüphane Yardımı', status: 'Pending' }
      ]);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await api.post(`/Admin/update-status`, { applicationId: id, status: status });
      Alert.alert("Başarılı", `Başvuru ${status === 'Accepted' ? 'onaylandı' : 'reddedildi'}.`);
      fetchAllApplications(); // Listeyi yenile
    } catch (err) {
      Alert.alert("Hata", "İşlem yapılamadı.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.eventName}>{item.eventName}</Text>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.approveBtn} onPress={() => handleAction(item.id, 'Accepted')}>
          <Text style={styles.btnText}>✅</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => handleAction(item.id, 'Rejected')}>
          <Text style={styles.btnText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={apps} keyExtractor={item => item.id.toString()} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  eventName: { color: '#666', fontSize: 13 },
  btnRow: { flexDirection: 'row' },
  approveBtn: { backgroundColor: '#e8f9ed', padding: 10, borderRadius: 8, marginRight: 8 },
  rejectBtn: { backgroundColor: '#ffebeb', padding: 10, borderRadius: 8 },
  btnText: { fontSize: 18 }
});

export default ManageApplications;