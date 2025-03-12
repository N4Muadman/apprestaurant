import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, BASE_URL } from '../../constants/api';

const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState();

  const getNotifications = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
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

      setNotifications(data.notifications);

    } catch (err) {
      console.log("Có lỗi xảy ra: " + err);
      Alert.alert("Thông báo", 'Có lỗi xảy ra');
    }
  }

  useEffect(() => {
    getNotifications();

  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 20 }}>Thông báo</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.order_item.menu_item ? (
              <>
                <Image source={
                  { uri: BASE_URL + item.order_item.menu_item.img }
                }
                  style={styles.itemImg}
                />
                <View>
                  <Text style={[styles.textSize, {fontWeight: 'bold', color: 'green'}]}>{item.content}</Text>
                  <Text style={styles.textSize}>Tên: {item.order_item.menu_item.name}</Text>
                  <Text style={styles.textSize}>Số lượng: {item.order_item.quantity}</Text>
                  <Text style={styles.textSize}>Bàn: {item.order_item.order.table.table_number}</Text>
                </View>
              </>
            ) : (<View></View>)}
          </View>
        )}
      />

      <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>QUAY LẠI</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Notification
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
    marginBottom: 15,
    flexDirection: 'row'
  },
  itemImg: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginEnd: 10
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