import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import FloatingButton from '@/components/FloatingButton';

export default function TabLayout() {

  return (
    <View style={{ flex: 1 }} >
      <Tabs
        screenOptions={{
          headerShown: false,
        }}>
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
          name="vehicle_inspection"
          options={{
            title: 'Vehicle Inspection',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? "file-document-edit" : "file-document-edit-outline"} size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="vehicle_trasaction"
          options={{
            title: 'Vehicle Trasaction',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'car-sharp' : 'car'} size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
      <FloatingButton />
    </View>
  );
}
