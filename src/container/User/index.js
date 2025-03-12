import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const UserScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [isCheckin, setIsCheckin] = useState(null);

  const checkLoginStatus = async () => {
    const checkin = await AsyncStorage.getItem('checkin');
    if (checkin) {
      setIsCheckin(true);
    } else {
      setIsCheckin(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
        checkLoginStatus();
    }, [])
);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);
  
  if (user === null) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
    );
  }
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const checkin = await AsyncStorage.getItem('checkin');
      if (checkin) {
        Alert.alert('Thông báo', 'Vui lòng check-out trước khi đăng xuất');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
        }
      });

      if (!response.ok) {
        if (response.status == 401){
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }
        Alert.alert("Thông báo", "Có lỗi xảy ra khi đăng xuất.");
        return;
      }
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      Alert.alert("Thông báo", "Đăng xuất thành công.");
    } catch (error) {
      console.error("Lỗi khi đăng xuất: ", error);
      Alert.alert("Thông báo", "Có lỗi xảy ra, vui lòng thử lại.");
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
  const handleCheckout = async () => {
    const token = await AsyncStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: 'patch',
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

      await AsyncStorage.removeItem('checkin');
      checkLoginStatus();
      Alert.alert("Thông báo", "Checkout thành công");

    }catch (err){
      Alert.alert("Thông báo", "Có lỗi xảy ra: " + err);
    }
  }

  return (
    <View style={styles.userScreen}>
      <View style={styles.user}>
        <View style={styles.imgUser}>
          <Image source={{ 
            uri: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
          }}
          style={{ 
            width: 90,
            height: 90, }} 
          />
        </View>
        <View style={{ marginStart: 15 }}>
          <Text style={styles.textUser}>{user.employee.full_name}</Text>
          <Text style={styles.textUser}>{user.email}</Text>
        </View>
      </View>
        {user.role_id === 3? (
          <>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('historyOrderScreen')}>
              <Text style={styles.btnText}>Lịch sử đặt đồ</Text>
            </TouchableOpacity>
          </>
        ):
        user.role_id === 4 ?(
          <>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('historyCookingScreen')}>
                <Text style={styles.btnText}>Lịch sử chế biến</Text>
              </TouchableOpacity>
          </>
        ): <></>}
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('listAttendanceScreen')}>
          <Text style={styles.btnText}>Danh sách chấm công</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('salaryScreen')}>
          <Text style={styles.btnText}>Xem lương</Text>
        </TouchableOpacity>

        {isCheckin ? (
          <TouchableOpacity style={styles.btn} onPress={() => handleCheckout()}>
            <Text style={styles.btnText}>Check out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={() => handleCheckin()}>
            <Text style={styles.btnText}>Check in</Text>
          </TouchableOpacity>
        ) }
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnTextLogout}>Đăng xuất</Text>
        </TouchableOpacity>
    </View>
  )
}
export default UserScreen

const styles = StyleSheet.create({
  userScreen: {
    flex: 1,
    backgroundColor: 'white',
    padding: 35
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  imgUser: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderBlockColor: 'black',
    borderRadius: '50%',
    backgroundColor: "#00000016"
  }, 
  textUser: {
    fontSize: 17,
    marginBottom: 5,
  },
  btn: {
    paddingVertical: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#00000016",
  },
  btnText: {
    color: "#d74011",
    fontSize: 16
  },
  btnLogout: {
    position: "absolute",
    bottom: 0,
    left: 35,
    textAlign: "center",
    backgroundColor: '#d74011',
    paddingVertical: 15,
    marginBottom: 15,
    borderRadius: 20,
    width: '100%'
  },
  btnTextLogout: {
    textAlign: "center",
    color: '#ffffff'
  }

});