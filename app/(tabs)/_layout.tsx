import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons

import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // Existing TabBarIcon component
import { Colors } from '@/constants/Colors'; // Assuming you are using a Colors object
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      {/* Add Kharcha Tab */}
      <Tabs.Screen
        name="ScanPay"
        options={{
          title: 'Scan & Pay',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'qr-code' : 'qr-code-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
