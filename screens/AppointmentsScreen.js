import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ListItem, Button, Icon, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';
import { useFocusEffect } from '@react-navigation/native';

export default function AppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (userId && userRole) {
        fetchAppointments();
      }
    }, [userId, userRole])
  );

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setUserId(userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
      } else {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching user ID or role:', error);
    }
  };

  const fetchAppointments = async () => {
    setRefreshing(true);
    try {
      let query = supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          reason,
          type,
          status,
          doctors (name),
          patients (first_name, last_name)
        `)
        .order('appointment_date', { ascending: true });

      if (userRole === 'doctor') {
        query = query.eq('doctor_id', userId);
      } else {
        query = query.eq('patient_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderAppointment = ({ item }) => (
    <ListItem 
      bottomDivider 
      onPress={() => userRole === 'doctor' && navigation.navigate('EditAppointment', { appointment: item, onGoBack: fetchAppointments })}
    >
      <Icon name='calendar' type='font-awesome' color='#3498db' />
      <ListItem.Content>
        <ListItem.Title>
          {userRole === 'doctor' 
            ? `${item.patients.first_name} ${item.patients.last_name}`
            : item.doctors.name
          }
        </ListItem.Title>
        <ListItem.Subtitle>{new Date(item.appointment_date).toLocaleString()}</ListItem.Subtitle>
        <Text>{item.reason}</Text>
        <Text>Status: {item.status}</Text>
      </ListItem.Content>
      {userRole === 'doctor' && <ListItem.Chevron />}
    </ListItem>
  );

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text h4 style={styles.title}>Appointments</Text>
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchAppointments}
            />
          }
        />
        {userRole === 'patient' && (
          <Button
            title="Book New Appointment"
            onPress={() => navigation.navigate('BookAppointment')}
            containerStyle={styles.button}
            icon={<Icon name='plus' type='font-awesome' color='white' />}
          />
        )}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    marginBottom: 20,
    color: '#3498db',
  },
  button: {
    marginTop: 20,
  },
});