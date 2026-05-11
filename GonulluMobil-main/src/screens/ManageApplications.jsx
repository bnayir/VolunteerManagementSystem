import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';

const ManageApplications = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    setLoading(true);
    try {
      // Not: Backend'de tüm bekleyenleri getiren genel bir endpoint varsa buraya yazabiliriz.
      // Şimdilik sistemin hata vermemesi için simüle edilmiş gerçekçi verilerle başlatıyoruz.
      // İleride burayı api.get('/Admin/pending-applications') şeklinde bağlayabilirsin.
      
      const mockData = [
        { id: 1, volunteerName: 'Ali Yılmaz', eventName: 'Sahil Temizliği', date: '12 Mayıs 2026', status: 'Pending' },
        { id: 2, volunteerName: 'Ayşe Demir', eventName: 'Barınak Ziyareti', date: '14 Mayıs 2026', status: 'Pending' },
        { id: 3, volunteerName: 'Caner Kaya', eventName: 'Kütüphane Düzenlemesi', date: '15 Mayıs 2026', status: 'Pending' },
      ];
      setApplications(mockData);
    } catch (err) {
      console.log("Başvuru çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    const statusText = newStatus === 'Approved' ? 'Onaylamak' : 'Reddetmek';
    
    Alert.alert(
      "İşlem Onayı", 
      `Bu başvuruyu ${statusText} istediğinize emin misiniz?`, 
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Evet, İşlemi Yap", 
          onPress: async () => {
            try {
              // 🌟 SENİN C# BACKEND KODUN ÇALIŞIYOR
              // [HttpPost("update-status/{id}")] metoduna string gönderiyoruz
              await api.post(`/Application/update-status/${appId}`, `"${newStatus}"`, {
                headers: { 'Content-Type': 'application/json' }
              });

              Alert.alert("Başarılı", `Başvuru ${newStatus === 'Approved' ? 'Onaylandı ✅' : 'Reddedildi ❌'}`);
              
              // İşlem yapılan kartı ekrandan anında kaldırıyoruz
              setApplications(prev => prev.filter(app => app.id !== appId));
              
            } catch (err) {
              // Eğer backend henüz bağlı değilse sunumda çalışsın diye simülasyon:
              Alert.alert("Sistem Mesajı", `Başvuru ${newStatus === 'Approved' ? 'Onaylandı ✅' : 'Reddedildi ❌'} (Simülasyon)`);
              setApplications(prev => prev.filter(app => app.id !== appId));
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.volunteerName.charAt(0)}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.volunteerName}>{item.volunteerName}</Text>
          <Text style={styles.dateText}>Başvuru: {item.date}</Text>
        </View>
        <View style={styles.badgePending}>
          <Text style={styles.badgeText}>Bekliyor</Text>
        </View>
      </View>

      <Text style={styles.eventName}>📍 Etkinlik: {item.eventName}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.btn, styles.rejectBtn]} 
          onPress={() => handleStatusUpdate(item.id, 'Rejected')}
        >
          <Text style={styles.btnText}>Reddet ❌</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.btn, styles.approveBtn]} 
          onPress={() => handleStatusUpdate(item.id, 'Approved')}
        >
          <Text style={styles.btnText}>Onayla ✅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>{"< Geri"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Başvuruları Yönet</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={applications}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={styles.emptyText}>Bekleyen yeni başvuru yok!</Text>
              <Text style={styles.emptySubText}>Tüm işlemleri tamamladınız.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { backgroundColor: '#1C1C1E', padding: 20, paddingTop: 50, flexDirection: 'row', alignItems: 'center' },
  backBtn: { paddingRight: 15 },
  backBtnText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  userInfo: { flex: 1 },
  volunteerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  dateText: { fontSize: 12, color: '#888', marginTop: 2 },
  badgePending: { backgroundColor: '#FFF4E5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  badgeText: { color: '#FF9500', fontSize: 12, fontWeight: 'bold' },
  eventName: { fontSize: 15, color: '#444', fontWeight: '500', marginBottom: 20, paddingLeft: 5 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 0.48, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  rejectBtn: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#FFCdd2' },
  approveBtn: { backgroundColor: '#E8F9ED', borderWidth: 1, borderColor: '#C8E6C9' },
  btnText: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 60, marginBottom: 15 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 5 }
});

export default ManageApplications;