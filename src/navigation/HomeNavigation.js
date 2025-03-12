import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TableScreen from '../container/Home/TableScreen';
import MenuItem from '../container/MenuItem';
import Cart from '../container/Cart';
import OrderView from '../container/OrderView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UnassignedOrderItems from '../container/UnassignedOrderItems';
import ScreenWebView from '../container/ScreenWebViewVnpay';
import Notification from '../container/notification/Notification';

const HomeStack = createNativeStackNavigator();

const HomeNavigation = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  if (user === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <HomeStack.Navigator>
      {user.role_id === 3 ? (
        <>
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
          <HomeStack.Screen
            name="Cart"
            component={Cart}
            options={{ headerShown: false }}
          />
          <HomeStack.Screen
            name="OrderView"
            component={OrderView}
            options={{ headerShown: false }}
          />

          <HomeStack.Screen
            name="WebViewVnpay"
            component={ScreenWebView}
            options={{ headerShown: false }}
          />
        </>
      ) : user.role_id === 4 ? (
        <>
          <HomeStack.Screen
            name="UnassignedOrderItems"
            component={UnassignedOrderItems}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Text>No valid role found</Text>
      )}
    </HomeStack.Navigator>
  )
}

export default HomeNavigation

const styles = StyleSheet.create({})