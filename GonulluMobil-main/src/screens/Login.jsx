import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Uyarı", "Lütfen e-posta ve şifrenizi girin.");
            return;
        }

        setLoading(true);
        try {
            // Gerçek C# Backend'ine istek atıyoruz
            const res = await api.post('/Auth/login', { email, password });
            
            // Backend'den gelen token ve rolü alıyoruz
            const { token, role } = res.data;

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userRole', role || 'User'); // Eğer rol gelmezse varsayılan 'User' (Gönüllü) olsun

            // Gelen role göre gerçek yönlendirme
            if (role === 'Admin' || role === 'SuperAdmin') {
                navigation.replace('AdminPanel'); 
            } else if (role === 'StkAdmin') {
                navigation.replace('StkDashboard'); 
            } else {
                // Gönüllü (User) girişi başarılıysa ana sekmelere git!
                navigation.replace('MainTabs'); 
            }

        } catch (err) {
            // Hatanın tam olarak ne olduğunu terminale ve ekrana yazdırıyoruz!
            console.log("Gerçek Login Hatası:", err.message);
            
            if (err.response) {
                // Backend'den cevap gelmiş ama şifre yanlış vb.
                Alert.alert("Hata", err.response.data?.message || "Giriş bilgileri hatalı.");
            } else {
                // Backend'e hiç ulaşılamamış (IP hatası)
                Alert.alert("Bağlantı Hatası", "Sunucuya ulaşılamıyor. Lütfen API adresini kontrol edin.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.logoText}>Gönüllü YS</Text>
            <Text style={styles.loginSubtitle}>Dünyayı değiştirmeye hazır mısın?</Text>
            
            <View style={styles.formCard}>
                <TextInput 
                    style={styles.input} 
                    placeholder="E-posta" 
                    placeholderTextColor="#999"
                    onChangeText={setEmail} 
                    autoCapitalize="none" 
                    value={email}
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Şifre" 
                    placeholderTextColor="#999"
                    secureTextEntry 
                    onChangeText={setPassword} 
                    value={password}
                />
                
                <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loginContainer: { flex: 1, backgroundColor: '#F0F2F5', justifyContent: 'center', padding: 25 },
    logoText: { fontSize: 40, fontWeight: 'bold', color: '#007AFF', textAlign: 'center' },
    loginSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
    formCard: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 4 },
    input: { backgroundColor: '#F1F3F5', padding: 15, borderRadius: 12, marginBottom: 15, color: '#000' },
    loginButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', minHeight: 60, justifyContent: 'center' },
    loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default Login;