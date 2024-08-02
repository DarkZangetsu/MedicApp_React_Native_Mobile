import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Text, Button, Icon, ThemeProvider, Card } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookAppointmentScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [type, setType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name');

      if (error) {
        throw error;
      }

      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleBookAppointment = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: userId,
            doctor_id: selectedDoctor,
            appointment_date: appointmentDateTime.toISOString(),
            reason: reason,
            type : type,
          },
        ]);

      if (error) {
        throw error;
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const renderDatePicker = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(
        <Picker.Item key={dateString} label={dateString} value={dateString} />
      );
    }
    return dates;
  };

  const renderTimePicker = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}` : i;
      times.push(
        <Picker.Item key={`${hour}:00`} label={`${hour}:00`} value={`${hour}:00`} />
      );
      times.push(
        <Picker.Item key={`${hour}:30`} label={`${hour}:30`} value={`${hour}:30`} />
      );
    }
    return times;
  };

  return (
    <ThemeProvider>
      <ScrollView style={styles.container}>
        <Text h4 style={styles.title}>Book an Appointment</Text>

        <Card containerStyle={styles.card}>
          <Card.Title>Select Doctor</Card.Title>
          <Card.Divider />
          <Picker
            selectedValue={selectedDoctor}
            onValueChange={(itemValue) => setSelectedDoctor(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a doctor" value={null} />
            {doctors.map((doctor) => (
              <Picker.Item key={doctor.id} label={doctor.name} value={doctor.id} />
            ))}
          </Picker>
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Select Date</Card.Title>
          <Card.Divider />
          <Picker
            selectedValue={selectedDate}
            onValueChange={(itemValue) => setSelectedDate(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a date" value={null} />
            {renderDatePicker()}
          </Picker>
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Select Time</Card.Title>
          <Card.Divider />
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a time" value={null} />
            {renderTimePicker()}
          </Picker>
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Reason for Appointment</Card.Title>
          <Card.Divider />
          <TextInput
            placeholder="Enter reason"
            value={reason}
            onChangeText={setReason}
            style={styles.input}
          />
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Type of Appointment</Card.Title>
          <Card.Divider />
          <TextInput
            placeholder="Enter type"
            value={type}
            onChangeText={setType}
            style={styles.input}
          />
        </Card>

        <Button
          title="Book Appointment"
          onPress={handleBookAppointment}
          containerStyle={styles.button}
          icon={<Icon name='check' type='font-awesome' color='white' />}
        />
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 20,
    color: '#3498db',
    textAlign: 'center',
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  picker: {
    height: 50,
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    borderRadius: 5,
  },
});
