import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import TiffinCard from '../../components/Card';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const tiffinData = [
    {
      id: '1',
      image: require('../../../assets/tiffin1.jpg'),
      title: 'Raju\'s Tiffin',
      rating: '4.5',
      timing: '9:00 AM - 2:00 PM',
      rate: 120,
      thaliType: 'Veg',
      cuisineType: 'North Indian',
    },
    {
      id: '2',
      image: require('../../../assets/tiffin2.jpg'),
      title: 'Mummy Da Dhaba',
      rating: '4.8',
      timing: '11:00 AM - 3:00 PM',
      rate: 150,
      thaliType: 'Non-Veg',
      cuisineType: 'Punjabi',
    },
    {
      id: '3',
      image: require('../../../assets/tiffin3.jpeg'),
      title: 'Healthy Bites',
      rating: '4.2',
      timing: '10:00 AM - 1:30 PM',
      rate: 100,
      thaliType: 'Veg',
      cuisineType: 'South Indian',
    },
    {
      id: '4',
      image: require('../../../assets/tiffin2.jpg'),
      title: 'Spicy Treats',
      rating: '4.0',
      timing: '12:00 PM - 3:00 PM',
      rate: 130,
      thaliType: 'Veg',
      cuisineType: 'Gujarati',
    },
    {
      id: '5',
      image: require('../../../assets/tiffin_1.webp'),
      title: 'Desi Kitchen',
      rating: '4.7',
      timing: '10:30 AM - 2:30 PM',
      rate: 140,
      thaliType: 'Non-Veg',
      cuisineType: 'Biryani Special',
    },
    {
      id: '6',
      image: require('../../../assets/lunch.webp'),
      title: 'Tiffin Express',
      rating: '4.3',
      timing: '11:00 AM - 3:30 PM',
      rate: 110,
      thaliType: 'Veg',
      cuisineType: 'Maharashtrian',
    },
    {
      id: '7',
      image: require('../../../assets/tiffin1.jpg'),
      title: 'Quick Bites',
      rating: '4.6',
      timing: '9:30 AM - 1:00 PM',
      rate: 125,
      thaliType: 'Veg',
      cuisineType: 'Rajasthian',
    },
  ];

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tiffin Wala</Text>
        <Text style={styles.headerSubtitle}>Find your perfect Tiffin</Text>
      </View>

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {filteredTiffinData.length > 0 ? (
            filteredTiffinData?.map((item) => (
              <TiffinCard
                key={item.id}
                image={item.image}
                title={item.title}
                rating={item.rating}
                timing={item.timing}
                rate={item.rate}
                thaliType={item.thaliType}
                cuisineType={item.cuisineType}
                onPress={() => console.log(`${item.title} pressed`)}
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
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 5,
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
  filterChipsContainer: {
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  filterChipsContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterChip: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  filterChipText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    paddingVertical: 10,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  clearAllButton: {
    backgroundColor: '#2E8B57',
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