import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ListItem, Button, Icon, ThemeProvider } from 'react-native-elements';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PatientDashboardScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          reason,
          status,
          doctors (name)
        `)
        .eq('patient_id', userId)
        .order('appointment_date', { ascending: true });

      if (error) {
        throw error;
      }

      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const renderAppointment = ({ item }) => (
    <ListItem bottomDivider>
      <Icon name='calendar' type='font-awesome' color='#3498db' />
      <ListItem.Content>
        <ListItem.Title>{item.doctors.name}</ListItem.Title>
        <ListItem.Subtitle>{new Date(item.appointment_date).toLocaleString()}</ListItem.Subtitle>
        <Text>{item.reason}</Text>
        <Text>Status: {item.status}</Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text h4 style={styles.title}>My Appointments</Text>
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={item => item.id}
        />
        <Button
          title="Book New Appointment"
          onPress={() => navigation.navigate('BookAppointment')}
          containerStyle={styles.button}
          icon={<Icon name='plus' type='font-awesome' color='white' />}
        />
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