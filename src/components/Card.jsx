import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const TiffinCard = ({
  image,
  title,
  rating,
  timing,
  rate,
  thaliType,
  cuisineType,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.row}>
          {/* <Ionicons name="star" size={16} color="#FFA500" /> */}
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.timing}>{timing}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.chip}>{thaliType}</Text>
          <Text style={styles.chip}>{cuisineType}</Text>
        </View>

        <Text style={styles.rate}>₹{rate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
 card: {
    width: screenWidth - 24, // full width minus horizontal margin
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: 14,
    color: '#555',
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 12,
    color: '#888',
  },
  timing: {
    fontSize: 13,
    color: '#777',
  },
  chip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginTop: 4,
    fontSize: 12,
    color: '#444',
  },
  rate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 6,
  },
});

export default TiffinCard;
