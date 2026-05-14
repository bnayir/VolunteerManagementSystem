import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';

import api from '../../services/api';

const ManageApplications = ({ navigation }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPendingOrgs();
  }, []);

  const fetchPendingOrgs = async () => {
    try {
      const res = await api.get('/Admin/pending-organizations');

      console.log('Gelen Veriler:', res.data);

      setOrganizations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(
        'Liste çekme hatası:',
        err.response?.data || err.message
      );

      Alert.alert(
        'Hata',
        'Bekleyen kurumlar listesi alınamadı.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async (orgId, isApproved) => {
    console.log('Butona basıldı! Gelen Kurum ID:', orgId);

    if (!orgId) {
      Alert.alert(
        'Hata',
        'Kurumun ID bilgisi bulunamadı.'
      );
      return;
    }

    const statusValue = isApproved
      ? 'Approved'
      : 'Rejected';

    try {
      await api.post('/Admin/update-status', {
        organizationId: orgId,
        newStatus: statusValue,
      });

      Alert.alert(
        'Başarılı 🎉',
        `Kurum ${
          isApproved ? 'onaylandı' : 'reddedildi'
        }.`
      );

      fetchPendingOrgs();
    } catch (err) {
      console.log(
        'İstek HATA verdi ❌',
        err.response?.data || err.message
      );

      Alert.alert(
        'Hata',
        err.response?.data?.message ||
          'İşlem başarısız oldu.'
      );
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🏢</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.orgName}>
              {item.name ||
                item.organizationName ||
                'İsimsiz Kurum'}
            </Text>

            <Text style={styles.orgEmail}>
              {item.email || 'E-posta yok'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <Text style={styles.detailText}>
            📌{' '}
            <Text style={styles.bold}>
              Vergi No:
            </Text>{' '}
            {item.taxNumber || 'Belirtilmemiş'}
          </Text>

          <Text style={styles.detailText}>
            📞{' '}
            <Text style={styles.bold}>
              Telefon:
            </Text>{' '}
            {item.phoneNumber || 'Yok'}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.btn, styles.rejectBtn]}
            onPress={() =>
              handleUpdateStatus(item.id, false)
            }
          >
            <Text style={styles.rejectBtnText}>
              REDDET
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.approveBtn]}
            onPress={() =>
              handleUpdateStatus(item.id, true)
            }
          >
            <Text style={styles.approveBtnText}>
              ONAYLA
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1C1C1E"
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtnWrapper}
        >
          <Text style={styles.backBtn}>{'‹'}</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>
            Kurum Kayıt Talepleri
          </Text>
        </View>

        <View style={styles.ghostBox} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#1C1C1E"
          />

          <Text style={styles.loadingText}>
            Kurumlar yükleniyor...
          </Text>
        </View>
      ) : (
        <FlatList
          data={organizations}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id
              ? item.id.toString()
              : index.toString()
          }
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchPendingOrgs();
              }}
              colors={['#1C1C1E']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Şu an onay bekleyen bir kurum
                bulunmuyor. 🎉
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

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

    boxShadow:
      '0px 2px 6px rgba(0,0,0,0.25)',

    zIndex: 999,
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
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  ghostBox: {
    width: 50,
  },

  listPadding: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,

    elevation: 5,

    boxShadow:
      '0px 2px 8px rgba(0,0,0,0.12)',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#FFF4E5',

    justifyContent: 'center',
    alignItems: 'center',
  },

  iconText: {
    fontSize: 24,
  },

  headerText: {
    marginLeft: 15,
    flex: 1,
  },

  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },

  orgEmail: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 15,
  },

  details: {
    marginBottom: 20,
  },

  detailText: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 6,
  },

  bold: {
    fontWeight: 'bold',
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  btn: {
    flex: 0.48,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  approveBtn: {
    backgroundColor: '#34C759',
  },

  rejectBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },

  approveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  rejectBtnText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 15,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },

  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default ManageApplications;