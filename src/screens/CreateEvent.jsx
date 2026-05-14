import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ScrollView, StatusBar 
} from 'react-native';
import api from '../../services/api';

const CreateEvent = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); 
  const [location, setLocation] = useState('');
  const [quota, setQuota] = useState(''); 

  const handleSave = async () => {
    if (!name || !description || !location || !quota) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await api.post('/Event', {
        Name: name.trim(),            
        Description: description.trim(), 
        Date: new Date().toISOString(),  
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
        Alert.alert("Hata", "Sunucu isteği reddetti.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d6efd" />

      {/* 🌟 KESİNLİKLE GÖRÜNECEK HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtnWrapper}
        >
          <Text style={styles.backBtn}>{'<'}</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Yeni Etkinlik</Text>
        </View>
        
        <View style={styles.ghostBox} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.label}>Etkinlik Adı</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Örn: Sahil Temizliği" 
            placeholderTextColor="#A1A1AA"
          />
          
          <Text style={styles.label}>Açıklama</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={description} 
            onChangeText={setDescription} 
            placeholder="Neler yapılacak? Detayları yazın..." 
            placeholderTextColor="#A1A1AA"
            multiline
          />

          <Text style={styles.label}>Konum / Şehir</Text>
          <TextInput 
            style={styles.input} 
            value={location} 
            onChangeText={setLocation} 
            placeholder="Örn: Konyaaltı Sahili" 
            placeholderTextColor="#A1A1AA"
          />
          
          <Text style={styles.label}>Kontenjan (Kişi Sayısı)</Text>
          <TextInput 
            style={styles.input} 
            value={quota} 
            onChangeText={setQuota} 
            keyboardType="numeric" 
            placeholder="Örn: 50" 
            placeholderTextColor="#A1A1AA"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>ETKİNLİĞİ YAYINLA</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} /> 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  
  // 🌟 GARANTİLİ HEADER STİLLERİ
  header: { 
    backgroundColor: '#0d6efd', 
    paddingTop: 50, // Android ve iOS çentiklerini kesin kurtarır
    paddingBottom: 15, 
    paddingHorizontal: 15,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    elevation: 5, // Android gölge
    shadowColor: '#000', // iOS gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999 // Her şeyin üstünde olmasını garantiler
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

  // FORM STİLLERİ
  formContainer: { flex: 1, padding: 15, paddingTop: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 20
  },
  label: { fontWeight: 'bold', color: '#3A3A3C', marginBottom: 8, marginTop: 10 },
  input: { 
    backgroundColor: '#F8F9FA', 
    borderWidth: 1, 
    borderColor: '#E5E5EA', 
    padding: 15, 
    borderRadius: 10, 
    fontSize: 15, 
    color: '#1C1C1E' 
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  saveBtn: { 
    backgroundColor: '#198754', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});

export default CreateEvent;