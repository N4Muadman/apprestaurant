import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MenuItem = ({route, navigation}) => {
  const table = route.params.item;
  const update = route.params.update;
  const [Categories, setCategories] = useState();
  const [MenuItems, setMenuItems] = useState();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [carts, setCarts] = useState([]);

  const getMenuItem = async (name, category) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/menu-items?name=${name}&category=${category}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'platform': 'mobile'
        }
      });

      if (!response.ok){
        Alert.alert('Thông báo', 'Có lỗi xảy ra');
      }
      const data = await response.json();
      setMenuItems(data.menuItems);
    }catch(e) {
      console.log('Có lỗi xảy ra: ' + e);
    }
  }
  const getCategories = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/menu-items`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'platform': 'mobile'
        }
      });

      if (!response.ok){
        Alert.alert('Thông báo', 'Có lỗi xảy ra');
      }
      const data = await response.json();
      const uniqueCategories = getUniqueCategories(data.menuItems);

      setCategories([{ id: '', keySeach: '', name: 'All' }, ...uniqueCategories]);
    }catch(e) {
      console.log('Có lỗi xảy ra: ' + e);
    }
  }

  const getUniqueCategories = (items) => {
    const categorySet = new Set();
    items.forEach(item => {
      if (item.category) {
        categorySet.add(item.category);
      }
    });

    return Array.from(categorySet).map((name, index) => ({
      id: (index + 1).toString(),
      keySeach: name,
      name
    }));
  };
  

  useEffect(() => {
    getMenuItem('', '');
    getCategories();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    getMenuItem(text, selectedCategory);
  };
  const handleCategoryPress = (category) => {
    setSelectedCategory(category.keySeach);
    getMenuItem(searchText, category.keySeach);
  };

  const handleAddToCart = (menuItem) => {
    setCarts((prevCarts) => {
      const existingItem = prevCarts.find((cartItem) => cartItem.id === menuItem.id);
  
      if (existingItem) {
        return prevCarts.map((cartItem) =>
          cartItem.id === menuItem.id
            ? { ...cartItem, quantity: cartItem.quantity + 1, totalPrice: menuItem.price * (cartItem.quantity + 1)}
            : cartItem
        );
      } else {
        return [...prevCarts, { ...menuItem, quantity: 1, totalPrice: menuItem.price}];
      }
    });
  };




  const paddedMenuItems = MenuItems && MenuItems.length % 2 !== 0 ? [...MenuItems, { id: 'empty', table_number: '' }] : MenuItems;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  const renderCategories = ({ item }) => {
    return (
      <TouchableOpacity style={[
        styles.btnCategory, 
        item.keySeach == selectedCategory && styles.btnCategoryActive]
        }
        onPress={() => handleCategoryPress(item)}>
        <Text style={item.id == selectedCategory && styles.txtCategoryActive}>{item.name}</Text>
      </TouchableOpacity>
      
    );
  }

  const renderMenuItem = ({item}) =>{
    
    if (item.id === 'empty') {
      return <TouchableOpacity style={{ width: '50%' }} />;
    }
    const isStopped = item.status === 1;
    return (
      <View style={styles.menuItemWrapper}>
          {isStopped && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Đồ ăn đã dừng chế biến trong hôm nay</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => !isStopped && handleAddToCart(item)}
            disabled={isStopped}
            >
            <Image 
                source={{ uri: `${BASE_URL + item.img}` }} 
                style={styles.menuItemImg} 
              />
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemPrice}>{formatCurrency(item.price)}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
      <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 15 }}>
        Chọn món cho bàn {table.table_number}
      </Text>
      <TextInput 
        placeholder='Tìm kiếm' 
        style={styles.Textinput}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={() => handleSearch(searchText)}
      />

      <View style={{ marginTop: 20 }}>
        <FlatList
          data={Categories}
          renderItem={renderCategories}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
        />
      </View>
      <View style={{ marginTop: 20}}>
        <FlatList
          data={paddedMenuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapperMenuItem}
        />
      </View>
      <View style={styles.cartContainer}>
        <Text style={styles.cartQuantity}>{carts.length}</Text>
        <TouchableOpacity style={styles.cart} onPress={() => {
          navigation.navigate('Cart', {carts: carts, table: table, update: update});
        }}>
          <Image source={{ 
            uri: 'https://banner2.cleanpng.com/20181201/kos/kisspng-scalable-vector-graphics-computer-icons-portable-n-daily-general-merchandise-svg-png-icon-free-downlo-5c02b1c90f0b77.6734633715436804570616.jpg'
           }}
           style={styles.cartImg}
           />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MenuItem;

const styles = StyleSheet.create({
  cartContainer:{
    width: 47,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cartQuantity:{
    fontSize: 18,
    color: '#d74011',
    position: 'absolute',
    right: 0,
    top: -15,
  },
  cart:{
    padding: 10,
    borderColor: "#d74011",
    borderWidth: 2,
    borderRadius: '50%',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: '#fff',
  },
  cartImg:{
    width: 22,
    height: 24
  },
  Textinput: {
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  btnCategory: {
    padding: 10,
    marginEnd: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10
  },
  btnCategoryActive: {
    backgroundColor: '#FF8000',
  },
  txtCategoryActive: {
    color: 'white'
  },  
  menuItemWrapper: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    overflow: 'hidden',
  },
  menuItem: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  menuItemImg: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  menuItemPrice: {
    fontSize: 14,
    color: '#FF8000',
    fontWeight: 'bold',
  },
  columnWrapperMenuItem: {
    justifyContent: 'space-between',
  },
});
