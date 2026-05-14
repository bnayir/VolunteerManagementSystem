import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const StkEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/Event/my-events')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => navigation.navigate('ManageApplicationsSTK', { eventId: item.id, eventName: item.name })}
    >
      <View>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventSubTitle}>📍 {item.location}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Etkinliklerim</Text></View>
      {loading ? <ActivityIndicator size="large" color="#0d6efd" /> : (
        <FlatList 
          data={events} 
          renderItem={renderItem} 
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{padding: 15}}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Henüz etkinlik oluşturmadınız.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { backgroundColor: '#0d6efd', padding: 40, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  eventCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  eventSubTitle: { fontSize: 13, color: '#666', marginTop: 4 },
  arrow: { fontSize: 24, color: '#0d6efd' }
});

export default StkEvents;