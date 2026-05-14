import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, 
  RefreshControl, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar
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
    if (!refreshing) setLoading(true);
    try {
      const res = await api.get('/Application/my-applications'); 
      console.log("Gelen Veri:", res.data); 
      
      const data = res.data || [];
      setAllApplications(data);
      
      if (activeFilter === 'All') {
        setFilteredApplications(data); 
      } else {
        setFilteredApplications(data.filter(item => item.status === activeFilter));
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
      case 'Accepted': 
        return { color: '#2ecc71', bg: '#eafaf1', text: 'Onaylandı' };
      case 'Pending': 
        return { color: '#f39c12', bg: '#fef5e7', text: 'Bekliyor' };
      case 'Rejected': 
        return { color: '#e74c3c', bg: '#fdedec', text: 'Reddedildi' };
      default: 
        return { color: '#95a5a6', bg: '#f4f6f6', text: 'Bilinmiyor' };
    }
  };

  const renderItem = ({ item }) => {
    const style = getStatusStyle(item.status);
    return (
      <View style={styles.appCard}>
        <View style={styles.cardInfo}>
          <Text style={styles.eventTitle}>{item.event?.name || item.eventName || "Gönüllülük Etkinliği"}</Text>
          <Text style={styles.eventDate}>
            📅 {item.appliedDate ? new Date(item.appliedDate).toLocaleDateString('tr-TR') : "Tarih Belirtilmemiş"}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
          <Text style={[styles.statusText, { color: style.color }]}>{style.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Başvurularım</Text>
        <View style={{ width: 30 }} /> 
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerSection: { 
    backgroundColor: '#007AFF', 
    paddingTop: 40, 
    paddingBottom: 20, 
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backBtn: { 
    width: 30,
    justifyContent: 'center',
  },
  backBtnText: { 
    color: '#fff', 
    fontSize: 40, 
    fontWeight: '300',
    marginTop: -8 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff',
    textAlign: 'center' 
  },
  filterBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 15, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  filterBtn: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: '#F1F3F5' 
  },
  filterBtnActive: { 
    backgroundColor: '#007AFF' 
  },
  filterBtnText: { 
    color: '#666', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  filterBtnTextActive: { 
    color: '#fff' 
  },
  appCard: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 18, 
    marginBottom: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  cardInfo: { flex: 1, marginRight: 10 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  eventDate: { fontSize: 12, color: '#7F8C8D', marginTop: 5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 50, marginBottom: 10 },
  emptyText: { color: '#999', fontSize: 15, fontWeight: '500' }
});

export default MyApplications;