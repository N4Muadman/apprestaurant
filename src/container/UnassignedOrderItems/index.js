import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, BASE_URL } from '../../constants/api';
import { useFocusEffect } from '@react-navigation/native';

const UnassignedOrderItems = () => {
    const [orderItems, setOrderItems] = useState();
    const [isCheckin, setIsCheckin] = useState(null);

    const checkLoginStatus = async () => {
        const checkin = await AsyncStorage.getItem('checkin');
        if (checkin) {
            setIsCheckin(true);
        } else {
            setIsCheckin(false);
        }
    };
    const handleCheckin = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
          const response = await fetch(`${API_BASE_URL}/checkin`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token,
              'platform': 'mobile',
            }
          });
    
          const data = await response.json();
          if (!response.ok) {
            Alert.alert("Thông báo", data.message);
            return;
          }
    
          await AsyncStorage.setItem('checkin', 'true');
          checkLoginStatus();
          Alert.alert("Thông báo", "Checkin thành công");
    
        }catch (err){
          Alert.alert("Thông báo", "Có lỗi xảy ra: " + err);
        }
      }

    const getOrderItems = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/unassigned-order-items`, {
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
            setOrderItems(data.orderItems);

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

            Alert.alert("Thông báo", "Nhận làm đồ ăn thành công");
            getOrderItems();

        } catch (err) {
            console.log("Có lỗi xảy ra: " + err);
            Alert.alert("Thông báo", 'Có lỗi xảy ra');
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getOrderItems();
            checkLoginStatus();
        }, [])
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };
    return (
        <View style={styles.container}>
            {!isCheckin ? (
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.btnCheckin} onPress={() => handleCheckin()}>
                        <Text style={styles.btnTextCheckin}>Checkin</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Vui lòng checkin trước khi bắt đầu làm việc</Text>
                </View>
            ) : ''}
            
            <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 20 }}>Đồ ăn mới đặt</Text>
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
                            <Text>Số lượng: {item.quantity}</Text>
                            <TouchableOpacity style={styles.btn} onPress={() => chooseOrderItem(item.id)}>
                                <Text style={styles.btnText}>Nhận làm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

export default UnassignedOrderItems;

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
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    btnCheckin: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: '#d74011',
        borderRadius: 15,
        marginBottom: 10,
    },
    btnTextCheckin: {
        color: 'white',
        fontSize: 20
    }
});