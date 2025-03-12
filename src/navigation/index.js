import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../container/Auth/LoginScreen';
import BottomTabs from '../container/BottomTabs';
import Notification from '../container/notification/Notification';
import Header from '../component/Header';
import { Linking, Alert } from 'react-native';
import queryString from 'query-string';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();

const NavigationMain = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    const handleDeepLink = async (event) => {
      try {
        const url = event.url;
        if (url) {
          const parsed = queryString.parseUrl(url);
          const token = parsed.query.token;
          const userString = parsed.query.user;
          const user = userString ? JSON.parse(decodeURIComponent(userString)) : null;

          if (token) {
            await AsyncStorage.setItem('token', token);
            // console.log("Token saved:", token);
            // console.log("User:", user);

            Alert.alert("Đăng nhập thành công!", `Xin chào, ${user?.full_name}`);

            setIsLoggedIn(true);

            if (navigationRef.isReady()) {
              navigationRef.navigate('Tabs');
            }
          }
        }
      } catch (error) {
        console.error("Lỗi xử lý URL:", error);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove(); 
    };
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Tabs" : "Login"}>
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            header: () => <Header />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationMain;
