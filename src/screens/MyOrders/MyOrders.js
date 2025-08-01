// MyOrders.js
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import leftArrow from '../../../assets/left.png'
import colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);



  useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    const storedOrders = await AsyncStorage.getItem('userOrders');
    if (storedOrders !== null) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders([]);
    }
  } catch (error) {
    console.log('Failed to fetch orders from AsyncStorage:', error);
  }
};




 const onRefresh = async () => {
  setRefreshing(true);
  await fetchOrders();
  setRefreshing(false);
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return colors.green;
      case 'preparing':
        return colors.Primary;
      case 'delivered':
        return colors.blue;
      case 'cancelled':
        return colors.Red;
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  const handleTrackOrder = (order) => {
    // Navigate to order tracking screen
    console.log('Track order:', order.id);
    // navigation.navigate('OrderTracking', { orderId: order.id });
  };

  const handleReorder = (order) => {
    // Handle reorder functionality
    console.log('Reorder:', order.id);
    // You can navigate back to the tiffin detail screen with pre-filled data
  };

  const renderOrderCard = (order) => (
    <View key={order.id} style={styles.orderCard}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{order.orderDate} • {order.orderTime}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      {/* Order Content */}
      <View style={styles.orderContent}>
        <Image source={order.tiffinImage} style={styles.orderImage} />
        <View style={styles.orderDetails}>
          <Text style={styles.tiffinName}>{order.tiffinName}</Text>
          <Text style={styles.tiffinCenter}>📍 {order.tiffinCenter}</Text>
          <Text style={styles.mealInfo}>🍽️ {order.meals.join(', ')}</Text>
          <Text style={styles.durationInfo}>📅 {order.duration}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.quantity}>Qty: {order.quantity}</Text>
            <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
          </View>
        </View>
      </View>

      {/* Order Footer */}
      <View style={styles.orderFooter}>
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryTime}>🕒 {order.deliveryTime}</Text>
          <Text style={styles.paymentMethod}>💳 {order.paymentMethod}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          {order.status === 'confirmed' || order.status === 'preparing' ? (
            <TouchableOpacity 
              style={styles.trackButton}
              onPress={() => handleTrackOrder(order)}
            >
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.reorderButton}
              onPress={() => handleReorder(order)}
            >
              <Text style={styles.reorderButtonText}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={leftArrow}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
          {['all', 'confirmed', 'preparing', 'delivered', 'cancelled'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.ordersContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {getFilteredOrders().length > 0 ? (
          getFilteredOrders().map(renderOrderCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🍽️</Text>
            <Text style={styles.emptyStateTitle}>No Orders Found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {activeTab === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${activeTab} orders found`}
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.exploreButtonText}>Explore Tiffins</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 34, // To balance the back button
  },
  tabContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabScrollView: {
    paddingHorizontal: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#ff6b35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  ordersContainer: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderContent: {
    flexDirection: 'row',
    padding: 15,
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  orderDetails: {
    flex: 1,
  },
  tiffinName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tiffinCenter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mealInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  durationInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  trackButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reorderButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reorderButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  exploreButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyOrders;