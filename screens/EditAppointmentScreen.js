import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Icon, ThemeProvider, Card } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import { supabase } from '../supabaseClient';

export default function EditAppointmentScreen({ route, navigation }) {
  const { appointment, onGoBack } = route.params;
  const [status, setStatus] = useState(appointment.status);

  const handleUpdateStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointment.id);

      if (error) {
        throw error;
      }

      onGoBack();
      navigation.goBack();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const statusOptions = [
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <ThemeProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Card containerStyle={styles.card}>
          <Card.Title h4>Edit Appointment</Card.Title>
          <Card.Divider />
          <View style={styles.infoContainer}>
            <Icon name="user" type="font-awesome" color="#3498db" size={20} />
            <Text style={styles.info}>{`${appointment.patients.first_name} ${appointment.patients.last_name}`}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="calendar" type="font-awesome" color="#3498db" size={20} />
            <Text style={styles.info}>{new Date(appointment.appointment_date).toLocaleString()}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="info-circle" type="font-awesome" color="#3498db" size={20} />
            <Text style={styles.info}>{appointment.reason}</Text>
          </View>
          <Text style={styles.label}>Status:</Text>
          <ModalSelector
            data={statusOptions}
            initValue={status}
            onChange={(option) => setStatus(option.key)}
            style={styles.selector}
            selectTextStyle={styles.selectText}
            optionTextStyle={styles.optionText}
            cancelTextStyle={styles.cancelText}
          />
          <Button
            title="Update Status"
            onPress={handleUpdateStatus}
            containerStyle={styles.button}
            icon={<Icon name='check' type='font-awesome' color='white' size={15} />}
            iconRight
          />
        </Card>
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#3498db',
  },
  selector: {
    marginBottom: 20,
  },
  selectText: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 16,
  },
  cancelText: {
    fontSize: 16,
    color: 'red',
  },
  button: {
    marginTop: 10,
  },
});