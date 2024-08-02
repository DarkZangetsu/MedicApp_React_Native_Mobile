import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Vérifier les identifiants de l'utilisateur
      const { data: user, error } = await supabase
        .from('users')
        .select('id, role, password')
        .eq('email', email)
        .single();

      if (error) throw error;

      if (!user) {
        throw new Error('User not found');
      }

      if (user.password !== password) {
        throw new Error('Incorrect password');
      }

      // Stocker l'ID de l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem('userId', user.id.toString());

      // Connecté avec succès, rediriger vers la page appropriée
      navigation.replace(user.role === 'doctor' ? 'DoctorNavigator' : 'PatientNavigator');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text h3 style={styles.title}>MedicApp</Text>
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
        <Button title="Login" onPress={handleLogin} containerStyle={styles.button} />
        <Button
          title="Don't have an account? Sign up"
          type="clear"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
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
