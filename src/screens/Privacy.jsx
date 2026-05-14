import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const Privacy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gizlilik ve Güvenlik</Text>
      <Text style={styles.text}>
        1. Gönüllü Yönetim Sistemi olarak verilerinizin güvenliği bizim için önemlidir.{"\n\n"}
        2. Paylaştığınız bilgiler sadece başvurduğunuz etkinlik sahipleriyle paylaşılır.{"\n\n"}
        3. Şifreleriniz uçtan uca şifrelenerek korunmaktadır.{"\n\n"}
        4. İstediğiniz zaman hesabınızı silebilir ve verilerinizin kaldırılmasını talep edebilirsiniz.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  text: { fontSize: 14, color: '#555', lineHeight: 22 }
});

export default Privacy;