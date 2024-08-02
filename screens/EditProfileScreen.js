import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input, Button, Text, ThemeProvider, Card, Icon } from 'react-native-elements';
import { supabase } from '../supabaseClient';

export default function EditProfileScreen({ route, navigation }) {
  const { profile, role } = route.params;
  const [formData, setFormData] = useState(profile);

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from(role === 'doctor' ? 'doctors' : 'patients')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;

      alert('Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    }
  };

  const renderInput = (placeholder, value, name, icon, multiline = false) => (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={(value) => handleChange(name, value)}
      multiline={multiline}
      leftIcon={<Icon name={icon} type="font-awesome" size={24} color="#3498db" />}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      containerStyle={styles.inputWrapper}
    />
  );

  return (
    <ThemeProvider>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Card containerStyle={styles.card}>
            <Card.Title h4>Edit Profile</Card.Title>
            <Card.Divider />
            {role === 'doctor' ? (
              <>
                {renderInput("Name", formData.name, "name", "user")}
                {renderInput("Specialty", formData.specialty, "specialty", "stethoscope")}
                {renderInput("Bio", formData.bio, "bio", "info-circle", true)}
              </>
            ) : (
              <>
                {renderInput("First Name", formData.first_name, "first_name", "user")}
                {renderInput("Last Name", formData.last_name, "last_name", "user")}
                {renderInput("Gender", formData.gender, "gender", "venus-mars")}
                {renderInput("Email", formData.email, "email", "envelope")}
                {renderInput("Phone", formData.phone, "phone", "phone")}
                {renderInput("Address", formData.address, "address", "map-marker", true)}
                {renderInput("Blood Group", formData.blood_group, "blood_group", "tint")}
              </>
            )}
            <Button
              title="Update Profile"
              onPress={handleSubmit}
              containerStyle={styles.button}
              icon={<Icon name="check" type="font-awesome" color="white" size={15} />}
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
    marginTop: 200,
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  input: {
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
  },
});