import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>À propos de nous</Text>
      <Text style={styles.content}>
        Bienvenue sur notre application de rencontre ! Nous sommes dédiés à vous aider à trouver des connexions significatives et à rencontrer de nouvelles personnes. Notre mission est de créer une plateforme sûre et agréable pour tous nos utilisateurs.
      </Text>
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
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});