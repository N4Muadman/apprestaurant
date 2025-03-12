import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BASE_URL } from '../../constants/api';

const OrderItem = ({route, navigation}) => {
    const order = route.params.order;
    const orderItems = order.order_items;

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount);
    };
    
  return (
    <View style={styles.orderItemContainer}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 20 }}>Chi Tiết Đơn Hàng</Text>
      <View style={styles.orderInfo}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Thông tin đơn hàng</Text>
        <View style={styles.orderInfoItem}>
            <Text style={styles.textSize}>Mã đơn hàng</Text>
            <Text style={styles.textSize}>{order.id}</Text>
        </View>
        <View style={styles.orderInfoItem}>
            <Text style={styles.textSize}>Tên bàn</Text>
            <Text style={styles.textSize}>{order.table.table_number}</Text>
        </View>
        <View style={styles.orderInfoItem}>
            <Text style={styles.textSize}>Trạng thái</Text>
            <Text style={[styles.textSize,{ color: order.status === 0 ? 'red' : 'green' }]}>{order.status === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</Text>
        </View>
        <View style={styles.orderInfoItem}>
            <Text style={styles.textSize}>Phương thức thanh toán</Text>
            <Text style={styles.textSize}>{order.type_pay === 'cash' ? 'Tiền mặt' : order.type_pay === 'vnpay' ? 'VNPAY' : ''}</Text>
        </View>
        <View style={styles.orderInfoItem}>
            <Text style={styles.textSize}>Thời gian</Text>
            <Text style={styles.textSize}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</Text>
        </View>
        <View style={styles.orderInfoItem}>
            <Text style={styles.textSize}>Tổng cộng</Text>
            <Text style={styles.textSize}>{formatCurrency(order.total_price)}</Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 }}>Chi tiết đồ ăn</Text>
          <FlatList 
            data={orderItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={ styles.orderItem }>
                    <View style={{ flexDirection: 'row' }}>
                        <Image 
                            source={{ uri: BASE_URL + item.menu_item.img }}
                            style={styles.orderItemImg}
                        />
                        <View>
                            <Text style={styles.textSizeItem}>{item.menu_item.name}</Text>
                            <Text style={styles.textSizeItem}>{formatCurrency(item.menu_item.price)}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.textSizeItem, { textAlign: 'right', color: item.status == 0 ? 'red': item.status == 1 ? 'yellow' : 'green' }]}>{item.status == 0 ? 'Chưa có đầu bếp': item.status == 1 ? 'Đầu bếp đang chuẩn bị' : 'Đã làm xong'}</Text>
                        <Text style={[styles.textSizeItem, { textAlign: 'right' }]}>Số lượng: {item.quantity}</Text>
                        <Text style={[styles.textSizeItem, { textAlign: 'right' }]}>Tổng giá: {formatCurrency(item.price)}</Text>
                    </View>
                </View>
            )}
          />
      </View>
      <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>QUAY LẠI</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
    orderItemContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    orderInfo:{
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000000',
        elevation: 5,
        marginBottom: 20
    },
    orderInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textSize: {
        fontSize: 16,
        marginBottom: 5,
    },
    orderItem: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    orderItemImg: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginEnd: 10
    },
    textSizeItem: {
        fontSize: 16,
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