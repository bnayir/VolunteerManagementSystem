import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ScrollView, StatusBar 
} from 'react-native';
import api from '../../services/api';

const CreateAdvert = ({ navigation }) => { 
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); 
  const [date, setDate] = useState(''); 
  const [quota, setQuota] = useState('');
  const [location, setLocation] = useState('');

  const handleSave = async () => {
    // 1. Boş alan kontrolü
    if (!name || !description || !date || !quota || !location) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      let formattedDate = new Date(date).toISOString();

      await api.post('/Event', {
        Name: name.trim(),
        Description: description.trim(),
        Date: formattedDate,
        Location: location.trim(),
        Quota: parseInt(quota, 10)
      });

      Alert.alert("Başarılı! 🎉", "Etkinlik başarıyla yayınlandı!");
      navigation.goBack(); 
    } catch (err) {
      console.log("Backend'in reddetme sebebi:", err.response?.data);
      const hatalar = err.response?.data?.errors;
      
      if (hatalar) {
        const hataMesajlari = Object.values(hatalar).flat().join('\n');
        Alert.alert("Validasyon Hatası 🛑", hataMesajlari);
      } else {
        Alert.alert("Hata", "Sunucu isteği reddetti. Tarih formatını (Örn: 2026-05-20) kontrol edin.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d6efd" />

      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtnWrapper}
        >
          <Text style={styles.backBtn}>{'<'}</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>✨ Yeni Etkinlik</Text>
        </View>
        
        <View style={styles.ghostBox} />
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.label}>Etkinlik Adı</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Etkinliğin başlığını girin" 
            placeholderTextColor="#A1A1AA"
          />
          
          <Text style={styles.label}>Açıklama</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={description} 
            onChangeText={setDescription} 
            placeholder="Gönüllülere etkinlik hakkında detay verin..." 
            placeholderTextColor="#A1A1AA"
            multiline
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Tarih & Saat</Text>
              <TextInput 
                style={styles.input} 
                value={date} 
                onChangeText={setDate} 
                placeholder="Örn: 2026-05-20" 
                placeholderTextColor="#A1A1AA"
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Kontenjan</Text>
              <TextInput 
                style={styles.input} 
                value={quota} 
                onChangeText={setQuota} 
                keyboardType="numeric" 
                placeholder="Örn: 50" 
                placeholderTextColor="#A1A1AA"
              />
            </View>
          </View>

          <Text style={styles.label}>Konum / Adres</Text>
          <TextInput 
            style={styles.input} 
            value={location} 
            onChangeText={setLocation} 
            placeholder="Örn: İstanbul, Beşiktaş Sahil" 
            placeholderTextColor="#A1A1AA"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>✅ Etkinliği Yayınla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  scrollArea: { flex: 1 },

  header: { 
    backgroundColor: '#0d6efd', 
    paddingTop: 50, 
    paddingBottom: 15, 
    paddingHorizontal: 15,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999 
  },
  backBtnWrapper: { 
    width: 50, 
    height: 40, 
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backBtn: { 
    color: '#ffffff', 
    fontSize: 38, 
    fontWeight: 'bold',
  },
  titleContainer: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  ghostBox: { width: 50 },

  formContainer: { 
    backgroundColor: '#fff', 
    marginHorizontal: 15, 
    padding: 20, 
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4
  },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#333', fontSize: 14 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 12, 
    borderRadius: 8, 
    fontSize: 15, 
    color: '#1C1C1E', 
    backgroundColor: '#fafafa' 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },
  saveBtn: { 
    backgroundColor: '#198754', 
    padding: 16, 
    borderRadius: 8, 
    marginTop: 30, 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CreateAdvert;