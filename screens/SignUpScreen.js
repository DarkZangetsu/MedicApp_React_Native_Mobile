import React, { useState } from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import { supabase } from '../supabaseClient';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('patient');

  const handleSignUp = async () => {
    try {
      // Insérer l'utilisateur dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({ 
          email, 
          password, // Note: Assurez-vous de hacher le mot de passe avant de l'insérer dans la base de données
          role
        })
        .select('id')
        .single();
  
      if (userError) throw userError;
      if (!userData || !userData.id) throw new Error('User ID not returned after insertion');
  
      const userId = userData.id;
  
      // Insérer des données supplémentaires selon le rôle
      if (role === 'doctor') {
        const { error: doctorError } = await supabase
          .from('doctors')
          .insert({ 
            id: userId, 
            name: `${firstName} ${lastName}`, 
            specialty: 'General' 
          });
        
        if (doctorError) throw doctorError;
      } else {
        const { error: patientError } = await supabase
          .from('patients')
          .insert({ 
            id: userId, 
            first_name: firstName,
            last_name: lastName,
            gender: 'Unknown', 
            birth_date: new Date().toISOString(), 
            email
          });
        
        if (patientError) throw patientError;
      }
  
      // Stocker l'ID de l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem('userId', userId);
  
      // Rediriger vers la page appropriée
      navigation.replace(role === 'doctor' ? 'DoctorNavigator' : 'PatientNavigator');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred. Please try again.');
    }
  };
  return (
    <ThemeProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text h3 style={styles.title}>Sign Up</Text>
        <Input
          placeholder="First Name"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={setFirstName}
          value={firstName}
        />
        <Input
          placeholder="Last Name"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={setLastName}
          value={lastName}
        />
        <Input
          placeholder="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <Button
          title={role === 'patient' ? 'Sign up as Patient' : 'Sign up as Doctor'}
          onPress={handleSignUp}
          containerStyle={styles.button}
        />
        <Button
          title={`Switch to ${role === 'patient' ? 'Doctor' : 'Patient'} Sign Up`}
          type="clear"
          onPress={() => setRole(role === 'patient' ? 'doctor' : 'patient')}
        />
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#3498db',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});
