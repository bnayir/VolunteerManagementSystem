import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      <View style={styles.headerBlock}>
        <Text style={styles.headerText}>✨ Yeni Etkinlik Oluştur</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Etkinlik Adı</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          placeholder="Etkinliğin başlığını girin" 
        />
        
        <Text style={styles.label}>Açıklama</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={description} 
          onChangeText={setDescription} 
          placeholder="Gönüllülere etkinlik hakkında detay verin..." 
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
            />
          </View>
        </View>

        <Text style={styles.label}>Konum / Adres</Text>
        <TextInput 
          style={styles.input} 
          value={location} 
          onChangeText={setLocation} 
          placeholder="Örn: İstanbul, Beşiktaş Sahil" 
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>✅ Etkinliği Yayınla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  headerBlock: { 
    backgroundColor: '#0d6efd', 
    paddingVertical: 20, 
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 20
  },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  formContainer: { 
    backgroundColor: '#fff', 
    marginHorizontal: 15, 
    padding: 20, 
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
  },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#333', fontSize: 14 },
  input: { 
    borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 15, color: '#000', backgroundColor: '#fafafa' 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },
  saveBtn: { 
    backgroundColor: '#198754', 
    padding: 16, borderRadius: 8, marginTop: 30, alignItems: 'center' 
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CreateAdvert;