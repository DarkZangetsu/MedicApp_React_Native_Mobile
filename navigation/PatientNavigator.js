import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import PatientDashboardScreen from '../screens/PatientDashboardScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import BlogScreen from '../screens/BlogScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfilScreen';

const Tab = createBottomTabNavigator();

export default function PatientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Appointments') {
            iconName = 'calendar';
          } else if (route.name === 'Blog') {
            iconName = 'book';
          } else if (route.name === 'Notifications') {
            iconName = 'bell';
          } else if (route.name === 'Profil') {
            iconName = 'user';
          }

          return <Icon name={iconName} type="font-awesome" size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#3498db',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Dashboard" component={PatientDashboardScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Blog" component={BlogScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}