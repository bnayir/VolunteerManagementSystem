import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, ActivityIndicator, RefreshControl, Alert, ScrollView
} from 'react-native';
import api from '../../services/api';

const Explore = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [announcement, setAnnouncement] = useState("Bugün yeni etkinlikler yayında! 🚀");

  const CATEGORIES = ["Hepsi", "Eğitim", "Çevre", "Hayvanlar", "Sosyal", "Yardım"];
  const [activeCategory, setActiveCategory] = useState("Hepsi");

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Event'); 
      setEvents(res.data); 
      setFilteredEvents(res.data); 
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      Alert.alert("Hata", "Etkinlikler yüklenemedi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (searchTextValue, categoryValue) => {
    let result = events;

    if (categoryValue !== "Hepsi") {
      const catLower = categoryValue.toLocaleLowerCase('tr-TR');
      result = result.filter(item => 
        item.name?.toLocaleLowerCase('tr-TR').includes(catLower) || 
        item.description?.toLocaleLowerCase('tr-TR').includes(catLower)
      );
    }

    if (searchTextValue) {
      const searchLower = searchTextValue.toLocaleLowerCase('tr-TR');
      result = result.filter(item => {
        const targetData = `${item.name} ${item.location} ${item.description}`.toLocaleLowerCase('tr-TR');
        return targetData.includes(searchLower);
      });
    }
    setFilteredEvents(result);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    applyFilters(text, activeCategory);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    applyFilters(searchText, category);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('EventDetail', { event: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>Gönüllü Çağrısı</Text>
        </View>
        <Text style={styles.quotaText}>👥 Kontenjan: {item.quota}</Text>
      </View>
      
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.locationText}>📍 {item.location}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>📅 {item.date ? new Date(item.date).toLocaleDateString('tr-TR') : 'Tarih Belirtilmedi'}</Text> 
        
        <View style={styles.joinBtn}>
          <Text style={styles.joinBtnText}>İncele</Text>
        </View>
      </View>
    </TouchableOpacity>
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
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
              onPress={() => handleCategorySelect(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {announcement && (
        <View style={styles.announcementBar}>
          <Text style={styles.announcementText}>📢 {announcement}</Text>
        </View>
      )}

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList 
          data={filteredEvents} 
          keyExtractor={(item) => item.id.toString()} 
          ListHeaderComponent={
            <View style={styles.bannerCard}>
              <Text style={styles.bannerTitle}>Günün Gönüllüsü Ol! 🌟</Text>
              <Text style={styles.bannerSubtitle}>
                Sistemde {events.length} aktif etkinlik seni bekliyor.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchEvents();}} />
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aradığınız kriterde etkinlik bulunamadı.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  headerSection: { backgroundColor: '#007AFF', padding: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#E0E0E0', marginBottom: 15 },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, fontSize: 16, elevation: 5 },
  categoryScroll: { marginTop: 15, flexDirection: 'row' },
  catBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  catBtnActive: { backgroundColor: '#fff', borderColor: '#fff' },
  catText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  catTextActive: { color: '#007AFF', fontWeight: 'bold' },
  announcementBar: { backgroundColor: '#e74c3c', padding: 8 },
  announcementText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
  bannerCard: { backgroundColor: '#E7F1FF', padding: 20, marginHorizontal: 16, marginTop: 15, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#007AFF' },
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
  joinBtn: { backgroundColor: '#F0F2F5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  joinBtnText: { color: '#007AFF', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default Explore;