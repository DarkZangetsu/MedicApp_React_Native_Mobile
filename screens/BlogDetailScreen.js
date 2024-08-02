import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Card, Button, ThemeProvider, Icon, Avatar } from 'react-native-elements';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BlogDetailScreen({ route, navigation }) {
  const { blog } = route.params;
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setUserId(userId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const isAuthor = userId === blog.doctor_id;

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blog.id);

      if (error) throw error;

      Alert.alert('Success', 'Blog post deleted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      Alert.alert('Error', 'There was an error deleting the blog post.');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Blog',
      'Are you sure you want to delete this blog post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDelete, style: 'destructive' },
      ]
    );
  };

  return (
    <ThemeProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Card containerStyle={styles.card}>
          <View style={styles.authorContainer}>
            <Avatar
              rounded
              title={blog.doctors.name.charAt(0)}
              containerStyle={styles.avatar}
              size="medium"
            />
            <View>
              <Text style={styles.author}>Dr. {blog.doctors.name}</Text>
              <Text style={styles.date}>{new Date(blog.created_at).toLocaleDateString()}</Text>
            </View>
          </View>
          <Card.Title style={styles.title}>{blog.title}</Card.Title>
          <Card.Divider />
          <Text style={styles.content}>{blog.content}</Text>
          {isAuthor && (
            <View style={styles.buttonContainer}>
              <Button
                title="Edit"
                onPress={() => navigation.navigate('EditBlog', { blog })}
                containerStyle={styles.button}
                icon={<Icon name='edit' type='font-awesome' color='white' size={15} />}
                buttonStyle={styles.editButton}
              />
              <Button
                title="Delete"
                onPress={confirmDelete}
                containerStyle={styles.button}
                icon={<Icon name='trash' type='font-awesome' color='white' size={15} />}
                buttonStyle={styles.deleteButton}
              />
            </View>
          )}
        </Card>
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  card: {
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: '#3498db',
    marginRight: 10,
  },
  author: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: 'gray',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
});