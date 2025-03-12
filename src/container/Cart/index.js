import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_BASE_URL, BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = ({route, navigation}) => {
  const table = route.params.table;
  const update = route.params.update;
  const [carts, setCarts] = useState();

  useEffect(() =>{
    setCarts(route.params.carts);
  }, []);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  const handleDecrease = (id) => {
    setCarts((prevCarts) => 
      prevCarts.map((cartItem) => 
        cartItem.id === id && cartItem.quantity > 1
          ? { ...cartItem, quantity: cartItem.quantity - 1, totalPrice: cartItem.price * (cartItem.quantity - 1) }
          : cartItem
      )
    );
  };
  const handleIncrease = (id) => {
    setCarts((prevCarts) =>
      prevCarts.map((cartItem) =>
        cartItem.id === id
          ? { 
              ...cartItem, 
              quantity: cartItem.quantity + 1, 
              totalPrice: cartItem.price * (cartItem.quantity + 1) 
            }
          : cartItem
      )
    );
  };
  const handleRemove = (id) => {
    setCarts((prevCarts) => prevCarts.filter((cartItem) => cartItem.id !== id));
  };
  const handleOrder = async () =>{
    const token = await AsyncStorage.getItem('token');
    
    const menuItems = carts.map((cartItem) => ({
        id: cartItem.id,
        quantity: cartItem.quantity,
    }));

    if (carts.length === 0) {
        Alert.alert("Lỗi", "Giỏ hàng trống. Vui lòng thêm sản phẩm.");
        return;
    }
    try {
        if(update){
          const response = await fetch(`${API_BASE_URL}/update-order-item/${update}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'platform': 'mobile',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                menu_item_ids: menuItems,
            }), 
          });
          const data = await response.json();
          if (response.ok) {
              setCarts([]);
              Alert.alert("Thành công", "Cập nhật đơn hàng thành công!");
              navigation.navigate('TableScreen');
          } else {
              console.error("Order failed: ", data);
              Alert.alert("Thất bại", data.message || "Cập nhật đơn hàng không thành công");
          }
        }else{
          const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'platform': 'mobile',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table_id: table.id,
                menu_item_ids: menuItems,
            }), 
          });
          const data = await response.json();
          if (response.ok) {
              setCarts([]);
              Alert.alert("Thành công", "Đặt hàng thành công!");
              navigation.navigate('TableScreen');
          } else {
              console.error("Order failed: ", data);
              Alert.alert("Thất bại", data.message || "Đặt hàng không thành công");
          }
        }
        
    }catch(e) {
        console.error("Error fetching order: ", e);
        Alert.alert("Thất bại", "Đặt hàng không thành công");
    }
  };
  const renderCart = ({item}) => { 
    return (
        <View style={styles.cartItem}>
            <View style={{ flexDirection: 'row' }}>
                <Image 
                    source={{ uri: `${BASE_URL + item.img}` }} 
                    style={styles.cartItemImg} 
                />
                <View style={{ marginStart: 10 }}>
                    <Text style={styles.textCart}>
                        {item.name}
                    </Text>
                    <Text style={styles.textCart}>
                        {formatCurrency(item.price)}
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
                    <Text style={styles.textCart}>{formatCurrency(item.totalPrice)}</Text>
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
    <View style={styles.cartContainer}>
      <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Giỏi hàng của bàn {table.table_number}</Text>
      <FlatList
        data={carts}
        renderItem={renderCart}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.btnOrder} onPress={handleOrder}>
        <Text style={{ textAlign: 'center', color: 'white' }}>Đặt món</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
    cartContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    },
    btnOrder:{
        width: '100%',
        backgroundColor: '#d74011',
        borderRadius: 30,
        paddingVertical: 10,
        position: 'absolute',
        bottom: 20,
        margin: 10
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
    cartItemImg:{
        width: '60',
        height: '60',
        borderRadius: 5,
    }, 
    cartQuantity:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    increase:{
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
    textCart:{
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
})