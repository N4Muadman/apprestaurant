import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserScreen from '../container/User';
import HistoryCooking from '../container/HistoryCooking';
import HistoryOrder from '../container/HistoryOrder';
import ListAttendance from '../container/listAttendance';
import Salary from '../container/Salary';
import OrderItem from '../container/OrderItem';

const UserStack = createNativeStackNavigator();
const UserNavigation = () => {
  return (
    <UserStack.Navigator>
        <UserStack.Screen name='UserScreen' component={UserScreen} options={{ headerShown: false }}/>
        <UserStack.Screen name='historyOrderScreen' component={HistoryOrder} options={{ headerShown: false }}/>
        <UserStack.Screen name='orderItemScreen' component={OrderItem} options={{ headerShown: false }}/>
        <UserStack.Screen name='historyCookingScreen' component={HistoryCooking} options={{ headerShown: false }}/>
        <UserStack.Screen name='listAttendanceScreen' component={ListAttendance} options={{ headerShown: false }}/>
        <UserStack.Screen name='salaryScreen' component={Salary} options={{ headerShown: false }}/>
    </UserStack.Navigator>
  )
}

export default UserNavigation;

const styles = StyleSheet.create({})