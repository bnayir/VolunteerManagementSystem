import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Alert, ActivityIndicator, RefreshControl 
} from 'react-native';
import api from '../../services/api';

const ManageApplications = ({ navigation }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPendingOrgs();
  }, []);

  const fetchPendingOrgs = async () => {
    try {
      const res = await api.get('/Admin/pending-organizations');
      setOrganizations(res.data || []);
    } catch (err) {
      console.log("Liste çekme hatası:", err.message);
      Alert.alert("Hata", "Bekleyen kurumlar listesi alınamadı.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

 const handleUpdateStatus = async (orgId, isApproved) => {
    console.log("Butona basıldı! Gelen Kurum ID:", orgId); 
    
    if (!orgId) {
      Alert.alert("Hata", "Kurumun ID bilgisi bulunamadı. Lütfen sayfayı yenileyin.");
      return;
    }

    const statusValue = isApproved ? "Approved" : "Rejected";

    try {
      console.log("İstek gönderiliyor: /Admin/update-status", { OrganizationId: orgId, NewStatus: statusValue });
      
      const response = await api.post('/Admin/update-status', {
        OrganizationId: orgId, 
        NewStatus: statusValue
      });
      
      console.log("Sunucu yanıt verdi! ✅", response.data);
      Alert.alert("Başarılı! 🎉", `Kurum ${isApproved ? "Onaylandı" : "Reddedildi"}.`);
      fetchPendingOrgs(); 
    } catch (err) {
      console.log("İstek HATA verdi! ❌", err.response?.data || err.message);
      Alert.alert("Hata", "Sunucu isteği reddetti. Terminale bakınız.");
    }
  };
  const renderItem = ({ item }) => {
    
    // 🌟 İŞTE BİZE GERÇEĞİ SÖYLEYECEK OLAN SATIR:
    console.log("🧐 BİR KURUM OBJESİNİN İÇİ:", item);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🏢</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.orgName}>{item.name || item.organizationName || "İsimsiz Kurum"}</Text>
            <Text style={styles.orgEmail}>{item.email || "E-posta yok"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <Text style={styles.detailText}>📌 <Text style={{fontWeight: 'bold'}}>Vergi No:</Text> {item.taxNumber || 'Belirtilmemiş'}</Text>
          <Text style={styles.detailText}>📞 <Text style={{fontWeight: 'bold'}}>Telefon:</Text> {item.phoneNumber || 'Yok'}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.btn, styles.rejectBtn]} 
            onPress={() => handleUpdateStatus(item.id, false)}
          >
            <Text style={styles.rejectBtnText}>REDDET</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, styles.approveBtn]} 
            onPress={() => handleUpdateStatus(item.id, true)}
          >
            <Text style={styles.approveBtnText}>ONAYLA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#666'}}>Kurumlar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kurum Kayıt Talepleri</Text>
        <View style={{ width: 40 }} /> 
      </View>
      
      <FlatList
        data={organizations}
        renderItem={renderItem}
keyExtractor={(item) => (item.eventId ? item.eventId.toString() : Math.random().toString())}        contentContainerStyle={styles.listPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchPendingOrgs();}} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Şu an onay bekleyen bir kurum bulunmuyor. 🎉</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 45, 
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  backIcon: {
    fontSize: 30,
    color: '#007AFF',
    fontWeight: '300',
    marginTop: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  listPadding: { paddingHorizontal: 20, paddingVertical: 20 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 20 },
  headerText: { marginLeft: 12 },
  orgName: { fontSize: 17, fontWeight: 'bold', color: '#1C1C1E' },
  orgEmail: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginVertical: 12 },
  details: { marginBottom: 15 },
  detailText: { fontSize: 14, color: '#3C3C43', marginBottom: 4 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 0.48, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  approveBtn: { backgroundColor: '#34C759' },
  rejectBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF3B30' },
  approveBtnText: { color: '#fff', fontWeight: 'bold' },
  rejectBtnText: { color: '#FF3B30', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#8E8E93', fontSize: 16, textAlign: 'center' }
});

export default ManageApplications;