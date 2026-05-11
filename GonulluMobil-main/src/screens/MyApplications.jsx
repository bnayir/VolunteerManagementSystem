import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, 
  RefreshControl, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import api from '../../services/api';

const MyApplications = ({ navigation }) => { 
  const [allApplications, setAllApplications] = useState([]); 
  const [filteredApplications, setFilteredApplications] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); 

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMyApplications();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      
      const res = await api.get('/Application/my-applications'); 
      
      setAllApplications(res.data);
      if (activeFilter === 'All') {
        setFilteredApplications(res.data); 
      } else {
        setFilteredApplications(res.data.filter(item => item.status === activeFilter));
      }
    } catch (err) {
      console.log("Başvuru çekme hatası:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
      case 'Approved': return { color: '#4CD964', bg: '#E8F9ED', text: 'Onaylandı' };
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
          <Text style={styles.eventDate}>
            📅 {item.eventDate ? new Date(item.eventDate).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Başvurularım</Text>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[styles.filterBtn, activeFilter === 'All' && styles.filterBtnActive]} 
          onPress={() => filterData('All')}
        >
          <Text style={[styles.filterBtnText, activeFilter === 'All' && styles.filterBtnTextActive]}>Hepsi</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterBtn, activeFilter === 'Approved' && styles.filterBtnActive]} 
          onPress={() => filterData('Approved')}
        >
          <Text style={[styles.filterBtnText, activeFilter === 'Approved' && styles.filterBtnTextActive]}>Onaylanan</Text>
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
  
  headerSection: { 
    backgroundColor: '#007AFF', 
    padding: 30, 
    paddingTop: 25, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    elevation: 4
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff',
    textAlign: 'center' 
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
  cardInfo: { flex: 1, marginRight: 10 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  eventDate: { fontSize: 12, color: '#7F8C8D', marginTop: 5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 50, marginBottom: 10 },
  emptyText: { color: '#999', fontSize: 14 }
});

export default MyApplications;