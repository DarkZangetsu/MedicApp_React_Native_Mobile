import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-elements';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import DoctorNavigator from './navigation/DoctorNavigator';
import PatientNavigator from './navigation/PatientNavigator';
import BookAppointmentScreen from './screens/BookAppointmentScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import WriteBlogScreen from './screens/WriteBlogScreen';
import BlogDetailScreen from './screens/BlogDetailScreen';
import EditBlogScreen from './screens/EditBlogScreen';
import EditAppointmentScreen from './screens/EditAppointmentScreen';

const Stack = createStackNavigator();

const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#f1c40f',
    background: '#f0f0f0',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="DoctorNavigator" component={DoctorNavigator} />
            <Stack.Screen name="PatientNavigator" component={PatientNavigator} />
            <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
            <Stack.Screen name="EditAppointment" component={EditAppointmentScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="WriteBlog" component={WriteBlogScreen} />
            <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
            <Stack.Screen name="EditBlog" component={EditBlogScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}