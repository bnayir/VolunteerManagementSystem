import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, 
  RefreshControl, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import api from '../../services/api';

const MyApplications = () => {
  const [allApplications, setAllApplications] = useState([]); // Tüm veriyi burada tutacağız
  const [filteredApplications, setFilteredApplications] = useState([]); // Ekranda bunu göstereceğiz
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // Hangi filtrenin aktif olduğunu tutar

  useEffect(() => { fetchMyApplications(); }, []);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/Application/my-applications'); 
      setAllApplications(res.data);
      setFilteredApplications(res.data); 
    } catch (err) {
      console.log("Başvuru çekme hatası");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filtreleme mantığı
  const filterData = (status) => {
    setActiveFilter(status);
    if (status === 'All') {
      setFilteredApplications(allApplications);
    } else {
      const filtered = allApplications.filter(item => item.status === status);
      setFilteredApplications(filtered);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted': return { color: '#4CD964', bg: '#E8F9ED', text: 'Onaylandı' };
      case 'Pending': return { color: '#FF9500', bg: '#FFF4E5', text: 'İnceleniyor' };
      case 'Rejected': return { color: '#FF3B30', bg: '#FFEBEB', text: 'Reddedildi' };
      default: return { color: '#8E8E93', bg: '#F2F2F7', text: 'Beklemede' };
    }
  };

  const renderItem = ({ item }) => {
    const status = getStatusStyle(item.status);
    return (
      <View style={styles.appCard}>
        <View style={styles.cardInfo}>
          <Text style={styles.eventTitle}>{item.eventName || "Gönüllülük Etkinliği"}</Text>
          <Text style={styles.eventDate}>📅 {new Date().toLocaleDateString('tr-TR')}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filtre Butonları */}
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[styles.filterBtn, activeFilter === 'All' && styles.filterBtnActive]} 
          onPress={() => filterData('All')}
        >
          <Text style={[styles.filterBtnText, activeFilter === 'All' && styles.filterBtnTextActive]}>Hepsi</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterBtn, activeFilter === 'Accepted' && styles.filterBtnActive]} 
          onPress={() => filterData('Accepted')}
        >
          <Text style={[styles.filterBtnText, activeFilter === 'Accepted' && styles.filterBtnTextActive]}>Onaylanan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterBtn, activeFilter === 'Pending' && styles.filterBtnActive]} 
          onPress={() => filterData('Pending')}
        >
          <Text style={[styles.filterBtnText, activeFilter === 'Pending' && styles.filterBtnTextActive]}>Bekleyen</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 50}} />
      ) : (
        <FlatList 
          data={filteredApplications} 
          keyExtractor={(item) => item.id.toString()} 
          contentContainerStyle={{ padding: 15 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchMyApplications();}} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>Bu kategoride başvuru bulunamadı.</Text>
            </View>
          }
          renderItem={renderItem} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  filterBar: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 10, 
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  filterBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F3F5' },
  filterBtnActive: { backgroundColor: '#007AFF' },
  filterBtnText: { color: '#666', fontWeight: 'bold', fontSize: 13 },
  filterBtnTextActive: { color: '#fff' },
  appCard: { 
    backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 12, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 2
  },
  cardInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  eventDate: { fontSize: 12, color: '#7F8C8D', marginTop: 5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 50, marginBottom: 10 },
  emptyText: { color: '#999', fontSize: 14 }
});

export default MyApplications;