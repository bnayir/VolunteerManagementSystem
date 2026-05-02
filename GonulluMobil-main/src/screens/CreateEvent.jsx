import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';

const CreateEvent = ({ navigation }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quota, setQuota] = useState('');

  const handleSave = async () => {
    if (!name || !location || !quota) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await api.post('/Application/create-event', {
        Name: name,
        Location: location,
        Quota: parseInt(quota)
      });
      Alert.alert("Başarılı", "Etkinlik yayına alındı! ✅");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Hata", "Kaydedilemedi, backend bağlantısını kontrol et.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Etkinlik Adı</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Örn: Park Temizliği" />
      
      <Text style={styles.label}>Konum / Şehir</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Örn: Antalya" />
      
      <Text style={styles.label}>Kontenjan</Text>
      <TextInput style={styles.input} value={quota} onChangeText={setQuota} keyboardType="numeric" placeholder="Örn: 20" />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>YAYINLA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 15, color: '#333' },
  input: { borderBottomWidth: 1, borderColor: '#ddd', paddingVertical: 10, fontSize: 16 },
  saveBtn: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 10, marginTop: 40, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CreateEvent;