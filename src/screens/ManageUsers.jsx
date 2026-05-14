import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  TouchableOpacity, StatusBar 
} from 'react-native';
import api from '../../services/api';

const ManageUsers = ({ navigation }) => { 
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
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />

      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtnWrapper}
        >
          <Text style={styles.backBtn}>{'<'}</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Kullanıcı Listesi</Text>
        </View>
        
        <View style={styles.ghostBox} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1C1C1E" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 15 }} 
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  
  header: { 
    backgroundColor: '#1C1C1E', 
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
    shadowOpacity: 0.3,
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

  userCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  userEmail: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E' },
  userLevel: { fontSize: 13, color: '#007AFF', marginTop: 4, fontWeight: '500' },
  badge: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});

export default ManageUsers;