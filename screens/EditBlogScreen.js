import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, Icon, ThemeProvider, Card } from 'react-native-elements';
import { supabase } from '../supabaseClient';

export default function EditBlogScreen({ route, navigation }) {
  const { blog } = route.params;
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ title, content })
        .eq('id', blog.id);

      if (error) throw error;

      Alert.alert('Success', 'Blog post updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating blog post:', error);
      Alert.alert('Error', 'Error updating blog post');
    }
  };

  return (
    <ThemeProvider>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Card containerStyle={styles.card}>
            <Card.Title h4>Edit Blog</Card.Title>
            <Card.Divider />
            <View style={styles.inputContainer}>
              <Icon name="pencil" type="font-awesome" color="#3498db" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="file-text-o" type="font-awesome" color="#3498db" size={20} />
              <TextInput
                style={styles.textArea}
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                multiline
              />
            </View>
            <Button
              title="Update Blog"
              onPress={handleSubmit}
              containerStyle={styles.button}
              icon={<Icon name='check' type='font-awesome' color='white' size={15} />}
              iconRight
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
  textArea: {
    flex: 1,
    height: 150,
    marginLeft: 10,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 20,
  },
});