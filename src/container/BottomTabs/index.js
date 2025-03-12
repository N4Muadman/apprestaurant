import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from '../../component/Header';
import HomeNavigation from '../../navigation/HomeNavigation';
import UserNavigation from '../../navigation/UserNavigation';

const Tab = createBottomTabNavigator();
const BottomTabs = ({navigation}) => {
  return (
    <Tab.Navigator initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'https://cdn-icons-png.flaticon.com/512/25/25694.png';
          } else if (route.name === 'User') {
            iconName = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';
          }
          return <Image 
            source={{uri: iconName}}
              style={{
                width: 24,
                height: 24,
              }}
            />
        },
        tabBarActiveTintColor: '#d74011',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigation}
        options={{
          header: () => <Header onNotificationPress={() => navigation.navigate('Notification')} />,
        }}
      />

      <Tab.Screen
        name="User"
        component={UserNavigation}
        options={{
          header: () => <Header onNotificationPress={() => navigation.navigate('Notification')} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabs

const styles = StyleSheet.create({})