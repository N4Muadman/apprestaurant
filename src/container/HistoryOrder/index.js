import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert, TouchableOpacity  } from 'react-native'
import React, { useEffect, useState } from 'react';import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/api';
const HistoryOrder = ({navigation}) => {
  const [orders, setOrders] = useState()

  const getOrders = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
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
      setOrders(data.orders);

    }catch (err){
      console.log("Có lỗi xảy ra: " + err);
      Alert.alert("Thông báo", 'Có lỗi xảy ra');
    }
  }
  useEffect(() => {
    getOrders();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <View style={{ padding: 20, backgroundColor: 'white', flex: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: '600' }}>Danh sách lịch sử đơn hàng</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('orderItemScreen', {order: item})}>
            <View style={styles.ordersItem}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15 }}>Mã: {item.id}</Text>
                <Text style={{ fontSize: 15 }}>Bàn: {item.table.table_number}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'center', fontSize: 15 }}>{item.type_pay == 'cash' ? 'Tiền mặt' : item.type_pay == 'vnpay' ? 'VNPAY' : '' }</Text>
                <Text style={{  textAlign: 'center', fontSize: 15 ,color: item.status === 0 ? 'red' : 'green' }}>{item.status == 0 ? 'Chưa thanh toán': 'Đã thanh toán' }</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'right', fontSize: 15 }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</Text>
                <Text style={{ textAlign: 'right', fontSize: 16, fontWeight: 'bold' }}>{formatCurrency(item.total_price)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>QUAY LẠI</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HistoryOrder;

const styles = StyleSheet.create({
  ordersItem: {
    flexDirection: 'row', 
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    margin: 4,
    shadowColor: '#000000',
    elevation: 5,
    shadowRadius: 10
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