import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';

const StkProfile = ({ navigation }) => {
  
  const profileData = {
    name: "Eğitim Vakfı",
    email: "iletisim@egitim.org.tr",
    phone: "+90 212 283 62 22",
    address: "Şişli, İstanbul",
    description: "Eğitim Vakfı, kurulduğu günden bu yana nitelikli eğitimin her çocuğun hakkı olduğu inancıyla çalışmaktadır.Bilimsel düşünceyi rehber edinen, milli ve evrensel değerlere sahip bireyler yetiştirmek amacıyla eğitim projeleri geliştiriyor ve başarılı öğrencilerimizi ödüllendiriyoruz. Eğitime yapılan yatırım, geleceğe yapılan en büyük yatırımdır."
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d6efd" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnWrapper}>
          <Text style={styles.backBtn}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>🏢 Kurum Profili</Text>
        </View>
        <View style={styles.ghostBox} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeader}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{profileData.name.charAt(0)}</Text>
          </View>
          <Text style={styles.orgName}>{profileData.name}</Text>
          <Text style={styles.orgBadge}>Onaylı Sivil Toplum Kuruluşu ✓</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Hakkımızda</Text>
          <Text style={styles.descText}>{profileData.description}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📧</Text>
            <View>
              <Text style={styles.infoLabel}>E-Posta</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📞</Text>
            <View>
              <Text style={styles.infoLabel}>Telefon</Text>
              <Text style={styles.infoValue}>{profileData.phone}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.infoIcon}>📍</Text>
            <View>
              <Text style={styles.infoLabel}>Adres</Text>
              <Text style={styles.infoValue}>{profileData.address}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>✏️ Profili Düzenle</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  // HEADER
  header: { backgroundColor: '#0d6efd', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, zIndex: 999 },
  backBtnWrapper: { width: 50, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backBtn: { color: '#ffffff', fontSize: 38, fontWeight: 'bold' },
  titleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  ghostBox: { width: 50 },
  // İÇERİK
  content: { padding: 15 },
  profileHeader: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
  avatarBox: { width: 90, height: 90, backgroundColor: '#fff', borderRadius: 45, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, borderWidth: 2, borderColor: '#0d6efd' },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#0d6efd' },
  orgName: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginTop: 15 },
  orgBadge: { fontSize: 13, color: '#198754', fontWeight: 'bold', marginTop: 5, backgroundColor: '#E8F9ED', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8 },
  descText: { fontSize: 14, color: '#555', lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  infoIcon: { fontSize: 24, marginRight: 15 },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '500', color: '#333' },
  editBtn: { backgroundColor: '#0d6efd', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, elevation: 3 },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default StkProfile;