import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuItem = ({route}) => {
  const table = route.params.item;
  const [Categories, setCategories] = useState();
  const [MenuItems, setMenuItems] = useState();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
    return (
      <TouchableOpacity style={styles.menuItemWrapper}>
      <View style={styles.menuItem}>
        <Image 
          source={{ uri: `${BASE_URL + item.img}` }} 
          style={styles.menuItemImg} 
        />
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemPrice}>{formatCurrency(item.price)}</Text>
      </View>
    </TouchableOpacity>
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
    </View>
  );
}

export default MenuItem;

const styles = StyleSheet.create({
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
