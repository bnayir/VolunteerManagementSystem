import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Yeni Etkinlik Oluştur</Text>

      <Text style={styles.label}>Etkinlik Adı</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Örn: Sahil Temizliği" 
      />
      
      <Text style={styles.label}>Açıklama</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={description} 
        onChangeText={setDescription} 
        placeholder="Neler yapılacak? Detayları yazın..." 
        multiline
      />

      <Text style={styles.label}>Konum / Şehir</Text>
      <TextInput 
        style={styles.input} 
        value={location} 
        onChangeText={setLocation} 
        placeholder="Örn: Konyaaltı Sahili" 
      />
      
      <Text style={styles.label}>Kontenjan (Kişi Sayısı)</Text>
      <TextInput 
        style={styles.input} 
        value={quota} 
        onChangeText={setQuota} 
        keyboardType="numeric" 
        placeholder="Örn: 50" 
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>ETKİNLİĞİ YAYINLA</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} /> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1C1C1E', marginTop: 40 },
  label: { fontWeight: 'bold', marginTop: 15, color: '#3A3A3C' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA', padding: 15, borderRadius: 10, fontSize: 16, color: '#000', marginTop: 5 },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#34C759', padding: 18, borderRadius: 12, marginTop: 30, alignItems: 'center', elevation: 3 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CreateEvent;