import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, StatusBar } from 'react-native';
import api from '../../services/api';

const EventDetail = ({ route, navigation }) => {
  const { event } = route.params;

  const handleApply = async () => {
  try {

    console.log("Başvuru gönderiliyor...");
    console.log("Event ID:", event.id);

    const res = await api.post(
      `/Event/${event.id}/join`
    );

    console.log("BAŞARILI:", res.data);

    Alert.alert(
      "Başarılı ✅",
      res.data?.message ||
      "Başvurunuz alındı!"
    );

    navigation.goBack();

  } catch (err) {

    console.log(
      "JOIN ERROR:",
      err.response?.status
    );

    console.log(
      "JOIN DATA:",
      err.response?.data
    );

    if (err.response?.status === 401) {

      Alert.alert(
        "Oturum Hatası",
        "Lütfen tekrar giriş yapın."
      );

    } else if (err.response?.status === 403) {

      Alert.alert(
        "Yetkisiz",
        "Bu etkinliğe katılma yetkiniz yok."
      );

    } else {

      Alert.alert(
        "Hata",
        err.response?.data?.message ||
        "Başvuru sırasında hata oluştu."
      );
    }
  }
};

  const defaultImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <TouchableOpacity style={styles.floatingBackBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.floatingBackText}>‹</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <Image 
          source={{ uri: event.imageUrl || defaultImage }} 
          style={styles.headerImage}
        />

        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Gönüllü Aranıyor</Text>
          </View>

          <Text style={styles.title}>{event.name}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.icon}>📍</Text>
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.icon}>📅</Text>
              <Text style={styles.infoText}>
                {event.date ? new Date(event.date).toLocaleDateString('tr-TR') : 'Tarih Belirtilmedi'}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.icon}>👥</Text>
              <Text style={styles.infoText}>Kontenjan: {event.quota} Kişi</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Etkinlik Hakkında</Text>
          <Text style={styles.description}>
            {event.description || "Bu etkinlik için detaylı bir açıklama girilmemiş. Ancak harika bir sosyal sorumluluk fırsatı olduğuna eminiz! Hemen katıl ve topluma değer katmak için ilk adımı at."}
          </Text>
          
          <View style={{ height: 40 }} /> 
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Hemen Katıl</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  floatingBackBtn: {
    position: 'absolute',
    top: 50, 
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, 
  },
  floatingBackText: {
    color: '#fff',
    fontSize: 35,
    fontWeight: '300',
    marginTop: -4,
    marginLeft: -2,
  },

  headerImage: { width: '100%', height: 280, resizeMode: 'cover' },
  content: { padding: 20, marginTop: -25, backgroundColor: '#F8F9FA', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  badge: { backgroundColor: '#E8F9ED', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#4CD964' },
  badgeText: { color: '#4CD964', fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 26, fontWeight: '900', color: '#1C1C1E', marginBottom: 20 },
  infoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  icon: { fontSize: 20, marginRight: 15 },
  infoText: { fontSize: 15, color: '#333', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 10 },
  description: { fontSize: 15, color: '#555', lineHeight: 24 },
  footer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: 30 },
  applyBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 15, alignItems: 'center', elevation: 4 },
  applyBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }
});

export default EventDetail;