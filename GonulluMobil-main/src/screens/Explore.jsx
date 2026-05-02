import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, ActivityIndicator, RefreshControl, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import api from '../../services/api';

const MOCK_EVENTS = [
  { id: 'm1', name: 'Barınak Gönüllüleri Buluşması', location: 'Antalya Hayvan Barınağı', quota: 20 },
  { id: 'm2', name: 'Kıyı Temizliği Etkinliği', location: 'Konyaaltı Sahili', quota: 50 },
  { id: 'm3', name: 'Çocuklara Kitap Okuma Günleri', location: 'İl Halk Kütüphanesi', quota: 10 },
  { id: 'm4', name: 'Yaşlı Bakımevi Ziyareti', location: 'Huzurevi Müdürlüğü', quota: 15 },
];

const Explore = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [announcement, setAnnouncement] = useState("Bugün yeni etkinlikler yayında! 🚀");

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/Application/available-events'); 
      if (res.data && res.data.length > 0) {
        setEvents(res.data);
        setFilteredEvents(res.data);
      } else {
        setEvents(MOCK_EVENTS);
        setFilteredEvents(MOCK_EVENTS);
      }
    } catch (err) {
      console.error("Bağlantı hatası, hazır veriler yükleniyor.");
      setEvents(MOCK_EVENTS);
      setFilteredEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApply = async (eventId) => {
  try {
    
    
    const res = await api.post('/Application/apply', { 
      EventId: eventId 
    });
    
    if (res.status === 200 || res.status === 201) {
      Alert.alert("Başarılı", "Başvurunuz alındı! ✅");
    }
  } catch (err) {
    console.log("Hata Detayı:", err.response?.data);
    
    Alert.alert("Hata", "Başvuru sırasında bir sorun oluştu. İsimlendirmeyi kontrol edin.");
  }
};

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = events.filter(item => {
      const itemData = `${item.name.toUpperCase()} ${item.location.toUpperCase()}`;
      return itemData.indexOf(text.toUpperCase()) > -1;
    });
    setFilteredEvents(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>Gönüllü Çağrısı</Text>
        </View>
        <Text style={styles.quotaText}>👥 {item.quota} Kişi</Text>
      </View>
      
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.locationText}>📍 {item.location}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>📅 15 Nisan 2026</Text> 
        {/* 🌟 onPress buraya bağlandı */}
        <TouchableOpacity 
          style={styles.joinBtn} 
          onPress={() => handleApply(item.id)}
        >
          <Text style={styles.joinBtnText}>Hemen Katıl</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Etkinlik Keşfet</Text>
        <Text style={styles.subtitle}>Sana uygun bir görev mutlaka vardır.</Text>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Etkinlik veya şehir ara..." 
          placeholderTextColor="#999"
          value={searchText} 
          onChangeText={handleSearch} 
        />
        {announcement && (
  <View style={{ backgroundColor: '#e74c3c', padding: 10 }}>
    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
      📢 DUYURU: {announcement}
    </Text>
  </View>
)}
      </View>

      <FlatList 
        data={filteredEvents} 
        keyExtractor={(item) => item.id.toString()} 
        ListHeaderComponent={
          <View style={styles.bannerCard}>
            <Text style={styles.bannerTitle}>Günün Gönüllüsü Ol! 🌟</Text>
            <Text style={styles.bannerSubtitle}>
              Bugün katılabileceğin {events.length > 0 ? events.length : 'yeni'} etkinlik seni bekliyor.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchEvents();}} />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>
            Aradığınız kriterde etkinlik bulunamadı.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  headerSection: { backgroundColor: '#007AFF', padding: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#E0E0E0', marginBottom: 15 },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, fontSize: 16, elevation: 5 },
  bannerCard: { backgroundColor: '#E7F1FF', padding: 20, marginHorizontal: 16, marginTop: 15, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#007AFF', elevation: 2 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  bannerSubtitle: { fontSize: 13, color: '#555', marginTop: 5 },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 15, borderRadius: 20, padding: 15, elevation: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
  quotaText: { color: '#666', fontSize: 13 },
  eventName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  locationText: { color: '#777', marginTop: 5, fontSize: 14 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { color: '#888', fontSize: 13 },
  joinBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  joinBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default Explore;