import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/api';

const ListAttendance = ({navigation}) => {
  const [attendances, setAttendances] = useState();

  const getAttendances = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/attendances`, {
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
      setAttendances(data.attendances);

    }catch (err){
      console.log("Có lỗi xảy ra: " + err);
      Alert.alert("Thông báo", 'Có lỗi xảy ra');
    }
  }

  const formatHour = (hour) => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);

    return hours + ' giờ ' + minutes + ' phút';
  }

  useEffect(() => {
    getAttendances();
    
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 20 }}>Danh sách chấm công</Text>
      <FlatList
        data={attendances}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <View style={styles.text}>
              <Text style={styles.textSize}>Thời gian checkin</Text>
              <Text style={[styles.textSize, styles.textValue]}>{item.checkin_time}</Text>
            </View>
            
            <View style={styles.text}>
              <Text style={styles.textSize}>Thời gian checkout</Text>
              <Text style={[styles.textSize, styles.textValue]}>{item.checkout_time}</Text>
            </View>
            
            <View style={styles.text}>
              <Text style={styles.textSize}>Tổng giờ làm việc</Text>
              <Text style={[styles.textSize, styles.textValue]}>{formatHour(item.total_hours)}</Text>
            </View>
            
            <View style={styles.text}>
              <Text style={styles.textSize}>Trạng thái</Text>
              <Text style={[styles.textSize, styles.textValue, {color: item.status == 0 ? 'red' : 'green'}]}>{item.status == 0 ? 'Chưa phê duyệt': 'Đã phê duyệt'}</Text>
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

export default ListAttendance;

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