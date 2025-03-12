import { Alert, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_BASE_URL, BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuView } from '@react-native-menu/menu';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrderView = ({ route, navigation }) => {
  const table = route.params.item;
  const [order, setOrder] = useState(null);

  const getOrder = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/order-table/${table.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'platform': 'mobile'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Thông báo', data.message, [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('TableScreen');
            }
          }
        ]);
      }
      setOrder(data.order);

    } catch (e) {
      console.error("Error getting order: " + e);
      Alert.alert("Thông báo", "Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    getOrder();

  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleDecrease = async (id) => {
    try {

    } catch (err) {

    }
  }
  const handleIncrease = (id) => {

  }
  const handleRemove = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/delete-order-item/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'platform': 'mobile'
        }
      });

      if (!response.ok) {
        Alert.alert("Thông báo", "Có lỗi xảy ra");
        return;
      }
      getOrder();
    } catch (err) {
      Alert.alert("Thông báo", "Có lỗi xảy ra");
      console.error("Lỗi: ", err);
    }
  }

  const handlePayment = async (type_pay) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/payment-order/${order.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'platform': 'mobile',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type_pay: type_pay,
        }),
      });

      if (!response.ok) {
        Alert.alert("Thông báo", "Có lỗi xảy ra");
        return;
      }

      const data = await response.json();

      if (type_pay === 'cash') {
        Alert.alert('Thông báo', 'Thanh toán thành công', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('TableScreen');
            },
          },
        ]);
      } else if (type_pay === 'vnpay') {
        if (data.payment_url) {
          navigation.navigate('WebViewVnpay', data.payment_url);
          // Linking.openURL(data.payment_url).catch(err => {
          //   Alert.alert('Thông báo', 'Không thể mở thanh toán VNPAY: ' + err);
          // });

          // Alert.alert('Thông báo', 'Thanh toán qua VNPAY đang chờ xử lý...');

          // // navigation.navigate('TableScreen');
        } else {
          Alert.alert("Thông báo", "Không nhận được link thanh toán VNPAY.");
        }
      }
    } catch (err) {
      Alert.alert("Thông báo", "Có lỗi xảy ra: " + err);
    }
  }

  const handleSelectAction = (actionId) => {
    switch (actionId) {
      case 'cash_payment':
        handlePayment('cash');
        break;
      case 'vnpay_payment':
        handlePayment('vnpay');
        break;
      default:
        alert('Chưa chọn phương thức');
    }
  }

  

  const renderOrderItem = ({ item }) => {

    return (
      <View style={styles.cartItem}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: `${BASE_URL + item.menu_item.img}` }}
            style={styles.cartItemImg}
          />
          <View style={{ marginStart: 10 }}>
            <Text style={styles.textCart}>
              {item.menu_item.name}
            </Text>
            <Text style={styles.textCart}>
              {formatCurrency(item.menu_item.price)}
            </Text>
            <Text style={{ color: item.status === 0 ? 'red' : item.status === 1 ? 'orange' : item.status === 2 ? 'green' : 'black' }}>
              {item.status === 0 ? 'Chưa có đầu bếp' :
                item.status === 1 ? 'Đầu bếp đang chuẩn bị' :
                  item.status === 2 ? 'Đầu bếp đã làm xong' : ''}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.cartQuantity}>
            <TouchableOpacity style={styles.decrease} onPress={() => handleDecrease(item.id)}>
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={{ margin: 10 }}>{item.quantity}</Text>
            <TouchableOpacity style={styles.increase} onPress={() => handleIncrease(item.id)}>
              <Text>+</Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'center', marginStart: 30 }}>
            <Text style={styles.textCart}>{formatCurrency(item.price)}</Text>
          </View>
        </View>
        <View style={styles.delete}>
          <TouchableOpacity style={styles.btnDelete} onPress={() => handleRemove(item.id)}>
            <Text>x</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.orderViewContainer}>
      <Text style={styles.tableName}>Đơn hàng của bàn {table.table_number}</Text>
      <FlatList
        data={order?.order_items ?? []}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.orderViewBottom}>
        {order ? (
          <View style={styles.totalPrice}>
            <Text style={{ fontSize: 18 }}>Tổng</Text>
            <Text style={{ fontSize: 18 }}>{formatCurrency(order.total_price)}</Text>
          </View>
        ) : (
          <Text style={{ textAlign: 'center' }}>Đang tải đơn hàng...</Text>
        )}
        <View style={styles.payment}>
          <TouchableOpacity style={styles.btnBottom} onPress={() => { navigation.navigate('MenuItem', { item: table, update: order.id }) }}>
            <Text style={styles.textbtn}>Đặt thêm</Text>
          </TouchableOpacity>
          <MenuView
            title="Payment Actions"
            onPressAction={({ nativeEvent }) => handleSelectAction(nativeEvent.event)}
            actions={[
              { id: 'cash_payment', title: '🟢 Tiền mặt' },
              { id: 'vnpay_payment', title: '🟠 VNPay' },
            ]}
          >
            <Text style={styles.btnBottom}>
              <Text style={styles.textbtn}>Thanh toán</Text>
            </Text>
          </MenuView>
        </View>
      </View>
    </View>
  );
};

export default OrderView;

const styles = StyleSheet.create({
  orderViewContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  tableName: {
    textAlign: 'center',
    fontSize: 16,
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginStart: 10,
    marginBottom: 15
  },
  orderViewBottom: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20
  },
  payment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginStart: 10,
  },
  btnBottom: {
    paddingHorizontal: 40,
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#d74011'
  },
  textbtn: {
    fontSize: 18,
    color: 'white',
  },

  cartItem: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    margin: 10,
    marginBottom: 15,
  },
  cartItemImg: {
    width: '60',
    height: '60',
    borderRadius: 5,
  },
  cartQuantity: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  increase: {
    paddingHorizontal: 5,
    paddingVertical: 0,
    borderColor: 'black',
    borderRadius: '50%',
    borderWidth: 1
  },
  decrease: {
    paddingHorizontal: 7,
    paddingVertical: 0,
    borderColor: 'black',
    borderRadius: '50%',
    borderWidth: 1
  },
  textCart: {
    fontSize: 15,
  },
  delete: {
    position: 'absolute',
    top: -10,
    right: -6,
  },
  btnDelete: {
    paddingHorizontal: 6,
    paddingVertical: 0,
    borderColor: 'black',
    borderRadius: '50%',
    borderWidth: 1
  }
});