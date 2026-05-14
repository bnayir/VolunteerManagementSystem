import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  ActivityIndicator, SafeAreaView, StatusBar 
} from 'react-native';
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
      <View style={{ flex: 1 }}>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventSubTitle}>📍 {item.location}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d6efd" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnWrapper}>
          <Text style={styles.backBtn}>‹</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Etkinliklerim</Text>
        </View>
        
        <View style={styles.ghostBox} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0d6efd" style={{marginTop: 50}} /> 
      ) : (
        <FlatList 
          data={events} 
          renderItem={renderItem} 
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{padding: 15}}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyText}>Henüz bir etkinlik oluşturmadınız.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  
  header: { 
    backgroundColor: '#0d6efd', 
    paddingTop: 20, 
    paddingBottom: 20, 
    paddingHorizontal: 20,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  backBtnWrapper: { 
    width: 40, 
    justifyContent: 'center' 
  },
  backBtn: { 
    color: '#fff', 
    fontSize: 45, 
    fontWeight: '300',
    marginTop: -8 
  },
  titleContainer: { 
    flex: 1, 
    alignItems: 'center' 
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  ghostBox: { width: 40 }, 

  eventCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 1}, 
    shadowOpacity: 0.1, 
    shadowRadius: 2
  },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 4 },
  eventSubTitle: { fontSize: 13, color: '#666' },
  arrow: { fontSize: 28, color: '#0d6efd', marginLeft: 10, fontWeight: '300' },
  
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 50, marginBottom: 10 },
  emptyText: { color: '#999', fontSize: 15, fontWeight: '500' }
});

export default StkEvents;