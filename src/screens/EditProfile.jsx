import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleUpdate = () => {
    Alert.alert("Başarılı", "Profil bilgileriniz güncellendi! ✅");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ad Soyad</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Adınızı giriniz" />
      
      <Text style={styles.label}>Telefon Numarası</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="05XX XXX XX XX" keyboardType="phone-pad" />
      
      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
        <Text style={styles.saveBtnText}>Değişiklikleri Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 25 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2 },
  saveBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default EditProfile;