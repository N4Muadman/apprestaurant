import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/api';

const Salary = ({navigation}) => {
  const [salaries, setSalaries] = useState();

  const getSalaries = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/salaries`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'platform': 'mobile'
        }
      });
      const data = await response.json();
      if(!response.ok){
        Alert.alert("Thông báo", "có lỗi xảy ra" + data.message);
        return;
      }
      setSalaries(data.salaries);

    }catch (err){
      console.log("Có lỗi xảy ra: " + err);
      Alert.alert("Thông báo", 'Có lỗi xảy ra');
    }
  }

  useEffect(() => {
    getSalaries();
    
  }, []);
  const formatHour = (hour) => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);

    return hours + ' giờ ' + minutes + ' phút';
  }
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 20 }}>Danh sách tính lương</Text>
      <FlatList
      data={salaries}
      keyExtractor={(item) => item.month}
      renderItem={({item}) => (
        <View style={styles.item}>
          <View style={styles.text}>
            <Text style={styles.textSize}>Lương cơ bản</Text>
            <Text style={[styles.textSize, styles.textValue]}>{formatCurrency(item.employee.base_salary)}</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.textSize}>Thời gian</Text>
            <Text style={[styles.textSize, styles.textValue]}>{item.month}</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.textSize}>Tổng giờ làm</Text>
            <Text style={[styles.textSize, styles.textValue]}>{formatHour(item.total_working_hours)}</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.textSize}>Tổng lương</Text>
            <Text style={[styles.textSize, styles.textValue]}>{formatCurrency(item.total_salary)}</Text>
          </View>
        </View>
      )}
       />
       
      <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>QUAY LẠI</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Salary

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  textSize: {
    fontSize: 16
  },
  textValue: {
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: 'black',
    elevation: 5,
    margin: 3,
    marginBottom: 15
  },
  btnBack: {
      position: 'absolute',
      bottom: 15,
      marginLeft: 20,
      paddingVertical: 15,
      backgroundColor: '#d74011',
      width: '100%',
      borderRadius: 25
  }
})