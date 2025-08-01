// TiffinDetail.js - Updated confirmOrder function and imports
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import leftArrow from "../../../assets/left.png"
import colors from '../../constants/colors';

const TiffinDetail = ({ route, navigation }) => {
  const { tiffinData } = route.params;
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedTiffin, setSelectedTiffin] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState('single');
  const [quantity, setQuantity] = useState(1);


  // Sample menu items for the tiffin center
  const menuItems = [
    {
      id: '1',
      name: 'Regular Thali',
      description: 'Dal, Rice, 2 Roti, Sabji, Pickle, Salad',
      price: tiffinData.rate,
      type: tiffinData.thaliType,
      image: tiffinData.image,
    },
    {
      id: '2',
      name: 'Special Thali',
      description: 'Dal, Rice, 3 Roti, 2 Sabji, Sweet, Pickle, Salad, Raita',
      price: tiffinData.rate + 30,
      type: tiffinData.thaliType,
      image: tiffinData.image,
    },
    {
      id: '3',
      name: 'Premium Thali',
      description: 'Dal, Rice, 4 Roti, 2 Sabji, Sweet, Pickle, Salad, Raita, Papad',
      price: tiffinData.rate + 50,
      type: tiffinData.thaliType,
      image: tiffinData.image,
    },
  ];

  const reviewsData = [
    {
      id: '1',
      userName: 'Anjali Mehra',
      rating: 5,
      date: '28 July 2025',
      review: 'Absolutely loved the food! The packaging was neat, and the delivery was on time. Highly recommend!',
    },
    {
      id: '2',
      userName: 'Rahul Singh',
      rating: 4,
      date: '27 July 2025',
      review: 'Good quality and taste. Just a bit too spicy for my preference, but overall a great experience.',
    },
    {
      id: '3',
      userName: 'Priya Sharma',
      rating: 5,
      date: '25 July 2025',
      review: 'Tastes just like home-cooked food. Affordable and fresh. Will definitely order again!',
    },
    {
      id: '4',
      userName: 'Amit Verma',
      rating: 3,
      date: '23 July 2025',
      review: 'Decent service, but delivery was late by 20 minutes. Food was still warm and tasty though.',
    },
    {
      id: '5',
      userName: 'Sneha Patel',
      rating: 5,
      date: '20 July 2025',
      review: 'Best tiffin service I have used so far. Loved the variety and hygiene maintained.',
    },
  ];

  const handleOrderPress = (item) => {
    setSelectedTiffin(item);
    setSelectedMeals([]);
    setSelectedDuration('single');
    setOrderModalVisible(true);
  };

  // Updated confirmOrder function to save order and navigate to MyOrders
  const confirmOrder = async () => {
    if (selectedMeals.length === 0) {
      Alert.alert('Please select at least one meal time');
      return;
    }

    try {
      // Create order object
      const newOrder = {
        id: `ORD${Date.now()}`,
        orderDate: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        orderTime: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        tiffinName: selectedTiffin.name,
        tiffinCenter: tiffinData.title,
        tiffinImage: selectedTiffin.image,
        meals: selectedMeals.map(mealId => 
          mealOptions.find(option => option.id === mealId)?.label
        ),
        duration: durationOptions.find(option => option.id === selectedDuration)?.label,
        price: selectedTiffin.price,
        quantity,
totalAmount: selectedDuration === 'weekly' 
  ? selectedTiffin.price * 7 * selectedMeals.length * quantity
  : selectedTiffin.price * selectedMeals.length * quantity,

        status: 'confirmed',
        deliveryTime: getDeliveryTime(),
        paymentMethod: 'Online', // You can make this dynamic
        orderNumber: `#${Math.floor(Math.random() * 90000) + 10000}`
      };

      // Get existing orders from AsyncStorage
      const existingOrders = await AsyncStorage.getItem('userOrders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      
      // Add new order to the beginning of the array
      orders.unshift(newOrder);
      
      // Save updated orders to AsyncStorage
      await AsyncStorage.setItem('userOrders', JSON.stringify(orders));

      // Show success message
      Alert.alert(
        "Order Placed Successfully!", 
        `Your order ${newOrder.orderNumber} has been confirmed.`,
        [
          {
            text: "View Orders",
            onPress: () => {
              setOrderModalVisible(false);
              navigation.navigate('MyOrders');
            }
          },
          {
            text: "Continue Shopping",
            onPress: () => setOrderModalVisible(false)
          }
        ]
      );

      console.log('Order saved successfully:', newOrder);
      
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    }
  };

  // Helper function to get delivery time based on selected meals
  const getDeliveryTime = () => {
    if (selectedMeals.includes('breakfast')) return '8:00 AM - 9:00 AM';
    if (selectedMeals.includes('lunch')) return '12:30 PM - 1:30 PM';
    if (selectedMeals.includes('dinner')) return '7:00 PM - 8:00 PM';
    return '12:30 PM - 1:30 PM'; // default
  };

  const mealOptions = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
  ];

  const durationOptions = [
    { id: 'single', label: 'Single Day' },
    { id: 'weekly', label: '1 Week' },
  ];

  const toggleMealSelection = (mealId) => {
    setSelectedMeals((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId]
    );
  };

  const getMealSummary = () => {
    const selectedLabels = mealOptions
      .filter((option) => selectedMeals.includes(option.id))
      .map((option) => option.label);
    return selectedLabels.join(', ') || 'None selected';
  };

  const getDurationLabel = () => {
    const selected = durationOptions.find((option) => option.id === selectedDuration);
    return selected?.label || 'None';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={leftArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tiffin Details</Text>
        {/* Add My Orders button */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('MyOrders')}
          style={styles.ordersButton}
        >
          <Text style={styles.ordersButtonText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Tiffin Center Info */}
        <View style={styles.tiffinInfoCard}>
          <Image source={tiffinData.image} style={styles.tiffinImage} />
          <View style={styles.tiffinInfo}>
            <View>
              <Text style={styles.tiffinTitle}>{tiffinData.title}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {tiffinData.rating}</Text>
              <Text style={styles.cuisineType}>{tiffinData.cuisineType}</Text>
            </View>
            <Text style={styles.timing}>🕒 {tiffinData.timing}</Text>
            </View>
            <View style={styles.typeContainer}>
              <Text style={[styles.thaliType, tiffinData.thaliType === 'Veg' ? styles.vegType : styles.nonVegType]}>
                {tiffinData.thaliType === 'Veg' ? '🟢' : '🔴'} {tiffinData.thaliType}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.tabSection}>
          {/* Tab Headers */}
          <View style={styles.tabHeader}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'menu' && styles.activeTab]}
              onPress={() => setActiveTab('menu')}
            >
              <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
                Menu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'reviews' && styles.activeTab]}
              onPress={() => setActiveTab('reviews')}
            >
              <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'menu' ? (
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Available Tiffins</Text>
              {menuItems.map((item) => (
                <View key={item.id} style={styles.menuItemCard}>
                  <Image source={item.image} style={styles.menuItemImage} />
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                    <View style={styles.menuItemFooter}>
                      <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                      <TouchableOpacity 
                        style={styles.orderButton}
                        onPress={() => handleOrderPress(item)}
                      >
                        <Text style={styles.orderButtonText}>Order Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.reviewsSection}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              {reviewsData.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <Text style={styles.reviewUserName}>{review.userName}</Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, index) => (
                          <Text key={index} style={[styles.star, index < review.rating && styles.filledStar]}>
                            ⭐
                          </Text>
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={styles.reviewText}>{review.review}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactItem}>📞 +91 98765 43210</Text>
            <Text style={styles.contactItem}>📍 Near City Mall, Main Road</Text>
            <Text style={styles.contactItem}>💳 Cash & Online Payment Accepted</Text>
          </View>
        </View>
      </ScrollView>

      {/* Order Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={orderModalVisible}
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Your Tiffin</Text>
            
            {/* Meal Time Selection */}
            <View style={styles.selectionSection}>
              <Text style={styles.selectionTitle}>Select Meal Times</Text>
              <Text style={styles.selectionSubtitle}>You can select multiple options</Text>
              
              <View style={styles.mealOptionsContainer}>
                {mealOptions?.map((meal) => (
                  <TouchableOpacity
                    key={meal.id}
                    style={[
                      styles.mealOption,
                      selectedMeals.includes(meal.id) && styles.selectedMealOption
                    ]}
                    onPress={() => toggleMealSelection(meal.id)}
                  >
                    <Text style={[
                      styles.mealOptionText,
                      selectedMeals.includes(meal.id) && styles.selectedMealOptionText
                    ]}>
                      {meal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration Selection */}
            <View style={styles.selectionSection}>
              <Text style={styles.selectionTitle}>Select Duration</Text>
              
              <View style={styles.durationOptionsContainer}>
                {durationOptions.map((duration) => (
                  <TouchableOpacity
                    key={duration.id}
                    style={[
                      styles.durationOption,
                      selectedDuration === duration.id && styles.selectedDurationOption
                    ]}
                    onPress={() => setSelectedDuration(duration.id)}
                  >
                    <Text style={[
                      styles.durationOptionText,
                      selectedDuration === duration.id && styles.selectedDurationOptionText
                    ]}>
                      {duration.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
<View style={styles.quantitySection}>
  <Text style={styles.selectionTitle}>Quantity</Text>
  <View style={styles.quantityControls}>
    <TouchableOpacity 
      style={styles.qtyButton} 
      onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
    >
      <Text style={styles.qtyButtonText}>−</Text>
    </TouchableOpacity>

    <Text style={styles.qtyValue}>{quantity}</Text>

    <TouchableOpacity 
      style={styles.qtyButton} 
      onPress={() => setQuantity(prev => prev + 1)}
    >
      <Text style={styles.qtyButtonText}>+</Text>
    </TouchableOpacity>
  </View>
</View>

            {/* Order Summary */}
            <View style={styles.orderSummarySection}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Tiffin: </Text>
                {selectedTiffin?.name || 'None selected'}
              </Text>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Meals: </Text>
                {getMealSummary()}
              </Text>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Duration: </Text>
                {getDurationLabel()}
              </Text>
              {selectedTiffin && selectedMeals.length > 0 && (
                <Text style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total: </Text>
                  ₹{selectedDuration === 'weekly' 
  ? selectedTiffin.price * 7 * selectedMeals.length * quantity
  : selectedTiffin.price * selectedMeals.length * quantity}

                </Text>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setOrderModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  selectedMeals.length === 0 && styles.disabledButton
                ]}
                onPress={confirmOrder}
                disabled={selectedMeals.length === 0}
              >
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ordersButton: {
    backgroundColor: colors.Primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  ordersButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  tiffinInfoCard: {
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  tiffinImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  tiffinInfo: {
    padding: 20,
    flexDirection:'row',
    justifyContent:"space-between",
    alignItems:"center"

  },
  tiffinTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: '#ff6b35',
    marginRight: 15,
  },
  cuisineType: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  timing: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  typeContainer: {
    alignSelf: 'flex-start',
  },
  thaliType: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  vegType: {
    backgroundColor: '#e8f5e8',
    color: colors.green,
  },
  nonVegType: {
    backgroundColor: '#ffebee',
    color: colors.Red,
  },
  tabSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: colors.Primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: colors.Primary,
    fontWeight: 'bold',
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuItemCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: 'row',
  },
  menuItemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  menuItemInfo: {
    flex: 1,
    padding: 15,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.Primary,
  },
  orderButton: {
    backgroundColor: colors.Primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUserInfo: {
    flexDirection: 'column',
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    color: '#ccc',
    marginRight: 2,
  },
  filledStar: {
    color: colors.Yellow,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  contactSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contactItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    lineHeight: 22,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 25,
    margin: 20,
    width: '90%',
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  selectionSection: {
    marginBottom: 25,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  mealOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  mealOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedMealOption: {
    backgroundColor: colors.Primary,
    borderColor: colors.Primary,
  },
  mealOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedMealOptionText: {
    color: '#fff',
  },
  durationOptionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  durationOption: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedDurationOption: {
    backgroundColor: colors.Primary,
    borderColor: colors.Primary,
  },
  durationOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedDurationOptionText: {
    color: '#fff',
  },
  quantitySection: {
  marginBottom: 25,
},
quantityControls: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
},
qtyButton: {
  backgroundColor: colors.Primary,
  paddingHorizontal: 15,
  paddingVertical: 5,
  borderRadius: 5,
},
qtyButtonText: {
  fontSize: 20,
  color: '#fff',
  fontWeight: 'bold',
},
qtyValue: {
  fontSize: 18,
  fontWeight: 'bold',
  marginHorizontal: 20,
  color: '#333',
},

  orderSummarySection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 18,
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 25,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.green,
    paddingVertical: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TiffinDetail;