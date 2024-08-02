import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ListItem, Icon, ThemeProvider } from 'react-native-elements';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const renderNotification = ({ item }) => (
    <ListItem bottomDivider>
      <Icon name='bell' type='font-awesome' color={item.read ? '#7f8c8d' : '#3498db'} />
      <ListItem.Content>
        <ListItem.Title>{item.message}</ListItem.Title>
        <ListItem.Subtitle>{new Date(item.created_at).toLocaleString()}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text h4 style={styles.title}>Notifications</Text>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
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
});