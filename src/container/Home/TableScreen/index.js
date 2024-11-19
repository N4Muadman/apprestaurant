import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../constants/api';
import { MenuView } from '@react-native-menu/menu';
import { useFocusEffect } from '@react-navigation/native';

const TableScreen = ({ navigation }) => {
  const [Tables, setTables] = useState([]);

  const getTables = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/tables`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'platform': 'mobile',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Có lỗi xảy ra', data.message || 'Không thể tải dữ liệu');
        return;
      }

      setTables(data.tables);
      
    } catch (error) {
      console.error('Error fetching tables:', error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối tới máy chủ');
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getTables();
  
      const interval = setInterval(getTables, 5000);
  
      return () => clearInterval(interval);
    }, [])
  );


  const paddedTables = Tables && Tables.length % 2 !== 0 ? [...Tables, { id: 'empty', table_number: '' }] : Tables;

  const getMenuActions = (status) => {
    switch (status) {
      case 0:
        return [
          { id: 'select_menu', title: '🟢 Chọn món' },
          { id: 'booking_table', title: '🟠 Đặt bàn' },
        ];
      case 1:
        return [{ id: 'order_view', title: '🟡 Xem đơn hàng' }];
      case 2:
        return [
          { id: 'un_booking_table', title: '🔴 Hủy đặt bàn', attributes: { destructive: true } },
        ];
      default:
        return [];
    }
  };

  const handleMenuAction = async (action, item) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (action === 'booking_table' && item.status === 0) {
        const response = await fetch(`${API_BASE_URL}/tables/booking-table/${item.id}`, 
          { method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'platform': 'mobile'
            }
           }
        );
        if (!response.ok){
          Alert.alert('Thất bại', `Có lỗi xảy ra`);
          return;
        }
        Alert.alert('Thành công', `Bàn ${item.id} đã được đặt thành công`);
      } else if (action === 'select_menu' && item.status === 0) {
        navigation.navigate('MenuItem', {item});
      }else if (action === 'order_view' && item.status === 1) {
        navigation.navigate('OrderView', {item});
      }
       else if (action === 'un_booking_table' && item.status === 2) {
        const response = await fetch(`${API_BASE_URL}/tables/booking-table/${item.id}`, 
          { method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'platform': 'mobile'
            }
           }
        );
        if (!response.ok){
          Alert.alert('Thất bại', `Có lỗi xảy ra`);
          return;
        }
        Alert.alert('Thành công', `Bàn ${item.id} đã được hủy đặt thành công`);
      }
      getTables();
    } catch (error) {
      console.error('Error performing action:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện hành động này');
    }
  };
  const renderItem = ({ item }) => {
    if (item.id === 'empty') {
      return <View style={{ flex: 1 }} />;
    }
    
    return (
      <View style={styles.itemContainer}>
        <MenuView
          title="Table Actions"
          onPressAction={({ nativeEvent }) => handleMenuAction(nativeEvent.event, item)}
          actions={getMenuActions(item.status)}
        >
          <TouchableOpacity style={[
              styles.item,
              item.status === 1 && styles.itemStatus1,
              item.status === 2 && styles.itemStatus2,
            ]}>
            <Text>{item.table_number}</Text>
          </TouchableOpacity>
        </MenuView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
    {Tables && Tables.length > 0 ? (
      <FlatList
        data={paddedTables}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    ) : (
      <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có bàn nào</Text>
    )}
  </View>
  );
};

export default TableScreen;

const styles = StyleSheet.create({
  itemContainer: {
    width: '50%',
    padding: 10,
    borderRadius: 8
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    height: 130,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },
  itemStatus1: {
    backgroundColor: '#FFCC00', // Màu vàng cho trạng thái đang sử dụng
  },
  itemStatus2: {
    backgroundColor: '#FF5733', // Màu đỏ cam cho bàn đã đặt
  },
  columnWrapper: {
    justifyContent: 'space-around',
  },
});
