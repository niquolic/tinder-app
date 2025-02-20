import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function UserProfile() {
  const router = useRouter();

  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    age: 28,
    photo: 'https://randomuser.me/api/portraits/men/28.jpg'
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.photo }} style={styles.photo} />
      <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.age}>{user.age} ans</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  age: {
    fontSize: 18,
    color: '#555',
  },
});