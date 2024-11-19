import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TableScreen from '../container/Home/TableScreen';
import MenuItem from '../container/MenuItem';

const HomeStack = createNativeStackNavigator();

const HomeNavigation = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="TableScreen" 
        component={TableScreen} 
        options={{ headerShown: false }}
      />
      <HomeStack.Screen 
        name="MenuItem" 
        component={MenuItem} 
        options={{ headerShown: false }} 
      />
    </HomeStack.Navigator>
  )
}

export default HomeNavigation

const styles = StyleSheet.create({})