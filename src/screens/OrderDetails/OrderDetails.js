// OrderDetail.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import leftArrow from '../../../assets/left.png';
import colors from '../../constants/colors';

const { height: screenHeight } = Dimensions.get('window');

const OrderDetail = ({ navigation, route }) => {
  const { order } = route.params;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const cancellationReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Delivery time too long',
    'Payment issues',
    'Wrong item ordered',
    'Emergency situation',
    'Other (specify below)',
  ];

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

  const canCancelOrder = () => {
    return order.status === 'confirmed' || order.status === 'preparing';
  };

  const showCancelBottomSheet = () => {
    setShowCancelModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideCancelBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCancelModal(false);
      setSelectedReason('');
      setCustomReason('');
    });
  };

  const handleCancelOrder = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for cancellation');
      return;
    }

    if (selectedReason === 'Other (specify below)' && !customReason.trim()) {
      Alert.alert('Error', 'Please specify your reason for cancellation');
      return;
    }

    try {
      // Get existing orders from AsyncStorage
      const storedOrders = await AsyncStorage.getItem('userOrders');
      let orders = storedOrders ? JSON.parse(storedOrders) : [];

      // Update the order status to cancelled
      orders = orders.map(o => {
        if (o.id === order.id) {
          return {
            ...o,
            status: 'cancelled',
            cancellationReason: selectedReason === 'Other (specify below)' ? customReason : selectedReason,
            cancellationDate: new Date().toISOString().split('T')[0],
            cancellationTime: new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            }),
          };
        }
        return o;
      });

      // Save updated orders back to AsyncStorage
      await AsyncStorage.setItem('userOrders', JSON.stringify(orders));

      hideCancelBottomSheet();
      
      Alert.alert(
        'Order Cancelled',
        'Your order has been cancelled successfully. Refund will be processed within 3-5 business days.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to cancel order:', error);
      Alert.alert('Error', 'Failed to cancel order. Please try again.');
    }
  };

  const renderCancellationModal = () => (
    <Modal
      visible={showCancelModal}
      transparent={true}
      animationType="none"
      onRequestClose={hideCancelBottomSheet}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={hideCancelBottomSheet}
        />
        <Animated.View 
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Cancel Order</Text>
              <TouchableOpacity onPress={hideCancelBottomSheet}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.reasonsList} showsVerticalScrollIndicator={false}>
              <Text style={styles.reasonsTitle}>Please select a reason for cancellation:</Text>
              
              {cancellationReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonOption,
                    selectedReason === reason && styles.selectedReasonOption,
                  ]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <View style={styles.radioButton}>
                    {selectedReason === reason && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={[
                    styles.reasonText,
                    selectedReason === reason && styles.selectedReasonText,
                  ]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}

              {selectedReason === 'Other (specify below)' && (
                <View style={styles.customReasonContainer}>
                  <TextInput
                    style={styles.customReasonInput}
                    placeholder="Please specify your reason..."
                    multiline={true}
                    numberOfLines={3}
                    value={customReason}
                    onChangeText={setCustomReason}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.bottomSheetFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={hideCancelBottomSheet}>
                <Text style={styles.cancelButtonText}>Keep Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmCancelButton} onPress={handleCancelOrder}>
                <Text style={styles.confirmCancelButtonText}>Cancel Order</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={leftArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDateTime}>{order.orderDate} • {order.orderTime}</Text>
        </View>

        {/* Tiffin Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.tiffinCard}>
            <Image source={order.tiffinImage} style={styles.tiffinImage} />
            <View style={styles.tiffinInfo}>
              <Text style={styles.tiffinName}>{order.tiffinName}</Text>
              <Text style={styles.tiffinCenter}>📍 {order.tiffinCenter}</Text>
              <Text style={styles.mealInfo}>🍽️ {order.meals.join(', ')}</Text>
              <Text style={styles.durationInfo}>📅 {order.duration}</Text>
              <View style={styles.quantityPrice}>
                <Text style={styles.quantity}>Qty: {order.quantity}</Text>
                <Text style={styles.price}>₹{order.totalAmount}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoItem}>🕒 Expected Delivery: {order.deliveryTime}</Text>
            <Text style={styles.infoItem}>📍 Delivery Address: {order.deliveryAddress || 'Default Address'}</Text>
            <Text style={styles.infoItem}>📞 Contact: {order.contactNumber || '+91 9876543210'}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoItem}>💳 Payment Method: {order.paymentMethod}</Text>
            <Text style={styles.infoItem}>💰 Total Amount: ₹{order.totalAmount}</Text>
            {order.status === 'cancelled' && (
              <Text style={styles.refundInfo}>💸 Refund Status: Processing (3-5 business days)</Text>
            )}
          </View>
        </View>

        {/* Cancellation Info (if cancelled) */}
        {order.status === 'cancelled' && order.cancellationReason && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cancellation Details</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoItem}>📝 Reason: {order.cancellationReason}</Text>
              <Text style={styles.infoItem}>📅 Cancelled On: {order.cancellationDate} • {order.cancellationTime}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {canCancelOrder() ? (
          <>
            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelOrderButton} onPress={showCancelBottomSheet}>
              <Text style={styles.cancelOrderButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.reorderButton}>
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>

      {renderCancellationModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
    marginTop: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDateTime: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tiffinCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tiffinImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  tiffinInfo: {
    flex: 1,
  },
  tiffinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tiffinCenter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  mealInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  durationInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quantityPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.Primary,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  refundInfo: {
    fontSize: 14,
    color: colors.Primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  trackButton: {
    flex: 1,
    backgroundColor: colors.Primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  cancelOrderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.Red,
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.Red,
    textAlign: 'center',
  },
  reorderButton: {
    flex: 1,
    backgroundColor: colors.Primary,
    paddingVertical: 14,
    borderRadius: 8,
  },
  reorderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 4,
  },
  reasonsList: {
    maxHeight: screenHeight * 0.5,
    paddingHorizontal: 20,
  },
  reasonsTitle: {
    fontSize: 16,
    color: '#333',
    marginVertical: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedReasonOption: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.Primary,
    borderWidth: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.Primary,
  },
  reasonText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  selectedReasonText: {
    color: colors.Primary,
    fontWeight: '500',
  },
  customReasonContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  customReasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 80,
    backgroundColor: 'white',
  },
  bottomSheetFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 14,
    borderColor: colors.Primary,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.Primary,
    textAlign: 'center',
  },
  confirmCancelButton: {
    flex: 1,
    backgroundColor: colors.Red,
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});

export default OrderDetail;