import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserInSecureStore } from '@/constants/Tokens';

export default function Swipe() {
  type Card = {
    id: string;
    name: string;
    age: number;
    bio: string;
    image: string;
  };

  const [cards, setCards] = useState<Card[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [matchMessage, setMatchMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getUserInSecureStore();
      setToken(storedToken);
    };
    checkToken();
  }, []);

  const onSwiped = () => {
    setCards((prevCards) => prevCards.slice(1));
  };

  const { data, isLoading, error } = useQuery({
    queryKey: '[profile]',
    queryFn: () => fetch('https://api-tinder-next.vercel.app/api/profiles', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(res => res.json())
  });

  useEffect(() => {
    if (data) {
      setCards(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async ({ liked, userId }: { liked: boolean, userId: string }) => {
      const url = liked ? `https://api-tinder-next.vercel.app/api/swipe/like/${userId}` : `https://api-tinder-next.vercel.app/api/swipe/dislike/${userId}`;
      await fetch(url, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
    },
    onSuccess: async (_data, { userId }) => {
      onSwiped();
      const matches = await fetch('https://api-tinder-next.vercel.app/api/matches', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then(res => res.json());
      const isAMatch = matches.find((match: any) => match.id === userId);
      if (isAMatch) {
        setMatchMessage("Match !");
        setTimeout(() => {
          setMatchMessage(null);
        }, 3000);
      }
    },
  });

  const onSubmit = (liked: boolean, userId: string) => {
    mutation.mutate({ liked, userId });
  };

  if (isLoading) return <View style={styles.centered}><Text>Chargement...</Text></View>;
  if (error) return <View style={styles.centered}><Text>Erreur !</Text></View>;

  // const { data: cards, isLoading, error } = useQuery({
  //     queryKey: '[profile]',
  //     queryFn: () => fetch('https://api-tinder-next.vercel.app/api/profiles')
  //       .then(res => res.json())
  //   });
  
  //   const onSwiped = () => {
  //     cards.slice(1);
  //   };

  return (
    <View style={styles.container}>
      {matchMessage && (
        <View style={styles.matchMessageContainer}>
          <Text style={styles.matchMessage}>{matchMessage}</Text>
        </View>
      )}
      {cards.length > 0 ? (
        <Swiper
          cards={cards}
          renderCard={(card: Card) => (
            <View style={styles.card}>
              <Image source={{ uri: card.image }} style={styles.image} />
              <Text style={styles.name}>{card.name}, {card.age}</Text>
              <Text style={styles.bio}>{card.bio}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => onSubmit(false, card.id)} style={styles.button}>
                  <Icon name="times" size={30} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSubmit(true, card.id)} style={styles.button}>
                  <Icon name="heart" size={30} color="green" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          stackSize={3}
          verticalSwipe={false}
          onSwiped={onSwiped}
          backgroundColor={'#fff'}
          containerStyle={styles.swiperContainer}
          cardStyle={styles.swiperCard}
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.noMoreProfiles}>Plus de profil à voir pour le moment</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  swiperContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  swiperCard: { justifyContent: 'center', alignItems: 'center' },
  card: { width: 300, height: 400, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  image: { width: 250, height: 250, borderRadius: 10 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  bio: { fontSize: 18, fontWeight: 'normal', marginTop: 10 },
  noMoreProfiles: { fontSize: 18, color: 'gray', textAlign: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '80%' },
  button: { padding: 10 },
  matchMessageContainer: { position: 'absolute', top: 50, backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 10, borderRadius: 5 },
  matchMessage: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});