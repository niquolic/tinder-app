import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserStore } from '@/store/userStore';
import Icon from 'react-native-vector-icons/FontAwesome';

const getUserItem = async (key: string) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Erreur de lecture sécurisée:", error);
    return null;
  }
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const web = Platform.OS === "web";
  const { isAuthenticated, setIsAuthenticated }: any = useUserStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function getUserInSecureStore() {
      let token = null;
      if (web) {
        token = localStorage.getItem("token");
      }
      if (!web) {
        token = await getUserItem("token");
      }
      if (token) {
        setIsAuthenticated(true);
        return <Redirect href="/" />;
      } else {
        setIsReady(true);
      }
    }
    getUserInSecureStore();
  }, []);

  if (!isAuthenticated && isReady) {
    return <Redirect href="/login" />;
  }

  if (isAuthenticated) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Match',
            tabBarIcon: ({ color }) => <Icon name="heart" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profil/settings/index"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Icon name="cog" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profil/[id]"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <Icon name="user" size={28} color={color} />,
          }}
        />
      </Tabs>
    );
  }
}
