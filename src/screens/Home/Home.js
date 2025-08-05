import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import TiffinCard from '../../components/Card';
import colors from '../../constants/colors';
import AdBanner from '../../components/AdBanner';

const Home = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCards, setVisibleCards] = useState(new Set());
  const scrollViewRef = useRef(null);
  const [focusedCardId, setFocusedCardId] = useState(null);
const cardPositions = useRef({}); // track Y position of each card


  const tiffinData = [
    {
      id: '1',
      image: [
        require('../../../assets/tiffin1.jpg'),
        require('../../../assets/tiffin_1.webp'),
        require('../../../assets/tiffin2.jpg'),
        require('../../../assets/tiffin3.jpeg'),
        require('../../../assets/lunch.webp'),
      ],
      title: 'Raju\'s Tiffin',
      rating: '4.5',
      timing: '9:00 AM - 2:00 PM',
      rate: 120,
      thaliType: 'Veg',
      cuisineType: 'North Indian',
            latitude: 26.873036,
    longitude: 75.686512,
    distance : 2.5
    },
    {
      id: '2',
      image: [
        require('../../../assets/tiffin2.jpg'),
        require('../../../assets/tiffin1.jpg'),
        require('../../../assets/tiffin3.jpeg'),
        require('../../../assets/tiffin_1.webp'),
        require('../../../assets/lunch.webp'),
      ],
      title: 'Mummy Da Dhaba',
      rating: '4.8',
      timing: '11:00 AM - 3:00 PM',
      rate: 150,
      thaliType: 'Non-Veg',
      cuisineType: 'Punjabi',
          latitude: 28.6139,
    longitude: 77.2090,
    distance : 2.8
    },
    {
      id: '3',
      image: [
        require('../../../assets/tiffin3.jpeg'),
        require('../../../assets/tiffin1.jpg'),
        require('../../../assets/tiffin2.jpg'),
        require('../../../assets/tiffin_1.webp'),
        require('../../../assets/lunch.webp'),
      ],
      title: 'Healthy Bites',
      rating: '4.2',
      timing: '10:00 AM - 1:30 PM',
      rate: 100,
      thaliType: 'Veg',
      cuisineType: 'South Indian',
         latitude: 28.6139,
    longitude: 77.2090,
    distance : 3.4
    },
    {
      id: '4',
      image: [
        require('../../../assets/tiffin_1.webp'),
        require('../../../assets/tiffin1.jpg'),
        require('../../../assets/tiffin2.jpg'),
        require('../../../assets/tiffin3.jpeg'),
        require('../../../assets/lunch.webp'),
      ],
      title: 'Spicy Treats',
      rating: '4.0',
      timing: '12:00 PM - 3:00 PM',
      rate: 130,
      thaliType: 'Veg',
      cuisineType: 'Gujarati',
          latitude: 28.6139,
    longitude: 77.2090,
    distance : 1.2
    },
    {
      id: '5',
      image: [
        require('../../../assets/lunch.webp'),
        require('../../../assets/tiffin1.jpg'),
        require('../../../assets/tiffin2.jpg'),
        require('../../../assets/tiffin3.jpeg'),
        require('../../../assets/tiffin_1.webp'),
      ],
      title: 'Desi Kitchen',
      rating: '4.7',
      timing: '10:30 AM - 2:30 PM',
      rate: 140,
      thaliType: 'Non-Veg',
      cuisineType: 'Biryani Special',
         latitude: 28.6139,
    longitude: 77.2090,
    distance : 2.1
    },
    {
      id: '6',
      image: [
        require('../../../assets/tiffin2.jpg'),
        require('../../../assets/tiffin1.jpg'),
        require('../../../assets/tiffin3.jpeg'),
        require('../../../assets/tiffin_1.webp'),
        require('../../../assets/lunch.webp'),
      ],
      title: 'Tiffin Express',
      rating: '4.3',
      timing: '11:00 AM - 3:30 PM',
      rate: 110,
      thaliType: 'Veg',
      cuisineType: 'Maharashtrian',
           latitude: 28.6139,
    longitude: 77.2090,
    distance : 4.5
    },
    {
      id: '7',
      image: [
        require('../../../assets/tiffin_1.webp'),
        require('../../../assets/tiffin1.jpg'),
        require('../../../assets/tiffin2.jpg'),
        require('../../../assets/tiffin3.jpeg'),
        require('../../../assets/lunch.webp'),
      ],
      title: 'Quick Bites',
      rating: '4.6',
      timing: '9:30 AM - 1:00 PM',
      rate: 125,
      thaliType: 'Veg',
      cuisineType: 'Rajasthian',
       latitude: 28.6139,
    longitude: 77.2090,
    distance : 3.9
    },
  ];

  const handleAdPress = (ad) => {
    
    // Example actions based on ad type:
    switch (ad.type) {
      case 'festival':
        // Navigate to festival offers page
        // navigation.navigate('FestivalOffers', { ad });
        break;
      case 'discount':
        // Navigate to specific tiffin center with discount applied
        // navigation.navigate('TiffinDetails', { centerId: ad.tiffinCenterId, discount: ad.discount });
        break;
      case 'new_launch':
        // Navigate to new tiffin center
        // navigation.navigate('NewLaunches');
        break;
      default:
        // Default action
        break;
    }
  };


  // Filter function for search
  const filteredTiffinData = tiffinData.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      item.title.toLowerCase().includes(query) ||
      item.thaliType.toLowerCase().includes(query) ||
      item.cuisineType.toLowerCase().includes(query)
    );
  });

  const clearSearch = () => {
    setSearchQuery('');
  };

   const handleTiffinCardPress = (item) => {
    console.log('Navigating with item:', item);
    
    // Navigate directly without complex error handling that might interfere
    navigation.navigate('TiffinDetail', { tiffinData: item });
  };


  // Handle scroll to determine visible cards (optional optimization)
  const handleScroll = (event) => {
  const scrollY = event.nativeEvent.contentOffset.y;
  const screenHeight = Dimensions.get('window').height;

  let closestId = null;
  let closestDistance = Infinity;

  Object.entries(cardPositions.current).forEach(([id, positionY]) => {
    const distance = Math.abs(positionY - scrollY + 200); // adjust offset as needed
    if (distance < closestDistance) {
      closestDistance = distance;
      closestId = id;
    }
  });

  setFocusedCardId(closestId);
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <AdBanner onAdPress={handleAdPress} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, cuisine, or meal type..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    
      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredTiffinData.length} tiffin service{filteredTiffinData.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Tiffin Cards */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        <View style={styles.cardsContainer}>
          {filteredTiffinData.length > 0 ? (
            filteredTiffinData?.map((item, index) => (
              <TiffinCard
                key={item.id}
                image={item.image}
                title={item.title}
                rating={item.rating}
                timing={item.timing}
                rate={item.rate}
                thaliType={item.thaliType}
                cuisineType={item.cuisineType}
                isVisible={index < 1} // Only first 3 cards auto-scroll (you can make this more sophisticated)
                onPress={() => handleTiffinCardPress(item)}
                latitude={item.latitude}
longitude={item.longitude}
                distance={item.distance}
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsIcon}>🍽️</Text>
              <Text style={styles.noResultsTitle}>No tiffin services found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try searching with different keywords like "veg", "punjabi", or specific tiffin names
              </Text>
              <TouchableOpacity onPress={clearSearch} style={styles.clearAllButton}>
                <Text style={styles.clearAllButtonText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderColor: colors.grey,
    borderWidth: 1, 
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingBottom: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  clearAllButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Home;