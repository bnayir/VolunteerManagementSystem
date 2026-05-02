import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const Notifications = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Anlık Bildirimler</Text>
          <Text style={styles.desc}>Yeni etkinliklerden haberim olsun.</Text>
        </View>
        <Switch value={pushEnabled} onValueChange={setPushEnabled} />
      </View>
      
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>E-Posta Bülteni</Text>
          <Text style={styles.desc}>Haftalık özetleri gönder.</Text>
        </View>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  desc: { fontSize: 12, color: '#777', marginTop: 4 }
});

export default Notifications;