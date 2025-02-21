import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

const messages = [
  { id: '1', sender: 'Alice', text: 'Hey, how are you?', unread: true, photo: 'https://randomuser.me/api/portraits/women/24.jpg' },
  { id: '2', sender: 'Bob', text: 'Are you coming to the party?', unread: true, photo: 'https://randomuser.me/api/portraits/men/24.jpg' },
  { id: '3', sender: 'Charlie', text: 'Let’s catch up soon!', unread: false, photo: 'https://randomuser.me/api/portraits/women/23.jpg' },
];

interface MessageItemProps {
  sender: string;
  text: string;
  unread: boolean;
  photo: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ sender, text, unread, photo }) => (
  <TouchableOpacity style={[styles.messageItem, unread && styles.unread]}>
    <Image source={{ uri: photo }} style={styles.photo} />
    <View style={styles.messageTextContainer}>
      <Text style={styles.sender}>{sender}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  </TouchableOpacity>
);

const MessagesScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageItem sender={item.sender} text={item.text} unread={item.unread} photo={item.photo} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  unread: {
    backgroundColor: '#e6f7ff',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageTextContainer: {
    flex: 1,
  },
  sender: {
    fontWeight: 'bold',
  },
  text: {
    marginTop: 5,
  },
});

export default MessagesScreen;