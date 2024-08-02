import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Icon, ThemeProvider, Avatar } from 'react-native-elements';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BlogScreen({ navigation }) {
  const [blogs, setBlogs] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
    fetchBlogs();
  }, []);

  const fetchUserRole = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUserRole(data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          id,
          title,
          content,
          created_at,
          doctor_id,
          doctors (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToBlogDetail = useCallback((blog) => {
    navigation.navigate('BlogDetail', { blog });
  }, [navigation]);

  const renderBlog = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => navigateToBlogDetail(item)}>
      <Card containerStyle={styles.card}>
        <View style={styles.cardHeader}>
          <Avatar
            rounded
            title={item.doctors.name.charAt(0)}
            containerStyle={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.author}>Dr. {item.doctors.name}</Text>
            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogContent} numberOfLines={3}>{item.content}</Text>
      </Card>
    </TouchableOpacity>
  ), [navigateToBlogDetail]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text h4 style={styles.title}>Health Tips & Articles</Text>
        <FlatList
          data={blogs}
          renderItem={renderBlog}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
        {userRole === 'doctor' && (
          <Button
            title="Write New Blog"
            onPress={() => navigation.navigate('WriteBlog')}
            containerStyle={styles.newBlogButton}
            buttonStyle={styles.newBlogButtonStyle}
            icon={<Icon name='plus' type='font-awesome' color='white' size={15} />}
            iconContainerStyle={styles.newBlogButtonIcon}
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    color: '#3498db',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 80, 
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: '#3498db',
  },
  headerText: {
    marginLeft: 10,
  },
  author: {
    fontWeight: 'bold',
  },
  date: {
    color: 'gray',
    fontSize: 12,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blogContent: {
    marginBottom: 10,
  },
  newBlogButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
  },
  newBlogButtonStyle: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
  },
  newBlogButtonIcon: {
    marginRight: 10,
  },
});