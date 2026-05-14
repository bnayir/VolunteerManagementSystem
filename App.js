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
import EventDetail from './src/screens/EventDetail';
import Onboarding from './src/screens/Onboarding';
import Register from './src/screens/Register';
import StkDashboard from './src/screens/StkDashboard'; 
import CreateAdvert from './src/screens/CreateAdvert';
import ManageApplicationsSTK from './src/screens/ManageApplicationsSTK';
import StkEvents from './src/screens/StkEvents';
import StkStatistics from './src/screens/StkStatistics';
import StkProfile from './src/screens/StkProfile';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="CreateAdvert" component={CreateAdvert} options={{ title: 'Yeni İlan Ver' }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Profili Düzenle', headerShown: true }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Bildirimler', headerShown: true }} />
        <Stack.Screen name="Privacy" component={Privacy} options={{ title: 'Gizlilik Politikası', headerShown: true }} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} />
        <Stack.Screen name="CreateEvent" component={CreateEvent} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="StkStatistics" component={StkStatistics} />
        <Stack.Screen name="StkProfile" component={StkProfile} />
<Stack.Screen 
  name="StkDashboard" 
  component={StkDashboard} 
  options={{ headerShown: false }} 
/>
<Stack.Screen 
    name="StkEvents" 
    component={StkEvents} 
    options={{ title: 'Etkinliklerim', headerShown: false }} 
  />

  <Stack.Screen 
    name="ManageApplicationsSTK" 
    component={ManageApplicationsSTK} 
    options={{ title: 'Başvurular', headerShown: false }} 
  />
        <Stack.Screen name="EventDetail" component={EventDetail} options={{ title: 'Etkinlik Detayı' }} />
        <Stack.Screen name="ManageApplications" component={ManageApplications} options={{ title: 'Başvuruları Yönet' }} />
        <Stack.Screen name="ManageUsers" component={ManageUsers} options={{ title: 'Gönüllü Listesi' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}