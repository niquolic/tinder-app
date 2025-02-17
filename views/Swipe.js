import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const profiles = [
  { id: 1, name: 'Alice', age: 24, image: 'https://randomuser.me/api/portraits/women/24.jpg' },
  { id: 2, name: 'Bob', age: 27, image: 'https://randomuser.me/api/portraits/men/27.jpg' },
  { id: 3, name: 'Charlie', age: 22, image: 'https://randomuser.me/api/portraits/men/22.jpg' }
];

export default function Swipe() {
  const [cards, setCards] = useState([...profiles]);

  const onSwiped = () => {
    setCards((prevCards) => [...prevCards.slice(1), prevCards[0]]);
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={(card) => (
          <View style={styles.card}>
            <Image source={{ uri: card.image }} style={styles.image} />
            <Text style={styles.name}>{card.name}, {card.age}</Text>
          </View>
        )}
        stackSize={3}
        verticalSwipe={false}
        onSwiped={onSwiped}
        backgroundColor={'#fff'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: 300, height: 400, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  image: { width: 250, height: 250, borderRadius: 10 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 10 }
});
