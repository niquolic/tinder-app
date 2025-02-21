import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserStore } from '@/store/userStore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserInSecureStore } from '@/constants/Tokens';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, setIsAuthenticated }: any = useUserStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getUserInSecureStore();
      if (token !== null) {
        setIsAuthenticated(true);
        return <Redirect href="/" />;
      } else {
        setIsReady(true);
      }
    };
    checkToken();
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
