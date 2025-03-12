import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, BASE_URL } from '../../constants/api';

const HistoryCooking = () => {
  const [orderItems, setOrderItems] = useState();

    const getOrderItems = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/cooking-history`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'platform': 'mobile'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                Alert.alert("Thông báo", "có lỗi xảy ra" + data.message);
                return;
            }
            setOrderItems(data.orderHistory);

        } catch (err) {
            console.log("Có lỗi xảy ra: " + err);
            Alert.alert("Thông báo", 'Có lỗi xảy ra');
        }
    }

    const chooseOrderItem = async (id) => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/change-order-item-status/${id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'platform': 'mobile'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                Alert.alert("Thông báo", + data.message);
                getOrderItems();
                return;
            }

            Alert.alert("Thông báo", "Thay đổi trạng thái thành công");
            getOrderItems();

        } catch (err) {
            console.log("Có lỗi xảy ra: " + err);
            Alert.alert("Thông báo", 'Có lỗi xảy ra');
        }
    }

    useEffect(() => {
        getOrderItems();

        // const interval = setInterval(getOrderItems, 5000);
  
        // return () => clearInterval(interval);
    }, [])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 20 }}>Lịch sử làm đồ ăn</Text>
            <FlatList
                data={orderItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{
                                    uri: `${BASE_URL + item.menu_item.img}`
                                }}
                                style={styles.itemImg}
                            />
                            <View>
                                <Text>{item.menu_item.name}</Text>
                                <Text>{item.order.table.table_number}</Text>
                                <Text>{formatCurrency(item.menu_item.price)}</Text>
                            </View>
                        </View>
                        <View>
                          
                        <Text style={{ color: item.status == 1 ? 'yellow' : 'green' }}>{item.status == 1 ? 'Đang làm' : 'Đã làm xong'}</Text>
                        </View>
                        <View>
                            <Text>Số lượng: {item.quantity}</Text>
                            {item.status == 1 ? (<TouchableOpacity style={styles.btn} onPress={() => chooseOrderItem(item.id)}>
                                <Text style={styles.btnText}>Đã xong</Text>
                            </TouchableOpacity>) : ''}
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

export default HistoryCooking

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      backgroundColor: 'white',
  },
  item: {
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 15,
      shadowColor: 'black',
      elevation: 5,
      margin: 3,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  itemImg: {
      width: 60,
      height: 60,
      borderRadius: 10,
      marginEnd: 10,
  },
  btn: {
      padding: 8,
      backgroundColor: '#d74011',
      borderRadius: 12,
      marginTop: 5
  },
  btnText: {
      color: 'white',
  }
});