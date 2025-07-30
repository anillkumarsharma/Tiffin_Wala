// TiffinDetail.js
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import React, { useState } from 'react';

const TiffinDetail = ({ route, navigation }) => {
  const { tiffinData } = route.params;
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedTiffin, setSelectedTiffin] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState('single');

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
    review: 'Best tiffin service I’ve used so far. Loved the variety and hygiene maintained.',
  },
];


  const handleOrderPress = (item) => {
    setSelectedTiffin(item);
    setSelectedMeals([]);
    setSelectedDuration('single');
    setOrderModalVisible(true);
  };

  const confirmOrder = () => {
    if (selectedMeals.length === 0) {
      alert('Please select at least one meal time');
      return;
    }

   Alert.alert("Success", "Your order has been placed.");
    
    // Handle order confirmation logic here
    console.log('Order confirmed for:', {
      tiffin: selectedTiffin,
      meals: selectedMeals,
      duration: selectedDuration
    });
    setOrderModalVisible(false);
    // You can navigate to order confirmation screen or show success message
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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tiffin Details</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Tiffin Center Info */}
        <View style={styles.tiffinInfoCard}>
          <Image source={tiffinData.image} style={styles.tiffinImage} />
          <View style={styles.tiffinInfo}>
            <Text style={styles.tiffinTitle}>{tiffinData.title}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {tiffinData.rating}</Text>
              <Text style={styles.cuisineType}>{tiffinData.cuisineType}</Text>
            </View>
            <Text style={styles.timing}>🕒 {tiffinData.timing}</Text>
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
                {mealOptions.map((meal) => (
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
                <Text style={styles.confirmButtonText}
                >Confirm Order</Text>
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
    color: '#2e7d32',
  },
  nonVegType: {
    backgroundColor: '#ffebee',
    color: '#c62828',
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
  borderColor: '#ff6b35',
},

tabText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#666',
},

activeTabText: {
  color: '#ff6b35',
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
    color: '#ff6b35',
  },
  orderButton: {
    backgroundColor: '#ff6b35',
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
  color: '#ffb300',
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
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
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
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  durationOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedDurationOptionText: {
    color: '#fff',
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
    backgroundColor: '#00C851',
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