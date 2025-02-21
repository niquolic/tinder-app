import { getUserInfosInSecureStore, saveSecureItem } from '@/constants/Tokens';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';

export default function UserProfile() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
    photo: '',
  });
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userString = await getUserInfosInSecureStore();
      if (userString) {
        const user = JSON.parse(userString);
        setUser(user);
      }
    };
    getUser();
  }, []);

  const handleSavePhoto = () => {
    const updatedUser = { ...user, photo: newPhotoUrl };
    setUser(updatedUser);
    saveSecureItem("user", JSON.stringify(updatedUser));
    setIsEditingPhoto(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <Image source={{ uri: user.photo }} style={styles.photo} />
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingPhoto(true)}>
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.age}>{user.age} ans</Text>
      {isEditingPhoto && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nouvelle URL de la photo"
            value={newPhotoUrl}
            onChangeText={setNewPhotoUrl}
          />
          <Button title="Enregistrer la nouvelle photo" onPress={handleSavePhoto} />
        </>
      )}
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
  photoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
});