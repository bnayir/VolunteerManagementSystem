import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import MainTabs from './src/navigation/MainTabs';
import EditProfile from './src/screens/EditProfile';
import Notifications from './src/screens/Notifications';
import Privacy from './src/screens/Privacy';
import AdminPanel from './src/screens/AdminPanel'; 
import CreateEvent from './src/screens/CreateEvent';
import ManageApplications from './src/screens/ManageApplications';
import ManageUsers from './src/screens/ManageUsers';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Profili Düzenle', headerShown: true }} />
<Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Bildirimler', headerShown: true }} />
<Stack.Screen name="Privacy" component={Privacy} options={{ title: 'Gizlilik Politikası', headerShown: true }} />
<Stack.Screen name="AdminPanel" component={AdminPanel} />
  <Stack.Screen name="CreateEvent" component={CreateEvent} />
  <Stack.Screen 
  name="ManageApplications" 
  component={ManageApplications} 
  options={{ title: 'Başvuruları Yönet' }} 
/>
<Stack.Screen name="ManageUsers" component={ManageUsers} options={{ title: 'Gönüllü Listesi' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}