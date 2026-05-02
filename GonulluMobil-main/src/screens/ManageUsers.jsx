import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/Admin/users'); 
      setUsers(res.data);
    } catch (err) {
      setUsers([
        { id: 1, email: 'ali@test.com', totalEvents: 5, level: 'Altın Gönüllü' },
        { id: 2, email: 'ayse@test.com', totalEvents: 2, level: 'Gümüş Gönüllü' },
      ]);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userLevel}>{item.level}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.totalEvents} Etkinlik</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  userCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  userEmail: { fontSize: 16, fontWeight: 'bold' },
  userLevel: { fontSize: 12, color: '#007AFF', marginTop: 3 },
  badge: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});

export default ManageUsers;