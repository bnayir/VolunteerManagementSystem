import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../services/api';

const CreateEvent = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // Backend DTO'da var
  const [location, setLocation] = useState('');
  const [quota, setQuota] = useState('');

  const handleSave = async () => {
    if (!name || !description || !location || !quota) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      
      await api.post('/Event', {
        Name: name,
        Description: description,
        Date: new Date().toISOString(), 
        Location: location,
        Quota: parseInt(quota)
      });

      Alert.alert("Başarılı", "Etkinlik veritabanına kaydedildi! ✅");
      navigation.goBack();
    } catch (err) {
      const errorMsg = err.response?.data || "Kaydedilemedi, yetkinizi veya bağlantıyı kontrol edin.";
      Alert.alert("Hata", typeof errorMsg === 'string' ? errorMsg : "Bir sorun oluştu.");
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
        placeholder="Örn: Park Temizliği" 
      />
      
      <Text style={styles.label}>Açıklama</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={description} 
        onChangeText={setDescription} 
        placeholder="Etkinlik detaylarını yazın..." 
        multiline
      />

      <Text style={styles.label}>Konum / Şehir</Text>
      <TextInput 
        style={styles.input} 
        value={location} 
        onChangeText={setLocation} 
        placeholder="Örn: Antalya" 
      />
      
      <Text style={styles.label}>Kontenjan</Text>
      <TextInput 
        style={styles.input} 
        value={quota} 
        onChangeText={setQuota} 
        keyboardType="numeric" 
        placeholder="Örn: 20" 
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>ETKİNLİĞİ YAYINLA</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} /> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1a1a1a' },
  label: { fontWeight: 'bold', marginTop: 15, color: '#333' },
  input: { borderBottomWidth: 1, borderColor: '#ddd', paddingVertical: 10, fontSize: 16, color: '#000' },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 12, marginTop: 40, alignItems: 'center', elevation: 3 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CreateEvent;