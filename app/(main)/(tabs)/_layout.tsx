import { Tabs } from 'expo-router';
import React from 'react';

import Header from '@/components/common/header';
import { HapticTab } from '@/components/haptic-tab';
import TabBar from '@/components/tab-bar';
import { useTheme } from '@/newLib/theme';

export default function TabLayout() {
const {theme,} = useTheme()


  return (
    <Tabs
    tabBar={props => <TabBar {...props} />}

      screenOptions={{
        sceneStyle: { backgroundColor:theme.background },
        

        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
        headerShown: true,
        header: () => <Header/>
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
        headerShown: true,
        header: () => <Header/>
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
        headerShown: true,
        header: () => <Header/>
        }}
      />
      <Tabs.Screen
        name="warranty"
        options={{
        headerShown: true,
        header: () => <Header/>
        }}
      />
     
    </Tabs>
  );
}
