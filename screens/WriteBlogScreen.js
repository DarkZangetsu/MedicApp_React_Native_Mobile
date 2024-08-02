import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Text, Button, Icon, ThemeProvider } from 'react-native-elements';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WriteBlogScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const { error } = await supabase
        .from('blogs')
        .insert([
          { title, content, doctor_id: userId }
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Blog post created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating blog post:', error);
      Alert.alert('Error', 'Error creating blog post');
    }
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text h4 style={styles.title}>Write New Blog</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <Button
          title="Submit"
          onPress={handleSubmit}
          containerStyle={styles.button}
          icon={<Icon name='check' type='font-awesome' color='white' />}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    marginBottom: 20,
    color: '#3498db',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 20,
  },
});
