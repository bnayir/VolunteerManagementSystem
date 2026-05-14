import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode"; 

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
            const temizEmail = email.trim();
            const res = await api.post('/Auth/login', { email: temizEmail, password });
            
            const { token } = res.data;
            const decodedToken = jwtDecode(token);
            
            const role = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'User';

            console.log("🔓 Şifre Çözüldü! Bulunan Rol:", role);

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userRole', role); 

            if (role === 'Admin' || role === 'SuperAdmin') {
                navigation.replace('AdminPanel'); 
            } else if (role === 'StkAdmin') {
                navigation.replace('StkDashboard'); 
            } else {
                navigation.replace('MainTabs'); 
            }

        } catch (err) {
            if (err.response) {
                const csharpCevabi = err.response.data;
                let errorMessage = "Giriş bilgileri hatalı.";
                
                if (typeof csharpCevabi === 'string') {
                    errorMessage = csharpCevabi;
                } else if (csharpCevabi?.message) {
                    errorMessage = csharpCevabi.message;
                } else if (csharpCevabi?.errors) {
                    errorMessage = "Geçersiz e-posta veya şifre formatı.";
                }

                Alert.alert("Giriş Hatası", errorMessage);
            } else {
                console.log("Bağlantı Hatası:", err.message);
                Alert.alert("Bağlantı Hatası", "Sunucuya ulaşılamıyor. Backend ayakta mı?");
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
                    keyboardType="email-address" 
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

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>
                        Hesabın yok mu? <Text style={{fontWeight: 'bold'}}>Yeni bir tane oluştur.</Text>
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
    loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    registerLink: { textAlign: 'center', marginTop: 20, color: '#007AFF', fontSize: 14 }
});

export default Login;