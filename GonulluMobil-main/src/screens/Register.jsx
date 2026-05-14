import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import api from '../../services/api';

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('User'); 
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/Auth/register', {
        firstName,
        lastName,
        email: email.trim(),
        password,
        phoneNumber,
        role
      });
      
      const successMsg = role === 'StkAdmin' 
        ? "STK başvurunuz alındı! Yönetici onayından sonra giriş yapabilirsiniz." 
        : "Hesabınız oluşturuldu! Giriş yapabilirsiniz.";

      Alert.alert("Başarılı!", successMsg, [
        { text: "Tamam", onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      console.log("Kayıt Hatası Detayı:", err.response?.data);
      const mesaj = err.response?.data?.message || "Kayıt sırasında bir hata oluştu.";
      Alert.alert("Kayıt Hatası", typeof mesaj === 'string' ? mesaj : "Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <Text style={styles.subtitle}>Sisteme nasıl dahil olmak istersiniz?</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleBox, role === 'User' && styles.activeRoleBox]} 
          onPress={() => setRole('User')}
        >
          <Text style={styles.roleIcon}>🙋‍♂️</Text>
          <Text style={[styles.roleText, role === 'User' && styles.activeRoleText]}>Gönüllü</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleBox, role === 'StkAdmin' && styles.activeRoleBox]} 
          onPress={() => setRole('StkAdmin')}
        >
          <Text style={styles.roleIcon}>🏢</Text>
          <Text style={[styles.roleText, role === 'StkAdmin' && styles.activeRoleText]}>STK / Kurum</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Ad" value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Soyad" value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Telefon" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
        <TextInput style={styles.input} placeholder="E-posta" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>KAYIT OL</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{marginTop: 20}}>
          <Text style={styles.footerText}>Zaten hesabın var mı? <Text style={styles.link}>Giriş Yap</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 25, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1C1C1E', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#8E8E93', textAlign: 'center', marginBottom: 25 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  roleBox: { flex: 0.48, padding: 15, borderRadius: 15, backgroundColor: '#F2F2F7', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  activeRoleBox: { borderColor: '#007AFF', backgroundColor: '#E3F2FD' },
  roleIcon: { fontSize: 30, marginBottom: 5 },
  roleText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  activeRoleText: { color: '#007AFF' },
  form: { width: '100%' },
  input: { backgroundColor: '#F2F2F7', padding: 15, borderRadius: 12, marginBottom: 12, fontSize: 16, color: '#000' },
  btn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerText: { textAlign: 'center', color: '#666' },
  link: { color: '#007AFF', fontWeight: 'bold' }
});

export default Register;