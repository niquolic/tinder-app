import { getUserInSecureStore } from '@/constants/Tokens';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useMutation, useQuery } from 'react-query';

const App = () => {
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
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getUserInSecureStore();
      setToken(storedToken);
    };
    checkToken();
  }, []);

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
    onSuccess: async (_data, { userId, liked }) => {
      if (liked) {
        const matches = await fetch('https://api-tinder-next.vercel.app/api/matches', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }).then(res => res.json());
        const isAMatch = matches.find((match: any) => match.id === userId);
        if (isAMatch) {
          setMatchMessage("Match !");
          setIsSwiping(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }).start(() => {
                setMatchMessage(null);
                setIsSwiping(false);
                removeFirstCard();
              });
            }, 3000);
          });
        } else {
          removeFirstCard();
        }
      } else {
        removeFirstCard();
      }
    },
  });

  const removeFirstCard = () => {
    setCards((prevCards) => {
      const updatedCards = prevCards.slice(1);
      return [...updatedCards];
    });
  };

  const onSwipedRight = (index: number) => {
    const id = cards[index].id;
    mutation.mutate({ liked: true, userId: id });
  };

  const onSwipedLeft = (index: number) => {
    const id = cards[index].id;
    mutation.mutate({ liked: false, userId: id });
  };

  if (isLoading) return <View style={styles.centered}><Text>Chargement...</Text></View>;
  if (error) return <View style={styles.centered}><Text>Erreur !</Text></View>;

  return (
    <View style={styles.container}>
      {matchMessage && (
        <Animated.View style={[styles.matchMessageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.matchMessage}>{matchMessage}</Text>
        </Animated.View>
      )}
      {cards.length > 0 && !isSwiping ? (
        <Swiper
          key={cards.length}
          cards={cards}
          renderCard={(card, index) => (
            <View style={styles.card}>
              <Image source={{ uri: card.image }} style={styles.image} />
              <Text style={styles.name}>{card.name}, {card.age}</Text>
              <Text style={styles.bio}>{card.bio}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => onSwipedLeft(index)} style={styles.button}>
                  <Icon name="times" size={30} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSwipedRight(index)} style={styles.button}>
                  <Icon name="heart" size={30} color="green" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          stackSize={3}
          verticalSwipe={false}
          onSwipedRight={onSwipedRight}
          onSwipedLeft={onSwipedLeft}
          backgroundColor={'#fff'}
          containerStyle={styles.swiperContainer}
          cardStyle={styles.swiperCard}
        />
      ) : (
        !matchMessage && (
          <View style={styles.centered}>
            <Text style={styles.noMoreProfiles}>Plus de profil à voir pour le moment</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { 
    position: 'relative',
    width: '100%', 
    height: '100%', 
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: { 
    position: 'absolute', 
    top: -60, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover'
  },
  name: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'white', 
    top: -50,
    textShadowColor: 'black', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 5, 
    marginBottom: 10 
  },
  bio: { 
    fontSize: 16, 
    color: 'white', 
    textAlign: 'center', 
    textShadowColor: 'black', 
    top: -50,
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 5, 
    marginBottom: 20 
  },
  buttonsContainer: { 
    flexDirection: 'row', 
    top: -50,
    marginBottom: 30 
  },
  button: { 
    marginHorizontal: 20, 
    padding: 10 
  },
  swiperContainer: { flex: 1 },
  swiperCard: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noMoreProfiles: { fontSize: 18, fontWeight: 'bold', color: 'gray' },
  matchMessageContainer: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0, 255, 0, 0.8)', 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 1,
  },
  matchMessage: { 
    color: 'white', 
    fontSize: 32, 
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default App;