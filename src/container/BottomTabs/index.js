import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TableScreen from '../Home/TableScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import UserScreen from '../User';
import Header from '../../component/Header';
import HomeNavigation from '../../navigation/HomeNavigation';

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator initialRouteName='Home'
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home'){
            iconName = 'home';
          } else if (route.name === 'User'){
            iconName = 'user';
          }
          return <FontAwesome name={iconName} color={color} size={20}/>
        },
        tabBarActiveTintColor: '#d74011',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigation} 
        options={{
          header: () => <Header onNotificationPress={() => alert('Thông báo Home!')} />, 
        }}
      />

      <Tab.Screen 
        name="User" 
        component={UserScreen}
        options={{
          header: () => <Header onNotificationPress={() => alert('Thông báo Home!')} />, 
        }}
         />
    </Tab.Navigator>
  )
}

export default BottomTabs

const styles = StyleSheet.create({})