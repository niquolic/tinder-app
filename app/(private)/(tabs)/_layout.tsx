import { Redirect, Tabs, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserStore } from '@/store/userStore';

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
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated }: any = useUserStore();
  const [isReady, setIsReady] = useState(false);

  const pathname = usePathname();

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
            title: 'HomeScreen',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="/profil/settings/index"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
      </Tabs>
    );
  }
}
