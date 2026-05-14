import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import Explore from '../screens/Explore';
import MyApplications from '../screens/MyApplications';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MyApps') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { height: 65, paddingBottom: 10, paddingTop: 5 },
        headerShown: true,
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen 
        name="Explore" 
        component={Explore} 
        options={{ 
          title: 'Etkinlikleri Keşfet',
          tabBarLabel: 'Keşfet'
        }} 
      />
      <Tab.Screen 
        name="MyApps" 
        component={MyApplications} 
        options={{ 
          title: 'Başvurularım', 
          tabBarLabel: 'Başvurular' 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{ 
          title: 'Profilim', 
          tabBarLabel: 'Profilim' 
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainTabs;