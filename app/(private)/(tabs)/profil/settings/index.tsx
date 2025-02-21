import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Paramètres</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Compte</Text>
        <Text style={styles.item}>Modifier le profil</Text>
        <Text style={styles.item}>Paramètres de confidentialité</Text>
        <Text style={styles.item}>Changer de mot de passe</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Notifications</Text>
        <Text style={styles.item}>Notifications push</Text>
        <Text style={styles.item}>Notifications par email</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Préférences</Text>
        <Text style={styles.item}>Langue</Text>
        <Text style={styles.item}>Thème</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Aide</Text>
        <Text style={styles.item}>Centre d'aide</Text>
        <Text style={styles.item}>Contactez-nous</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>À propos</Text>
        <Text style={styles.item} onPress={() => router.push('../../about')}>À propos de nous</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  item: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});