import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Icon, ThemeProvider } from 'react-native-elements';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function DoctorDashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsByStatus: {},
    appointmentsByWeek: [],
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStatistics();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      // Fetch appointments
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('appointment_date, status, patient_id')
        .eq('doctor_id', userId);

      if (error) {
        throw error;
      }

      // Calculate statistics
      const totalPatients = new Set(appointments.map(app => app.patient_id)).size;
      const appointmentsByStatus = appointments.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      const appointmentsByWeek = Array(5).fill(0); 
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      appointments.forEach(app => {
        const appointmentDate = new Date(app.appointment_date);
        if (appointmentDate >= startOfMonth && appointmentDate <= endOfMonth) {
          const weekNumber = Math.ceil((appointmentDate.getDate() - 1) / 7);
          appointmentsByWeek[weekNumber]++;
        }
      });

      setStats({
        totalPatients,
        appointmentsByStatus,
        appointmentsByWeek,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const barChartData = {
    labels: Array.from({ length: stats.appointmentsByWeek.length }, (_, i) => `Week ${i + 1}`),
    datasets: [
      {
        data: stats.appointmentsByWeek,
      },
    ],
  };

  
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text h4 style={styles.title}>Doctor Dashboard</Text>
          
          <View style={styles.cardContainer}>
            <Card containerStyle={styles.card}>
              <Card.Title>Total Patients</Card.Title>
              <Card.Divider />
              <Text h3>{stats.totalPatients}</Text>
            </Card>

            <Card containerStyle={styles.card}>
              <Card.Title>Appointments by Status</Card.Title>
              <Card.Divider />
              <View style={styles.statsContainer}>
                {Object.entries(stats.appointmentsByStatus).map(([status, count]) => (
                  <View key={status} style={styles.statItem}>
                    <Icon name='calendar' type='font-awesome' color='#3498db' size={16} />
                    <Text style={styles.statText}>{status.charAt(0).toUpperCase() + status.slice(1)}: {count}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>

          <Card containerStyle={styles.chartCard}>
            <Card.Title>Appointments per Week</Card.Title>
            <Card.Divider />
            <View style={styles.chartContainer}>
              <BarChart
                data={barChartData}
                width={screenWidth * 0.85}
                height={screenHeight * 0.3}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: '#e26a00',
                  backgroundGradientFrom: '#fb8c00',
                  backgroundGradientTo: '#ffa726',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                style={styles.barChart}
              />
            </View>
          </Card>
        </ScrollView>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: '5%',
  },
  title: {
    marginBottom: '5%',
    color: '#3498db',
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    marginVertical: '2%',
    borderRadius: 10,
    width: '48%',
  },
  chartCard: {
    marginVertical: '2%',
    borderRadius: 10,
    width: '100%',
  },
  statsContainer: {
    marginTop: '5%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '3%',
  },
  statText: {
    marginLeft: '5%',
    fontSize: 14,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barChart: {
    marginVertical: '3%',
    borderRadius: 16,
  },
});