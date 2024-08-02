import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button, ThemeProvider, Avatar, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      setRole(userData.role);

      let profileData;
      if (userData.role === 'doctor') {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) throw error;
        profileData = data;
      } else {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) throw error;
        profileData = data;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('An error occurred while fetching your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Card containerStyle={styles.card}>
          <View style={styles.avatarContainer}>
            <Avatar
              rounded
              size="large"
              icon={{ name: 'user', type: 'font-awesome' }}
              containerStyle={styles.avatar}
            />
            <Text style={styles.name}>
              {role === 'doctor' ? profile.name : `${profile.first_name} ${profile.last_name}`}
            </Text>
          </View>
          <Card.Divider />
          {role === 'doctor' ? (
            <>
              <ProfileItem icon="stethoscope" text={`Specialty: ${profile.specialty}`} />
              <ProfileItem icon="info-circle" text={`Bio: ${profile.bio}`} />
            </>
          ) : (
            <>
              <ProfileItem icon="venus-mars" text={`Gender: ${profile.gender}`} />
              <ProfileItem icon="calendar" text={`Birth Date: ${new Date(profile.birth_date).toLocaleDateString()}`} />
              <ProfileItem icon="envelope" text={`Email: ${profile.email}`} />
              <ProfileItem icon="phone" text={`Phone: ${profile.phone}`} />
              <ProfileItem icon="map-marker" text={`Address: ${profile.address}`} />
              <ProfileItem icon="tint" text={`Blood Group: ${profile.blood_group}`} />
            </>
          )}
        </Card>
        <Button
          title="Edit Profile"
          icon={<Icon name="edit" type="font-awesome" color="white" size={15} style={styles.buttonIcon} />}
          onPress={() => navigation.navigate('EditProfile', { profile, role })}
          containerStyle={styles.button}
          buttonStyle={styles.editButton}
        />
        <Button
          title="Logout"
          icon={<Icon name="sign-out" type="font-awesome" color="white" size={15} style={styles.buttonIcon} />}
          onPress={handleLogout}
          containerStyle={styles.button}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </ThemeProvider>
  );
}

const ProfileItem = ({ icon, text }) => (
  <View style={styles.profileItem}>
    <Icon name={icon} type="font-awesome" size={20} color="#517fa4" />
    <Text style={styles.profileItemText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#517fa4',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
  },
  buttonIcon: {
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#517fa4',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
});